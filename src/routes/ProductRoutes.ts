import { FastifyInstance } from 'fastify';
import { z } from "zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from '../lib/prisma';
import { productListFormatter } from '../utils/productListFormatter';

export async function productRoute(app: FastifyInstance) {
    // Fetch all products
    app
        .withTypeProvider<ZodTypeProvider>()
        .get("/", {
            schema: {
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

    // Search product id
    app
        .withTypeProvider<ZodTypeProvider>()
        .get("/:productId", {
            schema: {
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

            const data = await prisma.product.findUnique({
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

            if (!data) {
                throw new Error('Product not found');
            }

            const [product] = productListFormatter([data]);

            return res.status(200).send({ product });
        });

    // Create product
    app
        .withTypeProvider<ZodTypeProvider>()
        .post("/", {
            schema: {
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
}

export default productRoute;