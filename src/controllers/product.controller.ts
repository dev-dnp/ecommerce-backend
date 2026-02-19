import { FastifyRequest, FastifyReply } from "fastify";
import { ProductService } from "../services/product.service";
import z, { uuid } from "zod";
import { ZConnectCategoryToProductSchemaDTO, ZCreateProductSchemaDTO, ZUpdateProductSchemaDTO } from "../dtos/product.dto";
import { AppError } from "../errors/AppError";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto"

export class ProductController {

    async getAllProducts(request: FastifyRequest, reply: FastifyReply) {

        const query = z.object({
            page: z.coerce.number().default(1),
            page_size: z.coerce.number().default(10),
            search_query: z.coerce.string().default("")
        }).safeParse(request.query);

        const queryDefault = {
            page: 0,
            page_size: 10,
            search_query: ""
        }

        const products = await new ProductService().gelAllProducts(query.data ?? queryDefault);

        return reply.status(200).send(products);
    }

    async getAllProductsByCategories(request: FastifyRequest, reply: FastifyReply) {

        const query = z.object({
            page: z.coerce.number().default(1),
            page_size: z.coerce.number().default(10),
            search_query: z.coerce.string().default("")
        }).safeParse(request.query);

        const categoriesResult = z.object({
            categories: z.union([z.array(z.coerce.string()).default([]), z.string().transform(s => [s])])
        }).safeParse(request.query);

        const queryDefault = {
            page: 0,
            page_size: 10,
            search_query: ""
        }

        console.log(categoriesResult.data?.categories)

        const products = await new ProductService().getAllProductsByCategories(query.data ?? queryDefault, categoriesResult.data?.categories || []);

        return reply.status(200).send(products);
    }

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

    async uploadPhotoProduct(request: FastifyRequest, reply: FastifyReply) {

        const queryResult = z.object({
            product_id: uuid()
        }).safeParse(request.query)

        if (!queryResult.success) throw new AppError("ID Produto não especificado!");

        const file = await request.file();

        if (!file) throw new AppError("Nenhum arquivo recebido para o upload!");

        const ext = path.extname(file.filename);

        const fileName = randomUUID() + ext;

        const uploadPath = path.join(process.cwd(), 'uploads', fileName);

        await new Promise((resolve, reject) => {
            const stream = fs.createWriteStream(uploadPath);
            file.file.pipe(stream);
            file.file.on("end", resolve);
            file.file.on("error", reject)
        });

        await new ProductService().updateProduct(queryResult.data.product_id, { photo: fileName });

        return reply.send({
            message: "Upload feito com sucesso",
            file: fileName
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