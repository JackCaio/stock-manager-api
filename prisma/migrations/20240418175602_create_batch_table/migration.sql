/*
  Warnings:

  - You are about to drop the `products` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `supplierProducts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `suppliers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "products";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "supplierProducts";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "suppliers";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Products" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "supply" INTEGER NOT NULL DEFAULT 0,
    "batch" TEXT NOT NULL,
    "expiration_time" DATETIME
);

-- CreateTable
CREATE TABLE "Suppliers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "phone" INTEGER
);

-- CreateTable
CREATE TABLE "SupplierProducts" (
    "supplier_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "price" DECIMAL NOT NULL,

    PRIMARY KEY ("supplier_id", "product_id"),
    CONSTRAINT "SupplierProducts_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "Suppliers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SupplierProducts_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Products" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Batches" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "supplier_id" TEXT NOT NULL,
    "arrival_date" DATETIME NOT NULL,
    CONSTRAINT "Batches_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "Suppliers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BatchProducts" (
    "batchId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "price" DECIMAL NOT NULL,

    PRIMARY KEY ("batchId", "productId"),
    CONSTRAINT "BatchProducts_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batches" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "BatchProducts_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Products" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
