import { DatabaseProduct, FormattedProductData } from "../interface/Product";

export function productFormatter(productData: DatabaseProduct): FormattedProductData {
    const { SupplierProducts, ...product } = productData;
    const buyingData = SupplierProducts.map((supplierProduct) => {
        return { price: Number(supplierProduct.price), supplier: supplierProduct.supplier }
    });
    return { ...product, buyingData }
}
