import { Router } from "express";
import { ProductModel } from "../dao/model/products.model.js";
import ProductManagerDB from "../dao/managers/products.dao.managers.js";
import { isAuth, isLog } from "../middlewares/protectedRoute.js";

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
router.get("/register", isLog, (req, res) => {
    res.render("register", {});
  });
  
  router.get("/login", isLog, (req, res) => {
    res.render("login", {});
  });
  
  router.get("/perfil", isAuth, (req, res) => {
    const user = req.session.user
    const isLogged = req.session.isLogged
    
    res.render("perfil", {user, isLogged});
  });
export default router;