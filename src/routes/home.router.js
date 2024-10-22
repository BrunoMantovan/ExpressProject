import ProductManagerDB from "../dao/managers/products.dao.managers.js";
import { isAuth, isLog } from "../middlewares/protectedRoute.js";
import CustomRouter from "./customRouter.js";
import ProductController from "../controllers/product.controller.js";

const productController = new ProductController();
const productManagerDB = new ProductManagerDB()


export default class UserRouterCustom extends CustomRouter {
  init(){
    this.get("/", ["PUBLIC"], isAuth, productController.getProductsView);
    
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