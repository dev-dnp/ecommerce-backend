import { z } from "zod";

const ZAddItemsInCart = z.object({
    cart_id: z.uuid().optional(),
    product_id: z.uuid(),
    quantity: z.number(),
});


export type TAddItemsInCart = z.infer<typeof ZAddItemsInCart>;

