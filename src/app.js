import express from "express";
import userRoute from "./routes/usuarios.router.js";
import productRoute from "./routes/products.router.js";
import cartRoute from "./routes/carts.router.js";
import {__dirname} from "./utils.js";

const app = express();

//middleware
app.use(express.json()) //parsea el body
app.use(express.urlencoded({extended: true})) //permite recibir formularios de las urls
app.use(express.static(__dirname + "/public")); //permite servir archivos estáticos
//app.use("api/users", userRoute)
app.use("/api/products", productRoute)
app.use("/api/carts", cartRoute)



app.listen(8080, () => {
    console.log("Está corriendo en http://localhost:8080/");
})