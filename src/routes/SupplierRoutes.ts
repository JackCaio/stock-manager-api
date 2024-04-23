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
};