import express from "express";
import { activateUser, getUserInfo, loginUser, logoutUser, registerUser, socialAuth, updateAccessToken, updateProfilePicture, updateUserInfo, updateUserPassword,  } from "../controllers/user.controller.js";
import { authorizeRoles, isAuthenticated } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/registration", registerUser);
userRouter.post("/activate-user", activateUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", isAuthenticated , logoutUser);
userRouter.get("/refresh", updateAccessToken);
userRouter.get("/me", isAuthenticated, getUserInfo);
userRouter.post("/social-auth", socialAuth);
userRouter.post("/update-user-info", isAuthenticated, updateUserInfo);
userRouter.post("/update-user-password", isAuthenticated, updateUserPassword);
userRouter.put("/update-user-avatar", isAuthenticated, updateProfilePicture);

export default userRouter;