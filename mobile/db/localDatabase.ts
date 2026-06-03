import * as SQLite from 'expo-sqlite';
import { Ingresso } from '../types';

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!db) {
    db = await SQLite.openDatabaseAsync('cinema-offline.db');
    await initializeDatabase(db);
  }
  return db;
}

async function initializeDatabase(database: SQLite.SQLiteDatabase) {
  await database.execAsync(`
    CREATE TABLE IF NOT EXISTS ingressos_local (
      id INTEGER PRIMARY KEY,
      sessaoId INTEGER NOT NULL,
      tipo TEXT NOT NULL,
      valorPago REAL NOT NULL,
      assento TEXT NOT NULL DEFAULT '',
      filmeTitulo TEXT DEFAULT '',
      salaNumero INTEGER DEFAULT 0,
      horarioSessao TEXT DEFAULT '',
      sincronizado INTEGER DEFAULT 1,
      dataCompra TEXT DEFAULT (datetime('now'))
    );
  `);
}

export async function saveIngressosOffline(ingressos: Ingresso[]) {
  const database = await getDatabase();

  for (const ingresso of ingressos) {
    const filmeTitulo = ingresso.sessao?.filme?.titulo || '';
    const salaNumero = ingresso.sessao?.sala?.numero || 0;
    const horarioSessao = ingresso.sessao?.horarioInicio || '';

    await database.runAsync(
      `INSERT OR REPLACE INTO ingressos_local (id, sessaoId, tipo, valorPago, assento, filmeTitulo, salaNumero, horarioSessao, sincronizado)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [ingresso.id, ingresso.sessaoId, ingresso.tipo, ingresso.valorPago, ingresso.assento, filmeTitulo, salaNumero, horarioSessao]
    );
  }
}

export async function getIngressosOffline(): Promise<(Ingresso & { filmeTitulo?: string; salaNumero?: number; horarioSessao?: string })[]> {
  const database = await getDatabase();
  const rows: any[] = await database.getAllAsync('SELECT * FROM ingressos_local ORDER BY dataCompra DESC');

  return rows.map((row: any) => ({
    id: row.id,
    sessaoId: row.sessaoId,
    tipo: row.tipo,
    valorPago: row.valorPago,
    assento: row.assento,
    filmeTitulo: row.filmeTitulo,
    salaNumero: row.salaNumero,
    horarioSessao: row.horarioSessao,
  }));
}

export async function removeIngressoOffline(id: number) {
  const database = await getDatabase();
  await database.runAsync('DELETE FROM ingressos_local WHERE id = ?', [id]);
}

export async function syncIngressosFromApi(ingressos: Ingresso[]) {
  await saveIngressosOffline(ingressos);
}

export async function clearAllOfflineData() {
  const database = await getDatabase();
  await database.execAsync('DELETE FROM ingressos_local');
}