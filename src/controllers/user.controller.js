import UserDTO from "../DTO/User.dto.js"
import UserService from "../services/user.services.js"
import { createResponse } from "../utils.js"
import Controllers from "./Controllers.js"

const userService = new UserService()

export default class UserController extends Controllers{
    constructor(){
        super(userService)
    }

    register = async(req, res, next)=>{
        try{
            const data = await this.service.register(req.body)
            const response = data ? new UserDTO(data) : null;
            !response ? createResponse(res, 404, response) : createResponse(res, 201, response)
        }catch (e) {
            next(e)
        }
    }
    login = async(req, res, next)=>{
        try{
            const data = await this.service.login(req.body)
            const token = data.token
            req.session.isLogged = true;
            req.session.user = data.user
            const userDto = new UserDTO(data.user)
            
            !token ? createResponse(res, 404, token) : 
            res.status(200).cookie("authToken", token, {httpOnly: true, signed: true, secure: false, maxAge: 60 * 60 * 1000 }).json({mensaje: "Usuario logueado", userDto ,token});
        }catch (e) {
            next(e)
        }
    }
    logout = async(req, res, next)=>{
        try{
            req.session.destroy((e)=>{
                if(e) return res.send("error al desloguearse")
                return res.redirect("/login")                
            })
        }catch (e) {
            next(e)
        }
    }
    current = async(req, res, next)=>{
        try{
            if (req.user) {
                const userDto = new UserDTO(req.user.user)
                res.json({ usuario: userDto});
            } else {
                res.status(401).json({ mensaje: "Unauthorized" });
            }
        }catch (e) {
            next(e)
        }
    }
}