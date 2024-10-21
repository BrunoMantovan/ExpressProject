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
        
        this.get("/logout", ["PUBLIC"], (req, res) => {
            req.session.destroy((e)=>{
                if(e) return res.send("error al desloguearse")
                return res.redirect("/login")
                
            })
        })
        this.get("/current", ["PUBLIC"], invokePassport("jwt"), handleAuth("admin"), async (req, res) => {
            if (req.user) {
                res.json({ usuario: req.user });
            } else {
                res.status(401).json({ mensaje: "Unauthorized" });
            }
        })
        this.get ("/:id", ["PUBLIC"], userController.getById)
        this.put ("/:id", ["PUBLIC"], userController.update)
        this.delete ("/:id", ["PUBLIC"], userController.delete)

        /* this.get("/failedRegister", ["PUBLIC"], (req, res) => {
            res.status(400).json({mensaje: "Error al crear el usuario"});
        })
        this.get("/failedLogin", ["PUBLIC"], (req, res) => {
            res.status(400).json({mensaje: "Error al inciar sesión"});
        }) */
    }
}