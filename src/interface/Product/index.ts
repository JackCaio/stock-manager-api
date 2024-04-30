export interface ProductParams {
    productId: string
}

export interface CreateLoadout {
    name: string,
    supply: number,
    expirationTime: number
}

export interface UpdateLoadout {
    name?: string,
    supply?: number,
    expirationTime?: number
}

export interface SupplyUpdateLoadout {
    productId: string,
    incomingSupply: number
}

type Supplier = {
    name: string,
    phone: string | null
}

type SupplierProducts = {
    price: object,
    supplier: Supplier
}

type buyingData = {
    price: number,
    supplier: Supplier
}

export interface FormattedProductData {
    buyingData: buyingData[],
    name: string,
    supply: number,
    expirationTime: number | null
}

export interface DatabaseProduct {
    SupplierProducts: SupplierProducts[],
    name: string,
    supply: number,
    expirationTime: number | null
}
