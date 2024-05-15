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
        price: object
    }[]
}
