-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SupplierProducts" (
    "supplier_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "price" DECIMAL NOT NULL,

    PRIMARY KEY ("supplier_id", "product_id"),
    CONSTRAINT "SupplierProducts_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "Suppliers" ("id") ON DELETE CASCADE ON UPDATE RESTRICT,
    CONSTRAINT "SupplierProducts_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Products" ("id") ON DELETE CASCADE ON UPDATE RESTRICT
);
INSERT INTO "new_SupplierProducts" ("price", "product_id", "supplier_id") SELECT "price", "product_id", "supplier_id" FROM "SupplierProducts";
DROP TABLE "SupplierProducts";
ALTER TABLE "new_SupplierProducts" RENAME TO "SupplierProducts";
CREATE TABLE "new_BatchProducts" (
    "batchId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "price" DECIMAL NOT NULL,
    "quantity" INTEGER NOT NULL,

    PRIMARY KEY ("batchId", "productId"),
    CONSTRAINT "BatchProducts_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batches" ("id") ON DELETE NO ACTION ON UPDATE RESTRICT,
    CONSTRAINT "BatchProducts_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products" ("id") ON DELETE NO ACTION ON UPDATE RESTRICT
);
INSERT INTO "new_BatchProducts" ("batchId", "price", "productId", "quantity") SELECT "batchId", "price", "productId", "quantity" FROM "BatchProducts";
DROP TABLE "BatchProducts";
ALTER TABLE "new_BatchProducts" RENAME TO "BatchProducts";
CREATE TABLE "new_Batches" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "supplier_id" TEXT NOT NULL DEFAULT 'N/A',
    "arrival_date" DATETIME NOT NULL,
    CONSTRAINT "Batches_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "Suppliers" ("id") ON DELETE SET DEFAULT ON UPDATE RESTRICT
);
INSERT INTO "new_Batches" ("arrival_date", "id", "supplier_id") SELECT "arrival_date", "id", "supplier_id" FROM "Batches";
DROP TABLE "Batches";
ALTER TABLE "new_Batches" RENAME TO "Batches";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
