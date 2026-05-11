import express from "express"
import { authorizeRoles, isAuthenticated } from "../middleware/auth.js"
import { createLayout } from "../controllers/layout.controller.js"
const layoutRouter = express.Router()


layoutRouter.post("/create-layout", isAuthenticated, authorizeRoles("admin"), createLayout)

export default layoutRouter