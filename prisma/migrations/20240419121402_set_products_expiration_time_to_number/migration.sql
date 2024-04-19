/*
  Warnings:

  - You are about to alter the column `expiration_time` on the `Products` table. The data in that column could be lost. The data in that column will be cast from `DateTime` to `Int`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Products" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "supply" INTEGER NOT NULL DEFAULT 0,
    "expiration_time" INTEGER
);
INSERT INTO "new_Products" ("expiration_time", "id", "name", "supply") SELECT "expiration_time", "id", "name", "supply" FROM "Products";
DROP TABLE "Products";
ALTER TABLE "new_Products" RENAME TO "Products";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
