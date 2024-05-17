import { BatchData, DatabaseBatchPrice } from "../interface/Batch";

export function batchListFormatter(dbBatchList: DatabaseBatchPrice[]) {
    return dbBatchList.map((batch) => {
        const price = batch.BatchProducts.reduce((acc, cur) => {
            return acc + (Number(cur.price) * Number(cur.quantity));
        }, 0);

        return {
            id: batch.id,
            arrivalDate: batch.arrivalDate,
            supplierId: batch.supplierId,
            price
        }
    })
}

export function batchDataFormatter(batchData: BatchData) {
    const { BatchProducts, supplier, ...baseData } = batchData;
    const products = BatchProducts.map(({ product, price, quantity }) => {
        return {
            name: product.name,
            price,
            quantity
        }
    });

    return {
        ...baseData,
        supplier: supplier.name,
        products
    };
}
