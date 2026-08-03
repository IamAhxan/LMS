import { CatchAsyncError } from "./catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import jwt from 'jsonwebtoken';
import { redis } from "../utils/redis.js";
// Authenticated User
export const isAuthenticated = CatchAsyncError(async (req, res, next) => {
    const access_token = req.cookies.access_token;
    if (!access_token) {
        return next(new ErrorHandler("Please login first", 400));
    }
    const decoded = jwt.verify(access_token, process.env.ACCESS_TOKEN);
    if (!decoded) {
        return next(new ErrorHandler("access token is not valid", 400));
    }
    const user = await redis.get(decoded.id);
    if (!user) {
        return next(new ErrorHandler("Please login to access this user", 404));
    }
    req.user = JSON.parse(user);
    next();
});
// Validate User Roles
export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user?.role || '')) {
            return next(new ErrorHandler(`role: ${req.user?.role} is not allowed to access this resource`, 403));
        }
        next();
    };
};
//# sourceMappingURL=auth.js.map