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