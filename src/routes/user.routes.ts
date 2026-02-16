import { FastifyInstance } from "fastify";
import { prisma } from "../../lib/prisma";
import { UserService } from "../services/user.service";
import { UserController } from "../controllers/user.controller";

export async function userRoutes(app: FastifyInstance){

    app.post("/user", new UserController().CreateUser);

    app.patch("/user/:user_id/email", new UserController().UpdateEmailUser);

    app.patch("/user/:user_id/password", new UserController().UpdatePasswordUser);

    app.post("/user/:user_id/profile", new UserController().createProfile);

}