import { sql } from "../../index"
import { ProductRepository } from "./products.repository"

export class ProductService {
  private repository: ProductRepository

  constructor(repository: ProductRepository) {
    this.repository = repository
  }

  async getAllProducts() {
    return await this.repository.getAllProducts()
  }

  async purchaseProduct(userId: number, productId: number, quantity: number) {
    return await sql.begin(async () => {
      const product = await this.repository.getProductById(productId)

      if (!product) {
        throw new Error("Product not found")
      }

      const totalPrice = product.price * quantity

      const user = await this.repository.getUserBalance(userId)

      if (user.balance < totalPrice) {
        throw new Error("Insufficient balance")
      }

      const updatedUser = await this.repository.updateUserBalance(userId, user.balance - totalPrice)

      await this.repository.createPurchase(userId, productId, quantity, totalPrice)

      return {
        message: "Purchase successful",
        updatedBalance: updatedUser.balance,
      }
    })
  }
}
