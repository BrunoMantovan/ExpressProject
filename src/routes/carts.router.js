import CustomRouter from "./customRouter.js";
import { CartsController } from "../controllers/carts.controller.js";

const cartsController = new CartsController();

export default class CartsRouterCustom extends CustomRouter {
    init() {
        this.get("/", ["PUBLIC"], cartsController.getCarts);
        this.get("/user", ["PUBLIC"], cartsController.getCartByUser);
        this.get("/:id", ["PUBLIC"], cartsController.getCartById);
        this.post("/", ["PUBLIC"], cartsController.createCart);
        this.post("/:cid/products/:pid", ["PUBLIC"], cartsController.addProductToCart);
        this.delete("/:cid/products/:pid", ["PUBLIC"], cartsController.deleteProductFromCart);
        this.delete("/:cid", ["PUBLIC"], cartsController.deleteAllProductsFromCart);
        this.put("/:cid/products/:pid", ["PUBLIC"], cartsController.updateProductQuantity);
        this.put("/:cid", ["PUBLIC"], cartsController.updateProductsArray);
    }
}