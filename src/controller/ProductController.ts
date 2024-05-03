import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../lib/prisma';
import { CreateLoadout, ProductParams, SupplyUpdateLoadout } from '../interface/Product';
import ProductService from '../service/ProductService';
import { ValidationService } from '../service/ValidationService';

class ProductController {
    constructor(private service: ProductService, private validator: ValidationService) { }

    public fetchProductList = async (_req: FastifyRequest, res: FastifyReply) => {
        const products = await this.service.fetchList();

        res.status(200).send({ products });
    }

    public fetchProductById = async (req: FastifyRequest, res: FastifyReply) => {
        const { productId } = req.params as ProductParams;

        try {
            const product = await this.service.fetchId(productId);

            return res.status(200).send({ product });
        } catch (error) {
            throw new Error('Product not found');
        }
    }

    public createProduct = async (req: FastifyRequest, res: FastifyReply) => {
        const { name, supply, expirationTime } = req.body as CreateLoadout;

        const product = await this.service.create(name, supply, expirationTime);

        return res.status(201).send({ productId: product.id });
    }

    public updateProductData = async (req: FastifyRequest, res: FastifyReply) => {
        const { productId } = req.params as ProductParams;
        const { name, supply, expirationTime } = req.body as CreateLoadout;

        // await this.service.validateId(productId);
        await this.validator.validateProduct(productId);
        await this.service.update(productId, { name, supply, expirationTime });

        res.status(200).send();
    }

    public deleteProductData = async (req: FastifyRequest, res: FastifyReply) => {
        const { productId } = req.params as ProductParams;

        await prisma.product.delete({
            where: {
                id: productId
            }
        });

        return res.status(200).send()
    }

    public supplyBulkUpdate = async (req: FastifyRequest, res: FastifyReply) => {
        const { products } = req.body as { products: SupplyUpdateLoadout[] };

        await Promise.all(
            products.map(async (product) => {
                const data = await this.service.fetchId(product.productId);
                await this.service.update(product.productId, { supply: data.supply + product.incomingSupply });
            })
        );

        return res.status(200).send();
    }
}

export default ProductController
