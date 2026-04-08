-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Ingresso" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sessaoId" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "valorPago" REAL NOT NULL,
    "assento" TEXT NOT NULL DEFAULT '',
    CONSTRAINT "Ingresso_sessaoId_fkey" FOREIGN KEY ("sessaoId") REFERENCES "Sessao" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Ingresso" ("id", "sessaoId", "tipo", "valorPago") SELECT "id", "sessaoId", "tipo", "valorPago" FROM "Ingresso";
DROP TABLE "Ingresso";
ALTER TABLE "new_Ingresso" RENAME TO "Ingresso";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
