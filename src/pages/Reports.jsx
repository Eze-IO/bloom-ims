import { NavLink, useParams } from "react-router-dom";
import { useStore } from "../store.jsx";
import { find, label } from "../lib/schema.js";
import { Signed, money, qty } from "../lib/format.jsx";
import { PageHead } from "../components/Layout.jsx";

function groupSum(rows, keyFn, fields) {
  const m = new Map();
  for (const r of rows) {
    const k = keyFn(r);
    const g = m.get(k) || { key: k, count: 0, ...Object.fromEntries(fields.map((f) => [f, 0])) };
    g.count++;
    fields.forEach((f) => { g[f] += +r[f] || 0; });
    m.set(k, g);
  }
  return [...m.values()];
}

// Column kinds: "$" money, "±" signed money, "q" quantity, "n" count, undefined = text.
const REPORTS = [
  { id: "pnl", title: "Profit by customer", desc: "Deal results grouped by the customer on each letter of credit.",
    run: (db) => groupSum(db.link, (l) => find(db, "lc", l.lc_id)?.customer || "No LC", ["purchase", "sale", "fees", "gross"]).sort((a, b) => b.gross - a.gross),
    cols: [["key", "Customer"], ["count", "Deals", "n"], ["purchase", "Purchases", "$"], ["sale", "Sales", "$"], ["fees", "Fees", "$"], ["gross", "Gross P&L", "±"]] },
  { id: "stock", title: "Stock by warehouse and product", desc: "Total quantity on hand for each product in each warehouse.",
    run: (db) => groupSum(db.inventory, (i) => `${label(db, "warehouse", i.warehouse_id) || "Unknown"}|${find(db, "product", i.product_id)?.grade || "Unknown"}`, ["quantity"])
      .map((g) => ({ ...g, wh: g.key.split("|")[0], grade: g.key.split("|")[1] }))
      .sort((a, b) => a.wh.localeCompare(b.wh) || b.quantity - a.quantity),
    cols: [["wh", "Warehouse"], ["grade", "Product"], ["count", "Lots", "n"], ["quantity", "Quantity (MT)", "q"]] },
  { id: "ports", title: "Shipments by destination", desc: "Bills of lading grouped by port of discharge.",
    run: (db) => {
      const arrived = db.bl_status.find((s) => s.bl_status_type === "arrived")?.bl_status_id;
      const rows = db.bl.map((b) => ({ ...b, atSea: b.bl_status_id != arrived ? 1 : 0, done: b.bl_status_id == arrived ? 1 : 0 }));
      return groupSum(rows, (b) => b.port_of_discharge || "Unknown", ["atSea", "done"]).sort((a, b) => b.count - a.count);
    },
    cols: [["key", "Port of discharge"], ["count", "Shipments", "n"], ["atSea", "At sea", "n"], ["done", "Arrived", "n"]] },
  { id: "agents", title: "Agent commissions by country", desc: "Commission totals for agents in each country.",
    run: (db) => groupSum(db.agent, (a) => a.agent_country || "Unknown", ["agent_commission"]).sort((a, b) => b.agent_commission - a.agent_commission),
    cols: [["key", "Country"], ["count", "Agents", "n"], ["agent_commission", "Commission", "$"]] },
  { id: "counterparties", title: "Contracts by counterparty", desc: "How many contracts each buyer or seller has, and how many are still open.",
    run: (db) => {
      const done = db.contract_status.find((s) => s.contract_status_desc === "complete")?.contract_status_id;
      const rows = db.contract.map((c) => ({ ...c, open: c.contract_status_id != done ? 1 : 0 }));
      return groupSum(rows, (c) => label(db, "counterparty", c.counterparty_id) || "Unknown", ["open"]).sort((a, b) => b.count - a.count);
    },
    cols: [["key", "Counterparty"], ["count", "Contracts", "n"], ["open", "Open", "n"]] },
];

function fmt(kind, v) {
  if (kind === "$") return money(v);
  if (kind === "±") return <Signed value={v} />;
  if (kind === "q") return qty(v);
  return v;
}

function downloadCsv(rep, rows) {
  const q = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const lines = [
    rep.cols.map(([, l]) => q(l)).join(","),
    ...rows.map((r) => rep.cols.map(([f, , k]) => (["$", "±", "q"].includes(k) ? (+r[f]).toFixed(2) : q(r[f]))).join(",")),
  ];
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([lines.join("\n")], { type: "text/csv" }));
  a.download = `bloom-${rep.id}.csv`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

export default function Reports() {
  const { report } = useParams();
  const { db } = useStore();
  const rep = REPORTS.find((r) => r.id === report) || REPORTS[0];
  const rows = rep.run(db);

  return (
    <>
      <PageHead title="Reports" subtitle="Summaries the trading desk used to ask for by email." />
      <nav className="tabs" aria-label="Reports">
        {REPORTS.map((r) => <NavLink key={r.id} to={`/reports/${r.id}`} className={r === rep ? "active" : ""}>{r.title}</NavLink>)}
      </nav>
      <section className="card">
        <div className="toolbar">
          <div className="count"><strong style={{ color: "var(--text)" }}>{rep.title}</strong> · {rep.desc}</div>
          <button onClick={() => downloadCsv(rep, rows)}>Download CSV</button>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr>{rep.cols.map(([f, l, k]) => <th key={f} className={k ? "num" : ""}>{l}</th>)}</tr></thead>
            <tbody>
              {rows.length ? rows.map((r) => (
                <tr key={r.key}>{rep.cols.map(([f, , k]) => <td key={f} className={k ? "num" : ""}>{fmt(k, r[f])}</td>)}</tr>
              )) : <tr><td className="empty" colSpan={rep.cols.length}>Nothing to report.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
