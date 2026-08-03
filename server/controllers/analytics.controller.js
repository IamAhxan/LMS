import ErrorHandler from "../utils/ErrorHandler.js";
import { CatchAsyncError } from "../middleware/catchAsyncErrors.js";
import { generateLast12MonthsData } from "../utils/analyticsGenerator.js";
import userModel from "../models/user.model.js";
import CourseModel from "../models/course.model.js";
import OrderModel from "../models/orderModel.js";
// User Data Analytics -- only admins
export const getUsersAnalytics = CatchAsyncError(async (req, res, next) => {
    try {
        const users = await generateLast12MonthsData(userModel);
        res.status(200).json({
            success: true,
            users,
        });
    }
    catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});
// Course Data Analytics -- only admins
export const getCoursesAnalytics = CatchAsyncError(async (req, res, next) => {
    try {
        const courses = await generateLast12MonthsData(CourseModel);
        res.status(200).json({
            success: true,
            courses,
        });
    }
    catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});
// Order Data Analytics -- only admins
export const getOrdersAnalytics = CatchAsyncError(async (req, res, next) => {
    try {
        const orders = await generateLast12MonthsData(OrderModel);
        res.status(200).json({
            success: true,
            orders,
        });
    }
    catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});
//# sourceMappingURL=analytics.controller.js.map