import ProductManagerDB from "../dao/managers/products.dao.managers.js";
import { isAuth, isLog } from "../middlewares/protectedRoute.js";
import CustomRouter from "./customRouter.js";

const productManagerDB = new ProductManagerDB()


export default class UserRouterCustom extends CustomRouter {
  init(){
    this.get("/", async (req, res)=>{
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
    
    this.get("/register", ["PUBLIC"], isLog, (req, res) => {
      res.render("register", {});
    });
    
    this.get("/login", ["PUBLIC"], isLog, (req, res) => {
      console.log(req.session);
      
      res.render("login", {});
    });
    
    this.get("/perfil", ["PUBLIC"], isAuth, (req, res) => {
      console.log(req.session);
      const user = req.session.user
      const isLogged = req.session.isLogged
      
      res.render("perfil", {user, isLogged});
    });
    
    this.get('/:id', ["PUBLIC"], (req, res) => {
      res.send(req.params.id);
    });
  }
}