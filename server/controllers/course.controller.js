import { CatchAsyncError } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import cloudinary from "cloudinary";
import { createCourse, getAllCoursesService, } from "../services/course.service.js";
import CourseModel from "../models/course.model.js";
import { redis } from "../utils/redis.js";
import mongoose, { mongo } from "mongoose";
import sendMail from "../utils/sendMail.js";
import ejs from "ejs";
import path from "path";
import NotificationModel from "../models/notificationModel.js";
import axios from "axios";
// Upload Course
export const uploadCourse = CatchAsyncError(async (req, res, next) => {
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
    }
    catch (error) {
        console.log(error);
        return next(new ErrorHandler(error.message, 500));
    }
});
// Edit Course
// Edit Course
export const editCourse = CatchAsyncError(async (req, res, next) => {
    try {
        const data = req.body;
        const thumbnail = data.thumbnail;
        const courseId = req.params.id;
        const courseData = (await CourseModel.findById(courseId));
        if (!courseData) {
            return next(new ErrorHandler("Course not found", 404));
        }
        // Handle thumbnail safely regardless of string or object
        if (typeof thumbnail === "string" && !thumbnail.startsWith("https")) {
            if (courseData?.thumbnail?.public_id) {
                await cloudinary.v2.uploader.destroy(courseData.thumbnail.public_id);
            }
            const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
                folder: "Courses",
            });
            data.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            };
        }
        else if (typeof thumbnail === "string" &&
            thumbnail.startsWith("https")) {
            data.thumbnail = {
                public_id: courseData?.thumbnail?.public_id,
                url: courseData?.thumbnail?.url,
            };
        }
        const course = await CourseModel.findByIdAndUpdate(courseId, { $set: data }, { new: true });
        // FIX: Synchronize updated course with Redis Cache
        if (course) {
            await redis.set(courseId, JSON.stringify(course), "EX", 604800);
        }
        res.status(201).json({
            success: true,
            course,
        });
    }
    catch (error) {
        console.log(error);
        return next(new ErrorHandler(error.message, 500));
    }
});
// Get single Course Without purchasing
export const getSingleCourse = CatchAsyncError(async (req, res, next) => {
    try {
        const courseId = req.params.id;
        const isCacheExist = await redis.get(courseId);
        if (isCacheExist) {
            const course = JSON.parse(isCacheExist);
            return res.status(200).json({
                success: true,
                course,
                cache: true,
            });
        }
        else {
            const course = await CourseModel.findById(req.params.id).select("-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links");
            await redis.set(courseId, JSON.stringify(course), "EX", 604800);
            res.status(200).json({
                success: true,
                course,
            });
        }
    }
    catch (error) {
        console.log(error);
        return next(new ErrorHandler(error.message, 500));
    }
});
// Get all courses without purchasing
export const getAllCourse = CatchAsyncError(async (req, res, next) => {
    try {
        const courses = await CourseModel.find().select("-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links");
        res.status(200).json({
            success: true,
            courses,
        });
    }
    catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});
// Get Course Content -- only for valid user
export const getCourseByUser = CatchAsyncError(async (req, res, next) => {
    try {
        const userCourseList = req.user?.courses;
        const courseId = req.params.id;
        const courseExists = userCourseList?.find((course) => course.courseId === courseId);
        if (!courseExists) {
            return next(new ErrorHandler("You are not enrolled in this course", 404));
        }
        const course = await CourseModel.findById(courseId);
        const content = course?.courseData;
        res.status(200).json({
            success: true,
            content,
        });
    }
    catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});
export const addQuestion = CatchAsyncError(async (req, res, next) => {
    try {
        const { question, courseId, contentId } = req.body;
        const course = await CourseModel.findById(courseId);
        if (!mongoose.Types.ObjectId.isValid(contentId)) {
            return next(new ErrorHandler("Invalid Content Id", 500));
        }
        const courseContent = await course?.courseData.find((item) => item._id.equals(contentId));
        if (!courseContent) {
            return next(new ErrorHandler("Content not found", 404));
        }
        // Create a new question object
        const newQuestion = {
            user: req.user,
            question,
            questionReplies: [],
        };
        courseContent.questions.push(newQuestion);
        await NotificationModel.create({
            user: req.user?._id.toString(),
            title: "New Question received",
            message: `You have a new question from ${courseContent?.title}`,
        });
        await course?.save();
        res.status(200).json({
            success: true,
            message: "Question added successfully",
            courseContent,
        });
    }
    catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});
