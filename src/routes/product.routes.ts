import { FastifyInstance } from "fastify";
import { ProductController } from "../controllers/product.controller";

export async function productRoutes(app: FastifyInstance) {

    app.post("/product", new ProductController().createProduct);

    app.put("/product/:product_id", new ProductController().updateProduct);

}