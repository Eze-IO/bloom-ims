// Opens bloom.sqlite in the browser with sql.js (SQLite compiled to WebAssembly).
// GitHub Pages can't accept writes, so the edited database is saved in this browser's IndexedDB.
import initSqlJs from "sql.js";
import wasmUrl from "sql.js/dist/sql-wasm.wasm?url";

const DB_FILE = `${import.meta.env.BASE_URL}bloom.sqlite`;
const IDB_NAME = "bloom-ims";
const IDB_STORE = "files";
const IDB_KEY = "bloom.sqlite";

// ---------- IndexedDB (best effort: private windows may block it) ----------
function idb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(IDB_STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
async function idbDo(mode, fn) {
  try {
    const conn = await idb();
    return await new Promise((resolve, reject) => {
      const tx = conn.transaction(IDB_STORE, mode);
      const req = fn(tx.objectStore(IDB_STORE));
      tx.oncomplete = () => resolve(req.result);
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    return undefined;
  }
}
const loadSaved = () => idbDo("readonly", (s) => s.get(IDB_KEY));
const save = (bytes) => idbDo("readwrite", (s) => s.put(bytes, IDB_KEY));
const clearSaved = () => idbDo("readwrite", (s) => s.delete(IDB_KEY));

// ---------- Database ----------
let SQL;
async function fetchOriginal() {
  const res = await fetch(DB_FILE);
  if (!res.ok) throw new Error(`Couldn't load ${DB_FILE} (${res.status})`);
  return new Uint8Array(await res.arrayBuffer());
}

function open(bytes) {
  const db = new SQL.Database(bytes);
  db.run("PRAGMA foreign_keys = ON");
  return db;
}

/** Opens the saved copy from this browser if there is one, otherwise the published bloom.sqlite. */
export async function openDatabase() {
  SQL ??= await initSqlJs({ locateFile: () => wasmUrl });
  const saved = await loadSaved();
  return open(saved || (await fetchOriginal()));
}

/** Throws away this browser's changes and reopens the published file. */
export async function resetDatabase() {
  await clearSaved();
  return open(await fetchOriginal());
}

/** Runs a SELECT and returns plain objects. */
export function query(db, sql, params = []) {
  const stmt = db.prepare(sql);
  try {
    stmt.bind(params);
    const out = [];
    while (stmt.step()) out.push(stmt.getAsObject());
    return out;
  } finally {
    stmt.free();
  }
}

/** Saves the current database to IndexedDB. */
export function persist(db) {
  const bytes = db.export();
  db.run("PRAGMA foreign_keys = ON"); // export() can reset connection pragmas
  return save(bytes);
}

export function download(db, filename = "bloom.sqlite") {
  const bytes = db.export();
  db.run("PRAGMA foreign_keys = ON");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([bytes], { type: "application/vnd.sqlite3" }));
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

/** Turns SQLite constraint errors into sentences people can act on. */
export function explainError(err) {
  const msg = String(err?.message || err);
  const RULES = {
    chk_quantity: "A lot can hold at most 2,000 MT.",
    chk_validDateInventory: "The release date must come after the received date.",
    chk_validDateLc: "Arrival (ETA) must be after sailing (ETS).",
    chk_pnl: "P&L must equal sale minus purchase.",
    chk_gross: "Gross must equal P&L minus fees.",
  };
  for (const [name, text] of Object.entries(RULES)) if (msg.includes(name)) return text;
  if (msg.includes("FOREIGN KEY")) return "Other records still point to this one, or it points to a record that doesn't exist.";
  if (msg.includes("NOT NULL")) return `A required field is empty (${msg.split(":").pop().trim()}).`;
  if (msg.includes("UNIQUE")) return "A record with that key already exists.";
  return msg;
}
