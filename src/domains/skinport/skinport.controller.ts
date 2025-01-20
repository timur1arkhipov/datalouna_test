import type { Request, Response } from "express"
import { SkinportService } from "./skinport.service"
import { redisClient } from "../../index"
import { SkinportRepository } from "./skinport.repository"

export class SkinportController {
  private skinportService: SkinportService

  constructor() {
    const repository = new SkinportRepository()
    this.skinportService = new SkinportService(repository)
  }

  getItems = async (req: Request, res: Response) => {
    try {
      const cacheKey = "skinport_items_cache"
      const cachedItems = await redisClient.get(cacheKey)

      if (cachedItems) {
        console.log("Returning cached data")
        return res.json(JSON.parse(cachedItems))
      }

      const items = await this.skinportService.fetchSkinportItems()

      await redisClient.setEx(cacheKey, 3600, JSON.stringify(items))

      res.json(items)
    } catch (error) {
      console.error("Error fetching items:", error)
      res.status(500).json({ error: "An error occurred while fetching items" })
    }
  }
}

