import passport from "passport";
import jwt, { ExtractJwt } from "passport-jwt";
import { getJWTCookie } from "../utils.js";

const JSWStrategy = jwt.Strategy

const initPassport = () =>{
    passport.use("jwt", new JSWStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([getJWTCookie]),
        secretOrKey: process.env.PRIVATE_KEY,
    }, (jwt_payload, done) => {
        try{
            return done(null, jwt_payload)
        }catch(e){
            return done(e)
        }
    }))
}

export default initPassport;