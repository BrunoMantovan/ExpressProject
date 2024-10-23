import MongoDao from "./dao.js";
import { cartsModel } from "./carts.model.js";
import { TicketModel } from "./ticket.model.js"
import { generateUniqueCode } from '../../utils.js';
export default class CartAccessMongo extends MongoDao {
    constructor() {
        super(cartsModel);
    }

    async getCartById(id) {
        try {
            return await this.model.findById(id).populate('products.product').populate('user'); 
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

    async purchaseProductsInCart(cid) {
        try {
            const cart = await this.getCartById(cid)
            if (!cart) {
                throw new Error("Carrito no encontrado");
            }
    
            const productsNotPurchased = [];
            const productsPurchased = [];
    
            for (const item of cart.products) {
                const product = item.product;
                if (product.stock >= item.quantity) {
                    product.stock -= item.quantity;
                    await product.save();
                    productsPurchased.push({
                        product: product._id,
                        quantity: item.quantity,
                        price: product.price
                    });
                } else {
                    productsNotPurchased.push(product._id);
                }
            }
            const amount = productsPurchased.reduce((total, item) => total + item.price * item.quantity, 0)
            console.log(amount);
            
            if(amount <= 0) return {mensaje: "No se pudo procesar la compra", ticket: null, productsNotPurchased: null}

            const ticket = await TicketModel.create({
                code: generateUniqueCode(),
                amount: amount,
                purchaser: cart.user.email
            });
            cart.products = cart.products.filter(item => productsNotPurchased.includes(item.product._id));
            await cart.save();
    
            return {
                ticket,
                productsNotPurchased
            };
        } catch (error) {
            console.error("Error en purchaseProductsInCart:", error)
            throw new Error(error);
        }
    }
}
