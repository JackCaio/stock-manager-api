import { PrismaClient } from "@prisma/client";

class BatchService {
    constructor(private prisma: PrismaClient) { }

    public fetchList = () => {
        return this.prisma.batch.findMany({
            select: {
                id: true,
                arrivalDate: true,
                supplierId: true,
                BatchProducts: {
                    select: {
                        price: true,
                        quantity: true
                    }
                }
            }
        });
    }

    public fetchId = (batchId: string) => {
        return this.prisma.batch.findUnique({
            select: {
                id: true,
                supplier: {
                    select: {
                        name: true
                    }
                },
                arrivalDate: true,
                BatchProducts: {
                    select: {
                        price: true,
                        quantity: true,
                        stockQuantity: true,
                        product: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            },
            where: {
                id: batchId
            }
        });
    }

    public createBatch = (supplierId: string, arrivalDate: Date) => {
        return this.prisma.batch.create({
            data: {
                supplierId,
                arrivalDate
            }
        });
    }

    public createBatchProduct = (batchId: string, productId: string, price: number, quantity: number) => {
        return this.prisma.batchProducts.create({
            data: {
                batchId,
                productId,
                price,
                quantity,
                stockQuantity: quantity
            }
        });
    }
}

export default BatchService;
