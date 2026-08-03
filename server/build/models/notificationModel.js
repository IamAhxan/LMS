import mongoose, { Document, Schema, Model } from "mongoose";
const notificationSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        default: "unread",
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });
const NotificationModel = mongoose.model("Notification", notificationSchema);
export default NotificationModel;
//# sourceMappingURL=notificationModel.js.map