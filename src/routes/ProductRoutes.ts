import { FastifyInstance } from 'fastify';
import { z } from "zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { productController } from '../controller';

export async function productRoute(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .get("/", {
            schema: {
                summary: 'Fetches all created products',
                tags: ['Products'],
                response: {
                    200: z.object({
                        products: z.array(z.object({
                            name: z.string(),
                            supply: z.number(),
                            expirationTime: z.number().nullable(),
                            buyingData: z.array(z.object({
                                price: z.number().multipleOf(0.01).positive(),
                                supplier: z.object({
                                    name: z.string(),
                                    phone: z.string().nullable()
                                })
                            }))
                        }))
                    })
                }
            }
        }, productController.fetchProductList);

    app
        .withTypeProvider<ZodTypeProvider>()
        .get("/:productId", {
            schema: {
                summary: 'Search for one product by its id',
                tags: ['Products'],
                params: z.object({
                    productId: z.string().uuid()
                }),
                response: {
                    200: z.object({
                        product: z.object({
                            name: z.string(),
                            supply: z.number(),
                            expirationTime: z.number().nullable(),
                            buyingData: z.array(z.object({
                                price: z.number().multipleOf(0.01).positive(),
                                supplier: z.object({
                                    name: z.string(),
                                    phone: z.string().nullable()
                                })
                            }))
                        })
                    })
                }
            }
        }, productController.fetchProductById);

    app
        .withTypeProvider<ZodTypeProvider>()
        .post("/", {
            schema: {
                summary: 'Creates a new product',
                tags: ['Products'],
                body: z.object({
                    name: z.string().min(4),
                    supply: z.number().int().nonnegative(),
                    expirationTime: z.number().int().positive().nullable()
                }),
                response: {
                    201: z.object({
                        productId: z.string().uuid()
                    }),
                },
            }
        }, productController.createProduct);

    app
        .withTypeProvider<ZodTypeProvider>()
        .put("/:productId", {
            schema: {
                summary: 'Updates a product`s data',
                tags: ['Products'],
                params: z.object({ productId: z.string().uuid() }),
                body: z.object({
                    name: z.string().optional(),
                    supply: z.number().nonnegative().optional(),
                    expirationTime: z.number().int().positive().optional()
                })
            }
        }, productController.updateProductData);

    app
        .withTypeProvider<ZodTypeProvider>()
        .delete("/:productId", {
            schema: {
                summary: 'Deletes a product`s data',
                tags: ['Products'],
                params: z.object({ productId: z.string().uuid() })
            }
        }, productController.deleteProductData);

    app
        .withTypeProvider<ZodTypeProvider>()
        .patch("/", {
            schema: {
                summary: 'Bunk updates product supplies',
                tags: ['Products'],
                body: z.object({
                    products: z.array(
                        z.object({
                            productId: z.string().uuid(),
                            incomingSupply: z.number().int().positive()
                        })
                    )
                })
            }
        }, productController.supplyBulkUpdate)
}

export default productRoute;