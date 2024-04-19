type Supplier = {
    name: string,
    phone: string | null
}

type SupplierProducts = {
    price: object,
    supplier: Supplier
}

type ProductList = {
    SupplierProducts: SupplierProducts[],
    name: string,
    supply: number,
    expirationTime: number | null
}

type buyingData = {
    price: number,
    supplier: Supplier
}

type ProductListFormatted = {
    buyingData: buyingData[],
    name: string,
    supply: number,
    expirationTime: number | null
}

export function productListFormatter(list: ProductList[]): ProductListFormatted[] {
    return list.map((products) => {
        const { SupplierProducts, ...product } = products;
        const buyingData = SupplierProducts.map((supplierProduct) => {
            return { price: Number(supplierProduct.price), supplier: supplierProduct.supplier }
        });
        return { ...product, buyingData }
    });
};