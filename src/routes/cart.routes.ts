import { FastifyInstance } from "fastify";
import { CartController } from "../controllers/cart.controller";


export async function cartRoutes(app: FastifyInstance) {

    app.post("/carts", new CartController().registerInCart);

    app.get("/carts/:user_id", new CartController().getAllCart);

    app.put("/carts/:cart_id", new CartController().updateItemsInCart);

    app.delete("/carts/:cart_id/items", new CartController().removeItemsInCart);

    app.delete("/carts/:cart_id", new CartController().removeCart);



}