import express from "express";
import productRoute from "./routes/products.router.js";
import cartRoute from "./routes/carts.router.js";
import homeRoute from "./routes/home.router.js";
import rtpRoute from "./routes/rtp.router.js";
import {__dirname} from "./utils.js";
import { Server } from "socket.io";
import ProductManager from "./class/productManager.js";
import handlebars from "express-handlebars";
import mongoose from "mongoose";
import ProductManagerDB from "./dao/managers/products.dao.managers.js";

const app = express();
const productManager = new ProductManager(__dirname + "/data/products.json")
const productManagerDB = new ProductManagerDB();
//middleware
app.use(express.json()) //parsea el body
app.use(express.urlencoded({extended: true})) //permite recibir formularios de las urls
app.use(express.static(__dirname + "/public")); //permite servir archivos estáticos
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars")
app.use("/api/products", productRoute)
app.use("/api/carts", cartRoute)
app.use("/", homeRoute)
app.use("/api/realtimeproducts", rtpRoute)


const httpServer =app.listen(8080, () =>{
    console.log("Servidor iniciado en http://localhost:8080");
})
mongoose.connect("mongodb+srv://ploktor:Sabaton.2001@cluster0.sknub.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    {dbName: "backend"}
).then(()=>{
    console.log("Conectado a MongoDB");
    
})
export const io = new Server(httpServer);

io.on("connection", async (socket) => {
    const list = await productManagerDB.getProducts()
    socket.emit("showList", list)
    socket.on("addProduct", async (product) => {

        const result = await productManagerDB.addProducts(
            product.title,
            product.description,
            product.price,
            product.thumbnail,
            product.code,
            product.stock,
            product.category,
            product.status
        )

        if (!result) {
            console.log(result);
            return socket.emit("error", "El producto ya existe")
        }else if(result){
            return socket.emit("addedProduct", list, "El producto ha sido añadido correctamente")
        } 
    })
    socket.on("updateProduct", async (product) => {
        const result = await productManagerDB.updateProduct(product.id, product.updatedProduct);
        if (!result) {
            console.log(result);
            return socket.emit("error", "El producto no existe")
        }else if(result){
            return socket.emit("updatedProduct", list, "El producto ha sido actualizado correctamente")
        }
    })
    socket.on("deleteProduct", async (id) => {
        const result = await productManagerDB.deleteProduct(id);
        if (!result) {
            console.log(result);
            return socket.emit("error", "El producto no existe")
        }
        return socket.emit("addedProduct", list)

    })
})