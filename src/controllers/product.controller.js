import ProductService from "../services/product.services.js"
import { createResponse } from "../utils.js"
import Controllers from "./Controllers.js"

const productService = new ProductService();

export default class ProductController extends Controllers {
    constructor(){
        super(productService);
    }

    getProducts = async (req, res, next) => {
        try {
            const { page = 1, limit = 10, sort = '' } = req.query;
            const products = await this.service.getProducts(page, limit, sort);
            createResponse(res, 200, {
                status: "Success",
                payload: products.docs,
                totalPages: products.totalPages,
                prevPage: products.prevPage,
                nextPage: products.nextPage,
                page: products.page,
                hasPrevPage: products.hasPrevPage,
                hasNextPage: products.hasNextPage,
                prevLink: products.hasPrevPage ? `/api/products?page=${products.prevPage}&limit=${limit}&sort=${sort}` : null,
                nextLink: products.hasNextPage ? `/api/products?page=${products.nextPage}&limit=${limit}&sort=${sort}` : null,
            });
        } catch (e) {
            next(e);
        }
    }
    getProductsView = async (req, res, next) => {
        try {
            console.log("user", req.session.user);
            
            const { page = 1, limit = 10, sort = '' } = req.query;
            const products = await this.service.getProducts(page, limit, sort);
            res.render("home", { result: products.docs });
        } catch (e) {
            next(e);
        }
    }

    getProductsByCategory = async (req, res, next) => {
        try {
            const { category } = req.params;
            const products = await this.service.getProductsByCategory(category);
            createResponse(res, 200, products);
        } catch (e) {
            next(e);
        }
    }

    getProductsByPrice = async (req, res, next) => {
        try {
            const products = await this.service.getProductsByPrice('asc');
            createResponse(res, 200, products);
        } catch (e) {
            next(e);
        }
    }
}