import type { Request, Response } from "express"
import { AuthService } from "./auth.service"
import { AuthRepository } from "./auth.repository"
import { createSession } from "../../middleware/auth"

export class AuthController {
  private authService: AuthService

  constructor() {
    const repository = new AuthRepository()
    this.authService = new AuthService(repository)
  }

  register = async (req: Request, res: Response) => {
    const { username, email, password } = req.body

    try {
      const user = await this.authService.register(username, email, password)
      createSession(req, user.id)
      res.status(201).json({ user })
    } catch (error) {
      console.error("Registration error:", error)
      res.status(400).json({ error: "Registration failed" })
    }
  }

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body

    try {
      const user = await this.authService.login(email, password)
      if (user) {
        createSession(req, user.id)
        res.json({ user: { id: user.id, username: user.username, email: user.email } })
      } else {
        res.status(401).json({ error: "Invalid credentials" })
      }
    } catch (error) {
      console.error("Login error:", error)
      res.status(500).json({ error: "Login failed" })
    }
  }

  logout = (req: Request, res: Response) => {
    req.session = null
    res.clearCookie('session')
    res.json({ message: 'Logged out successfully' })
  }

  changePassword = async (req: Request, res: Response) => {
    const { oldPassword, newPassword } = req.body
    const userId = req.session?.userId

    try {
      const result = await this.authService.changePassword(userId, oldPassword, newPassword)
      if (result) {
        res.json({ message: "Password changed successfully" })
      } else {
        res.status(401).json({ error: "Invalid old password" })
      }
    } catch (error) {
      console.error("Change password error:", error)
      res.status(500).json({ error: "Failed to change password" })
    }
  }

  checkAuthStatus = (req: Request, res: Response) => {
    if (req.session?.userId) {
      res.json({ isAuthenticated: true, userId: req.session.userId })
    } else {
      res.json({ isAuthenticated: false })
    }
  }
}
