import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import { redis } from "./redis.js";
// parse environment variable to integrate with fallback values
// default to 1 day if .env is missing (86400 seconds)
const accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE || "86400", 10);
// default to 3 days (259200 seconds)
const refreshTokenExpire = parseInt(process.env.REFRESH_TOKEN_EXPIRE || "259200", 10);
// Options for Cookies
export const accessTokenOptions = {
    expires: new Date(Date.now() + accessTokenExpire * 60 * 60 * 1000), // Convert seconds to milliseconds
    maxAge: accessTokenExpire * 60 * 60 * 1000, // Convert seconds to milliseconds
    httpOnly: true,
    sameSite: "lax",
};
export const refreshTokenOptions = {
    expires: new Date(Date.now() + refreshTokenExpire * 24 * 60 * 60 * 1000), // Convert seconds to milliseconds
    maxAge: refreshTokenExpire * 24 * 60 * 60 * 1000, // Convert seconds to milliseconds
    httpOnly: true,
    sameSite: "lax",
};
export const sendToken = (user, res, statusCode) => {
    const accessToken = user.SignAccessToken();
    const refreshToken = user.SignRefreshToken();
    // Upload session to redis
    redis.set(user._id.toString(), JSON.stringify(user)); // Set expiration to 7 days
    // only set secure to true in production
    if (process.env.NODE_ENV === "production") {
        accessTokenOptions.secure = true;
    }
    res.cookie("access_token", accessToken, accessTokenOptions);
    res.cookie("refresh_token", refreshToken, refreshTokenOptions);
    res.status(statusCode).json({
        success: true,
        user,
        AccessToken: accessToken,
        RefreshToken: refreshToken,
    });
};
//# sourceMappingURL=jwt.js.map