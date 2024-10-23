import { isAuth } from "../middlewares/protectedRoute.js";
import CustomRouter from "./customRouter.js";

export default class RtpRouterCustom extends CustomRouter {
    init(){
        this.get("/", ["ADMIN"], (req, res)=>{
            res.render("realTimeProducts", {})
        })
    }
}