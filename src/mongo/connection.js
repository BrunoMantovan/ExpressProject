import mongoose from "mongoose";

/* export const connectionDB = async() => {
    try{
        await mongoose.connect(process.env.MONGO_STRING ,{ dbName: process.env.DB_NAME });
        console.log('BBDD conectada')
    } catch (e) {
        console.log('Error al conectarse a la bbdd');
    }
} */
export default class MongoSingleton {
    static #instance;
    
    constructor(){
        mongoose.connect(process.env.MONGO_STRING ,{ dbName: process.env.DB_NAME });
    }

    static getInstance(){
        if(this.#instance){
            console.log("devolviendo la instancia");
            return this.#instance;
        }
        this.#instance = new MongoSingleton();
        console.log("se creo la instancia");        
        return this.#instance;
    }
}