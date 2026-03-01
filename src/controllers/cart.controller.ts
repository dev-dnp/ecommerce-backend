import { FastifyRequest, FastifyReply } from "fastify";
import { ProductService } from "../services/product.service";
import z, { uuid } from "zod";
import { ZConnectCategoryToProductSchemaDTO, ZCreateProductSchemaDTO, ZUpdateProductSchemaDTO } from "../dtos/product.dto";
import { AppError } from "../errors/AppError";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto"
import { CartService } from "../services/cart.service";

export class CartController {

    async registerInCart(request: FastifyRequest, reply: FastifyReply) {

        const bodyResult = z.object({
            user_id: z.string(),
            cart_items: z.array(z.object({
                product_id: z.uuid(),
                quantity: z.number()
            }))
        }).safeParse(request.body);

        if (!bodyResult.success) throw new AppError("Informe o ID do usuário!");

        const { user_id, cart_items } = bodyResult.data;

        await new CartService().registerItemsInCart(user_id, cart_items);

        return "Registado com sucesso!";

    }

    async getAllCart(request: FastifyRequest, reply: FastifyReply) {

        const bodyResult = z.object({
            user_id: z.uuid()
        }).safeParse(request.params);

        if (!bodyResult.success) throw new AppError("Informe o ID do usuário!");

        const { user_id } = bodyResult.data;


        const allCarts = await new CartService().getAllCartByUser(user_id);

        return allCarts;

    }

    async updateItemsInCart(request: FastifyRequest, reply: FastifyReply) {

        const paramsResult = z.object({
            cart_id: z.string()
        }).safeParse(request.params);

        const bodyResult = z.array(z.object({
            product_id: z.uuid(),
            quantity: z.coerce.number()
        })).safeParse(request.body);



        if (!paramsResult.success) throw new AppError("Informe o ID do carrinho!");
        if (!bodyResult.success) throw new AppError("Informe os items do carrinho a ser atualizados!");

        const { cart_id } = paramsResult.data;
        const itemsCart = bodyResult.data;

        await new CartService().updateItemInCart(cart_id, itemsCart);

        return "Atualizado!";

    }

    async removeItemsInCart(request: FastifyRequest, reply: FastifyReply) {

        const bodyResult = z.object({
            product_ids: z.array(z.string())
        }).safeParse(request.body);

        const paramsResult = z.object({
            cart_id: z.uuid(),
        }).safeParse(request.params);

        if (!bodyResult.success) throw new AppError("Envie a lista de ID dos produtos");
        if (!paramsResult.success) throw new AppError("Envie o ID do carrinho como parâmetro");

        const { product_ids } = bodyResult.data;
        const { cart_id } = paramsResult.data;

        await new CartService().removeItemsInCart(cart_id, product_ids);

        return "Removido com sucesso!";
    }

    async removeCart(request: FastifyRequest, reply: FastifyReply) {
        const paramsResult = z.object({
            cart_id: z.uuid()
        }).safeParse(request.params);

        if (!paramsResult.success) throw new AppError("Envie o ID do carrinho como paramêtro");

        const { cart_id } = paramsResult.data;

        await new CartService().removeCart(cart_id);

        return "Carrinho eliminado com sucesso!";

    }

}