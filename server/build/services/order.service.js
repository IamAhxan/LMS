import { CatchAsyncError } from "../middleware/catchAsyncErrors.js";
import OrderModel from "../models/orderModel.js";
import ErrorHandler from "../utils/ErrorHandler.js";
// create new order
export const newOrder = CatchAsyncError(async (data, res, next) => {
    try {
        const order = await OrderModel.create(data);
        res.status(201).json({
            success: true,
            message: "Order created successfully",
            order,
        });
    }
    catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
});
// Get all orders for admin
export const getAllOrdersService = async (res) => {
    const orders = await OrderModel.find().sort({ createdAt: -1 });
    res.status(201).json({
        success: true,
        orders,
    });
};
//# sourceMappingURL=order.service.js.map