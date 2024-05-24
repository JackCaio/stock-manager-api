import { PrismaClient } from "@prisma/client";
import { BadRequest } from "../routes/_errors/bad-request";

export class ValidationService {
    constructor(private prisma: PrismaClient) { }

    public validateSupplier = async (supplierId: string) => {
        try {
            await this.prisma.supplier.findUniqueOrThrow({
                where: {
                    id: supplierId
                }
            });
        } catch (error) {
            throw new BadRequest(404, 'Supplier not found!');
        }
    }

    public validateProduct = async (productId: string) => {
        try {
            await this.prisma.product.findUniqueOrThrow({
                where: {
                    id: productId
                }
            });
        } catch (error) {
            throw new BadRequest(404, 'Product not found');
        }
    }

    public validateSupplierProduct = async (productId: string, supplierId: string) => {
        try {
            await this.prisma.supplierProducts.findUniqueOrThrow({
                where: {
                    supplierId_productId: {
                        productId,
                        supplierId
                    }
                }
            });
        } catch (error) {
            throw new BadRequest(400, 'Supplier does not sell this product');
        }
    }

    public validateBatch = async (batchId: string) => {
        try {
            await this.prisma.batch.findUniqueOrThrow({
                where: {
                    id: batchId
                }
            });
        } catch (error) {
            throw new BadRequest(404, 'Batch not found!');
        }
    }

    public validateBatchProduct = async (batchId: string, productId: string) => {
        try {
            await this.validateBatch(batchId);
            return this.prisma.batchProducts.findUniqueOrThrow({
                where: {
                    batchId_productId: {
                        batchId,
                        productId
                    }
                }
            });
        } catch (error) {
            throw new BadRequest(400, "Batch doesn't have this product");
        }
    }

    public validateBatchProductQuantity = async (batchId: string, productId: string, quantity: number) => {
        const product = await this.validateBatchProduct(batchId, productId);
        if (product.quantity <= quantity) {
            throw new BadRequest(400, "Batch doesn't have this ammount of products");
        }
    }

    public validateBatchArrivalDate = (arrivalDate: Date) => {
        const today = new Date();
        arrivalDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        if (arrivalDate > today) {
            throw new BadRequest(400, 'Cant register a batch that was not delivered');
        }
    }
}
