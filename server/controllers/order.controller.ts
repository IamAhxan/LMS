import type { Response, Request, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import type { IOrder } from "../models/orderModel.js";
import OrderModel from "../models/orderModel.js";
import userModel from "../models/user.model.js";
import CourseModel from "../models/course.model.js";
import NotificationModel from "../models/notificationModel.js";
import path, { dirname } from "path";
import ejs from "ejs";
import sendMail from "../utils/sendMail.js";
import { getAllOrdersService, newOrder } from "../services/order.service.js";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create Order

export const createOrder = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId, payment_info } = req.body as IOrder;
      const user = await userModel.findById(req.user?._id);
      const courseExistInUser = user?.courses.some(
        (course: any) => course.courseId === courseId,
      );
      if (courseExistInUser)
        return next(
          new ErrorHandler("You have already enrolled in this course", 400),
        );

      const course = await CourseModel.findById(courseId);

      if (!course) return next(new ErrorHandler("Course not found", 404));

      const data: any = {
        courseId: course._id,
        userId: user?._id,
        payment_info,
      };

      const mailData = {
        order: {
          _id: course._id.toString().slice(0, 6),
          name: course.name,
          price: course.price,
          date: new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        },
      };

      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/order-confirmation.ejs"),
        { order: mailData },
      );

      try {
        if (user) {
          await sendMail({
            email: user.email,
            subject: "New Order Placed",
            template: "order-confirmation.ejs",
            data: mailData,
          });
        }
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
      }

      user?.courses.push({ courseId: course._id.toString() });
      await user?.save();

      await NotificationModel.create({
        user: user?._id.toString(),
        title: "New Order Placed",
        message: `You have a new order from ${course?.name}`,
      });
      if(course.purchased){
          course.purchased ? course.purchased += 1 : course.purchased = 1;
      }
      await course.save();
      newOrder(data, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
);

// Get all orders for admin
export const getAllOrders = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllOrdersService(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
);