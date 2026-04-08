-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Filme" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "sinopse" TEXT NOT NULL DEFAULT '',
    "classificacaoEtaria" TEXT NOT NULL,
    "duracao" INTEGER NOT NULL,
    "dataInicioExibicao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataFinalExibicao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "generoId" INTEGER NOT NULL,
    CONSTRAINT "Filme_generoId_fkey" FOREIGN KEY ("generoId") REFERENCES "Genero" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Filme" ("classificacaoEtaria", "duracao", "generoId", "id", "titulo") SELECT "classificacaoEtaria", "duracao", "generoId", "id", "titulo" FROM "Filme";
DROP TABLE "Filme";
ALTER TABLE "new_Filme" RENAME TO "Filme";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
