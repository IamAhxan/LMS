import type { Request, Response, NextFunction } from "express";
import userModel, { type IUser } from "../models/user.model.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { CatchAsyncError } from "../middleware/catchAsyncErrors.js";
import jwt, { type JwtPayload, type Secret } from "jsonwebtoken";
import ejs from "ejs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import sendMail from "../utils/sendMail.js";
import dotenv from "dotenv";
import {
  accessTokenOptions,
  refreshTokenOptions,
  sendToken,
} from "../utils/jwt.js";
import { redis } from "../utils/redis.js";
import { getAllUsersService, getUserById, updateUserRoleService } from "../services/user.service.js";
import cloudinary from "cloudinary";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Register a user

interface IRegistrationBody {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

export const registerUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password }: IRegistrationBody = req.body;

      const isEmailExists = await userModel.findOne({ email });
      if (isEmailExists) {
        return next(new ErrorHandler("Email already exists", 400));
      }
      const user: IRegistrationBody = { name, email, password };

      const activationToken = createActivationToken(user);

      const activationCode = activationToken.activationCode;

      const data = { user: { name: user.name }, activationCode };
      try {
        await sendMail({
          email: user.email,
          subject: "Activate Your LMS Account",
          template: "activation-mail.ejs",
          data,
        });

        res.status(201).json({
          success: true,
          message: `User registered successfully. Please check your email ${user.email} to activate your account.`,
          activationToken: activationToken.token, // Send the token in the response for testing purposes (remove in production)
        });
      } catch (error) {
        console.error("Mail error:", error);
        return next(new ErrorHandler("Failed to send activation email", 500));
      }
    } catch (error) {
      console.error("Registration error:", error);
      return next(new ErrorHandler("Failed to register user", 500));
    }
  },
);

interface IActivationToken {
  token: string;
  activationCode: string;
}

// Create activation token
export const createActivationToken = (
  user: IRegistrationBody,
): IActivationToken => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

  const token = jwt.sign(
    { user, activationCode },
    process.env.ACTIVATION_SECRET as Secret,
    { expiresIn: "10m" },
  );

  return { token, activationCode };
};

// Activate User

interface iActivationRequest {
  activation_token: string;
  activation_code: string;
}

export const activateUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activation_token, activation_code }: iActivationRequest =
        req.body;

      const newUser: { user: IUser; activationCode: string } = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET as string,
      ) as { user: IUser; activationCode: string };

      if (newUser.activationCode !== activation_code) {
        return next(new ErrorHandler("Invalid activation code", 400));
      }

      const { name, email, password } = newUser.user;

      const existUser = await userModel.findOne({ email });
      if (existUser) {
        return next(new ErrorHandler("Email already exists", 400));
      }
      const user = await userModel.create({
        name,
        email,
        password,
        isVerified: true,
      });

      res.status(200).json({
        success: true,
        message: "User activated successfully",
      });
    } catch (error: any) {
      console.error("activation error:", error);
      return next(new ErrorHandler("Failed to activate user", 500));
    }
  },
);

// Login User
interface ILoginRequest {
  email: string;
  password: string;
}
export const loginUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as ILoginRequest;

      if (!email || !password) {
        return next(new ErrorHandler("Please provide email and password", 400));
      }

      const user = await userModel.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("Invalid email or password", 401));
      }

      const isPasswordMatch = await user.comparePassword(password);

      if (!isPasswordMatch) {
        return next(new ErrorHandler("Invalid email or password", 401));
      }

      sendToken(user, res, 200);
    } catch (error: any) {
      console.error("Login error:", error);
      return next(new ErrorHandler("Failed to login user", 500));
    }
  },
);

// Logout User
export const logoutUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.cookie("access_token", "", { maxAge: 1 });
      res.cookie("refresh_token", "", { maxAge: 1 });
      const userId = req.user?._id?.toString() || " ";

      redis.del(userId);

      res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error: any) {
      console.error("Logout error:", error);
      return next(new ErrorHandler("Failed to Logout user", 500));
    }
  },
);

// Update Access Token
export const updateAccessToken = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refresh_token = req.cookies.refresh_token as string;
      const decoded = jwt.verify(
        refresh_token,
        process.env.REFRESH_TOKEN as string,
      ) as JwtPayload;

      const message = "Could not refresh token";
      if (!decoded) {
        return next(new ErrorHandler(message, 400));
      }

      const session = await redis.get(decoded.id as string);

      if (!session) {
        return next(new ErrorHandler("Please Login to access this resource", 400));
      }

      const user = JSON.parse(session);

      const accessToken = jwt.sign(
        { id: user._id },
        process.env.ACCESS_TOKEN as string,
        {
          expiresIn: "5m",
        },
      );
      const refreshToken = jwt.sign(
        { id: user._id },
        process.env.REFRESH_TOKEN as string,
        {
          expiresIn: "3d",
        },
      );

      req.user = user;

      res.cookie("access_token", accessToken, accessTokenOptions);
      res.cookie("refresh_token", refreshToken, refreshTokenOptions);

      res.status(200).json({
        status: "success",
        accessToken,
      });
    } catch (error: any) {
      return next(
        new ErrorHandler(
          "Failed to Update Access Token: " + error.message,
          500,
        ),
      );
    }
  },
);

