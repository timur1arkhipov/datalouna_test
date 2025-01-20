import { sql } from "../../index"

export class ProductRepository {
  async getAllProducts() {
    return await sql`SELECT * FROM products`
  }

  async getProductById(productId: number) {
    const [product] = await sql`SELECT * FROM products WHERE id = ${productId}`
    return product
  }

  async getUserBalance(userId: number) {
    const [user] = await sql`SELECT balance FROM users WHERE id = ${userId}`
    return user
  }

  async updateUserBalance(userId: number, newBalance: number) {
    const [updatedUser] = await sql`
      UPDATE users
      SET balance = ${newBalance}
      WHERE id = ${userId}
      RETURNING balance
    `
    return updatedUser
  }

  async createPurchase(userId: number, productId: number, quantity: number, totalPrice: number) {
    await sql`
      INSERT INTO purchases (user_id, product_id, quantity, total_price)
      VALUES (${userId}, ${productId}, ${quantity}, ${totalPrice})
    `
  }
}