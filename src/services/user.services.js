import { tokenGenerator, isValidPassword, createHash } from "../utils.js";
import UserAccessMongo from "../dao/model/user.dao.js";
import Services from "./services.js"

const userDAO = new UserAccessMongo()

export default class UserService extends Services {
    constructor() {
        super(userDAO)
    }

    async register(user){
        try {
            const { email, password } = user
            const existUser = await this.dao.getByEmail(email)
            if(!existUser){
                const newUser = await this.dao.create({
                    ...user,
                    password: createHash(password)
                })
                return newUser
            }
            return null
        } catch(e){
            throw new Error(e)
        }
    }

    async login(user) {
        try {
            const { email, password } = user;
            const userExist = await this.dao.getByEmail(email);
            
            if (!userExist) return null;
            const passValid = isValidPassword(userExist, password);
            if (!passValid) return null;
            
            return {
                user: userExist,
                token: tokenGenerator(userExist)
            }
          
        } catch (error) {
          throw new Error(error);
        }
    };
}