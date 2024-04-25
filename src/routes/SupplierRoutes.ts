import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

export async function supplierRoute(app: FastifyInstance) {
    // Fetch all suppliers
    app
        .withTypeProvider<ZodTypeProvider>()
        .get('/', {
            schema: {
                summary: 'Fetches all created suppliers',
                tags: ['Suppliers'],
                response: {
                    200: z.object({
                        suppliers: z.array(
                            z.object({
                                name: z.string(),
                                phone: z.string().nullable()
                            })
                        )
                    })
                }
            },
        }, async (_req, res) => {
            const suppliers = await prisma.supplier.findMany({
                select: {
                    name: true,
                    phone: true
                }
            });

            res.status(200).send({ suppliers });
        });

    // Search supplier id    
    app
        .withTypeProvider<ZodTypeProvider>()
        .get("/:supplierId", {
            schema: {
                summary: 'Search for one supplier by its id',
                tags: ['Suppliers'],
                params: z.object({
                    supplierId: z.string().uuid()
                }),
                response: {
                    200: z.object({
                        supplier: z.object({
                            name: z.string(),
                            phone: z.string().nullable()
                        })
                    })
                }
            }
        }, async (req, res) => {
            const { supplierId } = req.params;

            const supplier = await prisma.supplier.findUnique({
                select: {
                    name: true,
                    phone: true
                },
                where: {
                    id: supplierId
                }
            });

            if (!supplier) {
                throw new Error('Supplier not found');
            }

            res.status(200).send({ supplier });
        })

    // Create supplier
    app
        .withTypeProvider<ZodTypeProvider>()
        .post('/', {
            schema: {
                summary: 'Creates a new supplier',
                tags: ['Suppliers'],
                body: z.object({
                    name: z.string(),
                    phone: z.string().min(11).nullable(),
                }),
                response: {
                    201: z.object({ supplierId: z.string().uuid() })
                }
            }
        }, async (req, res) => {
            const { name, phone } = req.body;

            const supplier = await prisma.supplier.create({
                data: {
                    name,
                    phone
                }
            });

            return res.status(201).send({ supplierId: supplier.id });
        });

    app
        .withTypeProvider<ZodTypeProvider>()
        .post('/:supplierId/products', {
            schema: {
                summary: 'Bulk adds products to a single supplier',
                tags: ['Suppliers'],
                params: z.object({
                    supplierId: z.string().uuid()
                }),
                body: z.object({
                    products: z.array(z.object({
                        price: z.number().multipleOf(0.01).nonnegative().default(0),
                        productId: z.string().uuid()
                    }))
                })
            }
        }, async (req, res) => {
            const { supplierId } = req.params;
            const { products } = req.body;

            const supplier = await prisma.supplier.findUnique({
                where: {
                    id: supplierId
                }
            });

            const dbProducts = await prisma.product.findMany({
                where: {
                    id: { in: products.map(product => product.productId) }
                }
            });

            if (dbProducts.length < products.length) {
                throw new Error('Some products were not found')
            }

            if (!supplier) {
                throw new Error('Supplier not found');
            }

            await prisma.supplierProducts.createMany({
                data: products.map(product => {
                    return { ...product, supplierId };
                })
            });

            return res.status(201).send()
        });

    app
        .withTypeProvider<ZodTypeProvider>()
        .patch('/:supplierId/products/:productId', {
            schema: {
                summary: 'Updates a suppliers price of a single product',
                tags: ['Suppliers'],
                params: z.object({
                    supplierId: z.string().uuid(),
                    productId: z.string().uuid()
                }),
                body: z.object({
                    price: z.number().multipleOf(0.01).nonnegative()
                })
            }
        }, async (req, res) => {
            const { productId, supplierId } = req.params;
            const { price } = req.body;

            console.log(productId, supplierId);

            try {
                await prisma.supplierProducts.findUniqueOrThrow({
                    where: {
                        supplierId_productId: {
                            supplierId,
                            productId
                        }
                    }
                });
            } catch (error) {
                throw new Error('Supplier/Product data not found');
            }

            await prisma.supplierProducts.update({
                where: {
                    supplierId_productId: {
                        supplierId,
                        productId
                    }
                },
                data: {
                    price
                }
            });

            return res.status(201).send();
        });
};