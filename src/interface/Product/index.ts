import { Supplier, SupplierProducts } from "../Supplier"

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
