import { z } from "zod";

export const ZCreateUserSchemaDTO = z.object({
    email: z.email(),
    password: z.string(),
});

export const ZUpdateEmailUserSchemaDTO = z.object({
    email: z.email()
});

export const ZUpdatePasswordUserSchemaDTO = z.object({
    current_password: z.string(),
    new_password: z.string()
});

export const ZCreateProfileSchemaDTO = z.object({
    name: z.string(),
    identity_code: z.string(),
    birthdate: z.coerce.date().optional(),
    gender: z.union([z.literal('0'), z.literal('1')]),
    phone1: z.string(),
    phone2: z.string().optional(),
    photo: z.string().optional(),
})

export const ZUpdateProfileSchemaDTO = z.object({
    name: z.string().optional(),
    identity_code: z.string().optional(),
    birthdate: z.coerce.date().optional(),
    gender: z.union([z.literal('0'), z.literal('1')]).optional(),
    phone1: z.string().optional(),
    phone2: z.string().optional(),
    photo: z.string().optional()
})

export const ZCreateAddressSchemaDTO = z.object({
    name: z.string(),
    identity_code: z.string(),
    birthdate: z.coerce.date(),
    gender: z.union([z.literal('0'), z.literal('1')]),
    phone1: z.string(),
    phone2: z.string().optional(),
    photo: z.string().optional(),
    user_id: z.uuid()
})

export const ZUpdateAddressSchemaDTO = z.object({
    name: z.string().optional(),
    identity_code: z.string().optional(),
    birthdate: z.coerce.date().optional(),
    gender: z.union([z.literal('0'), z.literal('1')]).optional(),
    phone1: z.string().optional(),
    phone2: z.string().optional(),
    photo: z.string().optional(),
})


export type TCreateUserRequestDTO = z.infer<typeof ZCreateUserSchemaDTO>; 
export type TUpdateEmailUserRequestDTO = z.infer<typeof ZUpdateEmailUserSchemaDTO>; 
export type TUpdatePasswordUserRequestDTO = z.infer<typeof ZUpdatePasswordUserSchemaDTO>; 
export type TCreateProfileRequestDTO = z.infer<typeof ZCreateProfileSchemaDTO>; 
export type TUpdateProfileRequestDTO = z.infer<typeof ZUpdateProfileSchemaDTO>; 
export type TCreateAddressRequestDTO = z.infer<typeof ZCreateAddressSchemaDTO>; 
export type TUpdateAddressRequestDTO = z.infer<typeof ZUpdateAddressSchemaDTO>; 
