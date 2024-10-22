import CustomRouter from "./customRouter.js";
import ProductController from "../controllers/product.controller.js";

const productController = new ProductController();
export default class ProductsRouterCustom extends CustomRouter {
    init() {
        this.get("/", ["PUBLIC"], productController.getProducts);
        this.get("/search/:category", ["PUBLIC"], productController.getProductsByCategory);
        this.get("/price", ["PUBLIC"], productController.getProductsByPrice);
        this.post("/", ["ADMIN"], productController.create);
        this.get("/:id", ["PUBLIC"], productController.getById);
        this.put("/:id", ["ADMIN"], productController.update);
        this.delete("/:id", ["ADMIN"], productController.delete);
    }
}