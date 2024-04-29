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

type FormattedProductData = {
    buyingData: buyingData[],
    name: string,
    supply: number,
    expirationTime: number | null
}

interface DatabaseProduct {
    SupplierProducts: SupplierProducts[],
    name: string,
    supply: number,
    expirationTime: number | null
}

export function productFormatter(productData: DatabaseProduct): FormattedProductData {
    const { SupplierProducts, ...product } = productData;
    const buyingData = SupplierProducts.map((supplierProduct) => {
        return { price: Number(supplierProduct.price), supplier: supplierProduct.supplier }
    });
    return { ...product, buyingData }
}
