-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BatchProducts" (
    "batchId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "price" DECIMAL NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "stockQuantity" INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY ("batchId", "productId"),
    CONSTRAINT "BatchProducts_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batches" ("id") ON DELETE NO ACTION ON UPDATE RESTRICT,
    CONSTRAINT "BatchProducts_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products" ("id") ON DELETE NO ACTION ON UPDATE RESTRICT
);
INSERT INTO "new_BatchProducts" ("batchId", "price", "productId", "quantity") SELECT "batchId", "price", "productId", "quantity" FROM "BatchProducts";
DROP TABLE "BatchProducts";
ALTER TABLE "new_BatchProducts" RENAME TO "BatchProducts";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
