import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

export async function supplierRoute(app: FastifyInstance) {
    // fetch all suppliers
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