import express from "express";
import productRoute from "./routes/products.router.js";
import cartRoute from "./routes/carts.router.js";
import homeRoute from "./routes/home.router.js";
import rtpRoute from "./routes/rtp.router.js";
import {__dirname} from "./utils.js";
import { Server } from "socket.io";
import ProductManager from "./class/productManager.js";
import handlebars from "express-handlebars";

const app = express();
const productManager = new ProductManager(__dirname + "/data/products.json")
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
app.use("/realtimeproducts", rtpRoute)


const httpServer =app.listen(8080, () =>{
    console.log("Servidor iniciado en http://localhost:8080");
})

export const io = new Server(httpServer);

io.on("connection", async (socket) => {
    const list = await productManager.getProductList()
    socket.emit("showList", list)
    socket.on("addProduct", async (product) => {
        const result = await productManager.addProduct(product);
        if (result === false) {
            console.log(result);
            return socket.emit("error", "Faltan campos o tienen valores incorrectos")
        }else if(result == true){
            return socket.emit("addedProduct", list)
        }
        socket.emit("error", "El producto ya existe")
    })
    socket.on("updateProduct", async (product) => {
        const result = await productManager.updateProduct(product.id, product.updatedProduct);
        if (result === false) {
            console.log(result);
            return socket.emit("error", "Faltan campos o tienen valores incorrectos")
        }else if(result == true){
            return socket.emit("addedProduct", list)
        }
        socket.emit("error", "El producto no existe")
    })
    socket.on("deleteProduct", async (id) => {
        const result = await productManager.deleteProduct(id);
        if (result === false) {
            console.log(result);
            return socket.emit("error", "El producto no existe")
        }
        return socket.emit("addedProduct", list)

    })
})