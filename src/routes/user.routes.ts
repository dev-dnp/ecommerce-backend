import { FastifyInstance } from "fastify";
import { UserController } from "../controllers/user.controller";

export async function userRoutes(app: FastifyInstance){

    app.post("/user", new UserController().CreateUser);

    app.patch("/user/:user_id/email", new UserController().UpdateEmailUser);

    app.patch("/user/:user_id/password", new UserController().UpdatePasswordUser);

    app.post("/user/:user_id/profile", new UserController().CreateProfile);

    app.put("/user/:user_id/profile", new UserController().UpdateProfile);

    app.post("/user/:user_id/address", new UserController().CreateOrUpdateAddress);

}