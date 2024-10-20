import mongoose from "mongoose";

export const connectionDB = async() => {
    try{
        await mongoose.connect(process.env.MONGO_STRING ,{ dbName: process.env.DB_NAME });
        console.log('BBDD conectada')
    } catch (e) {
        console.log('Error al conectarse a la bbdd');
    }
}