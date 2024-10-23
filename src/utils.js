import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
//import multer from "multer";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid';


export const createHash = (pass) => bcrypt.hashSync(pass, bcrypt.genSaltSync(10))
export const isValidPassword = (user, pass) => bcrypt.compareSync(pass, user.password)

const __filename = fileURLToPath(import.meta.url)

export const __dirname = dirname(__filename)

/* const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, __dirname + "/public/img");
    },
    filename: (req, file, callback) => {
        callback(null, file.originalname);
    }
}) */

export const tokenGenerator = (user) => {
    const token = jwt.sign({user}, process.env.PRIVATE_KEY, {expiresIn: "1h"})
    return token
}

export const generateUniqueCode = () => {
    return uuidv4();
};

export const getJWTCookie = (req) => {
    let token = null
    if(req.signedCookies){
        token = req.signedCookies["authToken"]
    }
    return token
}
//export const uploader = multer({ storage })

export const createResponse = (res, statusCode, data) => {
    return res.status(statusCode).json({data})
}