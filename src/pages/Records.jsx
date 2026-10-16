import { useMemo, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { useStore } from "../store.jsx";
import { ENTITIES, ENTITY, label } from "../lib/schema.js";
import { PageHead } from "../components/Layout.jsx";
import DataTable from "../components/DataTable.jsx";
import RecordForm from "../components/RecordForm.jsx";

export default function Records() {
  const { table } = useParams();
  const ent = ENTITY[table] || ENTITY.contract;
  const { db, canEdit } = useStore();
  const [search, setSearch] = useState({});
  const [sorts, setSorts] = useState({});
  const [editing, setEditing] = useState(null); // null | "new" | row

  const q = search[ent.id] || "";
  const sort = sorts[ent.id];

  const rows = useMemo(() => {
    const text = (c, r) => String(c.t === "ref" ? label(db, c.ref, r[c.k]) ?? "" : r[c.k] ?? "").toLowerCase();
    let out = db[ent.id];
    const needle = q.trim().toLowerCase();
    if (needle) out = out.filter((r) => ent.cols.some((c) => text(c, r).includes(needle)));
    if (sort) {
      const col = ent.cols.find((c) => c.k === sort.k);
      const val = (r) => (col.t === "ref" ? text(col, r) : typeof r[col.k] === "string" ? r[col.k].toLowerCase() : r[col.k] ?? -Infinity);
      out = [...out].sort((a, b) => { const x = val(a), y = val(b); return x < y ? -sort.dir : x > y ? sort.dir : 0; });
    }
    return out;
  }, [db, ent, q, sort]);

  const onSort = (k) => setSorts((s) => ({ ...s, [ent.id]: { k, dir: s[ent.id]?.k === k ? -s[ent.id].dir : 1 } }));

  return (
    <>
      <PageHead title="Records" subtitle={`Every table from the original database. Click a row to ${canEdit ? "edit it" : "see its details"}.`} />
      <nav className="tabs" aria-label="Tables">
        {ENTITIES.map((e) => (
          <NavLink key={e.id} to={`/records/${e.id}`} className={e === ent ? "active" : ""}>{e.title}</NavLink>
        ))}
      </nav>
      <section className="card">
        <div className="toolbar">
          <div className="count">
            <strong style={{ color: "var(--text)" }}>{ent.title}</strong> · {ent.desc} ({rows.length} of {db[ent.id].length})
          </div>
          <input type="search" placeholder={`Search ${ent.title.toLowerCase()}…`} aria-label="Search" value={q}
            onChange={(e) => setSearch((s) => ({ ...s, [ent.id]: e.target.value }))} />
          {canEdit
            ? <button className="primary" onClick={() => setEditing("new")}>+ Add</button>
            : <span className="pill">Read-only role</span>}
        </div>
        <div className="table-wrap">
          <DataTable ent={ent} rows={rows} sort={sort} onSort={onSort} onOpen={setEditing} />
        </div>
      </section>
      {editing && (
        <RecordForm key={ent.id} ent={ent} row={editing === "new" ? null : editing} onClose={() => setEditing(null)} />
      )}
    </>
  );
}
