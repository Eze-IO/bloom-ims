import { useMemo } from "react";
import { NavLink, useParams } from "react-router-dom";
import { useStore } from "../store.jsx";
import { Signed, money, qty } from "../lib/format.jsx";
import { PageHead } from "../components/Layout.jsx";

// Each report is a SQL query against bloom.sqlite.
// Column kinds: "$" money, "±" signed money, "q" quantity, "n" count, undefined = text.
const REPORTS = [
  { id: "pnl", title: "Profit by customer", desc: "Deal results grouped by the customer on each letter of credit.",
    sql: `SELECT COALESCE(lc.customer, 'No LC')  AS customer,
       COUNT(*)                          AS deals,
       SUM(link.purchase)                AS purchases,
       SUM(link.sale)                    AS sales,
       SUM(COALESCE(link.fees, 0))       AS fees,
       SUM(link.gross)                   AS gross
FROM link
LEFT JOIN lc ON lc.lc_id = link.lc_id
GROUP BY customer
ORDER BY gross DESC;`,
    cols: [["customer", "Customer"], ["deals", "Deals", "n"], ["purchases", "Purchases", "$"], ["sales", "Sales", "$"], ["fees", "Fees", "$"], ["gross", "Gross P&L", "±"]] },
  { id: "stock", title: "Stock by warehouse and product", desc: "Total quantity on hand for each product in each warehouse.",
    sql: `SELECT w.location_desc   AS warehouse,
       p.grade           AS product,
       COUNT(*)          AS lots,
       SUM(i.quantity)   AS quantity
FROM inventory i
JOIN warehouse w ON w.warehouse_id = i.warehouse_id
JOIN product   p ON p.product_id   = i.product_id
GROUP BY warehouse, product
ORDER BY warehouse, quantity DESC;`,
    cols: [["warehouse", "Warehouse"], ["product", "Product"], ["lots", "Lots", "n"], ["quantity", "Quantity (MT)", "q"]] },
  { id: "ports", title: "Shipments by destination", desc: "Bills of lading grouped by port of discharge.",
    sql: `SELECT COALESCE(bl.port_of_discharge, 'Unknown')            AS port,
       COUNT(*)                                             AS shipments,
       SUM(COALESCE(s.bl_status_type, '') <> 'arrived')     AS at_sea,
       SUM(COALESCE(s.bl_status_type, '') = 'arrived')      AS arrived
FROM bl
LEFT JOIN bl_status s ON s.bl_status_id = bl.bl_status_id
GROUP BY port
ORDER BY shipments DESC;`,
    cols: [["port", "Port of discharge"], ["shipments", "Shipments", "n"], ["at_sea", "At sea", "n"], ["arrived", "Arrived", "n"]] },
  { id: "agents", title: "Agent commissions by country", desc: "Commission totals for agents in each country.",
    sql: `SELECT agent_country          AS country,
       COUNT(*)               AS agents,
       SUM(agent_commission)  AS commission
FROM agent
GROUP BY country
ORDER BY commission DESC;`,
    cols: [["country", "Country"], ["agents", "Agents", "n"], ["commission", "Commission", "$"]] },
  { id: "counterparties", title: "Contracts by counterparty", desc: "How many contracts each buyer or seller has, and how many are still open.",
    sql: `SELECT cp.counterparty_name                                         AS counterparty,
       COUNT(*)                                                     AS contracts,
       SUM(COALESCE(cs.contract_status_desc, '') <> 'complete')     AS open
FROM contract c
JOIN counterparty cp         ON cp.counterparty_id   = c.counterparty_id
LEFT JOIN contract_status cs ON cs.contract_status_id = c.contract_status_id
GROUP BY counterparty
ORDER BY contracts DESC, counterparty;`,
    cols: [["counterparty", "Counterparty"], ["contracts", "Contracts", "n"], ["open", "Open", "n"]] },
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
  const { db, query } = useStore();
  const rep = REPORTS.find((r) => r.id === report) || REPORTS[0];
  // `db` changes after every write, so reports re-run against the latest data.
  const rows = useMemo(() => query(rep.sql), [rep, db]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <PageHead title="Reports" subtitle="SQL queries run live against the SQLite database." />
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
              {rows.length ? rows.map((r, i) => (
                <tr key={i}>{rep.cols.map(([f, , k]) => <td key={f} className={k ? "num" : ""}>{fmt(k, r[f])}</td>)}</tr>
              )) : <tr><td className="empty" colSpan={rep.cols.length}>Nothing to report.</td></tr>}
            </tbody>
          </table>
        </div>
        <details className="sql">
          <summary>Show the SQL</summary>
          <pre><code>{rep.sql}</code></pre>
        </details>
      </section>
    </>
  );
}
