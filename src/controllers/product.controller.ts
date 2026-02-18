import { FastifyRequest, FastifyReply } from "fastify";
import { ProductService } from "../services/product.service";
import z from "zod";
import { ZConnectCategoryToProductSchemaDTO, ZCreateProductSchemaDTO, ZUpdateProductSchemaDTO } from "../dtos/product.dto";
import { AppError } from "../errors/AppError";

export class ProductController {
    async createProduct(request: FastifyRequest, reply: FastifyReply) {

        const bodyResult = z.object({
            product: ZCreateProductSchemaDTO,
            categories: z.array(ZConnectCategoryToProductSchemaDTO).optional(),
        }).safeParse(request.body);

        if (!bodyResult.success) throw new AppError("Dados inválidos! Envie corretamente os dados de criação de um produto.");

        await new ProductService().registerProduct(bodyResult.data.product, bodyResult.data.categories);

        return reply.status(201).send({
            ok: true,
            details: {
                title: "Sucesso",
                msg: "Produto adicionado com sucesso!"
            },
            status_code: reply.statusCode
        });
    }

    async updateProduct(request: FastifyRequest, reply: FastifyReply) {

        const bodyResult = z.object({
            product: ZUpdateProductSchemaDTO,
            categories: z.array(ZConnectCategoryToProductSchemaDTO).optional(),
        }).safeParse(request.body);

        const paramsResult = z.object({
            product_id: z.uuid()
        }).safeParse(request.params);

        if (!bodyResult.success) throw new AppError("Dados inválidos! Envie corretamente os dados de criação de um produto.");
        if (!paramsResult.success) throw new AppError("Paramêtro inválido! Envie corretamente o ID do produto.");

        await new ProductService().updateProduct(paramsResult.data.product_id, bodyResult.data.product, bodyResult.data.categories);

        return reply.status(201).send({
            ok: true,
            details: {
                title: "Sucesso",
                msg: "Produto adicionado com sucesso!"
            },
            status_code: reply.statusCode
        });
    }
}