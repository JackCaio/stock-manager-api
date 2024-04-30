import { PrismaClient } from "@prisma/client";
import { productFormatter } from "../utils/productListFormatter";
import { UpdateLoadout } from "../interface/Product";

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

    public validateId = (productId: string) => {
        try {
            return this.prisma.product.findUniqueOrThrow({
                where: {
                    id: productId
                }
            });
        } catch (error) {
            throw new Error('Product not found');
        }
    }

    public fetchId = async (productId: string) => {
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

    public create = (name: string, supply: number, expirationTime: number) => {
        return this.prisma.product.create({
            data: {
                name,
                supply,
                expirationTime
            }
        });
    }

    public update = (productId: string, data: UpdateLoadout) => {
        return this.prisma.product.update({
            data,
            where: {
                id: productId
            }
        });
    }

    public delete = (productId: string) => {
        return this.prisma.product.delete({
            where: {
                id: productId
            }
        });
    }
}

export default ProductService