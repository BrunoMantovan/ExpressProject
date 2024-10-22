import MongoDao from "./dao.js";
import { ProductModel } from "./products.model.js";

export default class ProductAccessMongo extends MongoDao {
    constructor(){
        super(ProductModel);
    }

    async getProducts(page, limit, sort) {
        const options = {
            page: page,
            limit: limit,
            sort: sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : {},
        };
        
        try {
            return await this.model.paginate({}, options);
        } catch (error) {
            console.log('Error fetching products:', error);
            return [];
        }
    }

    async getProductsByQueryCategory(category) {
        try {
            return await this.model.aggregate([
                { $match: { category: category.toLowerCase() } },
                { $sort: { price: 1 } }
            ]);
        } catch (error) {
            console.log('Error fetching products by category:', error);
            return [];
        }
    }

    async ordenPrice(num) {
        try {
            return await this.model.aggregate([{ $sort: { price: num } }]);
        } catch (error) {
            console.log('Error ordering products by price:', error);
            return [];
        }
    }
}