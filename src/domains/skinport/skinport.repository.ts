export class SkinportRepository {
  private async fetchItems(params: URLSearchParams): Promise<any[]> {
    const clientId = process.env.SKINPORT_CLIENTID
    const clientSecret = process.env.SKINPORT_APIKEY

    const encodedData = Buffer.from(`${clientId}:${clientSecret}`).toString("base64")
    const authorizationHeaderString = `Basic ${encodedData}`

    const headers = {
      "Accept-Encoding": "br",
      Authorization: authorizationHeaderString,
    }

    const response = await fetch(`https://api.skinport.com/v1/items?${params}`, { headers })

    if (!response.ok) {
      throw new Error("Error while fetching data")
    }

    return await response.json()
  }

  async fetchTradableItems(): Promise<any[]> {
    const params = new URLSearchParams({
      app_id: "730",
      currency: "EUR",
      tradable: "1",
    })
    return this.fetchItems(params)
  }

  async fetchNonTradableItems(): Promise<any[]> {
    const params = new URLSearchParams({
      app_id: "730",
      currency: "EUR",
      tradable: "0",
    })
    return this.fetchItems(params)
  }
}