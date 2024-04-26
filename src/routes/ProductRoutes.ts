import { FastifyInstance } from 'fastify';
import { z } from "zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from '../lib/prisma';
import { productListFormatter } from '../utils/productListFormatter';

export async function productRoute(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .get("/", {
            schema: {
                summary: 'Fetches all created events',
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
        }, async (_req, res) => {
            const productList = await prisma.product.findMany({
                select: {
                    name: true,
                    supply: true,
                    expirationTime: true,
                    SupplierProducts: {
                        select: {
                            price: true,
                            supplier: {
                                select: {
                                    name: true,
                                    phone: true
                                }
                            }
                        },
                    }
                }
            });

            const products = productListFormatter(productList)

            res.status(200).send({ products });
        });

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
        }, async (req, res) => {
            const { productId } = req.params;

            try {
                const data = await prisma.product.findUniqueOrThrow({
                    select: {
                        name: true,
                        supply: true,
                        expirationTime: true,
                        SupplierProducts: {
                            select: {
                                price: true,
                                supplier: {
                                    select: {
                                        name: true,
                                        phone: true,
                                    }
                                }
                            }
                        }
                    },
                    where: {
                        id: productId
                    }
                });

                const [product] = productListFormatter([data]);

                return res.status(200).send({ product });
            } catch (error) {
                throw new Error('Product not found');
            }
        });

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
        }, async (req, res) => {
            const { name, supply, expirationTime } = req.body;

            const product = await prisma.product.create({
                data: {
                    name,
                    supply,
                    expirationTime
                }
            });

            return res.status(201).send({ productId: product.id });
        });

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
        }, async (req, res) => {
            const { productId } = req.params;
            const { name, supply, expirationTime } = req.body;

            try {
                const product = await prisma.product.findUniqueOrThrow({
                    where: {
                        id: productId
                    }
                });

                await prisma.product.update({
                    where: {
                        id: productId
                    },
                    data: {
                        name: name ?? product.name,
                        supply: supply ?? product.supply,
                        expirationTime: expirationTime ?? product.expirationTime
                    }
                });

                return res.status(200).send();
            } catch (error) {
                throw new Error('Product not found');
            }
        });

    app
        .withTypeProvider<ZodTypeProvider>()
        .delete("/:productId", {
            schema: {
                summary: 'Deletes a product`s data',
                tags: ['Products'],
                params: z.object({ productId: z.string().uuid() })
            }
        }, async (req, res) => {
            const { productId } = req.params;

            await prisma.product.delete({
                where: {
                    id: productId
                }
            });

            return res.status(200).send()
        });

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
        }, async (req, res) => {
            const { products } = req.body;

            await Promise.all(
                products.map(async (product) => {
                    try {
                        const data = await prisma.product.findUnique({
                            where: {
                                id: product.productId
                            }
                        });

                        const supply = data?.supply ?? 0

                        await prisma.product.update({
                            where: {
                                id: product.productId
                            },
                            data: {
                                supply: product.incomingSupply + supply
                            }
                        });

                        return res.status(200).send();
                    } catch (error) {
                        throw new Error('Product not found');
                    }
                })
            )
        })
}

export default productRoute;