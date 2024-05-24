import { FastifyReply, FastifyRequest } from "fastify";
import BatchService from "../service/BatchService";
import { ValidationService } from "../service/ValidationService";
import { BatchData, BatchLoadout } from "../interface/Batch";
import ProductService from "../service/ProductService";
import { batchDataFormatter, batchListFormatter } from "../utils/batchListFormatter";
import { BadRequest } from "../routes/_errors/bad-request";

class BatchController {
    constructor(private batchService: BatchService, private productService: ProductService, private validator: ValidationService) { }

    public fetchList = async (_req: FastifyRequest, res: FastifyReply) => {
        const dbBatchList = await this.batchService.fetchList()

        const resultList = batchListFormatter(dbBatchList);

        return res.status(200).send(resultList);
    }

    public fetchId = async (req: FastifyRequest, res: FastifyReply) => {
        const { batchId } = req.params as { batchId: string };

        await this.validator.validateBatch(batchId);
        const data = await this.batchService.fetchId(batchId);

        const batchData = batchDataFormatter(data as BatchData);

        res.status(200).send({ batchData })
    }

    public createBatch = async (req: FastifyRequest, res: FastifyReply) => {
        const { products, supplierId, arrivalDate } = req.body as BatchLoadout;

        const productValidations = products.map(product => this.validator.validateProduct(product.productId));
        await Promise.all(productValidations);

        if (arrivalDate !== undefined) {
            this.validator.validateBatchArrivalDate(arrivalDate);
        }

        const today = new Date();
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

export default BatchController;
