-- CreateTable
CREATE TABLE "_LancheComboToPedido" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_LancheComboToPedido_A_fkey" FOREIGN KEY ("A") REFERENCES "LancheCombo" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_LancheComboToPedido_B_fkey" FOREIGN KEY ("B") REFERENCES "Pedido" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Ingresso" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sessaoId" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "valorPago" REAL NOT NULL,
    "assento" TEXT NOT NULL DEFAULT '',
    "pedidoId" INTEGER,
    CONSTRAINT "Ingresso_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "Pedido" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Ingresso_sessaoId_fkey" FOREIGN KEY ("sessaoId") REFERENCES "Sessao" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Ingresso" ("assento", "id", "sessaoId", "tipo", "valorPago") SELECT "assento", "id", "sessaoId", "tipo", "valorPago" FROM "Ingresso";
DROP TABLE "Ingresso";
ALTER TABLE "new_Ingresso" RENAME TO "Ingresso";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "_LancheComboToPedido_AB_unique" ON "_LancheComboToPedido"("A", "B");

-- CreateIndex
CREATE INDEX "_LancheComboToPedido_B_index" ON "_LancheComboToPedido"("B");
