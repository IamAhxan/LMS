import type {Request, Response, NextFunction} from 'express';
import { CatchAsyncError } from '../middleware/catchAsyncErrors.js';
import ErrorHandler from '../utils/ErrorHandler.js';
import cloudinary from 'cloudinary';
import { createCourse } from '../services/course.service.js';


// Upload Course
export const uploadCourse = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = req.body;
        const thumbnail = data.thumbnail;
        if(thumbnail) {
            const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
                folder: "Courses"
            });

            data.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url
            }
        }
        createCourse(data, res, next);
    } catch (error:any) {
                console.log(error);
        return next(new ErrorHandler(error.message, 500));

    }
})