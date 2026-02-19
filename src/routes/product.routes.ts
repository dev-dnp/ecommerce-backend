import { FastifyInstance } from "fastify";
import { ProductController } from "../controllers/product.controller";

export async function productRoutes(app: FastifyInstance) {

    app.get("/products", new ProductController().getAllProducts);

    app.get("/products/filterByCategories", new ProductController().getAllProductsByCategories);

    app.post("/products", new ProductController().createProduct);

    app.post("/products/:product_id/upload-image", new ProductController().uploadPhotoProduct);

}