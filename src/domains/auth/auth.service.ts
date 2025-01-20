import bcrypt from "bcrypt"
import { AuthRepository } from "./auth.repository"

export class AuthService {
  private repository: AuthRepository

  constructor(repository: AuthRepository) {
    this.repository = repository
  }

  async register(username: string, email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10)
    return this.repository.createUser(username, email, hashedPassword)
  }

  async login(email: string, password: string) {
    const user = await this.repository.getUserByEmail(email)

    if (user && (await bcrypt.compare(password, user.password))) {
      return { id: user.id, username: user.username, email: user.email }
    }

    return null
  }

  async changePassword(userId: number, oldPassword: string, newPassword: string) {
    const user = await this.repository.getUserById(userId)

    if (user && (await bcrypt.compare(oldPassword, user.password))) {
      const hashedNewPassword = await bcrypt.hash(newPassword, 10)
      await this.repository.updatePassword(userId, hashedNewPassword)
      return true
    }

    return false
  }
}