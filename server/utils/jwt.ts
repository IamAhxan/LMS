import dotenv from "dotenv";
dotenv.config();
import type { Response } from "express";
import jwt from "jsonwebtoken";
import type { IUser } from "../models/user.model.js";
import {redis} from "./redis.js"


interface ITokenOptions{
    expires: Date;
    maxAge: number;
    httpOnly: boolean;
    sameSite: "strict" | "lax" | "none" | undefined;
    secure?: boolean;
}

export const sendToken = (user: IUser, res: Response, statusCode: number) => {
    const accessToken = user.SignAccessToken();
    const refreshToken = user.SignRefreshToken();

    // Upload session to redis
redis.set(user._id.toString(), JSON.stringify(user) as any); // Set expiration to 7 days

    // parse environment variable to integrate with fallback values
    const accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE || "300", 10); // default to 5 minutes
    const refreshTokenExpire = parseInt(process.env.REFRESH_TOKEN_EXPIRE || "1200", 10); // default to 5 minutes

    // Options for Cookies

    const accessTokenOptions: ITokenOptions = {
        expires: new Date(Date.now() + accessTokenExpire * 1000), // Convert seconds to milliseconds
        maxAge: accessTokenExpire * 1000, // Convert seconds to milliseconds
        httpOnly: true,
        sameSite: "lax",
    };

    const refreshTokenOptions: ITokenOptions = {
        expires: new Date(Date.now() + refreshTokenExpire * 1000), // Convert seconds to milliseconds
        maxAge: refreshTokenExpire * 1000, // Convert seconds to milliseconds
        httpOnly: true,
        sameSite: "lax",
    };

// only set secure to true in production
    if (process.env.NODE_ENV === "production") {
        accessTokenOptions.secure = true;
    }

    res.cookie("access_token", accessToken, accessTokenOptions);
    res.cookie("refresh_token", refreshToken, refreshTokenOptions);

    res.status(statusCode).json({
        success: true,
        accessToken,
        refreshToken
    });

}