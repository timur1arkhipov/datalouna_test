import type { ProductRepository } from "./products.repository"

export class ProductService {
  private repository: ProductRepository

  constructor(repository: ProductRepository) {
    this.repository = repository
  }

  async getAllProducts() {
    return await this.repository.getAllProducts()
  }

  async purchaseProduct(userId: number, productId: number, quantity: number) {
    return await this.repository.transaction(async (trx) => {
      const product = await this.repository.getProductById(productId, trx)

      if (!product) {
        throw new Error("Product not found")
      }

      const totalPrice = product.price * quantity

      // блок строки при чтении
      const user = await this.repository.getUserBalanceForUpdate(userId, trx)

      if (user.balance < totalPrice) {
        throw new Error("Wrong balance")
      }

      const updatedUser = await this.repository.updateUserBalance(userId, user.balance - totalPrice, trx)

      await this.repository.createPurchase(userId, productId, quantity, totalPrice, trx)

      return {
        message: "Purchase is done",
        updatedBalance: updatedUser.balance,
      }
    })
  }
}

