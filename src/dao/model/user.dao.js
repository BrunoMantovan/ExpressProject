import MongoDao from "./dao.js"
import { UserModel } from "./user.models.js"

export default class UserAccessMongo extends MongoDao {
    constructor(){
        super(UserModel)
    }

    async getByEmail(email){
        try {
            return await this.model.findOne({ email }) // modelo es la conexion a la base de datos
        } catch (error) {
            throw new Error(error)
        }
    }
}