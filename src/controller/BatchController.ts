import { FastifyReply, FastifyRequest } from "fastify";
import BatchService from "../service/BatchService";
import { ValidationService } from "../service/ValidationService";
import { BatchLoadout } from "../interface/Batch";
import ProductService from "../service/ProductService";
import { batchListFormatter } from "../utils/batchListFormatter";

class BatchController {
    constructor(private batchService: BatchService, private productService: ProductService, private validator: ValidationService) { }

    public fetchList = async (_req: FastifyRequest, res: FastifyReply) => {
        const dbBatchList = await this.batchService.fetchList()

        const resultList = batchListFormatter(dbBatchList);

        return res.status(200).send(resultList);
    }

    public createBatch = async (req: FastifyRequest, res: FastifyReply) => {
        const { products, supplierId, arrivalDate } = req.body as BatchLoadout;

        const productValidations = products.map(product => this.validator.validateProduct(product.productId));
        await Promise.all(productValidations);

        const today = new Date();
        arrivalDate?.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        if (arrivalDate && arrivalDate > today) {
            throw new Error('Cant register a batch that was not delivered');
        }

        const { id: batchId } = await this.batchService.createBatch(supplierId, arrivalDate || today);

        const batchProductCreation = products.map(({ productId, price, quantity }) => {
            return this.batchService.createBatchProduct(batchId, productId, price, quantity);
        });
        const productQuantityUpdate = products.map(({ productId, quantity }) => {
            return this.productService.updateQuantity(productId, quantity)
        })

        await Promise.all([...batchProductCreation, ...productQuantityUpdate]);

        res.status(201).send({ batchId });
    }
}

export default BatchController
