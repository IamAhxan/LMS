import NotificationModel from "../models/notificationModel.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { CatchAsyncError } from "../middleware/catchAsyncErrors.js";
import cron from "node-cron";
// Admin Notifications
export const getNotifications = CatchAsyncError(async (req, res, next) => {
    try {
        const notifications = await NotificationModel.find().sort({
            createAt: -1,
        });
        res.status(201).json({
            success: true,
            notifications,
        });
    }
    catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});
// Update Notification Status, Only admin
export const updateNotification = CatchAsyncError(async (req, res, next) => {
    try {
        const notification = await NotificationModel.findById(req.params.id);
        if (!notification) {
            return next(new ErrorHandler("Notification not found", 404));
        }
        else {
            notification.status = "read";
        }
        await notification.save();
        const notifications = await NotificationModel.find().sort({
            createdAt: -1,
        });
        res.status(201).json({
            success: true,
            notifications,
        });
    }
    catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});
// delete notification, only admin
cron.schedule("0 0 0 * * *", async () => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    await NotificationModel.deleteMany({
        status: "read",
        createdAt: { $lt: thirtyDaysAgo },
    });
    console.log("Old read notifications deleted successfully.");
});
//# sourceMappingURL=notification.controller.js.map