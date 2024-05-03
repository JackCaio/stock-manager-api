import { PrismaClient } from "@prisma/client";

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
            throw new Error('Supplier not found!');
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
            throw new Error('Product not found');
        }
    }
}
