import express, { type NextFunction, type Request, type Response } from 'express';
export const app = express();
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { ErrorMiddleware } from './middleware/Error.js';
import userRouter from './routes/user.route.js';
import courseRouter from './routes/course.routes.js';
import orderRouter from './routes/order.route.js';
import notificationRouter from './routes/notification.route.js';
import analyticsRouter from './routes/analytics.route.js';
import layoutRouter from './routes/layout.route.js';

// body parser
app.use(express.json({ limit: "50mb" }));

// cookie parser
app.use(cookieParser());

// cors
app.use(cors({
    origin: ["http://localhost:3000"],
    credentials: true,
}));

// Routes
app.use("/api/v1", userRouter, courseRouter, orderRouter, notificationRouter, analyticsRouter,layoutRouter);

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
app.get('/test', (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({
        success: true,
        message: "API is working fine",
    });
});


// unknown route handler
app.all('*splat', (req: Request, res: Response, next: NextFunction) => {
    const err = new Error(`Can't find ${req.originalUrl} on this server!`) as any;
    err.statusCode = 404;
    next(err);
});



app.use(ErrorMiddleware);