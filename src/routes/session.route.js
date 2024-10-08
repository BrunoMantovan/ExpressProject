import { Router } from "express";
import { UserModel } from "../models/user.models.js";
import { createHash, decodeToken, isValidPassword, tokenGenerator } from "../utils.js";
import passport from "passport";

const router = Router();

router.get ("/getSession", (req, res) => {
    res.json(req.session);
})

router.post("/register", passport.authenticate("registerStrategy", {failureRedirect: "/failedRegister"}), async (req, res) => {
    res.status(201).json({mensaje: "Usuario creado"});
});
router.get("/failedRegister", (req, res) => {
    res.status(400).json({mensaje: "Error al crear el usuario"});
})

router.post("/login", passport.authenticate("loginStrategy", {failureRedirect: "/failedLogin"}), async (req, res) => {
    if(!req.body) return res.status(400).json({mensaje: "Credenciales incorrectas"});
    const user = {
        nombre: req.user.nombre,
        apellido: req.user.apellido,
        email: req.user.email,
        edad: req.user.edad,
    }
    req.session.isLogged = true;
    req.session.user = user
    const token = tokenGenerator(user)

    res.cookie("authToken", token, {
        httpOnly: true,
        secure: false,
        maxAge: 60 * 60 * 1000 
    });
    res.status(200).json({mensaje: "Usuario logueado", token});
});
router.get("/failedLogin", (req, res) => {
    res.status(400).json({mensaje: "Error al inciar sesión"});
})

router.get("/logout", (req, res) => {
    req.session.destroy((e)=>{
        if(e) return res.send("error al desloguearse")
            return res.redirect("/")
        
    })
})

router.get("/current", decodeToken, async (req, res) => {
    if (req.user) {
        res.json({ usuario: req.user });
    } else {
        res.status(401).json({ mensaje: "Unauthorized" });
    }
})
export default router;