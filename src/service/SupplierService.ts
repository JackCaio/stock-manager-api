import { PrismaClient } from "@prisma/client";

class SupplierService {
    constructor(private prisma: PrismaClient) { }

    public fetchList = () => {
        return this.prisma.supplier.findMany({
            select: {
                name: true,
                phone: true
            }
        });
    }

    public fetchById = (supplierId: string) => {
        return this.prisma.supplier.findUniqueOrThrow({
            select: {
                name: true,
                phone: true
            },
            where: {
                id: supplierId
            }
        });
    }

    public create = (name: string, phone?: string | null) => {
        return this.prisma.supplier.create({
            data: {
                name,
                phone: phone ?? null,
            }
        });
    }

    public addSupplierProduct = async (supplierId: string, productId: string, price: number) => {
        await this.prisma.supplierProducts.create({
            data: {
                supplierId,
                productId,
                price
            }
        });
    }

    public fetchSupplierProducts = (supplierId: string) => {
        return this.prisma.supplierProducts.findMany({
            where: {
                supplierId
            },
            select: {
                price: true,
                product: {
                    select: {
                        name: true,
                        id: true
                    }
                }
            }
        });
    }

    public updateSupplierProductPrice = async (supplierId: string, productId: string, price: number) => {
        await this.prisma.supplierProducts.update({
            where: {
                supplierId_productId: {
                    productId,
                    supplierId
                }
            },
            data: {
                price
            }
        })
    }

    public bulkDeleteSupplierProduct = async (supplierId: string, productIdList: string[]) => {
        await this.prisma.supplierProducts.deleteMany({
            where: {
                AND: {
                    supplierId,
                    productId: {
                        in: productIdList
                    }
                }
            }
        });
    }
}

export default SupplierService;
