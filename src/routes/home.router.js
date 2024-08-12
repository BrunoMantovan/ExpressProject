import { Router } from "express";
import { ProductModel } from "../dao/model/products.model.js";
import ProductManagerDB from "../dao/managers/products.dao.managers.js";

const router = Router();
const manager = new ProductManagerDB()

router.get("/", async (req, res)=>{
    const productos = await manager.getProducts()
    res.render("home", {productos})
})
export default router;