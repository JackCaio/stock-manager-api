import { PrismaClient } from "@prisma/client";
import { productFormatter } from "../utils/productListFormatter";

class ProductService {
    constructor(private prisma: PrismaClient) { }

    public fetchList = async () => {
        const list = await this.prisma.product.findMany({
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

        return list.map(product => productFormatter(product))
    }

    public fetchById = async (productId: string) => {
        const data = await this.prisma.product.findUniqueOrThrow({
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
                                phone: true,
                            }
                        }
                    }
                }
            },
            where: {
                id: productId
            }
        });

        return productFormatter(data);
    }
}

export default ProductService