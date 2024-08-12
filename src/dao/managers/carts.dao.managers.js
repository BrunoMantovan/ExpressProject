import mongoose from "mongoose";
import { cartsModel } from "../model/carts.model.js";
import { ProductModel } from "../model/products.model.js";


class CartManagerDB {
  constructor() {}

  getCart = async () => {
    try {
      let carts = await cartsModel.find();
      let carritos = carts
      return carritos;
    } catch (e) {
      console.log("Error al tratar de obtener los carritos", e);
    }
  };

  async addCart() {
    try {
      const result = await cartsModel.create({});
      return result;
    } catch (e) {
      console.log("Error al crear el carrito.", e);
    }
  }
  async getCartById(id) {
    try {
      const cart = await cartsModel.findById(id).populate('products.product');
      if (cart) {
        return cart;
      } else {
        return console.log("No existe el carrito");
      }
    } catch (e) {
      console.log("Falló", e);
    }
  }

  async addProductToCart(cid, pid) {
    try {
      const cart = await cartsModel.findById({ _id: cid });
      const productDB = await ProductModel.findById(pid);
      if(!productDB){
        return false
      }
      const index = cart.products.findIndex( e => e.product == pid);
      if (index !== -1) {
        cart.products[index].quantity++;
        cart.save();
        return cart;
      } else {
        cart.products.push({ product: pid });
        cart.save();
        return cart;
      }
    } catch (e) {
      console.error("No se pudo agregar producto al carrito", e);
    }
  }

  async updateProductsArray(cid, products) {
    try{
      const updatedProducts = products.map(item => ({
        product: new mongoose.Types.ObjectId(item.product),
        quantity: item.quantity
      }));
      const cart = await cartsModel.findByIdAndUpdate(
        cid,
        { $set: { products: updatedProducts } },
        { new: true }
      );
      return cart;
    }catch(e){
      console.log("Error al actualizar el carrito", e);
    }
  }

  async deleteProduct(cid, pid) {
    try {
      const carritoActualizado = await cartsModel.findOneAndUpdate(
        { _id: cid },
        { $pull: { products: { product: pid } } },
        { new: true }
      );

      if (!carritoActualizado) {
        console.log("No se encontró el carrito");
        return false
      }

      return carritoActualizado;
    } catch (e) {
      console.log("Error al eliminar producto del carrito:", e);
    }
  }

  async deleteAllProducts(cid) {
    try {
      const updatedCart = await cartsModel.findOneAndUpdate(
          { _id: cid },
          { $set: { products: [] } },
          { new: true }
      );

      if (!updatedCart) {
        console.log("Cart not found");
        return false;
      }

      return updatedCart;
  } catch (e) {
      console.error("Error removing all products from cart:", e);
      throw new Error("Failed to remove all products from the cart");
  }    
  }

  async updateQuantity(cid, pid, quantity) {
    try {
      const updatedCart = await cartsModel.findOneAndUpdate(
        { _id: cid, "products.product": pid },
        { $set: { "products.$.quantity": quantity } },
        { new: true }
      );
      if (!updatedCart) {
        console.log("Carrito o producto no encontrado");
        return false
      }
      return updatedCart;
    } catch (e) {
      console.log("Error al actualizar la cantidad del producto:", e);
    }
  }
}

export default CartManagerDB;
