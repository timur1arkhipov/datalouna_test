import express from "express"
import { SkinportController } from "./skinport.controller"
import { isAuthenticated } from "../../middleware/auth"

const skinportRouter = express.Router()
const skinportController = new SkinportController()

skinportRouter.get("/items", isAuthenticated, skinportController.getItems)

export default skinportRouter