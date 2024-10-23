import { Router } from "express";
import jwt from "jsonwebtoken";
export default class CustomRouter {
    constructor() {
        this.router = Router();
        this.init()
    }

    getRouter() {
        return this.router;
    }

    init(){}

    get(path, policies, ...cb) {
        this.router.get(path, this.handlePolicies(policies), this.customResponses, this.applyCallbacks(cb));
    }
    post(path, policies, ...cb) {
        this.router.post(path, this.handlePolicies(policies), this.customResponses, this.applyCallbacks(cb));
    }
    put(path, policies, ...cb) {
        this.router.put(path, this.handlePolicies(policies), this.customResponses, this.applyCallbacks(cb));
    }
    delete(path, policies, ...cb) {
        this.router.delete(path, this.handlePolicies(policies), this.customResponses, this.applyCallbacks(cb));
    }

    applyCallbacks(cb) {
        return cb.map(callback => async (...params) => { // ...parasm = [req, res, next, err, ...]
            try {
                await callback.apply(this, params);
            }catch(e) {
                return params[1].status(500).send(e);
            }
        });
    }

    customResponses(req, res, next){
        res.success = payload => res.json({success: true, payload});
        res.error = payload => res.status(500).json({success: false, payload});
        res.notFound = () => res.status(404).json({success: false, payload: "no se encontro la ruta"});
        next();
    }

    handlePolicies(policies){ //["PUBLIC", "ADMIN", "USER"]
        return (req, res, next) => {
            console.log(policies);
            
            if(policies.includes("PUBLIC")) return next();
            const reqJWT = req.headers.authorization ? req.headers.authorization : req.signedCookies.authToken;
            console.log("headers: ",req.headers.authorization);
            console.log("cookies: ",req.signedCookies.authToken);
            console.log("jwt: ",reqJWT);
            
            
            if(!reqJWT) return res.status(401).json({success: false, payload: "usuario no logeado"});
            let userPayload = null
            try{
                userPayload = jwt.verify(reqJWT, process.env.PRIVATE_KEY)
            }catch (e){
                return res.status(400).send({status:'error', message: e })
            }
            if(!userPayload) return res.status(400).send({success: false, payload: "error en el token"})
                console.log(userPayload);
                
            if(!policies.includes(userPayload.user.rol.toUpperCase())) return res.status(403).json({success: false, payload: "no tienes permisos"})
            req.user = userPayload
            next()
        }        
    }
}