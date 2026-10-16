import { useStore } from "../store.jsx";
import { label } from "../lib/schema.js";
import { Signed, date, money, qty } from "../lib/format.jsx";

const numeric = (c) => ["money", "qty", "id"].includes(c.t);

function pillTone(l) {
  l = l.toLowerCase();
  if (/unpackaged|revised|incoming/.test(l)) return "warn";
  if (/complete|arrived|packaged|buyer/.test(l)) return "pos";
  return "";
}

function Cell({ col, row }) {
  const { db } = useStore();
  const v = row[col.k];
  const dash = <span className="muted">—</span>;
  switch (col.t) {
    case "ref": {
      if (v == null) return dash;
      const l = label(db, col.ref, v);
      if (!l) return <span className="muted" title="This record points to an ID that doesn't exist">#{v} missing</span>;
      return col.pill ? <span className={`pill ${pillTone(l)}`}>{l}</span> : l;
    }
    case "money": return col.signed ? <Signed value={v} /> : money(v);
    case "qty": return qty(v);
    case "date": case "datetime": return date(v);
    case "id": return <span className="muted">{v}</span>;
    default: return v == null || v === "" ? dash : v;
  }
}

/** Table of records. Pass `onSort` and `onOpen` to make headers sortable and rows clickable. */
export default function DataTable({ ent, rows, sort, onSort, onOpen }) {
  const open = (e, r) => {
    if (e.type === "click" || e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpen(r); }
  };
  return (
    <table>
      <thead>
        <tr>
          {ent.cols.map((c) => {
            const active = sort && sort.k === c.k;
            return (
              <th key={c.k} className={`${onSort ? "sortable" : ""} ${numeric(c) ? "num" : ""}`}
                aria-sort={onSort ? (active ? (sort.dir > 0 ? "ascending" : "descending") : "none") : undefined}
                onClick={onSort ? () => onSort(c.k) : undefined}>
                {c.l}{active ? (sort.dir > 0 ? " ↑" : " ↓") : ""}
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {rows.length ? rows.map((r) => (
          <tr key={r._rid} className={onOpen ? "clickable" : ""} tabIndex={onOpen ? 0 : undefined}
            onClick={onOpen ? (e) => open(e, r) : undefined} onKeyDown={onOpen ? (e) => open(e, r) : undefined}>
            {ent.cols.map((c) => <td key={c.k} className={numeric(c) ? "num" : ""}><Cell col={c} row={r} /></td>)}
          </tr>
        )) : (
          <tr><td className="empty" colSpan={ent.cols.length}>No matching records.</td></tr>
        )}
      </tbody>
    </table>
  );
}
