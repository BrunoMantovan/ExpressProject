import { ProductRepository } from "../repositories/product.repository.js";

export default class ProductService {
    constructor() {
        this.repository = new ProductRepository();
    }

    async getAll() {
        return this.repository.getAll();
    }

    async getById(id) {
        return this.repository.getById(id);
    }

    async create(productData) {
        return this.repository.create(productData);
    }

    async update(id, productData) {
        return this.repository.update(id, productData);
    }

    async delete(id) {
        return this.repository.delete(id);
    }

    async getProducts(page, limit, sort) {
        return this.repository.getProducts(page, limit, sort);
    }

    async getProductsByCategory(category) {
        return this.repository.getProductsByCategory(category);
    }

    async getProductsByPrice(order) {
        return this.repository.getProductsByPrice(order);
    }
}