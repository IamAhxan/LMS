import type { Request, Response, NextFunction } from "express";
import CourseModel from "../models/course.model.js";
import { CatchAsyncError } from "../middleware/catchAsyncErrors.js";

// Create Course

export const createCourse = CatchAsyncError(async (data:any, res: Response) => {
    const course = await CourseModel.create(data);
    res.status(201).json({
        success: true,
        course
    })
})