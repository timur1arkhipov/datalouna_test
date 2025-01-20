import { PurchasesRepository } from "./purchases.repository"

export class PurchasesService {
  private repository: PurchasesRepository

  constructor(repository: PurchasesRepository) {
    this.repository = repository
  }

  async getPurchasesByUserId(userId: number) {
    return await this.repository.getPurchasesByUserId(userId)
  }
}