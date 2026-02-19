import { FastifyInstance } from "fastify";
import { UserController } from "../controllers/user.controller";

export async function userRoutes(app: FastifyInstance) {

    app.post("/users", new UserController().CreateUser);

    app.patch("/users/:user_id/email", new UserController().UpdateEmailUser);

    app.patch("/users/:user_id/password", new UserController().UpdatePasswordUser);

    app.post("/users/:user_id/profile", new UserController().CreateProfile);

    app.put("/users/:user_id/profile", new UserController().UpdateProfile);

    app.post("/users/:user_id/address", new UserController().CreateOrUpdateAddress);

}