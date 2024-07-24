import { log } from "node:console";
import fs from "node:fs";
import {v4} from "uuid";

const types = {
    title: 'string',
    description: 'string',
    code: 'string',
    price: 'number',
    status: 'boolean',
    category: 'string',
    stock: 'number',
    thumbnails: 'object'
};
class ProductManager {
    constructor(path) {
        this.path = path;
        this.productList = []
    }
    
    async getProductList() {
        try {
            await fs.promises.access(this.path)
        } catch (error) {
            await fs.promises.writeFile(this.path, JSON.stringify({ data: [] }), 'utf-8')
            return
        }
        const list = await fs.promises.readFile(this.path, "utf-8")
        if(list === ""){ return }
        this.productList = [...JSON.parse(list).data]
        
        return [... this.productList]
    }

    async addProduct(product) {
        const requiredFields = ['title', 'description', 'code', 'price', 'status', 'category', 'stock'];

        for (let field of requiredFields) {
            if (!(field in product)) {
                return false;
            }
        }
        for (let field in product) {
            if (!(field in types)) {
                return false;
            }
            if (typeof product[field] !== types[field]) {
                return false;
            }
        }
        const result = await this.getProductList()
        const index = result.findIndex(e => product.code == e.code)
        if(index !== -1){ return }
        const newProduct = {id: v4(), ...product}

        this.productList.push(newProduct)
        await fs.promises.writeFile(this.path, JSON.stringify({ data: this.productList }));
        return true
    }

    async getProductById(id){
        await this.getProductList()
        return this.productList.find(product => product.id == id)
    }

    async updateProduct(id, update){
        for (let field in update) {
            if (!(field in types)) {
                return false;
            }
            if (typeof update[field] !== types[field]) {
                return false;
            }
        }
        await this.getProductList()
        const index = this.productList.findIndex(product => product.id == id)
        if (index == -1) {return index;}
        this.productList[index] = {...this.productList[index], ...update}
        await fs.promises.writeFile(this.path, JSON.stringify({ data: this.productList }));
        return true
    }

    async deleteProduct(id){
        await this.getProductList()
        const index = this.productList.findIndex(product => product.id == id)
        if (index == -1) {return false;}
        this.productList.splice(index, 1)
        await fs.promises.writeFile(this.path, JSON.stringify({ data: this.productList }));
    }
}

export default ProductManager;