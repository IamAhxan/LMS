import express, {} from "express";
export const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
import { ErrorMiddleware } from "./middleware/Error.js";
import userRouter from "./routes/user.route.js";
import courseRouter from "./routes/course.routes.js";
import orderRouter from "./routes/order.route.js";
import notificationRouter from "./routes/notification.route.js";
import analyticsRouter from "./routes/analytics.route.js";
import layoutRouter from "./routes/layout.route.js";
import { rateLimit } from "express-rate-limit";
// body parser
app.use(express.json({ limit: "50mb" }));
// cookie parser
app.use(cookieParser());
// cors
app.use(cors({
    origin: ["https://elearning-client-red.vercel.app"],
    credentials: true,
}));
// Api request Limit
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: "draft-8", // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
    // store: ... , // Redis, Memcached, etc. See below.
});
// Routes
app.use("/api/v1", userRouter, courseRouter, orderRouter, notificationRouter, analyticsRouter, layoutRouter);
// Temporary debug mode
//TODO delete this before production
// app.use((err: Error , req: Request, res: Response, next: NextFunction) => {
//     res.status(500).json({
//         success: false,
//         message: err.message,
//         stack: err.stack, // This will show you the file and line number
//     });
// });
// Testing API
app.get("/test", (req, res, next) => {
    res.status(200).json({
        success: true,
        message: "API is working fine",
    });
});
// unknown route handler
app.all("*splat", (req, res, next) => {
    const err = new Error(`Can't find ${req.originalUrl} on this server!`);
    err.statusCode = 404;
    next(err);
});
// middleware calls
app.use(limiter);
app.use(ErrorMiddleware);
//# sourceMappingURL=app.js.map