import express from "express"
import cookieSession from "cookie-session"
import { createClient } from "redis"
import postgres from 'postgres'
import authRoutes from "./domains/auth/auth.route"
import productsRouter from "./domains/products/products.route"
import purchasesRouter from "./domains/purchases/purchases.route"
import skinportRouter from "./domains/skinport/skinport.route"

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(
  cookieSession({
    name: "session",
    keys: [process.env.SESSION_KEY || "secret"],
    maxAge: 24 * 60 * 60 * 1000,
  }),
)

const sql = postgres(process.env.DATABASE_URL || 'postgres://user:password@localhost:5432/datalouna')

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://:redis@localhost:6379',
})

redisClient.connect().catch((err) => console.error('Redis connection error:', err))

app.use("/auth", authRoutes)
app.use("/skinport", skinportRouter)
app.use("/products", productsRouter)
app.use("/purchases", purchasesRouter)


app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

export { sql, redisClient }