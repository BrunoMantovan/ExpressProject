import MongoDao from "./dao.js";
import { cartsModel } from "./carts.model.js";

export default class CartAccessMongo extends MongoDao {
    constructor() {
        super(cartsModel);
    }

    async getCartById(id) {
        try {
            return await this.model.findById(id).populate('products.product');
        } catch (error) {
            throw new Error(error);
        }
    }

    async createOrGetCart(userId) {
        try {
            let cart = await this.model.findOne({ user: userId });
            
            if (!cart) {
                cart = await this.model.create({ user: userId, products: [] });
            }
            return cart;
        } catch (error) {
            console.error("Error en createOrGetCart:", error);
            throw new Error(error);
        }
    }

    async addProductToCart(cid, pid) {
        try {
            const cart = await this.model.findById(cid);
            const index = cart.products.findIndex(e => e.product.toString() === pid);
            if (index !== -1) {
                cart.products[index].quantity++;
            } else {
                cart.products.push({ product: pid, quantity: 1 });
            }
            return await cart.save();
        } catch (error) {
            throw new Error(error);
        }
    }

    async updateProductsArray(cid, products) {
        try {
            return await this.model.findByIdAndUpdate(
                cid,
                { $set: { products: products } },
                { new: true }
            );
        } catch (error) {
            throw new Error(error);
        }
    }

    async deleteProductFromCart(cid, pid) {
        try {
            return await this.model.findByIdAndUpdate(
                cid,
                { $pull: { products: { product: pid } } },
                { new: true }
            );
        } catch (error) {
            throw new Error(error);
        }
    }

    async deleteAllProductsFromCart(cid) {
        try {
            return await this.model.findByIdAndUpdate(
                cid,
                { $set: { products: [] } },
                { new: true }
            );
        } catch (error) {
            throw new Error(error);
        }
    }

    async updateProductQuantity(cid, pid, quantity) {
        try {
            return await this.model.findOneAndUpdate(
                { _id: cid, "products.product": pid },
                { $set: { "products.$.quantity": quantity } },
                { new: true }
            );
        } catch (error) {
            throw new Error(error);
        }
    }
}