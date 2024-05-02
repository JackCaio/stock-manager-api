import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { supplierController } from '../controller';

export async function supplierRoute(app: FastifyInstance) {
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
        }, supplierController.fetchSupplierList);

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
        }, supplierController.fetchSupplierById);

    app
        .withTypeProvider<ZodTypeProvider>()
        .post('/', {
            schema: {
                summary: 'Creates a new supplier',
                tags: ['Suppliers'],
                body: z.object({
                    name: z.string(),
                    phone: z.string().min(11).nullable().optional(),
                }),
                response: {
                    201: z.object({ supplierId: z.string().uuid() })
                }
            }
        }, supplierController.createSupplier);

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

            try {
                await prisma.supplier.findUniqueOrThrow({
                    where: {
                        id: supplierId
                    }
                });
            } catch (error) {
                throw new Error('Supplier not found');
            }

            const dbProducts = await prisma.product.findMany({
                where: {
                    id: { in: products.map(product => product.productId) }
                }
            });

            if (dbProducts.length < products.length) {
                throw new Error('Some products were not found')
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

    app
        .withTypeProvider<ZodTypeProvider>()
        .delete('/:supplierId/products', {
            schema: {
                summary: 'Bulk deletes a suppliers product data',
                tags: ['Suppliers'],
                params: z.object({
                    supplierId: z.string().uuid()
                }),
                body: z.object({
                    productList: z.array(z.string().uuid())
                })
            }
        }, async (req, res) => {
            const { supplierId } = req.params;
            const { productList } = req.body;

            await prisma.supplierProducts.deleteMany({
                where: {
                    AND: [{ supplierId }, { productId: { in: productList } }]
                }
            });

            return res.status(200).send();
        });

    app
        .withTypeProvider<ZodTypeProvider>()
        .get('/:supplierId/products', {
            schema: {
                summary: 'Fetches a suppliers product',
                tags: ['Suppliers'],
                params: z.object({ supplierId: z.string().uuid() }),
                response: {
                    200: z.object({
                        products: z.array(z.object({
                            productId: z.string().uuid(),
                            name: z.string(),
                            price: z.number().nonnegative().multipleOf(0.01)
                        }))
                    })
                }
            }
        }, async (req, res) => {
            const { supplierId } = req.params;

            const products = await prisma.supplierProducts.findMany({
                where: {
                    supplierId
                },
                select: {
                    price: true,
                    product: {
                        select: {
                            name: true,
                            id: true
                        }
                    }
                }
            });

            return res.status(200).send({
                products: products.map(product => {
                    return { price: Number(product.price), name: product.product.name, productId: product.product.id };
                })
            })
        })
};