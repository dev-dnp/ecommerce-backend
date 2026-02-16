import { FastifyRequest, FastifyReply } from "fastify";
import { ZCreateProfileSchemaDTO, ZCreateUserSchemaDTO, ZUpdateEmailUserSchemaDTO, ZUpdatePasswordUserSchemaDTO, ZUpdateProfileSchemaDTO } from "../dtos/user.dto";
import { UserService } from "../services/user.service";
import { AppError } from "../errors/AppError";
import z from "zod";

export class UserController 
{
    async CreateUser(request: FastifyRequest, reply: FastifyReply)
    {
        const result = ZCreateUserSchemaDTO.safeParse(request.body);

        if(!result.success) throw new AppError("Dados inválidos! Envie corretamente o email/password");

        await new UserService().CreateUser(result.data);

        return reply.status(201).send({
            ok: true,
            details: {
                title: "Sucesso",
                msg: "Usuário criado com sucesso!"
            },
            status_code: reply.statusCode
        });
    }

    async UpdateEmailUser(request: FastifyRequest, reply: FastifyReply)
    {
        const result = ZUpdateEmailUserSchemaDTO.safeParse(request.body);
        const { user_id } = request.params as {user_id: string}

        if(!result.success) throw new AppError("Dados inválidos! Envie corretamente o email");

        await new UserService().UpdateEmailUser(user_id, result.data.email);

        return reply.status(200).send({
            ok: true,
            details: {
                title: "Sucesso",
                msg: "Email atualizado com sucesso!"
            },
            status_code: reply.statusCode
        });
    }

    async UpdatePasswordUser(request: FastifyRequest, reply: FastifyReply)
    {
        const result = ZUpdatePasswordUserSchemaDTO.safeParse(request.body);
        const { user_id } = request.params as {user_id: string}

        if(!result.success) throw new AppError("Dados inválidos! Envie corretamente a password");

        await new UserService().UpdatePasswordUser(user_id, result.data);

        return reply.status(200).send({
            ok: true,
            details: {
                title: "Sucesso",
                msg: "Senha atualizada com sucesso!"
            },
            status_code: reply.statusCode
        });
    }

    async CreateProfile(request: FastifyRequest, reply: FastifyReply)
    {
        const bodyResult = ZCreateProfileSchemaDTO.safeParse(request.body);
        const  paramsResult = z.object({user_id: z.uuid()}).safeParse(request.params);

        if(!bodyResult.success) throw new AppError("Dados enviados no corpo da requisição estão inválidos. Tente novamente!", undefined, "Erro de validação");
        if(!paramsResult.success) throw new AppError("O tipo de ID enviado é inválido!", undefined, "Erro de validação");

        await new UserService().CreateProfile(paramsResult.data.user_id, bodyResult.data);

        return reply.status(200).send({
            ok: true,
            details: {
                title: "Sucesso",
                msg: "Perfil criado com sucesso!"
            },
            status_code: reply.statusCode
        });
    }

    async UpdateProfile(request: FastifyRequest, reply: FastifyReply)
    {
        const bodyResult = ZUpdateProfileSchemaDTO.safeParse(request.body);
        const  paramsResult = z.object({user_id: z.uuid()}).safeParse(request.params);

        if(!bodyResult.success) throw new AppError("Dados enviados no corpo da requisição estão inválidos. Tente novamente!", undefined, "Erro de validação");
        if(!paramsResult.success) throw new AppError("O tipo de ID enviado é inválido!", undefined, "Erro de validação");

        await new UserService().UpdateProfile(paramsResult.data.user_id, bodyResult.data);

        return reply.status(200).send({
            ok: true,
            details: {
                title: "Sucesso",
                msg: "Perfil atualizado com sucesso!"
            },
            status_code: reply.statusCode
        });
    }
}