export const addAnswer = CatchAsyncError(async (req, res, next) => {
    try {
        const { answer, courseId, contentId, questionId } = req.body;
        const course = await CourseModel.findById(courseId);
        if (!mongoose.Types.ObjectId.isValid(contentId)) {
            return next(new ErrorHandler("Invalid Content Id", 500));
        }
        const courseContent = await course?.courseData.find((item) => item._id.equals(contentId));
        if (!courseContent) {
            return next(new ErrorHandler("Content not found", 404));
        }
        const question = courseContent?.questions?.find((item) => item._id.equals(questionId));
        if (!question) {
            return next(new ErrorHandler("Question not found", 404));
        }
        // Create a new answer object
        const newAnswer = {
            user: req.user,
            answer,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        question.questionReplies?.push(newAnswer);
        await course?.save();
        if (req.user?._id.toString() === question.user._id.toString()) {
            // Create a notification for the user who asked the question
            await NotificationModel.create({
                user: req.user?._id.toString(),
                title: "New Question Reply Received",
                message: `You have a Reply from ${courseContent?.title}`,
            });
        }
        else {
            const data = {
                name: question.user.name,
                title: courseContent.title,
            };
            const html = await ejs.renderFile(path.join(__dirname, "..mails/question-reply.ejs"), data);
            try {
                await sendMail({
                    email: question.user.email,
                    subject: "Your question has a new answer",
                    template: "question-reply.ejs",
                    data,
                });
            }
            catch (error) {
                return next(new ErrorHandler(error.message, 500));
            }
        }
        res.status(200).json({
            success: true,
            message: "Answer added successfully",
            course,
        });
    }
    catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});
export const addReview = CatchAsyncError(async (req, res, next) => {
    try {
        const userCourseList = req.user?.courses;
        const courseId = req.params.id;
        const courseExists = userCourseList?.find((course) => course.courseId === courseId);
        if (!courseExists) {
            return next(new ErrorHandler("You are not enrolled in this course", 404));
        }
        const course = await CourseModel.findById(courseId);
        if (!course) {
            return next(new ErrorHandler("Course not found", 404));
        }
        const { review, rating } = req.body;
        const reviewData = {
            user: req.user,
            comment: review,
            rating,
        };
        course?.reviews.push(reviewData);
        let avg = 0;
        course?.reviews.forEach((review) => {
            avg += review.rating;
        });
        if (course) {
            course.ratings = avg / course?.reviews.length;
        }
        await course.save();
        if (courseId) {
            await redis.set(courseId.toString(), JSON.stringify(course), "EX", 604800);
        }
        await NotificationModel.create({
            user: req.user?._id.toString(),
            title: "New Review Added",
            message: `${req.user?.name} has added a new review in ${course.name} course.`,
        });
        res.status(200).json({
            success: true,
            message: "Review added successfully",
            course,
        });
    }
    catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});
export const addReplyToReview = CatchAsyncError(async (req, res, next) => {
    try {
        const { comment, courseId, reviewId } = req.body;
        const course = await CourseModel.findById(courseId);
        if (!course) {
            return next(new ErrorHandler("Course not found", 404));
        }
        const review = course?.reviews?.find((review) => review._id?.toString() === reviewId.toString());
        if (!review) {
            return next(new ErrorHandler("Review not found", 404));
        }
        const replyData = {
            user: req.user,
            comment,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        if (!review.commentReplies) {
            review.commentReplies = [];
        }
        review.commentReplies?.push(replyData);
        await course.save();
        await redis.set(courseId, JSON.stringify(course), "EX", 604800);
        res.status(200).json({
            success: true,
            message: "Reply added successfully",
            course,
        });
    }
    catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});
export const getAdminAllCourses = CatchAsyncError(async (req, res, next) => {
    try {
        getAllCoursesService(res);
    }
    catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});
// Delete Course --- only admin
// Delete Course --- only admin
export const deleteCourse = CatchAsyncError(async (req, res, next) => {
    try {
        const { id } = req.params;
        const course = await CourseModel.findById(id);
        if (!course) {
            return next(new ErrorHandler("Course not found", 404));
        }
        // 1. Delete course from MongoDB
        await course.deleteOne(); // Call deleteOne() directly on the document instance
        // 2. Invalidate Redis Cache
        await redis.del(id); // Remove specific course cache
        res.status(200).json({
            success: true,
            message: "Course deleted successfully",
        });
    }
    catch (error) {
        console.error("Delete Course Error:", error);
        return next(new ErrorHandler(error.message, 500));
    }
});
// generate video url
export const generateVideoUrl = CatchAsyncError(async (req, res, next) => {
    try {
        const { videoId } = req.body;
        const response = await axios.post("https://dev.vdocipher.com/api/videos/1b700cb08b5a383323c7659f54e9ba7a/otp", {
            ttl: 300,
        }, {
            headers: {
                Accept: "application/json",
                "content-type": "application/json",
                Authorization: `Apisecret ${process.env.VDOCIPHER_API_SECRET}`,
            },
        });
        res.json(response.data);
    }
    catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
});
//# sourceMappingURL=course.controller.js.map