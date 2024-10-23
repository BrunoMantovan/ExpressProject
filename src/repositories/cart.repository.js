import CartAccessMongo from "../dao/model/carts.dao.js";
import { BaseRepository } from "./base.repository.js";

export class CartRepository extends BaseRepository {
    constructor() {
        super(new CartAccessMongo());
    }

    async getCartById(id) {
        return this.dao.getCartById(id);
    }

    async createOrGetCart(userId) {
        return this.dao.createOrGetCart(userId);
    }

    async addProductToCart(cid, pid) {
        return this.dao.addProductToCart(cid, pid);
    }

    async deleteProductFromCart(cid, pid) {
        return this.dao.deleteProductFromCart(cid, pid);
    }

    async deleteAllProductsFromCart(cid) {
        return this.dao.deleteAllProductsFromCart(cid);
    }

    async updateProductQuantity(cid, pid, quantity) {
        return this.dao.updateProductQuantity(cid, pid, quantity);
    }

    async updateProductsArray(cid, products) {
        return this.dao.updateProductsArray(cid, products);
    }

    async purchaseProductsInCart(cid) {
        return this.dao.purchaseProductsInCart(cid);
    }
}