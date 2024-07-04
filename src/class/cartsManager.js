import fs from "node:fs";
import {v4} from "uuid";

class CartsManager{
    constructor(path){
        this.path = path;
        this.cartsList = []
    }

    async getCartsList() {
        try {
            await fs.promises.access(this.path)
        } catch (error) {
            await fs.promises.writeFile(this.path, JSON.stringify({ data: [] }), 'utf-8')
            return
        }
        const list = await fs.promises.readFile(this.path, "utf-8")
        if(list === ""){ return }
        this.cartsList = [...JSON.parse(list).data]
        
        return [... this.cartsList]
    }

    async addCart() {
        
        const newCart = {id: v4(), products:[]}
        await this.getCartsList()

        this.cartsList.push(newCart)
        await fs.promises.writeFile(this.path, JSON.stringify({ data: this.cartsList }));
        return true
    }

    async getCartById(id){
        await this.getCartsList()
        const result = this.cartsList.find(cart => cart.id == id)
        return result.products
    }

    async addProductToCart(cid, pid){
        await this.getCartsList()
        const updateCart = this.cartsList.map(cart => {
            if(cart.id !== cid){return cart}
            const index = cart.products.findIndex(e => e.id === pid)
            if(index === -1){
                cart.products.push({id: pid, quantity: 1})
                return cart
            }
            cart.products[index].quantity += 1
            return cart;
        })
        await fs.promises.writeFile(this.path, JSON.stringify({ data: [...updateCart] }));
    }
}

export default CartsManager