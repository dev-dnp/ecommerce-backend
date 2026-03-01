import { FastifyRequest, FastifyReply } from "fastify";
import z from "zod";
import { AppError } from "../errors/AppError";
import { OrderService } from "../services/order.service";

export class OrderController {

    async registerOrder(request: FastifyRequest, reply: FastifyReply) {

        const paramsResult = z.object({
            cart_id: z.uuid()
        }).safeParse(request.params);

        if (!paramsResult.success) throw new AppError("Nenhum parâmetro recebido!");

        const { cart_id } = paramsResult.data;

        await new OrderService().registerOrder(cart_id);

        return reply.status(201).send({
            msg: "Pedido efetuado com sucesso",
            status_code: reply.statusCode
        });

    }

}