import { prisma } from "../../lib/prisma";
import { v4 as uuidv4 } from 'uuid';
import { AppError } from "../errors/AppError";
import { TConnectCategoryToProductSchemaDTO, TCreateProductSchemaDTO, TUpdateProductSchemaDTO } from "../dtos/product.dto";


export class ProductService {
    async registerProduct(product: TCreateProductSchemaDTO, categories?: TConnectCategoryToProductSchemaDTO[]) {

        try {
            await prisma.$transaction(
                async (tx) => {
                    const idProductCreated = await tx.products.create({
                        data: {
                            ...product,
                            id: uuidv4()
                        },
                        select: { id: true }
                    });

                    if (!categories) return;

                    const categoriesFilter = categories.map(c => {
                        return {
                            ...c,
                            product_id: idProductCreated.id
                        }
                    });

                    await tx.product_categories.createMany({
                        data: categoriesFilter
                    });
                }
            )
        }
        catch (error) {
            console.log(error);
            throw new AppError(`Ocorreu uma falha desconhecida ao criar o produto! Por favor, tente novamente ou contacte o programador.`);
        }

    }

    async updateProduct(product_id: string, product: TUpdateProductSchemaDTO, categories?: TConnectCategoryToProductSchemaDTO[]) {
        try {
            await prisma.$transaction(
                async (tx) => {
                    await tx.products.update({
                        data: {
                            ...product
                        },
                        where: {
                            id: product_id
                        }
                    });

                    if (!categories) return;

                    const categoriesFilter = categories.map(c => {
                        return {
                            ...c,
                            product_id
                        }
                    });

                    await tx.product_categories.deleteMany({
                        where: { product_id }
                    });

                    await tx.product_categories.createMany({
                        data: categoriesFilter
                    });
                },

                {
                    maxWait: 10000, // tempo pra conseguir conexão
                    timeout: 20000, // tempo total da transação
                }
            )
        }
        catch (error) {
            console.log(error);
            throw new AppError(`Ocorreu uma falha desconhecida ao atualizar o produto! Por favor, tente novamente ou contacte o programador.`);
        }
    }
}