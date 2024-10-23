import passport from "passport";
import { UserModel } from "../dao/model/user.models.js";

const initPassport = (app) =>{
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        const user = await UserModel.findById(id);
        done(null, user);
    })
}

export default initPassport;