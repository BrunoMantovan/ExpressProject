import CartAccessMongo from "../dao/model/carts.dao.js";
import Services from "./services.js";

export class CartsService extends Services {
    constructor() {
        super(new CartAccessMongo());
    }

    async getCarts() {
        return this.dao.getAll();
    }

    async getCartById(id) {
        return this.dao.getCartById(id);
    }

    async createCart() {
        return this.dao.create({ products: [] });
    }

    async getCartByUser(userId) {
        if (!userId) {
            throw new Error("UserId no proporcionado");
        }
        return await this.dao.createOrGetCart(userId);
    }

    async addProductToCart(cartId, productId) {
        return this.dao.addProductToCart(cartId, productId);
    }

    async deleteProductFromCart(cartId, productId) {
        return this.dao.deleteProductFromCart(cartId, productId);
    }

    async deleteAllProductsFromCart(cartId) {
        return this.dao.deleteAllProductsFromCart(cartId);
    }

    async updateProductQuantity(cartId, productId, quantity) {
        return this.dao.updateProductQuantity(cartId, productId, quantity);
    }

    async updateProductsArray(cartId, products) {
        return this.dao.updateProductsArray(cartId, products);
    }
}