// Get user by Info

export const getUserInfo = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req?.user?._id.toString() || "";
      getUserById(userId, res);
    } catch (error: any) {
      return next(
        new ErrorHandler("Failed to get user info:" + error.message, 500),
      );
    }
  },
);

//TODO Social Authentication (Google, Facebook, etc.) can be implemented here using Passport.js or similar libraries, depending on the requirements of the application.

interface ISocialAuthBody {
  email: string;
  name: string;
  avatar?: string;
}

export const socialAuth = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, name, avatar } = req.body as ISocialAuthBody;
      const user = await userModel.findOne({ email });
      if (!user) {
        const newUser = await userModel.create({
          email,
          name,
          ...(avatar && {
            avatar: {
              public_id: "social_auth",
              url: avatar,
            },
          }),
        });
        sendToken(newUser, res, 200);
      } else {
        sendToken(user!, res, 200);
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
);

// Update user info

interface IUpdateUserInfoBody {
  name?: string;
  email?: string;
}

export const updateUserInfo = CatchAsyncError(
  CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name } = req.body as IUpdateUserInfoBody;

      const userId = req?.user?._id!;

      const user = await userModel.findById(userId);


      if (name && user) {
        user.name = name;
      }
      await user?.save();

      await redis.set(userId.toString(), JSON.stringify(user), "EX", 604800);

      res.status(201).json({
        success: true,
        message: "User info updated successfully",
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }),
);

// Update User Password

interface IUpdatePasswordBody {
  oldPassword: string;
  newPassword: string;
}

export const updateUserPassword = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { oldPassword, newPassword } = req.body as IUpdatePasswordBody;

      if (!oldPassword || !newPassword) {
        return next(
          new ErrorHandler("Please provide old and new password", 400),
        );
      }

      const user = await userModel.findById(req?.user?._id).select("+password");

      if (user?.password === undefined) {
        return next(new ErrorHandler("Invalid User", 404));
      }

      const isPasswordMatch = await user?.comparePassword(oldPassword);

      if (!isPasswordMatch) {
        return next(new ErrorHandler("Old password is incorrect", 400));
      }
      user.password = newPassword;
      await user.save();
      await redis.set(user._id.toString(), JSON.stringify(user));

      res.status(200).json({
        success: true,
        message: "Password updated successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
);

// Update User Profile/,Avatar
interface IUpdateProfilePicture {
  avatar: string;
}

export const updateProfilePicture = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { avatar } = req.body as IUpdateProfilePicture;
      const userId = req?.user?._id;

      const user = await userModel.findById(userId);

      if (avatar && user) {
        // if user already have an avatar, delete it from cloudinary before uploading new one
        if (user?.avatar?.public_id) {
          await cloudinary.v2.uploader.destroy(user?.avatar?.public_id);
          const myCloud = await cloudinary.v2.uploader.upload(avatar, {
            folder: "lms_avatars",
            width: 150,
          });
          user.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          };
        } else {
          const myCloud = await cloudinary.v2.uploader.upload(avatar, {
            folder: "lms_avatars",
            width: 150,
          });
          user.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          };
        }
      }

      await user?.save();
      await redis.set(userId!.toString(), JSON.stringify(user));

      res.status(200).json({
        success: true,
        message: "Profile picture updated successfully",
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
);

// export const updateUserRole = CatchAsyncError(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const { userId, role } = req.body as { userId: string; role: string };

//       const user = await userModel.findById(userId);

//       if (!user) {
//         return next(new ErrorHandler("User not found", 404));
//       }

//       user.role = role;

//       await user.save();
//       await redis.set(userId, JSON.stringify(user));

//       res.status(200).json({
//         success: true,
//         message: "User Role updated Successfully",
//         user,
//       });
//     } catch (error: any) {
//       return next(new ErrorHandler(error.message, 500));
//     }
//   },
// );

// get all users for admin

export const getAllUsers = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllUsersService(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
);


// Update User Role --- only admin
export const updateUserRole = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {id, role} = req.body
      updateUserRoleService(res, id, role);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
)
// Delete User --- only admin
export const deleteUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {id} = req.params;
      const user = await userModel.findById(id);

      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }
      await user.deleteOne({id});
      await redis.del(id as string);
      res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
      
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
)