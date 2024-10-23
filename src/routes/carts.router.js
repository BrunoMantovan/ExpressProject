import CustomRouter from "./customRouter.js";
import { CartsController } from "../controllers/carts.controller.js";

const cartsController = new CartsController();

export default class CartsRouterCustom extends CustomRouter {
    init() {
        this.get("/", ["USER", "ADMIN"], cartsController.getCarts);
        this.get("/user", ["USER", "ADMIN"], cartsController.getCartByUser);
        this.get("/:id", ["USER", "ADMIN"], cartsController.getCartById);
        this.post("/", ["USER"], cartsController.createCart);
        this.post("/:cid/products/:pid", ["USER"], cartsController.addProductToCart);
        this.delete("/:cid/products/:pid", ["USER","ADMIN"], cartsController.deleteProductFromCart);
        this.delete("/:cid", ["USER", "ADMIN"], cartsController.deleteAllProductsFromCart);
        this.put("/:cid/products/:pid", ["USER"], cartsController.updateProductQuantity);
        this.put("/:cid", ["USER", "ADMIN"], cartsController.updateProductsArray);
    }
}