import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import SEED from "./data/seed.js";
import { KEYS, dependents } from "./lib/schema.js";

// All demo state lives in the browser. Storage access is wrapped because private windows can throw.
const DATA_KEY = "bloom-ims:data:v1";
const SESSION_KEY = "bloom-ims:session:v1";
const USERS_KEY = "bloom-ims:users:v1";

const load = (key) => { try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } };
const persist = (key, val) => { try { val == null ? localStorage.removeItem(key) : localStorage.setItem(key, JSON.stringify(val)); } catch { /* ignore */ } };

function freshData() {
  const d = structuredClone(SEED);
  let rid = 1;
  for (const rows of Object.values(d)) for (const r of rows) r._rid = rid++;
  d._nextRid = rid;
  return d;
}

const SEED_USERS = [
  { name: "Dana Whitfield", email: "dana@bloom.example", role: "admin", confirmed: true },
  { name: "Marco Ilves", email: "marco@bloom.example", role: "editor", confirmed: true },
  { name: "Priya Nandakumar", email: "priya@bloom.example", role: "editor", confirmed: true },
  { name: "Sam Okafor", email: "sam@bloom.example", role: "viewer", confirmed: false },
];

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [db, setDb] = useState(() => load(DATA_KEY) || freshData());
  const [session, setSession] = useState(() => load(SESSION_KEY));
  const [users, setUsers] = useState(() => load(USERS_KEY) || SEED_USERS);
  const [toastMsg, setToastMsg] = useState(null);
  const toastTimer = useRef();

  useEffect(() => persist(DATA_KEY, db), [db]);
  useEffect(() => persist(SESSION_KEY, session), [session]);
  useEffect(() => persist(USERS_KEY, users), [users]);

  const toast = useCallback((msg) => {
    setToastMsg(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(null), 2200);
  }, []);

  const value = useMemo(() => ({
    db, session, users, toast,
    canEdit: !!session && session.role !== "viewer",
    signIn: (role) => setSession({ role }),
    signOut: () => setSession(null),
    resetData: () => setDb(freshData()),
    setUsers,

    saveRecord(table, original, data, idKey) {
      setDb((d) => {
        if (original) return { ...d, [table]: d[table].map((r) => (r._rid === original._rid ? { ...r, ...data } : r)) };
        const rec = { ...data, _rid: d._nextRid };
        if (idKey) rec[idKey] = Math.max(0, ...d[table].map((r) => +r[idKey] || 0)) + 1;
        return { ...d, _nextRid: d._nextRid + 1, [table]: [...d[table], rec] };
      });
    },

    /** Deletes a row, following the original database's rules. Returns what happened. */
    deleteRecord(table, row) {
      const deps = dependents(db, table, row);
      const blocking = deps.filter((x) => !x.cascade);
      if (blocking.length) return { blocked: blocking };
      const casc = deps.find((x) => x.cascade);
      setDb((d) => {
        const next = { ...d, [table]: d[table].filter((r) => r._rid !== row._rid) };
        if (casc) next.contract = next.contract.filter((c) => c[casc.col] != row[KEYS[table]]);
        return next;
      });
      return { cascaded: casc ? casc.n : 0 };
    },
  }), [db, session, users, toast]);

  return (
    <StoreContext.Provider value={value}>
      {children}
      {toastMsg && <div className="toast" role="status">{toastMsg}</div>}
    </StoreContext.Provider>
  );
}

export const useStore = () => useContext(StoreContext);
