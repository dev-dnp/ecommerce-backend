import { FastifyInstance } from "fastify";
import { ProductController } from "../controllers/product.controller";



export async function uploadRoutes(app: FastifyInstance) {

    app.post("/upload", new ProductController().uploadPhotoProduct);

}