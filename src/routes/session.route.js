import { tokenGenerator } from "../utils.js";
import passport from "passport";
import { invokePassport } from "../middlewares/handleErrors.js";
import { handleAuth } from "../middlewares/handleAuth.js";
import CustomRouter from "./customRouter.js";
import UserController from "../controllers/user.controller.js";
const userController = new UserController()
export default class UserRouterCustom extends CustomRouter {
    init(){
        this.get ("/getSession", ["PUBLIC"], (req, res) => {
            res.json(req.session);
        })
        this.get ("/", ["PUBLIC"], userController.getAll)
        this.post("/register", ["PUBLIC"], userController.register)
        this.post("/login", ["PUBLIC"], userController.login)        
        this.get("/logout", ["PUBLIC"], userController.logout)
        this.get("/current", ["PUBLIC"], invokePassport("jwt"), handleAuth("admin"), userController.current)
        this.get ("/:id", ["PUBLIC"], userController.getById)
        this.put ("/:id", ["PUBLIC"], userController.update)
        this.delete ("/:id", ["PUBLIC"], userController.delete)
    }
}