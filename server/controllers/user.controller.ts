import type { Request, Response, NextFunction } from "express";
import userModel, {type IUser} from "../models/user.model.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { CatchAsyncError } from "../middleware/catchAsyncErrors.js";
import jwt, { type Secret } from "jsonwebtoken";
import ejs from "ejs";
import path,{ dirname } from "path";
import { fileURLToPath } from "url";
import sendMail from "../utils/sendMail.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Register a user

interface IRegistrationBody{
    name: string;
    email: string;
    password: string;
    avatar?: string;
}

export const registerUser = CatchAsyncError(async (req:Request, res:Response, next:NextFunction) => {
    try {
        const { name, email, password }: IRegistrationBody = req.body;

        const isEmailExists = await userModel.findOne({ email });
        if (isEmailExists) {
            return next(new ErrorHandler("Email already exists", 400));
        }
        const user: IRegistrationBody = { name, email, password };

        const activationToken = createActivationToken(user);

        const activationCode = activationToken.activationCode;

        const data = {user:{name:user.name}, activationCode};
        try {
            await sendMail({
                email: user.email,
                subject: "Activate Your LMS Account",
                template: "activation-mail.ejs",
                data
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
});


interface IActivationToken {
    token: string;
    activationCode: string;
}

// Create activation token
export const createActivationToken = (user: IRegistrationBody): IActivationToken => {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

    const token = jwt.sign(
        { user, activationCode },
        process.env.ACTIVATION_SECRET as Secret,
        { expiresIn: "10m" }
    );

    return { token, activationCode };
}

// Activate User

interface iActivationRequest{
    activation_token: string;
    activation_code: string;
}

export const activateUser = CatchAsyncError(async (req:Request, res:Response, next:NextFunction) => {
    try {
        const {activation_token, activation_code}: iActivationRequest = req.body;



        const newUser: {user: IUser, activationCode: string} = jwt.verify(activation_token, process.env.ACTIVATION_SECRET as string) as {user: IUser; activationCode: string};

        if(newUser.activationCode !== activation_code){
            return next(new ErrorHandler("Invalid activation code", 400));
        }

        const {name, email, password} = newUser.user;

        const existUser = await userModel.findOne({email});
        if(existUser){
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

    } catch (error:any) {
                 console.error("activation error:", error);
        return next(new ErrorHandler("Failed to activate user", 500));
    }
});