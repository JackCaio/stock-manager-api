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
}

export default SupplierService;
