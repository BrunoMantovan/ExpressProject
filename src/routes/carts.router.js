import {Router} from "express";
import {__dirname} from "../utils.js";
import CartManagerDB from "../dao/managers/carts.dao.managers.js";

const router = Router();
const cartsManager = new CartManagerDB()

router.get("/", async (req, res)=>{
    const carts = await cartsManager.getCart()
    res.status(200).json({
        mensaje: "Se encontraron los carritos",
        carritos: carts
    })
})
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
    const result = await cartsManager.addProductToCart(cid, pid)
    if (!result) {
        return res.status(400).json({
            mensaje: "No se encontró el producto"
        });
    }else if(result){
        return res.status(201).json({
            mensaje: "Producto agregado correctamente"
        });
    }
})
router.delete("/:cid/products/:pid", async (req, res)=>{
    const {cid, pid} = req.params
    const result = await cartsManager.deleteProduct(cid, pid)
    if (!result) {
        return res.status(400).json({
            mensaje: "El producto no existe"
        });
    }
    res.status(200).json({
        mensaje: "Se eliminó el producto del carrito"
    })
})
router.delete("/:cid", async (req, res) => {
    const {cid} = req.params
    const result = await cartsManager.deleteAllProducts(cid)
    if (!result) {
        return res.status(400).json({
            mensaje: "El carrito no existe"
        });
    }
    res.status(200).json({
        mensaje: "Se eliminó el carrito"
    })
})
router.put("/:cid/products/:pid", async (req, res)=>{
    const {cid, pid} = req.params
    const {quantity} = req.body
    const result = await cartsManager.updateQuantity(cid, pid, quantity)
    if (!result) {
        return res.status(400).json({
            mensaje: "El producto no existe"
        });
    }
    res.status(200).json({
        mensaje: "Se actualizó la cantidad del producto"
    })
})
router.put("/:cid", async (req, res)=>{
    const {cid} = req.params
    const {products} = req.body
    const result = await cartsManager.updateProductsArray(cid, products)
    if (!result) {
        return res.status(400).json({
            mensaje: "El carrito no existe"
        });
    }
    res.status(200).json({
        mensaje: "Se actualizó el carrito"
    })
})
export default router;