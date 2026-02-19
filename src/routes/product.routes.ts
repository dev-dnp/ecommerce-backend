import { FastifyInstance } from "fastify";
import { ProductController } from "../controllers/product.controller";

export async function productRoutes(app: FastifyInstance) {

    app.get("/products", new ProductController().getAllProducts);

    app.post("/products", new ProductController().createProduct);

    app.put("/products/:product_id", new ProductController().updateProduct);

}