import mongoose, { Document, Model } from "mongoose";
interface INotification extends Document {
    title: string;
    message: string;
    status: string;
    user: mongoose.Types.ObjectId | string;
}
declare const NotificationModel: Model<INotification>;
export default NotificationModel;
//# sourceMappingURL=notificationModel.d.ts.map