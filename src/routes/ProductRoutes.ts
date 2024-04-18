import { FastifyInstance } from 'fastify';
import { z } from "zod";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from '../lib/prisma';

export async function productRoute(app: FastifyInstance) {
    app.get("/", (_req, res) => {
        res.send("bob");
    });

    app
        .withTypeProvider<ZodTypeProvider>()
        .post("/", {
            schema: {
                body: z.object({
                    name: z.string().min(4),
                    supply: z.number().int().nonnegative(),
                    batch: z.string(),
                    expirationTime: z.number().int().positive().nullable()
                }),
                response: {
                    201: z.object({
                        productId: z.string().uuid()
                    }),
                },
            }
        }, async (req, res) => {
            const { name, supply, batch, expirationTime } = req.body;

            const today = new Date().setHours(0, 0, 0, 0);
            const expirationDate = expirationTime ? new Date(today).setDate(new Date().getDate() + expirationTime) : null

            const product = await prisma.product.create({
                data: {
                    name,
                    supply,
                    batch,
                    expirationTime: expirationDate ? new Date(expirationDate) : null
                }
            });

            return res.status(201).send({ productId: product.id });
        });
}

export default productRoute;