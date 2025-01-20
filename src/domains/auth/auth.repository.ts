import { sql } from "../../index"

export class AuthRepository {
  async createUser(username: string, email: string, hashedPassword: string) {
    const [user] = await sql`
    INSERT INTO users (username, email, password)
    VALUES (${username}, ${email}, ${hashedPassword})
    RETURNING id, username, email
    `
    return user
  }
  
  async getUserByEmail(email: string) {
    const [user] = await sql`
    SELECT id, username, email, password
    FROM users
    WHERE email = ${email}
    `
    return user
  }
  
  async getUserById(userId: number) {
    const [user] = await sql`
    SELECT password
    FROM users
    WHERE id = ${userId}
    `
    return user
  }
  
  async updatePassword(userId: number, hashedNewPassword: string) {
    await sql`
    UPDATE users
    SET password = ${hashedNewPassword}
    WHERE id = ${userId}
    `
  }
}
