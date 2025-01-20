import { sql } from "../../index"

export class PurchasesRepository {
  async getPurchasesByUserId(userId: number) {
    return await sql`SELECT * FROM purchases WHERE user_id = ${userId}`
  }
}