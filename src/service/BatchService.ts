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
                        price: true
                    }
                }
            }
        });
    }

    public createBatch = (supplierId: string, arrivalDate: Date) => {
        return this.prisma.batch.create({
            data: {
                supplierId,
                arrivalDate
            }
        })
    }

    public createBatchProduct = (batchId: string, productId: string, price: number, quantity: number) => {
        return this.prisma.batchProducts.create({
            data: {
                batchId,
                productId,
                price,
                quantity
            }
        })
    }
}

export default BatchService;
