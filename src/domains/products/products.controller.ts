import type { Request, Response } from "express"
import { ProductService } from "./products.service"
import { ProductRepository } from "./products.repository"

export class ProductController {
  private productService: ProductService

  constructor() {
    const repository = new ProductRepository()
    this.productService = new ProductService(repository)
  }

  getProducts = async (req: Request, res: Response) => {
    try {
      const products = await this.productService.getAllProducts()
      res.json(products)
    } catch (error) {
      console.error("Error fetching products:", error)
      res.status(500).json({ error: "An error occurred while fetching products" })
    }
  }

  purchaseProduct = async (req: Request, res: Response) => {
    const { productId, quantity } = req.body
    const userId = req.session?.userId

    try {
      const result = await this.productService.purchaseProduct(userId, productId, quantity)
      res.json(result)
    } catch (error) {
      console.error("Error processing purchase:", error)
      if (error instanceof Error) {
        res.status(400).json({ error: error.message })
      } else {
        res.status(400).json({ error: "Error processing purchase" })
      }
    }
  }
}

