import { z } from "zod";

export const ZCreateProductSchemaDTO = z.object({
    name: z.string(),
    description: z.string().optional(),
    price: z.number(),
    stock: z.number().optional(),
    photo: z.string().optional(),
});

export const ZUpdateProductSchemaDTO = z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    price: z.number().optional(),
    stock: z.number().optional(),
    photo: z.string().optional()
});

export const ZAddProductInStockSchemaDTO = z.object({
    stock: z.number()
});

export const ZCreateCategoriesProductsSchemaDTO = z.object({
    name: z.string()
});

export const ZUpdateCategoriesProductsSchemaDTO = z.object({
    name: z.string()
});

export const ZRemoveCategoriesProductsSchemaDTO = z.object({
    id: z.uuid()
});

export const ZConnectCategoryToProductSchemaDTO = z.object({
    product_id: z.uuid().optional(),
    category_id: z.uuid()
});

export const ZRemoveCategoryToProductSchemaDTO = z.object({
    product_id: z.uuid(),
    category_id: z.uuid()
});


export type TCreateProductSchemaDTO = z.infer<typeof ZCreateProductSchemaDTO>;
export type TUpdateProductSchemaDTO = z.infer<typeof ZUpdateProductSchemaDTO>;
export type TAddProductInStockSchemaDTO = z.infer<typeof ZAddProductInStockSchemaDTO>;
export type TCreateCategoriesProductsSchemaDTO = z.infer<typeof ZCreateCategoriesProductsSchemaDTO>;
export type TUpdateCategoriesProductsSchemaDTO = z.infer<typeof ZUpdateCategoriesProductsSchemaDTO>;
export type TRemoveCategoriesProductsSchemaDTO = z.infer<typeof ZRemoveCategoriesProductsSchemaDTO>;
export type TConnectCategoryToProductSchemaDTO = z.infer<typeof ZConnectCategoryToProductSchemaDTO>;
export type TRemoveCategoryToProductSchemaDTO = z.infer<typeof ZRemoveCategoryToProductSchemaDTO>;