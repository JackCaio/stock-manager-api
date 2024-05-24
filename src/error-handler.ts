import { FastifyInstance } from "fastify"
import { BadRequest } from "./routes/_errors/bad-request";
import { ZodError } from "zod";

type FastifyErrorHandler = FastifyInstance['errorHandler'];

export const errorHandler: FastifyErrorHandler = (error, _request, reply) => {
    const { validation, validationContext } = error;

    if (error instanceof ZodError) {
        return reply.status(400).send({
            message: `Request validation error.`,
            errors: error.flatten().fieldErrors
        });
    }

    if (error instanceof BadRequest) {
        return reply.status(error.errorCode).send({ message: error.message, cause: error.cause });
    }
    return reply.status(500).send({ message: 'Internal Error' });
}