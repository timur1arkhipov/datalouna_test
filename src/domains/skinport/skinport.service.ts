import { SkinportRepository } from "./skinport.repository"

interface SkinportItem {
  market_hash_name: string
  item_page: string
  market_page: string
  min_price_tradable: number | null
  min_price_non_tradable: number | null
}
export class SkinportService {
  private repository: SkinportRepository

  constructor(repository: SkinportRepository) {
    this.repository = repository
  }

  async fetchSkinportItems(): Promise<SkinportItem[]> {
    const [dataTradable, dataNonTradable] = await Promise.all([
      this.repository.fetchTradableItems(),
      this.repository.fetchNonTradableItems(),
    ])

    const itemsMap = new Map<string, SkinportItem>()

    this.processItems(dataTradable, itemsMap, true)
    this.processItems(dataNonTradable, itemsMap, false)

    return Array.from(itemsMap.values())
  }

  private processItems(data: any[], itemsMap: Map<string, SkinportItem>, isTradable: boolean) {
    data.forEach((item: any) => {
      const existingItem = itemsMap.get(item.market_hash_name)
      if (existingItem) {
        if (isTradable) {
          existingItem.min_price_tradable = item.min_price
        } else {
          existingItem.min_price_non_tradable = item.min_price
        }
      } else {
        itemsMap.set(item.market_hash_name, {
          market_hash_name: item.market_hash_name,
          item_page: item.item_page,
          market_page: item.market_page,
          min_price_tradable: isTradable ? item.min_price : null,
          min_price_non_tradable: isTradable ? null : item.min_price,
        })
      }
    })
  }
}
