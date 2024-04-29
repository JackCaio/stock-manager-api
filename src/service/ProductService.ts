import { PrismaClient } from "@prisma/client";

class ProductService {
    constructor(private prisma: PrismaClient) { }

    public fetchList() {
        return this.prisma.product.findMany({
            select: {
                name: true,
                supply: true,
                expirationTime: true,
                SupplierProducts: {
                    select: {
                        price: true,
                        supplier: {
                            select: {
                                name: true,
                                phone: true
                            }
                        }
                    },
                }
            }
        });
    }
}

export default ProductService