import express from "express";
import { activateUser, loginUser, logoutUser, registerUser, updateAccessToken,  } from "../controllers/user.controller.js";
import { authorizeRoles, isAuthenticated } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/registration", registerUser);
userRouter.post("/activate-user", activateUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", isAuthenticated , logoutUser);
userRouter.get("/refresh", updateAccessToken);

export default userRouter;