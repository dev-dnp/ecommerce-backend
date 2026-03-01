import { prisma } from "../../lib/prisma";
import { v4 as uuidv4 } from 'uuid';
import { AppError } from "../errors/AppError";
import { TConnectCategoryToProductSchemaDTO, TCreateProductSchemaDTO, TUpdateProductSchemaDTO } from "../dtos/product.dto";
import { TParamsQueryPaginationAndSearch } from "../types/queryParamsFilter";
import { TAddItemsInCart } from "../dtos/cart.dto";
import { calcTotalPay } from "../utils/calcTotalPay";


export class OrderService {

    async registerOrder(cart_id: string) {

        try {
            await prisma.$transaction(
                async tx => {

                    const cartInfo = await tx.carts.findUnique({
                        where: { id: cart_id },
                        include: {
                            cart_items: {
                                include: {
                                    products: true
                                }
                            }
                        }
                    });

                    const products = cartInfo?.cart_items.map(x => {
                        return {
                            id: uuidv4(),
                            price: Number(x.products?.price),
                            product_id: x.product_id,
                            quantity: x.quantity
                        }
                    })

                    if (!products) return;

                    const totalPay = calcTotalPay(products);
                    const user_id = cartInfo?.user_id;

                    await tx.orders.create({
                        data: {
                            id: uuidv4(),
                            user_id,
                            total: totalPay,
                            order_items: {
                                createMany: {
                                    data: products
                                }
                            }
                        }
                    });

                    await tx.carts.delete({ where: { id: cart_id } });

                },

                {
                    maxWait: 10000, // tempo pra conseguir conexão
                    timeout: 20000, // tempo total da transação
                }

            );
        }
        catch (error) {
            console.log(error);
            throw new AppError("Ocorreu um erro desconhecido! Por favor, tente novamente ou contacte o programador")
        }

    }


}