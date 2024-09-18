import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import multer from "multer";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const createHash = (pass) => bcrypt.hashSync(pass, bcrypt.genSaltSync(10))
export const isValidPassword = (user, pass) => bcrypt.compareSync(pass, user.password)

const __filename = fileURLToPath(import.meta.url)

export const __dirname = dirname(__filename)

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, __dirname + "/public/img");
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname);
    }
})

const PRIVATE_KEY = "C0D3RH0US3"

export const tokenGenerator = (user) => {
    const token = jwt.sign({user}, PRIVATE_KEY, {expiresIn: "1h"})
    return token
}

export const decodeToken = (req, res, next) => {
    const token = req.cookies.authToken
    console.log(token);
    
    if(!token) res.status(401).json({mensaje: "No hay token"})
    jwt.verify(token, PRIVATE_KEY, (err, decoded) => {
        if(err) res.status(401).json({mensaje: "Token no valido"})
        req.user = decoded.user
        next()
    })
}

export const uploader = multer({ storage })