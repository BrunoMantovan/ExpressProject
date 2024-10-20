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
import { Command } from "commander";
import { AppInit } from "./init/initialConfig.js"

const app = express();
const productManagerDB = new ProductManagerDB();
const commander = new Command(app);
AppInit(app)

commander
  .option('--port <port>', "Puerto del server", 8080)
  .option('--mode <mode>', "Ambiente donde se usaran las variables de entorno", 'dev')
  .requiredOption('--rol <rol>○', "Rol a ejecutar", "user")
commander.parse()
console.log(commander.opts())

const homeRouter = new HomeRoute()
const sessionRouter = new SessionRouter()

app.use(session({
    store: MongoStore.create({
      mongoUrl: "mongodb+srv://ploktor:Sabaton.2001@cluster0.sknub.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
      dbName: "users",
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


const httpServer =app.listen(process.env.PORT, () =>{
    console.log("Servidor iniciado en http://localhost:8080");
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