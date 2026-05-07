import type {Request, Response, NextFunction} from "express"
import ErrorHandler from "../utils/ErrorHandler.js"
import { CatchAsyncError } from "../middleware/catchAsyncErrors.js"
import { generateLast12MonthsData } from "../utils/analyticsGenerator.js"
import userModel from "../models/user.model.js"

// User Data Analytics -- only admins

export const getUsersAnalytics  = CatchAsyncError(
    async(req: Request, res: Response, next: NextFunction)=>{
        try {
            const users = await generateLast12MonthsData(userModel)
            res.status(200).json({
                success: true,
                users,
            });
        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500))
        }
    }
)

