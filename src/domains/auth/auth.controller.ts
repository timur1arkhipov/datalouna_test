import type { Request, Response } from "express"
import { AuthService } from "./auth.service"
import { AuthRepository } from "./auth.repository"

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
      req.session = { userId: user.id }
      res.status(201).json({ user })
    } catch (error) {
      res.status(400).json({ error: "Registration failed" })
    }
  }

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body

    try {
      const user = await this.authService.login(email, password)
      if (user) {
        req.session = { userId: user.id }
        res.json({ user: { id: user.id, username: user.username, email: user.email } })
      } else {
        res.status(401).json({ error: "Invalid credentials" })
      }
    } catch (error) {
      res.status(500).json({ error: "Login failed" })
    }
  }

  logout = (req: Request, res: Response) => {
    req.session = null
    res.json({ message: "Logged out successfully" })
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
      res.status(500).json({ error: "Failed to change password" })
    }
  }
}
