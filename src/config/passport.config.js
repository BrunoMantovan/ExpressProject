import passport from "passport";
import local from "passport-local";
import { UserModel } from "../models/user.models.js";
import { createHash, isValidPassword } from "../utils.js";

const localStrategy = local.Strategy

const initPassport = (app) =>{
    passport.use("registerStrategy", new localStrategy({
        usernameField: "email",
        passReqToCallback: true, //pasar el objeto a otros middlewares
        
    }, async (req, username, password, done) => {
       try{
        const {nombre, apellido, edad, email, password} = req.body;

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
            password: createHash(password)
        }
        const user = await UserModel.create(newUser)
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

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        const user = await UserModel.findById(id);
        done(null, user);
    })
}

export default initPassport;