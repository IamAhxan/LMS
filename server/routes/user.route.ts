import express from "express";
import { activateUser, registerUser, userLogin } from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.post("/registration", registerUser);
userRouter.post("/activate-user", activateUser);
userRouter.post("/login-user", userLogin);

export default userRouter;