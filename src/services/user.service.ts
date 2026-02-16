import { prisma } from "../../lib/prisma";
import { TCreateProfileRequestDTO, TCreateUserRequestDTO, TUpdateEmailUserRequestDTO, TUpdatePasswordUserRequestDTO, TUpdateProfileRequestDTO } from "../dtos/user.dto";
import { v4 as uuidv4 } from 'uuid';
import { AppError } from "../errors/AppError";
import bcrypt from "bcryptjs";


export class UserService 
{
    async CreateUser({email, password}: TCreateUserRequestDTO)
    {
        const userExists = await prisma.users.findUnique({
            where: {
                email
            }
        });

        if(userExists) 
            throw new AppError("Este usuário já existe!");

        try
        {
            const passwordHashed = await bcrypt.hash(password, 10);

            const userCreated = await prisma.users.create({
                data: {
                    id: uuidv4(),
                    email,
                    password: passwordHashed
                }
            });

            return userCreated;
        }
        catch (error)
        {
            console.log(error);
            throw new AppError("Ocorreu uma falha desconhecida ao registar o usuário! Por favor, contacte o programador.");
        }
    }

    async UpdateEmailUser(user_id: string, email: string)
    {

        const ifUserExists = await prisma.users.findUnique({
            where: {
                id: user_id
            }
        });

        if(!ifUserExists)
            throw new AppError("O ID de usuário não existe! Envie o ID correto.");

        const ifEmailExists = await prisma.users.findUnique({
            where: {
                email
            }
        });

        if(ifEmailExists)
            throw new AppError("Este email já existe! Tente outro.");

        try
        {
            await prisma.users.update({
                where: { id: user_id },
                data: {email}
            });
        }
        catch(error)
        {
            console.log(error);
            throw new AppError("Ocorreu uma falha desconhecida ao atualizar o email do usuário! Por favor, contacte o programador.");
        }

        
    }

    async UpdatePasswordUser(user_id: string, passwords: TUpdatePasswordUserRequestDTO)
    {
 
        const passwordHash = await prisma.users.findUnique({
            where: { id: user_id },
            select: {password: true}
        });

        if(!passwordHash) 
            throw new AppError("Usuário não encontrado!");

        const passwordEquals = await bcrypt.compare(passwords.current_password, passwordHash.password);

        if(!passwordEquals)
            throw new AppError("A senha atual está incorreta!");

        const newPasswordHash = await bcrypt.hash(passwords.new_password, 10);

        try
        {
            await prisma.users.update({
                data: {
                    password: newPasswordHash
                },
                where: {
                    id: user_id
                }
            });
        }
        catch (error)
        {
            console.log(error);
            throw new AppError("Ocorreu uma falha desconhecida ao atualizar a senha do usuário! Por favor, contacte o programador.");
        }
        
    }

    async CreateProfile(user_id: string, data: TCreateProfileRequestDTO)
    {

        const ifProfileExists = await prisma.profiles.findFirst({
            where: {
                user_id
            }
        });

        if(ifProfileExists) throw new AppError("Este perfil já existe!");


        const ifUserExists = await prisma.users.findUnique({
            where: {
                id: user_id
            }
        });

        if(!ifUserExists) throw new AppError("Usuário não encontrado! Forneça um ID válido.");

        try
        {
            const profileCreated = await prisma.profiles.create({
                data: {
                    ...data,
                    id: uuidv4(),
                    user_id
                }
            });

            return profileCreated;
        }
        catch (error)
        {
            console.log(error);
            throw new AppError(`Ocorreu uma falha desconhecida ao criar o perfil do usuário ${ifUserExists.email}! Por favor, contacte o programador.`);
        }
    }

    async UpdateProfile(user_id: string, data: TUpdateProfileRequestDTO)
    {

        const ifUserExists = await prisma.users.findUnique({
            where: {
                id: user_id
            }
        });

        if(!ifUserExists) throw new AppError("Usuário não encontrado! Forneça um ID válido.");

        try
        {
            const profileUpdated = await prisma.profiles.update({
                data: {
                    ...data,
                    id: uuidv4(),
                },
                where: {
                    user_id
                }
            });

            return profileUpdated;
        }
        catch (error)
        {
            console.log(error);
            throw new AppError(`Ocorreu uma falha desconhecida ao atualizar o perfil do usuário ${ifUserExists.email}! Por favor, contacte o programador.`);
        }
    }
}