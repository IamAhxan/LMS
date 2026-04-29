import type { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import cloudinary from "cloudinary";
import { createCourse } from "../services/course.service.js";
import CourseModel from "../models/course.model.js";
import { redis } from "../utils/redis.js";

// Upload Course
export const uploadCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const thumbnail = data.thumbnail;
      if (thumbnail) {
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "Courses",
        });

        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }
      createCourse(data, res, next);
    } catch (error: any) {
      console.log(error);
      return next(new ErrorHandler(error.message, 500));
    }
  },
);

// Edit Course
export const editCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;
      const thumbnail = data.thumbnail;

      if (thumbnail) {
        await cloudinary.v2.uploader.destroy(thumbnail.public_id);
        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "Courses",
        });

        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }

      const courseId = req.params.id;
      const course = await CourseModel.findByIdAndUpdate(
        courseId,
        { $set: data },
        { new: true },
      );

      res.status(201).json({
        success: true,
        course,
      });
    } catch (error: any) {
      console.log(error);
      return next(new ErrorHandler(error.message, 500));
    }
  },
);

// Get single Course Without purchasing
export const getSingleCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courseId = req.params.id as string;

      const isCacheExist = await redis.get(courseId);

      if (isCacheExist) {
        const course = JSON.parse(isCacheExist);
        return res.status(200).json({
          success: true,
          course,
          cache: true,
        });
      } else {
        const course = await CourseModel.findById(req.params.id).select(
          "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links",
        );

        await redis.set(courseId, JSON.stringify(course));

        res.status(200).json({
          success: true,
          course,
        });
      }
    } catch (error: any) {
      console.log(error);
      return next(new ErrorHandler(error.message, 500));
    }
  },
);

// Get all courses without purchasing
export const getAllCourse = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {

        const isCacheExist = await redis.get("allCourses");
        if (isCacheExist) {
            const courses = JSON.parse(isCacheExist);
            return res.status(200).json({
                success: true,
                courses,
            });
        }else{
      const courses = await CourseModel.find().select(
        "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links",
      );

      await redis.set("allCourses",JSON.stringify(courses));

      res.status(200).json({
        success: true,
        courses,
      });
        }



    } catch (error: any) {
      console.log(error);
      return next(new ErrorHandler(error.message, 500));
    }
  },
);
