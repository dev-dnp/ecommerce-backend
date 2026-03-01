import fastify from "fastify";
import { userRoutes } from "./routes/user.routes";
import { AppError } from "./errors/AppError";
import { productRoutes } from "./routes/product.routes";
import multipart from "@fastify/multipart";
import { uploadRoutes } from "./routes/upload.routes";
import { cartRoutes } from "./routes/cart.routes";
import { orderRoutes } from "./routes/order.routes";
const qs = require('qs');

const app = fastify({
    routerOptions: {
        querystringParser: str => qs.parse(str)
    }
});

app.register(multipart, {
    limits: {
        fieldSize: 5 * 1024 * 1024 // 5MB
    }
});

app.register(userRoutes);
app.register(productRoutes);
app.register(uploadRoutes);
app.register(cartRoutes);
app.register(orderRoutes);

app.setErrorHandler((error, request, reply) => {

    if (error instanceof AppError) {
        return reply
            .status(error.statusCode)
            .send({
                ok: false,
                details: {
                    title: error.title,
                    msg: error.message
                },
                status_code: error.statusCode,
            });
    }

    console.log(error)

    return reply
        .status(500)
        .send({
            ok: false,
            details: {
                title: "Falha no servidor!",
                msg: "Ocorreu um erro interno desconhecido, por favor, contacte o programador."
            },
            status_code: reply.statusCode,
        })


});

app.listen({ port: 3333, host: '0.0.0.0' }).then(() => console.log("HTTP Server Running in http://0.0.0.0:3333 ❤️‍🔥"));
