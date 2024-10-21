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
            !data ? createResponse(res, 404, data) : createResponse(res, 201, data)
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
            
            !token ? createResponse(res, 404, token) : 
            res.status(200).cookie("authToken", token, {httpOnly: true, signed: true, secure: false, maxAge: 60 * 60 * 1000 }).json({mensaje: "Usuario logueado", token});
        }catch (e) {
            next(e)
        }
    }
}