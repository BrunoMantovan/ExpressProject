import ProductAccessMongo from "../dao/model/product.dao.js";
import { BaseRepository } from "./base.repository.js";

export class ProductRepository extends BaseRepository {
    constructor() {
        super(new ProductAccessMongo());
    }

    async getProducts(page, limit, sort) {
        return this.dao.getProducts(page, limit, sort);
    }

    async getProductsByCategory(category) {
        return this.dao.getProductsByQueryCategory(category);
    }

    async getProductsByPrice(order) {
        return this.dao.ordenPrice(order === 'asc' ? 1 : -1)
    }
}