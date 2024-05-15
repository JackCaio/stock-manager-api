import { DatabaseBatchPrice } from "../interface/Batch";

export function batchListFormatter(dbBatchList: DatabaseBatchPrice[]) {
    return dbBatchList.map((batch) => {
        const price = batch.BatchProducts.reduce((acc, cur) => {
            return acc + Number(cur.price);
        }, 0);

        return {
            id: batch.id,
            arrivalDate: batch.arrivalDate,
            supplierId: batch.supplierId,
            price
        }
    })
}