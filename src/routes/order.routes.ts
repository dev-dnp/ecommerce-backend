import { FastifyInstance } from "fastify";
import { CartController } from "../controllers/cart.controller";
import { OrderController } from "../controllers/order.controller";


export async function orderRoutes(app: FastifyInstance) {

    app.post("/orders/:cart_id", new OrderController().registerOrder);



}