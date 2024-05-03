export interface Supplier {
    name: string,
    phone?: string | null
}

export interface SupplierProducts {
    price: object,
    supplier: Supplier
}

export interface SupplierParams {
    supplierId: string
}

export interface SupplierProductsParams extends SupplierParams {
    productId: string
}

export interface SupplierProductsLoadout {
    price: number,
    productId: string
}