import type { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import cloudinary from "cloudinary";
import { createCourse } from "../services/course.service.js";
import CourseModel from "../models/course.model.js";
import { redis } from "../utils/redis.js";
import mongoose, { mongo } from "mongoose";
import sendMail from "../utils/sendMail.js";
import ejs from "ejs";
import path from "path";
import NotificationModel from "../models/notificationModel.js";

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
      } else {
        const courses = await CourseModel.find().select(
          "-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links",
        );

        await redis.set("allCourses", JSON.stringify(courses));

        res.status(200).json({
          success: true,
          courses,
        });
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
);

// Get Course Content -- only for valid user

export const getCourseByUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userCourseList = req.user?.courses;
      const courseId = req.params.id;

      const courseExists = userCourseList?.find(
        (course: any) => course._id.toString() === courseId,
      );

      if (!courseExists) {
        return next(
          new ErrorHandler("You are not enrolled in this course", 404),
        );
      }

      const course = await CourseModel.findById(courseId);

      const content = course?.courseData;

      res.status(200).json({
        success: true,
        content,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
);

// Add question to course

interface IAddQuestionData {
  question: string;
  courseId: string;
  contentId: string;
}

export const addQuestion = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { question, courseId, contentId }: IAddQuestionData = req.body;
      const course = await CourseModel.findById(courseId);

      if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return next(new ErrorHandler("Invalid Content Id", 500));
      }
      const courseContent = await course?.courseData.find((item: any) =>
        item._id.equals(contentId),
      );

      if (!courseContent) {
        return next(new ErrorHandler("Content not found", 404));
      }

      // Create a new question object
      const newQuestion: any = {
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
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
);


// add answer in course question

interface IAddAnswerData{
  answer: string;
  courseId: string;
  contentId: string;
  questionId: string;
}


export const addAnswer = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { answer, courseId, contentId, questionId }: IAddAnswerData = req.body;
      const course = await CourseModel.findById(courseId);

            if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return next(new ErrorHandler("Invalid Content Id", 500));
      }
      const courseContent = await course?.courseData.find((item: any) =>
        item._id.equals(contentId),
      );

      if (!courseContent) {
        return next(new ErrorHandler("Content not found", 404));
      }

      const question = courseContent?.questions?.find((item:any) => item._id.equals(questionId));
      if (!question) {
        return next(new ErrorHandler("Question not found", 404));
      }

      // Create a new answer object
      const newAnswer: any = {
        user: req.user,
        answer,
      };

      question.questionReplies?.push(newAnswer);

      await course?.save();

      if(req.user?._id.toString() === question.user._id.toString()){
        // Create a notification for the user who asked the question
              await NotificationModel.create({
        user: req.user?._id.toString(),
        title: "New Question Reply Received",
        message: `You have a Reply from ${courseContent?.title}`,
      });
      }else{
        const data = {
          name: question.user.name,
          title: courseContent.title,
        }

        const html = await ejs.renderFile(path.join(__dirname, "..mails/question-reply.ejs"), data);


        try {
          await sendMail({
            email: question.user.email,
            subject: "Your question has a new answer",
            template: "question-reply.ejs",
            data
          });
        } catch (error:any) {
          return next(new ErrorHandler(error.message, 500));
        }
      }

      res.status(200).json({
        success: true,
        message: "Answer added successfully",
        course
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
);


// Add Review in COurse

interface IAddReviewData{
  review: string;
  rating: number;
  courseId: string;
  userId: string;
}

export const addReview = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userCourseList = req.user?.courses;
      const courseId = req.params.id

      const courseExists = userCourseList?.find(
        (course: any) => course._id.toString() === courseId?.toString(),
      );
      
      if(!courseExists){
        return next(new ErrorHandler("You are not enrolled in this course", 404));
      }

      const course = await CourseModel.findById(courseId);
      if(!course){
        return next(new ErrorHandler("Course not found", 404));
      }

      const {review, rating}: IAddReviewData = req.body;


      const reviewData: any = {
        user: req.user,
        comment: review,
        rating,
      }
            course?.reviews.push(reviewData);

            let avg = 0;
            course?.reviews.forEach((review) => {
              avg += review.rating;
            });

            if(course){
              course.ratings = avg / course?.reviews.length;
            }

            await course.save();

            const notification = {
              title: "New Review Added",
              message: `${req.user?.name} has added a new review in ${course.name} course.`,
            }

            res.status(200).json({
              success: true,
              message: "Review added successfully",
              course,
            });



    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  },
);


// Add Reply in Review

interface IReviewData {
  comment: string;
  courseId: string;
  reviewId: string;
}


export const addReplyToReview = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {comment, courseId, reviewId} = req.body as IReviewData;

      const course = await CourseModel.findById(courseId);
      if(!course){
        return next(new ErrorHandler("Course not found", 404));
      }
      const review = course?.reviews?.find((review) => review._id?.toString() === reviewId.toString());
      if(!review){
        return next(new ErrorHandler("Review not found", 404));
      }

      const replyData: any = {
        user: req.user,
        comment,
      }

      if(!review.commentReplies){
        review.commentReplies = [];
      }

     review.commentReplies?.push(replyData);

      await course.save()

      res.status(200).json({
        success: true,
        message: "Reply added successfully",
        course,
      });

    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  })