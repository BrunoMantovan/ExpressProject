import { ProductModel } from '../model/products.model.js';

class ProductManagerDB {
  constructor() {}

  async getProducts(page, limit, sort) {
    
    const options = {
      page: page , 
      limit: limit ,
      sort: sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : {},
    };
    
    try {
      let products = await ProductModel.paginate({}, options)
      console.log('products:', products)
      
      return products
    } catch (error) {
      console.log('Error fetching products:', error)
      return []
    }
  }
}
export default ProductManagerDB;
