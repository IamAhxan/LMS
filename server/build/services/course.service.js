import CourseModel from "../models/course.model.js";
import { CatchAsyncError } from "../middleware/catchAsyncErrors.js";
// Create Course
export const createCourse = CatchAsyncError(async (data, res) => {
    const course = await CourseModel.create(data);
    res.status(201).json({
        success: true,
        course
    });
});
// Get all courses Admin
export const getAllCoursesService = async (res) => {
    const courses = await CourseModel.find().sort({ createdAt: -1 });
    res.status(201).json({
        success: true,
        courses,
    });
};
//# sourceMappingURL=course.service.js.map