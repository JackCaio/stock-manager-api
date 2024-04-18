/*
  Warnings:

  - The primary key for the `supplierProducts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `productId` on the `supplierProducts` table. All the data in the column will be lost.
  - You are about to drop the column `supplierId` on the `supplierProducts` table. All the data in the column will be lost.
  - You are about to drop the column `expirationTime` on the `products` table. All the data in the column will be lost.
  - Added the required column `product_id` to the `supplierProducts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `supplier_id` to the `supplierProducts` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_supplierProducts" (
    "supplier_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "price" DECIMAL NOT NULL,

    PRIMARY KEY ("supplier_id", "product_id"),
    CONSTRAINT "supplierProducts_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "suppliers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "supplierProducts_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_supplierProducts" ("price") SELECT "price" FROM "supplierProducts";
DROP TABLE "supplierProducts";
ALTER TABLE "new_supplierProducts" RENAME TO "supplierProducts";
CREATE TABLE "new_products" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "supply" INTEGER NOT NULL DEFAULT 0,
    "batch" TEXT NOT NULL,
    "expiration_time" DATETIME
);
INSERT INTO "new_products" ("batch", "id", "name", "supply") SELECT "batch", "id", "name", "supply" FROM "products";
DROP TABLE "products";
ALTER TABLE "new_products" RENAME TO "products";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
