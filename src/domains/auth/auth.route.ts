import express from "express"
import { isAuthenticated } from "../../middleware/auth"
import { AuthController } from "./auth.controller"

const authRoutes = express.Router()
const authController = new AuthController()

authRoutes.post("/register", authController.register)
authRoutes.post("/login", authController.login)
authRoutes.post("/logout", authController.logout)
authRoutes.post("/change-password", isAuthenticated, authController.changePassword)

export default authRoutes