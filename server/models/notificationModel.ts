import mongoose, { Document, Schema, Model } from "mongoose";

interface INotification extends Document {
  title: string;
  message: string;
  status: string;
  user: string;
}

const notificationSchema: Schema<INotification> = new Schema(
  {
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
  },
  { timestamps: true },
);
const NotificationModel: Model<INotification> = mongoose.model<INotification>(
  "Notification",
  notificationSchema,
);

export default NotificationModel;
