import { sql } from "../../index"

type query = typeof sql
type TransactionFunction<T> = (trx: query) => Promise<T>

export class ProductRepository {
  async getAllProducts() {
    return await sql`SELECT * FROM products`
  }

  async getProductById(
    productId: number,
    trx: query = sql
  ) {
    const [product] = await trx`SELECT * FROM products WHERE id = ${productId}`
    return product
  }

  async getUserBalanceForUpdate(
    userId: number,
    trx: query = sql
  ) {
    const [user] = await trx`SELECT balance FROM users WHERE id = ${userId} FOR UPDATE`
    return user
  }

  async updateUserBalance(
    userId: number,
    newBalance: number,
    trx: query = sql
  ) {
    const [updatedUser] = await trx`
      UPDATE users
      SET balance = ${newBalance}
      WHERE id = ${userId}
      RETURNING balance
    `
    return updatedUser
  }

  async createPurchase(
    userId: number,
    productId: number,
    quantity: number,
    totalPrice: number,
    trx: query = sql) {
    await trx`
      INSERT INTO purchases (user_id, product_id, quantity, total_price)
      VALUES (${userId}, ${productId}, ${quantity}, ${totalPrice})
    `
  }

  async transaction<T>(callback: TransactionFunction<T>): Promise<T> {
    return sql.begin(callback as any) as Promise<T>
  }
}
