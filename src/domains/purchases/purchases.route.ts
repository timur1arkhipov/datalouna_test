import express from "express"
import { PurchasesController } from "./purchases.controller"
import { isAuthenticated } from "../../middleware/auth"

const purchasesRouter = express.Router()
const purchasesController = new PurchasesController()

purchasesRouter.get("/", isAuthenticated, purchasesController.getPurchases)

export default purchasesRouter