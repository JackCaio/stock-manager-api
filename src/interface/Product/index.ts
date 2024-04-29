export interface ProductParams {
    productId: string
}

export interface ProductLoadout {
    name: string,
    supply: number,
    expirationTime: number
}

export interface SupplyUpdateLoadout {
    productId: string,
    incomingSupply: number
}

export interface BulkSupplyUpdateLoadout {
    products: SupplyUpdateLoadout[]
}