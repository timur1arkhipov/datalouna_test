import type { Request, Response } from "express"
import { PurchasesService } from "./purchases.service"
import { PurchasesRepository } from "./purchases.repository"

export class PurchasesController {
  private purchasesService: PurchasesService

  constructor() {
    const repository = new PurchasesRepository()
    this.purchasesService = new PurchasesService(repository)
  }

  getPurchases = async (req: Request, res: Response) => {
    try {
      const userId = req.session?.userId
      const purchases = await this.purchasesService.getPurchasesByUserId(userId)

      res.json(purchases)
    } catch (error) {
      console.error("Error fetching purchases:", error)
      res.status(500).json({ error: "An error occurred while fetching purchases" })
    }
  }
}

