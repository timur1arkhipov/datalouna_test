import express from "express"
import { isAuthenticated } from "../../middleware/auth"
import { ProductController } from "./products.controller"

const productsRouter = express.Router()
const productController = new ProductController()

productsRouter.get("/", isAuthenticated, productController.getProducts)
productsRouter.post("/purchase", isAuthenticated, productController.purchaseProduct)

export default productsRouter

