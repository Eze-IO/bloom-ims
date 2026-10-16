import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { download, explainError, openDatabase, persist, query, resetDatabase } from "./lib/sqlite.js";

// The data lives in a SQLite database (public/bloom.sqlite) opened in the browser.
// Only the chosen demo role is kept in localStorage.
const SESSION_KEY = "bloom-ims:session:v1";
const loadSession = () => { try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch { return null; } };
const saveSession = (s) => { try { s ? localStorage.setItem(SESSION_KEY, JSON.stringify(s)) : localStorage.removeItem(SESSION_KEY); } catch { /* ignore */ } };

// Identifiers can't be bound as parameters, so only names from the database's own catalog are used in SQL text.
const ident = (name) => {
  if (!/^[a-z_]+$/.test(name)) throw new Error(`Bad identifier: ${name}`);
  return name;
};

/** Reads every table into plain arrays. Each row gets `_rid` (its SQLite rowid). */
function snapshot(db) {
  const out = {};
  for (const { name } of query(db, "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%'")) {
    out[name] = query(db, `SELECT rowid AS _rid, * FROM ${ident(name)} ORDER BY rowid`);
  }
  return out;
}

// One shared open, so React StrictMode's double effects don't load the file twice.
let opening;

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const sqlite = useRef(null);
  const [data, setData] = useState(null); // snapshot of every table
  const [loadError, setLoadError] = useState(null);
  const [session, setSession] = useState(loadSession);
  const [toastMsg, setToastMsg] = useState(null);
  const toastTimer = useRef();

  useEffect(() => {
    opening ??= openDatabase();
    opening.then((db) => { sqlite.current = db; setData(snapshot(db)); }, (e) => setLoadError(String(e.message || e)));
  }, []);
  useEffect(() => saveSession(session), [session]);

  const toast = useCallback((msg) => {
    setToastMsg(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(null), 2200);
  }, []);

  /** Runs write statements in one transaction, then refreshes the snapshot and saves. Returns an error sentence or null. */
  const write = useCallback((statements) => {
    const db = sqlite.current;
    try {
      db.run("BEGIN");
      for (const [sql, params] of statements) db.run(sql, params);
      db.run("COMMIT");
    } catch (e) {
      try { db.run("ROLLBACK"); } catch { /* no open transaction */ }
      return explainError(e);
    }
    setData(snapshot(db));
    persist(db);
    return null;
  }, []);

  const value = useMemo(() => {
    const users = (data?.app_user || []).map((u) => ({ ...u, confirmed: !!u.confirmed }));
    return {
      ready: !!data,
      loadError,
      db: data,
      users,
      session,
      toast,
      canEdit: !!session && session.role !== "viewer",
      signIn: (role) => setSession({ role }),
      signOut: () => setSession(null),

      /** Runs a read-only query (used by reports). */
      query: (sql, params) => query(sqlite.current, sql, params),

      async resetData() {
        sqlite.current = await resetDatabase();
        opening = Promise.resolve(sqlite.current);
        setData(snapshot(sqlite.current));
      },

      downloadDb: () => download(sqlite.current),

      /** Inserts (original = null) or updates a row. Returns an error sentence or null. */
      saveRecord(table, original, values) {
        const cols = Object.keys(values).map(ident);
        const params = cols.map((c) => values[c] ?? null);
        const t = ident(table);
        return original
          ? write([[`UPDATE ${t} SET ${cols.map((c) => `${c} = ?`).join(", ")} WHERE rowid = ?`, [...params, original._rid]]])
          : write([[`INSERT INTO ${t} (${cols.join(", ")}) VALUES (${cols.map(() => "?").join(", ")})`, params]]);
      },

      /** Deletes a row. The database itself cascades to contracts or refuses if the row is still in use. */
      deleteRecord(table, row) {
        const before = query(sqlite.current, "SELECT COUNT(*) AS n FROM contract")[0].n;
        const error = write([[`DELETE FROM ${ident(table)} WHERE rowid = ?`, [row._rid]]]);
        if (error) return { error };
        const after = query(sqlite.current, "SELECT COUNT(*) AS n FROM contract")[0].n;
        return { cascaded: table === "contract" ? 0 : before - after };
      },

      updateUser: (email, patch) => {
        const cols = Object.keys(patch).map(ident);
        return write([[`UPDATE app_user SET ${cols.map((c) => `${c} = ?`).join(", ")} WHERE email = ?`,
          [...cols.map((c) => (typeof patch[c] === "boolean" ? +patch[c] : patch[c])), email]]]);
      },
      removeUser: (email) => write([["DELETE FROM app_user WHERE email = ?", [email]]]),
    };
  }, [data, loadError, session, toast, write]);

  return (
    <StoreContext.Provider value={value}>
      {children}
      {toastMsg && <div className="toast" role="status">{toastMsg}</div>}
    </StoreContext.Provider>
  );
}

export const useStore = () => useContext(StoreContext);
