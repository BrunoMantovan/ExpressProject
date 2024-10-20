import { tokenGenerator } from "../utils.js";
import passport from "passport";
import { invokePassport } from "../middlewares/handleErrors.js";
import { handleAuth } from "../middlewares/handleAuth.js";
import CustomRouter from "./customRouter.js";

export default class UserRouterCustom extends CustomRouter {
    init(){
        this.get ("/getSession", ["PUBLIC"], (req, res) => {
            res.json(req.session);
        })
        
        this.post("/register", ["PUBLIC"], passport.authenticate("registerStrategy", {failureRedirect: "/failedRegister"}), async (req, res) => {
            res.status(201).json({mensaje: "Usuario creado"});
        });
        this.get("/failedRegister", ["PUBLIC"], (req, res) => {
            res.status(400).json({mensaje: "Error al crear el usuario"});
        })
        
        this.post("/login", ["PUBLIC"], passport.authenticate("loginStrategy", {failureRedirect: "/failedLogin"}), async (req, res) => {
            if(!req.body) return res.status(400).json({mensaje: "Credenciales incorrectas"});
            const user = {
                nombre: req.user.nombre,
                apellido: req.user.apellido,
                email: req.user.email,
                edad: req.user.edad,
                rol: req.user.rol,
            }
            req.session.isLogged = true;
            req.session.user = user
            const token = tokenGenerator(user)
        
            res.status(200).cookie("authToken", token, {httpOnly: true, signed: true, secure: false, maxAge: 60 * 60 * 1000 }).json({mensaje: "Usuario logueado", token});
        });
        this.get("/failedLogin", ["PUBLIC"], (req, res) => {
            res.status(400).json({mensaje: "Error al inciar sesión"});
        })
        
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
    }
}