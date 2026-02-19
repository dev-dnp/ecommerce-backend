import { prisma } from "../../lib/prisma";
import { v4 as uuidv4 } from 'uuid';
import { AppError } from "../errors/AppError";
import { TConnectCategoryToProductSchemaDTO, TCreateProductSchemaDTO, TUpdateProductSchemaDTO } from "../dtos/product.dto";
import { TParamsQueryPaginationAndSearch } from "../types/queryParamsFilter";


export class ProductService {

    async gelAllProducts(query: TParamsQueryPaginationAndSearch) {

        const { page_size = 10, page = 1, search_query = "" } = query;

        const products = await prisma.products.findMany({
            include: {
                product_categories: {
                    select: {
                        category_id: true,
                        categories: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            },
            where: {
                OR: [
                    { name: { contains: search_query ?? "", mode: "insensitive" } }
                ]
            },
            orderBy: { created_at: "asc" },
            skip: (page - 1) * page_size,
            take: page_size

        });

        const allProducts = products.map(p => {
            return {
                id: p.id,
                name: p.name,
                description: p.description,
                price: p.price,
                stock: p.stock,
                photo: p.photo,
                created_at: p.created_at,
                categories:
                    p.product_categories.map(c => ({
                        category_id: c.category_id,
                        name: c.categories.name
                    }))
            }
        })

        const totalItems = await prisma.products.count();

        return {
            data: allProducts,
            metadata: {
                page,
                page_size,
                number_items: allProducts.length,
                total_items: totalItems,
                search_query
            }
        }
    }

    async getAllProductsByCategories(query: TParamsQueryPaginationAndSearch, categories: string[]) {

        const { page_size = 10, page = 1, search_query = "" } = query;

        const products = await prisma.products.findMany({
            include: {
                product_categories: {
                    select: {
                        category_id: true,
                        categories: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            },
            where: {

                AND: [
                    { name: { contains: search_query, mode: "insensitive" } },

                    {

                        product_categories: {
                            some: {
                                categories: {
                                    name: {
                                        in: categories
                                    }
                                }
                            }
                        }

                    }
                ]
            },
            orderBy: { created_at: "asc" },
            skip: (page - 1) * page_size,
            take: page_size

        });

        const allProducts = products.map(p => {
            return {
                id: p.id,
                name: p.name,
                description: p.description,
                price: p.price,
                stock: p.stock,
                photo: p.photo,
                created_at: p.created_at,
                categories:
                    p.product_categories.map(c => ({
                        category_id: c.category_id,
                        name: c.categories.name
                    }))
            }
        })

        const totalItems = await prisma.products.count();

        return {
            data: allProducts,
            metadata: {
                page,
                page_size,
                number_items: allProducts.length,
                total_items: totalItems,
                search_query
            }
        }
    }

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