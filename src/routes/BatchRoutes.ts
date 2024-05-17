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
                tags: ['Batches'],
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
        .get("/:batchId", {
            schema: {
                summary: 'Fetches data of a batch by its id',
                tags: ['Batches'],
                params: z.object({
                    batchId: z.string().uuid()
                }),
                response: {
                    200: z.object({
                        batchData: z.object({
                            id: z.string().uuid(),
                            supplier: z.string(),
                            arrivalDate: z.date(),
                            products: z.array(z.object({
                                name: z.string(),
                                price: z.coerce.number(),
                                quantity: z.number(),
                                sotckQuantity: z.number()
                            }))
                        })
                    })
                }
            }
        }, batchController.fetchId);

    app
        .withTypeProvider<ZodTypeProvider>()
        .post("/", {
            schema: {
                summary: 'Create new batch with products',
                tags: ['Batches'],
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
