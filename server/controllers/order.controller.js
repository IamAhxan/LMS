import { CatchAsyncError } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import OrderModel from "../models/orderModel.js";
import userModel from "../models/user.model.js";
import CourseModel from "../models/course.model.js";
import NotificationModel from "../models/notificationModel.js";
import path, { dirname } from "path";
import ejs from "ejs";
import sendMail from "../utils/sendMail.js";
import { getAllOrdersService, newOrder } from "../services/order.service.js";
import { fileURLToPath } from "url";
import { redis } from "../utils/redis.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import dotenv from "dotenv";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
// Create Order
export const createOrder = CatchAsyncError(async (req, res, next) => {
    try {
        if (!req.user?._id) {
            return next(new ErrorHandler("User not authenticated", 401));
        }
        const userId = req.user._id.toString();
        const { courseId, payment_info } = req.body;
        if (payment_info) {
            if ("id" in payment_info) {
                const paymentIntentId = payment_info.id;
                const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
                if (paymentIntent.status !== "succeeded") {
                    return next(new ErrorHandler("payment not authorized", 400));
                }
            }
        }
        const user = await userModel.findById(userId);
        if (!user)
            return next(new ErrorHandler("User not found", 404));
        const courseExistInUser = user.courses.some((course) => course.courseId === courseId);
        if (courseExistInUser)
            return next(new ErrorHandler("You have already enrolled in this course", 400));
        const course = await CourseModel.findById(courseId);
        if (!course)
            return next(new ErrorHandler("Course not found", 404));
        const data = {
            courseId: course._id,
            userId: user._id,
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
        const html = await ejs.renderFile(path.join(__dirname, "../mails/order-confirmation.ejs"), { order: mailData });
        try {
            await sendMail({
                email: user.email,
                subject: "New Order Placed",
                template: "order-confirmation.ejs",
                data: mailData,
            });
        }
        catch (error) {
            return next(new ErrorHandler(error.message, 500));
        }
        user.courses.push({ courseId: course._id.toString() });
        await redis.set(userId, JSON.stringify(user));
        await user.save();
        await NotificationModel.create({
            user: user._id.toString(),
            title: "New Order Placed",
            message: `You have a new order from ${course?.name}`,
        });
        course.purchased = (course.purchased || 0) + 1;
        await course.save();
        newOrder(data, res, next);
    }
    catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});
// Get all orders for admin
export const getAllOrders = CatchAsyncError(async (req, res, next) => {
    try {
        getAllOrdersService(res);
    }
    catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});
// send stripe publishable key
export const sendStripePublishableKey = CatchAsyncError(async (req, res) => {
    res.status(200).json({
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
});
// New Payment
export const newPayment = CatchAsyncError(async (req, res, next) => {
    try {
        const myPayment = await stripe.paymentIntents.create({
            amount: req.body.amount,
            currency: "USD",
            metadata: {
                company: "E-Learning",
            },
            automatic_payment_methods: {
                enabled: true,
            },
        });
        res.status(201).json({
            success: true,
            client_secret: myPayment.client_secret,
        });
    }
    catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});
//# sourceMappingURL=order.controller.js.map