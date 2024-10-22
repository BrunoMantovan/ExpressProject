import ProductAccessMongo from "../dao/model/product.dao.js";
import Services from "./services.js";

const productDAO = new ProductAccessMongo();

export default class ProductService extends Services {
    constructor() {
        super(productDAO);
    }

    async getProducts(page, limit, sort) {
        return await this.dao.getProducts(page, limit, sort);
    }

    async getProductsByCategory(category) {
        return await this.dao.getProductsByQueryCategory(category);
    }

    async getProductsByPrice(order) {
        return await this.dao.ordenPrice(order === 'asc' ? 1 : -1);
    }
}