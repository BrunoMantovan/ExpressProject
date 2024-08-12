import { ProductModel } from '../model/products.model.js';

class ProductManagerDB {
  constructor() {}

  async getProducts(page = 1, limit = 10) {
    const options = {
      page: page, 
      limit: limit, 
    };

    try {
      let products = await ProductModel.paginate({}, options)
      console.log('Fetched products:', products.docs)
      return products.docs
    } catch (error) {
      console.error('Error fetching products:', error)
      return []
    }
  }

  async addProducts(title, description, price, thumbnail, code, stock, category, status) {
    try {
      let newProduct = await ProductModel.create({
        title, 
        description, 
        price, 
        thumbnail, 
        code, 
        stock,
        category,
        status, 
      });
      console.log('newProduct:', newProduct);
      return newProduct;
  } catch (error) {
      console.error('Error adding product:', error);
      throw error;
  }
  }

  async getProductById(id) {
    const product = await ProductModel.find({ _id: id });
    if (product.length==0){
      return console.log('No existe ese producto')
    }else{
 
    return product;
  }}
  async updateProduct(id, updatedFields) {
    const ID = { _id: id };
    const updatedProduct = await ProductModel.findOneAndUpdate(
      ID,
      { $set: updatedFields },
      { new: true }
  );
    return updatedProduct;
  }

  async deleteProduct(id) {
    const productDelete = await ProductModel.deleteOne({ _id: id });
    return productDelete;
  
  }

  async ordenPrice(num) {
    const products = await ProductModel.aggregate([{ $sort: { price: num } }]);
    return products;
  }

  async getProductsByQueryTitle(dato) {
    const products = await ProductModel.aggregate([
      { $match: { title: dato } },
    ]);
    return products;
  }
  
  async getProductsByQueryCategory(dato) {
    const products = await ProductModel.aggregate([
      { $match: { category: dato } }, { $sort: { price: 1 } }
    ]);
    return products;
  }
  
  async getProductsByQueryStock(dato) {
    const products = await ProductModel.aggregate([
      { $match: { stock: dato } },
    ]);

    return products;
  }
 
  }
export default ProductManagerDB;
