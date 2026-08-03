import { Document, Model } from "mongoose";
export interface IOrder extends Document {
    courseId: string;
    userId: string;
    payment_info: object;
}
declare const OrderModel: Model<IOrder>;
export default OrderModel;
//# sourceMappingURL=orderModel.d.ts.map