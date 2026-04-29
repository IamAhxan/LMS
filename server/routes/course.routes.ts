import express from "express";
const courseRouter = express.Router();
import { editCourse, getAllCourse, getSingleCourse, uploadCourse } from "../controllers/course.controller.js";
import { authorizeRoles, isAuthenticated } from "../middleware/auth.js";

courseRouter.post(
  "/create-course",
  isAuthenticated,
  authorizeRoles("admin"),
  uploadCourse,
);
courseRouter.put(
  "/edit-course/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  editCourse,
);
courseRouter.get(
  "/get-course/:id",
  getSingleCourse,
);
courseRouter.get(
  "/get-courses",
  getAllCourse,
);

export default courseRouter;
