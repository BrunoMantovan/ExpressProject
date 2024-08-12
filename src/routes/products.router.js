import {Router} from "express";
import ProductManager from "../class/productManager.js";
import {__dirname} from "../utils.js";
import { ProductModel } from "../dao/model/products.model.js";
import ProductManagerDB from "../dao/managers/products.dao.managers.js";

const router = Router();

const productManagerDB = new ProductManagerDB()

router.get("/", async (req, res) => {
    const list = await productManager.getProductList()
})

router.post("/", async (req, res) => {
    const product = req.body
    console.log(product)
    
    /* const result = await productManager.addProduct(product);
    if (result === false) {
        return res.status(400).json({
            mensaje: "Faltan campos o tienen valores incorrectos"
        });
    }else if(result == true){
        res.status(201).json({
            mensaje: "producto añadido"
        })
    } */
   try{
    const result = await ProductModel.create(product)
    return res.status(201).json({
       mensaje: "producto añadido",
       payload: result
    });
   }catch(e){
       return res.status(500).json({
           mensaje: "Error creando producto",
           error: e
       })
   }
})

router.get("/:id", async (req, res)=> {
    const {id} = req.params
    const filteredProduct = await productManagerDB.getProductById(id)
    res.status(200).json({
        mensaje: "Se encontró el producto",
        producto: filteredProduct
    })
})

router.put("/:id", async (req, res)=> {
    const {id} = req.params
    const productUpdate = req.body
    const result = await productManagerDB.updateProduct(id, productUpdate)
    if (!result) {
        return res.status(400).json({
            mensaje: "El producto no existe"
        });
    }else if(result){
        return res.status(200).json({
            mensaje: "Se actualizó el producto"
        });
    }
})

router.delete("/:id", async (req, res)=> {
    const {id} = req.params
    const result = await productManagerDB.deleteProduct(id)
    if (!result) {
        return res.status(400).json({
            mensaje: "El producto no existe"
        });
    }
    res.status(200).json({
        mensaje: "Se eliminó el producto"
    })
})


export default router;