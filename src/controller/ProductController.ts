import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../lib/prisma';
import { productFormatter } from '../utils/productListFormatter';
import { BulkSupplyUpdateLoadout, ProductLoadout, ProductParams } from '../interface/Product';
import ProductService from '../service/ProductService';
import { productService } from '../service';

class ProductController {
    constructor(private service: ProductService) { }

    public fetchProductList = async (_req: FastifyRequest, res: FastifyReply) => {
        console.log('1', this)
        const productList = await productService.fetchList();

        const products = productList.map(product => productFormatter(product));

        res.status(200).send({ products });
    }

    public async fetchProductById(req: FastifyRequest, res: FastifyReply) {
        const { productId } = req.params as ProductParams;

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

            const product = productFormatter(data);

            return res.status(200).send({ product });
        } catch (error) {
            throw new Error('Product not found');
        }
    }

    public async createProduct(req: FastifyRequest, res: FastifyReply) {
        const { name, supply, expirationTime } = req.body as ProductLoadout;

        const product = await prisma.product.create({
            data: {
                name,
                supply,
                expirationTime
            }
        });

        return res.status(201).send({ productId: product.id });
    }

    public async updateProductData(req: FastifyRequest, res: FastifyReply) {
        const { productId } = req.params as ProductParams;
        const { name, supply, expirationTime } = req.body as ProductLoadout;

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
    }

    public async deleteProductData(req: FastifyRequest, res: FastifyReply) {
        const { productId } = req.params as ProductParams;

        await prisma.product.delete({
            where: {
                id: productId
            }
        });

        return res.status(200).send()
    }

    public async supplyBulkUpdate(req: FastifyRequest, res: FastifyReply) {
        const { products } = req.body as BulkSupplyUpdateLoadout;

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
    }

    public test() {
        console.log(this instanceof ProductController)
    }
}

export default ProductController
