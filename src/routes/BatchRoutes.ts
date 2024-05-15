import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { batchController } from "../controller";
import { z } from "zod";

export async function batchRoute(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .get("/", {
            schema: {
                summary: 'Fetches list of all batches',
                tags: ['Batch'],
                response: {
                    200: z.array(z.object({
                        id: z.string().uuid(),
                        arrivalDate: z.date(),
                        supplierId: z.string().uuid(),
                        price: z.number().nonnegative()
                    }))
                }
            }
        }, batchController.fetchList);

    app
        .withTypeProvider<ZodTypeProvider>()
        .post("/", {
            schema: {
                summary: 'Create new Batch with products',
                tags: ['Batch'],
                body: z.object({
                    supplierId: z.string().uuid(),
                    arrivalDate: z.coerce.date().optional(),
                    products: z.array(z.object({
                        productId: z.string().uuid(),
                        price: z.number().multipleOf(0.01).nonnegative(),
                        quantity: z.number().int().nonnegative()
                    }))
                }),
                response: {
                    201: z.object({
                        batchId: z.string().uuid()
                    })
                }
            }
        }, batchController.createBatch)
}
