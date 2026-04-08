-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Ingresso" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sessaoId" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "valorPago" REAL NOT NULL,
    "assento" TEXT NOT NULL DEFAULT '',
    CONSTRAINT "Ingresso_sessaoId_fkey" FOREIGN KEY ("sessaoId") REFERENCES "Sessao" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Ingresso" ("assento", "id", "sessaoId", "tipo", "valorPago") SELECT "assento", "id", "sessaoId", "tipo", "valorPago" FROM "Ingresso";
DROP TABLE "Ingresso";
ALTER TABLE "new_Ingresso" RENAME TO "Ingresso";
CREATE TABLE "new_Sessao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "filmeId" INTEGER NOT NULL,
    "salaId" INTEGER NOT NULL,
    "horarioInicio" DATETIME NOT NULL,
    "valorIngresso" REAL NOT NULL,
    CONSTRAINT "Sessao_filmeId_fkey" FOREIGN KEY ("filmeId") REFERENCES "Filme" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Sessao_salaId_fkey" FOREIGN KEY ("salaId") REFERENCES "Sala" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Sessao" ("filmeId", "horarioInicio", "id", "salaId", "valorIngresso") SELECT "filmeId", "horarioInicio", "id", "salaId", "valorIngresso" FROM "Sessao";
DROP TABLE "Sessao";
ALTER TABLE "new_Sessao" RENAME TO "Sessao";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
