import {Router} from "express";
import CartsManager from "../class/cartsManager.js"
import {__dirname} from "../utils.js";

const router = Router();
const cartsManager = new CartsManager(__dirname + "/data/carts.json")

router.get("/:id", async (req, res)=>{
    const {id} = req.params
    const filteredCart = await cartsManager.getCartById(id)
    res.status(200).json({
        mensaje: "Se encontró el carrito",
        carrito: filteredCart
    })
})
router.post("/", async (req, res)=>{
    await cartsManager.addCart()
    res.status(201).json({
        mensaje: "Se creó el carrito"
    })
})
router.post("/:cid/products/:pid", async (req, res)=>{
    const {cid, pid} = req.params
    await cartsManager.addProductToCart(cid, pid)
    res.status(201).json({
        mensaje: "Carrito actualizado"
    })
})

export default router;