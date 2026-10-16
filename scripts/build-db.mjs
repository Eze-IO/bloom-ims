// Builds public/bloom.sqlite from db/schema.sql and the sample data in db/seed.js.
// Run with: npm run db:build
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import initSqlJs from "sql.js";
import SEED from "../db/seed.js";

const root = fileURLToPath(new URL("..", import.meta.url));
const SQL = await initSqlJs();
const db = new SQL.Database();

db.run(readFileSync(root + "db/schema.sql", "utf8"));

// Load with foreign keys off: the generated sample data has some references to rows that don't exist.
db.run("PRAGMA foreign_keys = OFF");
db.run("BEGIN");
for (const [table, rows] of Object.entries(SEED)) {
  for (const row of rows) {
    const cols = Object.keys(row);
    db.run(
      `INSERT INTO ${table} (${cols.join(", ")}) VALUES (${cols.map(() => "?").join(", ")})`,
      cols.map((c) => row[c] ?? null),
    );
  }
}

const USERS = [
  ["dana@bloom.example", "Dana Whitfield", "admin", 1],
  ["marco@bloom.example", "Marco Ilves", "editor", 1],
  ["priya@bloom.example", "Priya Nandakumar", "editor", 1],
  ["sam@bloom.example", "Sam Okafor", "viewer", 0],
];
for (const u of USERS) db.run("INSERT INTO app_user (email, name, role, confirmed) VALUES (?, ?, ?, ?)", u);

// Clear dangling references so foreign keys can be enforced from here on.
const rows = (sql) => { const r = db.exec(sql)[0]; return r ? r.values : []; };
const cleared = {};
for (const [table, rowid, , fkid] of rows("PRAGMA foreign_key_check")) {
  const col = rows(`PRAGMA foreign_key_list(${table})`).find((fk) => fk[0] === fkid)[3];
  db.run(`UPDATE ${table} SET ${col} = NULL WHERE rowid = ?`, [rowid]);
  cleared[`${table}.${col}`] = (cleared[`${table}.${col}`] || 0) + 1;
}
db.run("COMMIT");

db.run("PRAGMA foreign_keys = ON");
const leftover = rows("PRAGMA foreign_key_check");
const integrity = rows("PRAGMA integrity_check")[0][0];
if (leftover.length || integrity !== "ok") throw new Error(`Database check failed: ${leftover.length} FK problems, integrity ${integrity}`);
db.run("VACUUM");

const out = root + "public/bloom.sqlite";
writeFileSync(out, Buffer.from(db.export()));

console.log("Cleared dangling references:", cleared);
for (const [t] of rows("SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name")) {
  console.log(`  ${t.padEnd(20)} ${rows(`SELECT COUNT(*) FROM ${t}`)[0][0]} rows`);
}
console.log("Wrote", out);
