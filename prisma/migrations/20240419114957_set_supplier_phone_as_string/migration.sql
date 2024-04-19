-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Suppliers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "phone" TEXT
);
INSERT INTO "new_Suppliers" ("id", "name", "phone") SELECT "id", "name", "phone" FROM "Suppliers";
DROP TABLE "Suppliers";
ALTER TABLE "new_Suppliers" RENAME TO "Suppliers";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
