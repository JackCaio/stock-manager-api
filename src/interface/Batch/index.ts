export interface BatchLoadout {
    supplierId: string,
    arrivalDate?: Date,
    products: BatchProductsLoadout[]
}

export interface BatchProductsLoadout {
    productId: string,
    price: number,
    quantity: number
}

export interface DatabaseBatchPrice {
    id: string,
    supplierId: string,
    arrivalDate: Date,
    BatchProducts: {
        price: object,
        quantity: number
    }[]
}

export interface BatchData {
    id: string,
    arrivalDate: Date,
    supplier: {
        name: string,
    },
    BatchProducts: {
        price: object,
        product: {
            name: string,
        },
        quantity: number,
        stockQuantity: number,
    }[],
}
