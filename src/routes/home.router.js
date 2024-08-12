import { Router } from "express";
import { ProductModel } from "../dao/model/products.model.js";
import ProductManagerDB from "../dao/managers/products.dao.managers.js";

const router = Router();
const productManagerDB = new ProductManagerDB()

router.get("/", async (req, res)=>{
    try {
        const { page=1, limit=10, sort='' } = req.query;        
        const products = await productManagerDB.getProducts(page, limit, sort);
        const result = products.docs     
        res.render("home", { result });
      } catch(e){
        return res.status(500).json({
            mensaje: "Error cargando productos",
            error: e
        })
    }
})
export default router;