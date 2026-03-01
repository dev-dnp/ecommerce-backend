import { prisma } from "../../lib/prisma";
import { v4 as uuidv4 } from 'uuid';
import { AppError } from "../errors/AppError";
import { TConnectCategoryToProductSchemaDTO, TCreateProductSchemaDTO, TUpdateProductSchemaDTO } from "../dtos/product.dto";
import { TParamsQueryPaginationAndSearch } from "../types/queryParamsFilter";
import { TAddItemsInCart } from "../dtos/cart.dto";


export class CartService {

    async registerItemsInCart(user_id: string, items: TAddItemsInCart[]) {

        const randomUUID = uuidv4();

        const dataItemsCart = items.map(i => ({
            id: uuidv4(),
            product_id: i.product_id,
            quantity: i.quantity,
        }));

        await prisma.carts.create({
            data: {
                id: randomUUID,
                user_id,
                cart_items: {
                    createMany: {
                        data: dataItemsCart
                    }
                }
            }
        });
    }

    async getAllCartByUser(user_id: string) {

        try {
            const allCartUser = await prisma.carts.findMany({
                where: {
                    user_id
                },
                include: {
                    cart_items: {
                        include: {
                            products: true
                        }
                    }
                }
            })

            return allCartUser;
        }
        catch (error) {
            console.log(error);
            throw new AppError("Ocorreu uma falha desconhecida! Por favor, tente novamente ou contate o programador!");
        }

    }

    async updateItemInCart(cart_id: string, items: TAddItemsInCart[]) {

        if (!cart_id) return;


        const filterItems = items.map(i => ({
            product_id: i.product_id,
            quantity: i.quantity
        }))

        try {
            await prisma.$transaction(async (tx) => {

                await Promise.all(filterItems.map(i => {

                    return tx.cart_items.updateMany({
                        data: {
                            product_id: i.product_id,
                            quantity: i.quantity
                        },
                        where: {
                            AND: [
                                { cart_id },
                                { product_id: i.product_id }
                            ]
                        }
                    });

                }));

            },
                {
                    maxWait: 10000, // tempo pra conseguir conexão
                    timeout: 20000, // tempo total da transação
                }
            )
        }
        catch (error) {
            console.log(error);
            throw new AppError("Ocorreu um erro desconhecido! Tente novamente ou contate o programador");
        }

    }

    async removeItemsInCart(cart_id: string, product_ids: string[]) {

        try {
            await Promise.all(
                product_ids.map(product_id => {
                    prisma.$transaction(
                        async (tx) => {
                            return tx.cart_items.deleteMany({
                                where: {
                                    AND: [
                                        { product_id },
                                        { cart_id }
                                    ]
                                }
                            })
                        },
                        {
                            maxWait: 10000, // tempo pra conseguir conexão
                            timeout: 20000, // tempo total da transação
                        }
                    )
                })
            )
        }
        catch (error) {
            console.log(error);
            throw new AppError("Houve um erro desconhecido! Tente novamente ou contacte o programador!");
        }
    }

    async removeCart(cart_id: string) {

        try {
            await prisma.carts.delete({
                where: {
                    id: cart_id
                }
            });
        }
        catch (error) {
            console.log(error);
            throw new AppError("Houve um erro desconhecido! Tente novamente ou contacte o programador!");
        }
    }

}