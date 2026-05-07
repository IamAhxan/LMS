import NotificationModel from "../models/notificationModel.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { CatchAsyncError } from "../middleware/catchAsyncErrors.js";
import type { Request, Response, NextFunction } from "express";



// Admin Notifications
export const getNotifications = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const notifications = await NotificationModel.find().sort({createAt: -1});
            res.status(201).json({
                success: true,
                notifications,
            })

        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
)

// Update Notification Status, Only admin


export const updateNotification = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const notification = await NotificationModel.findById(req.params.id);
            if(!notification){
                return next(new ErrorHandler("Notification not found", 404));
            }else{
            notification.status = "read";
            }

            await notification.save();
            const notifications = await NotificationModel.find().sort({createdAt: -1});
            res.status(201).json({
                success: true,
                notifications,
            })

        } catch (error: any) {
            return next(new ErrorHandler(error.message, 500));
        }
    }
)

