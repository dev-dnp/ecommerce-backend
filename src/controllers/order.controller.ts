import { FastifyRequest, FastifyReply } from "fastify";
import { ProductService } from "../services/product.service";
import z, { uuid } from "zod";
import { ZConnectCategoryToProductSchemaDTO, ZCreateProductSchemaDTO, ZUpdateProductSchemaDTO } from "../dtos/product.dto";
import { AppError } from "../errors/AppError";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto"
import { CartService } from "../services/cart.service";
import { OrderService } from "../services/order.service";

export class OrderController {

    async registerOrder(request: FastifyRequest, reply: FastifyReply) {

        const paramsResult = z.object({
            cart_id: z.uuid()
        }).safeParse(request.params);

        if (!paramsResult.success) throw new AppError("Nenhum parâmetro recebido!");

        const { cart_id } = paramsResult.data;

        const x = await new OrderService().registerOrder(cart_id);

        return x;

    }

}