import passport from "passport";
import local from "passport-local";
import { UserModel } from "../models/user.models.js";
import { createHash, isValidPassword } from "../utils.js";
import jwt from "jsonwebtoken";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

const localStrategy = local.Strategy

const initPassport = (app) =>{
    passport.use("registerStrategy", new localStrategy({
        usernameField: "email",
        passReqToCallback: true, //pasar el objeto a otros middlewares
        
    }, async (req, username, password, done) => {
       try{
        const {nombre, apellido, edad, email, password, rol} = req.body;

        const userFound = await UserModel.findOne({email: username}).lean();
        if(userFound){
            console.log("usuario ya existe");
            done(null, false, {message: "usuario ya existe"});
        }
        const newUser ={
            nombre,
            apellido,
            edad,
            email,
            password: createHash(password),
            rol
        }
        const user = await UserModel.update(newUser)
        return done(null, user) 
       }catch(e){
        console.log(e);
        
        return done(e)
       }   
    }))

    passport.use("loginStrategy", new localStrategy({
        usernameField: "email",
        passReqToCallback: true, //pasar el objeto a otros middlewares
    }, async (req, username, password, done) => {
        try{
            const userFound = await UserModel.findOne({email: username})
            if(!userFound) return done(null, false, {message: "Credenciales incorrectas"})
            if(!isValidPassword(userFound, password)) return done(null, false, {message: "Credenciales incorrectas"})
            return done(null, userFound)
        }catch(e){
            return done(e)
        }
    }))

    passport.use("current", new JwtStrategy({
        jwtFromRequest: (req) => {
            const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req) || ExtractJwt.fromExtractors([req => req.cookies.authToken])(req);
            return token;
        },
        secretOrKey: process.env.PRIVATE_KEY
    }, async (jwt_payload, done) => {
        try {
            const user = await UserModel.findById(jwt_payload.user._id);
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        } catch (e) {
            return done(e, false);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        const user = await UserModel.findById(id);
        done(null, user);
    })
}

export default initPassport;