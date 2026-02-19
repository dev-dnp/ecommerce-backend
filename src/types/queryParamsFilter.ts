import { z } from "zod";

export const ZParamsQueryPaginationAndSearch = z.object({
    page_size: z.number().default(10),
    page: z.number().default(1),
    search_query: z.string().default("").optional()
});


export const ZMetadataPaginationOptionsResponse = z.object({
    limit: z.number(),
    page: z.number(),
    totalItems: z.number()
});

export type TParamsQueryPaginationAndSearch = z.infer<typeof ZParamsQueryPaginationAndSearch>;
export type TMetadataPaginationOptionsResponse = z.infer<typeof ZMetadataPaginationOptionsResponse>;