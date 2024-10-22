import { CartsService } from "../services/carts.services.js";
export class CartsController {
  constructor() {
    this.cartsService = new CartsService();
  }

  getCarts = async (req, res) => {
    try {
      const carts = await this.cartsService.getCarts();
      res.status(200).json({
        mensaje: "Se encontraron los carritos",
        carritos: carts
      });
    } catch (error) {
      res.status(500).json({ mensaje: "Error al obtener los carritos" });
    }
  }

  getCartById = async (req, res) => {
    try {
        const { id } = req.params;
        const cart = await this.cartsService.getCartById(id);
        res.status(200).json({
            mensaje: "Se encontró el carrito",
            carrito: cart
        });
    } catch (error) {
        res.status(404).json({ mensaje: "Carrito no encontrado" });
    }
  }

  getCartByUser = async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(401).json({ mensaje: "Usuario no autenticado" });
        }
        const userId = req.session.user._id;
        
        const cart = await this.cartsService.getCartByUser(userId);
        if (cart) {
            res.status(200).json({
                mensaje: "Se encontró el carrito",
                carrito: cart
            });
        } else {
            res.status(404).json({ mensaje: "No se encontró un carrito, se creará uno nuevo" });
        }
    } catch (error) {
        console.error("Error en getCartByUser:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
  }

  createCart = async (req, res) => {
    try {
        console.log(req.user);
        
        await this.cartsService.createCart();
        res.status(201).json({
            mensaje: "Se creó el carrito"
        });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al crear el carrito" });
    }
  }

  addProductToCart = async (req, res) => {
    try {
      const { cid, pid } = req.params;
      await this.cartsService.addProductToCart(cid, pid);
      res.status(201).json({
        mensaje: "Producto agregado correctamente"
      });
    } catch (error) {
      res.status(400).json({ mensaje: "No se pudo agregar el producto" });
    }
  }

  deleteProductFromCart = async (req, res) => {
    try {
      const { cid, pid } = req.params;
      await this.cartsService.deleteProductFromCart(cid, pid);
      res.status(200).json({
        mensaje: "Se eliminó el producto del carrito"
      });
    } catch (error) {
      res.status(400).json({ mensaje: "No se pudo eliminar el producto" });
    }
  }

  deleteAllProductsFromCart = async (req, res) => {
    try {
      const { cid } = req.params;
      await this.cartsService.deleteAllProductsFromCart(cid);
      res.status(200).json({
        mensaje: "Se eliminaron todos los productos del carrito"
      });
    } catch (error) {
      res.status(400).json({ mensaje: "No se pudo vaciar el carrito" });
    }
  }

  updateProductQuantity = async (req, res) => {
    try {
      const { cid, pid } = req.params;
      const { quantity } = req.body;
      await this.cartsService.updateProductQuantity(cid, pid, quantity);
      res.status(200).json({
        mensaje: "Se actualizó la cantidad del producto"
      });
    } catch (error) {
      res.status(400).json({ mensaje: "No se pudo actualizar la cantidad" });
    }
  }

  updateProductsArray = async (req, res) => {
    try {
      const { cid } = req.params;
      const { products } = req.body;
      await this.cartsService.updateProductsArray(cid, products);
      res.status(200).json({
        mensaje: "Se actualizó el carrito"
      });
    } catch (error) {
      res.status(400).json({ mensaje: "No se pudo actualizar el carrito" });
    }
  }
}