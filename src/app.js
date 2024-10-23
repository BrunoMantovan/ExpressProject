import express from "express";
import { Server } from "socket.io";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import initPassport from "./config/passport.config.js";
import { AppInit } from "./init/initialConfig.js"
import config from "./config.js"
import HomeRouterCustom from "./routes/home.router.js";
import SessionRouterCustom from "./routes/session.route.js";
import ProductsRouterCustom from "./routes/products.router.js";
import CartsRouterCustom from "./routes/carts.router.js";
import RtpRouterCustom from "./routes/rtp.router.js";
import ProductController from "./controllers/product.controller.js";

const app = express();
const productController = new ProductController();
AppInit(app)

const homeRouter = new HomeRouterCustom()
const productRouter = new ProductsRouterCustom();
const cartsRouter = new CartsRouterCustom();
const rtpRouter = new RtpRouterCustom()
const sessionRouter = new SessionRouterCustom()

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

app.use("/", homeRouter.getRouter())
app.use("/api/products", productRouter.getRouter())
app.use("/api/carts", cartsRouter.getRouter())
app.use("/api/realtimeproducts", rtpRouter.getRouter())
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
        try {
            const result = await productController.create({ body: product });
            if (result) {
                socket.emit("addedProduct", "El producto ha sido añadido correctamente");
            } else {
                socket.emit("error", "No se pudo añadir el producto");
            }
        } catch (error) {
            socket.emit("error", "Error al añadir el producto");
        } 
    })
    socket.on("updateProduct", async (product) => {
        try {
            const result = await productController.update({ params: { id: product.id }, body: product.updatedProduct });
            if (result) {
                socket.emit("updatedProduct", "El producto ha sido actualizado correctamente");
            } else {
                socket.emit("error", "No se pudo actualizar el producto");
            }
        } catch (error) {
            socket.emit("error", "Error al actualizar el producto");
        }
    })
    socket.on("deleteProduct", async (id) => {
        try {
            const result = await productController.delete({ params: { id } });
            if (result) {
                socket.emit("deletedProduct", "El producto ha sido eliminado correctamente");
            } else {
                socket.emit("error", "No se pudo eliminar el producto");
            }
        } catch (error) {
            socket.emit("error", "Error al eliminar el producto");
        }

    })
})