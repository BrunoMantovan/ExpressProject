import {Router} from "express";
import ProductManager from "../class/productManager.js";
import {__dirname} from "../utils.js";
import { ProductModel } from "../dao/model/products.model.js";
import ProductManagerDB from "../dao/managers/products.dao.managers.js";

const router = Router();

const productManagerDB = new ProductManagerDB()

router.get("/", async (req, res) => {
    try {
        const { page=1, limit=10, sort='' } = req.query;        
        const products = await productManagerDB.getProducts(page, limit, sort);
        const result = products.docs     
        res.status(200).json({
            status: "Success",
            payload: products.docs,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage ? `/api/products?page=${products.prevPage}&limit=${limit}&sort=${sort}` : null,
            nextLink: products.hasNextPage ? `/api/products?page=${products.nextPage}&limit=${limit}&sort=${sort}` : null,
        })
      } catch(e){
        return res.status(500).json({
            mensaje: "Error cargando productos",
            error: e
        })
    }
})
router.get("/search/:category", async (req, res) => {
    const category = req.params.category;
    let products = await productManagerDB.getProductsByQueryCategory(
      category.toLowerCase()
    );
    res.status(200).json(products);
});

router.get("/price", async (req, res) => {
  let products = await productManagerDB.ordenPrice(1);
  res.status(200).json(products);
});

router.post("/", async (req, res) => {
    const product = req.body
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