/*
  Warnings:

  - You are about to drop the column `slug` on the `products` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_products" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "supply" INTEGER NOT NULL DEFAULT 0,
    "batch" TEXT NOT NULL,
    "expirationTime" DATETIME
);
INSERT INTO "new_products" ("batch", "expirationTime", "id", "name", "supply") SELECT "batch", "expirationTime", "id", "name", "supply" FROM "products";
DROP TABLE "products";
ALTER TABLE "new_products" RENAME TO "products";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
