import { FastifyReply, FastifyRequest } from "fastify";
import SupplierService from "../service/SupplierService";
import { Supplier, SupplierParams, SupplierProductsLoadout, SupplierProductsParams } from "../interface/Supplier";
import { ValidationService } from "../service/ValidationService";

class SupplierController {
    constructor(private service: SupplierService, private validator: ValidationService) { }

    public fetchSupplierList = async (_req: FastifyRequest, res: FastifyReply) => {
        const suppliers = await this.service.fetchList()

        res.status(200).send({ suppliers });
    }

    public fetchSupplierById = async (req: FastifyRequest, res: FastifyReply) => {
        const { supplierId } = req.params as SupplierParams;

        try {
            const supplier = await this.service.fetchById(supplierId);

            return res.status(200).send({ supplier });
        } catch (error) {
            throw new Error('Supplier not found');
        }
    }

    public createSupplier = async (req: FastifyRequest, res: FastifyReply) => {
        const { name, phone } = req.body as Supplier;

        const supplier = await this.service.create(name, phone)

        return res.status(201).send({ supplierId: supplier.id });
    }

    public addSuplierProducts = async (req: FastifyRequest, res: FastifyReply) => {
        const { supplierId } = req.params as SupplierParams;
        const { products } = req.body as { products: SupplierProductsLoadout[] };

        const validations = [
            this.validator.validateSupplier(supplierId),
            ...products.map(product => this.validator.validateProduct(product.productId))
        ];

        await Promise.all(validations);
        await Promise.all(products.map(({ productId, price }) => this.service.addSupplierProduct(supplierId, productId, price)));

        return res.status(201).send()
    }

    public fetchSupplierProducts = async (req: FastifyRequest, res: FastifyReply) => {
        const { supplierId } = req.params as SupplierParams;

        const products = await this.service.fetchSupplierProducts(supplierId);

        return res.status(200).send({
            products: products.map(product => {
                return { price: Number(product.price), name: product.product.name, productId: product.product.id };
            })
        })
    }

    public updateProductPrice = async (req: FastifyRequest, res: FastifyReply) => {
        const { productId, supplierId } = req.params as SupplierProductsParams;
        const { price } = req.body as { price: number };

        await this.validator.validateSupplierProduct(productId, supplierId);
        await this.service.updateSupplierProductPrice(supplierId, productId, price);

        return res.status(201).send();
    }

    public bulkDeleteSupplierProduct = async (req: FastifyRequest, res: FastifyReply) => {
        const { supplierId } = req.params as SupplierParams;
        const { productIdList } = req.body as { productIdList: string[] };

        await this.service.bulkDeleteSupplierProduct(supplierId, productIdList)

        return res.status(200).send();
    }
}

export default SupplierController;
