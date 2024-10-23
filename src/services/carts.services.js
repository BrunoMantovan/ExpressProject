import { CartRepository } from "../repositories/cart.repository.js";

export class CartsService {
    constructor() {
        this.repository = new CartRepository();
    }

    async getCarts() {
        return this.repository.getAll();
    }

    async getCartById(id) {
        return this.repository.getCartById(id);
    }

    async createCart() {
        return this.repository.create({ products: [] });
    }

    async getCartByUser(userId) {
        if (!userId) {
            throw new Error("UserId no proporcionado");
        }
        return await this.repository.createOrGetCart(userId);
    }

    async addProductToCart(cartId, productId) {
        return this.repository.addProductToCart(cartId, productId);
    }

    async deleteProductFromCart(cartId, productId) {
        return this.repository.deleteProductFromCart(cartId, productId);
    }

    async deleteAllProductsFromCart(cartId) {
        return this.repository.deleteAllProductsFromCart(cartId);
    }

    async updateProductQuantity(cartId, productId, quantity) {
        return this.repository.updateProductQuantity(cartId, productId, quantity);
    }

    async updateProductsArray(cartId, products) {
        return this.repository.updateProductsArray(cartId, products);
    }
}