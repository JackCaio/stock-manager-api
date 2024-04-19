/*
  Warnings:

  - Added the required column `quantity` to the `BatchProducts` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BatchProducts" (
    "batchId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "price" DECIMAL NOT NULL,
    "quantity" INTEGER NOT NULL,

    PRIMARY KEY ("batchId", "productId"),
    CONSTRAINT "BatchProducts_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batches" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "BatchProducts_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_BatchProducts" ("batchId", "price", "productId") SELECT "batchId", "price", "productId" FROM "BatchProducts";
DROP TABLE "BatchProducts";
ALTER TABLE "new_BatchProducts" RENAME TO "BatchProducts";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
