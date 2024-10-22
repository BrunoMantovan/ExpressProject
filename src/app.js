import express from "express";
import productRoute from "./routes/products.router.js";
import cartRoute from "./routes/carts.router.js";
import HomeRoute from "./routes/home.router.js";
import rtpRoute from "./routes/rtp.router.js";
import { Server } from "socket.io";
import ProductManagerDB from "./dao/managers/products.dao.managers.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import SessionRouter from "./routes/session.route.js";
import passport from "passport";
import initPassport from "./config/passport.config.js";
import { AppInit } from "./init/initialConfig.js"
import config from "./config.js"

const app = express();
const productManagerDB = new ProductManagerDB();
AppInit(app)

const homeRouter = new HomeRoute()
const sessionRouter = new SessionRouter()

app.use(session({
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_STRING,
      dbName: process.env.DB_NAME,
      ttl: 360,
    }),
    secret: "secret",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 120000 } 
}));
  
initPassport(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/products", productRoute)
app.use("/api/carts", cartRoute)
app.use("/", homeRouter.getRouter())
app.use("/api/realtimeproducts", rtpRoute)
app.use("/api/sessions", sessionRouter.getRouter());

const PORT = config.PORT

/* process.on("exit", (code) =>{
    console.log("El servidor se ha cerrado con el codigo " + code);
})
process.exit() */

const httpServer =app.listen(PORT, () =>{
    console.log("Servidor iniciado en http://localhost:" + PORT);
})

export const io = new Server(httpServer);

io.on("connection", async (socket) => {
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
            return socket.emit("addedProduct", "El producto ha sido añadido correctamente")
        } 
    })
    socket.on("updateProduct", async (product) => {
        const result = await productManagerDB.updateProduct(product.id, product.updatedProduct);
        if (!result) {
            console.log(result);
            return socket.emit("error", "El producto no existe")
        }else if(result){
            return socket.emit("updatedProduct", "El producto ha sido actualizado correctamente")
        }
    })
    socket.on("deleteProduct", async (id) => {
        const result = await productManagerDB.deleteProduct(id);
        if (!result) {
            console.log(result);
            return socket.emit("error", "El producto no existe")
        }
        return socket.emit("addedProduct")

    })
})