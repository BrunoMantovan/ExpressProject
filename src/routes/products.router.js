import {Router} from "express";
import ProductManager from "../class/productManager.js";
import {__dirname} from "../utils.js";

const router = Router();

const productManager = new ProductManager(__dirname + "/data/products.json")

router.get("/", async (req, res) => {
    const list = await productManager.getProductList()
    res.status(200).json({
        mensaje: "Se encontraron los productos",
        productos: list
    })
})

router.post("/", async (req, res) => {
    const product = req.body
    const result = await productManager.addProduct(product);
    if (result === false) {
        return res.status(400).json({
            mensaje: "Faltan campos o tienen valores incorrectos"
        });
    }else if(result == true){
        res.status(201).json({
            mensaje: "producto añadido"
        })
    }
    return res.status(409).json({
        mensaje: "El producto ya existe"
    });
})

router.get("/:id", async (req, res)=> {
    const {id} = req.params
    const filteredProduct = await productManager.getProductById(id)
    res.status(200).json({
        mensaje: "Se encontró el producto",
        producto: filteredProduct
    })
})

router.put("/:id", async (req, res)=> {
    const {id} = req.params
    const productUpdate = req.body
    const result = await productManager.updateProduct(id, productUpdate)
    if (result === false) {
        return res.status(400).json({
            mensaje: "Revise los valores a actualizar"
        });
    }else if(result == -1){
        return res.status(404).json({
            mensaje: "No se encontró el producto"
        });
    }
    res.status(200).json({
        mensaje: "Se actualizó el producto"
    })
})

router.delete("/:id", async (req, res)=> {
    const {id} = req.params
    await productManager.deleteProduct(id)
    res.status(200).json({
        mensaje: "Se eliminó el producto"
    })
})


export default router;