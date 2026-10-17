import { Link } from "react-router-dom";
import { useStore } from "../store.jsx";
import { ENTITY, find } from "../lib/schema.js";
import { Signed, qty } from "../lib/format.jsx";
import { PageHead } from "../components/Layout.jsx";
import DataTable from "../components/DataTable.jsx";
import { STACK_CHIPS } from "../lib/stack.js";

function Kpi({ label, value, sub }) {
  return (
    <div className="card kpi">
      <div className="label">{label}</div>
      <div className="value">{value}</div>
      <div className="sub">{sub}</div>
    </div>
  );
}

export default function Dashboard() {
  const { db } = useStore();

  const totalQty = db.inventory.reduce((s, r) => s + (+r.quantity || 0), 0);
  const complete = db.contract_status.find((s) => s.contract_status_desc === "complete");
  const open = db.contract.filter((c) => !complete || c.contract_status_id != complete.contract_status_id).length;
  const arrived = db.bl_status.find((s) => s.bl_status_type === "arrived");
  const atSea = db.bl.filter((b) => !arrived || b.bl_status_id != arrived.bl_status_id).length;
  const gross = db.link.reduce((s, r) => s + (+r.gross || 0), 0);

  const byWh = db.warehouse.map((w) => ({
    id: w._rid, name: w.location_desc,
    v: db.inventory.filter((i) => i.warehouse_id == w.warehouse_id).reduce((s, i) => s + (+i.quantity || 0), 0),
  }));
  const maxWh = Math.max(1, ...byWh.map((x) => x.v));

  const deals = db.link.map((l) => {
    const lc = find(db, "lc", l.lc_id);
    return { id: l._rid, name: `Deal ${l.link_id}${lc ? ` · ${lc.customer}` : ""}`, v: +l.gross || 0 };
  });
  const maxDeal = Math.max(1, ...deals.map((x) => Math.abs(x.v)));

  const recent = [...db.contract].sort((a, b) => (b.contract_date || "").localeCompare(a.contract_date || "")).slice(0, 6);

  return (
    <>
      <PageHead title="Dashboard" subtitle="Where everything stands right now." />
      <div className="grid kpis">
        <Kpi label="Inventory on hand" value={`${qty(totalQty)} MT`} sub={`${db.inventory.length} lots in ${db.warehouse.length} warehouses`} />
        <Kpi label="Open contracts" value={open} sub={`${db.contract.length - open} completed`} />
        <Kpi label="Shipments at sea" value={atSea} sub={`${db.bl.length - atSea} arrived`} />
        <Kpi label="Net deal P&L" value={<Signed value={gross} />} sub={`across ${db.link.length} deals, after fees`} />
      </div>

      <section className="card stack-note" style={{ marginTop: 16 }} aria-label="Technology">
        <span className="label">Under the hood</span>
        <ul className="chips">{STACK_CHIPS.map((c) => <li key={c}>{c}</li>)}</ul>
        <span className="muted" style={{ fontSize: 13 }}>Every number here comes from a SQLite database running in your browser.</span>
        <Link to="/about">How it's built →</Link>
      </section>

      <div className="grid two" style={{ marginTop: 16 }}>
        <section className="card">
          <div className="card-head"><h2>Inventory by warehouse</h2><Link to="/records/inventory">View lots</Link></div>
          <div className="bars">
            {byWh.map((x) => (
              <div className="bar-row" key={x.id}>
                <span>{x.name}</span>
                <div className="bar-track"><div className="bar-fill" style={{ width: `${(x.v / maxWh) * 100}%` }} /></div>
                <span className="num">{qty(x.v)} MT</span>
              </div>
            ))}
          </div>
        </section>
        <section className="card">
          <div className="card-head"><h2>Profit and loss by deal</h2><Link to="/records/link">View deals</Link></div>
          <div className="bars">
            {deals.map((x) => (
              <div className="bar-row" key={x.id}>
                <span title={x.name} style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{x.name}</span>
                <div className="diverge">
                  <div className="left"><div style={{ width: `${x.v < 0 ? (-x.v / maxDeal) * 100 : 0}%` }} /></div>
                  <div className="right"><div style={{ width: `${x.v > 0 ? (x.v / maxDeal) * 100 : 0}%` }} /></div>
                </div>
                <span className="num"><Signed value={x.v} /></span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="card" style={{ marginTop: 16 }}>
        <div className="card-head"><h2>Latest contracts</h2><Link to="/records/contract">All contracts</Link></div>
        <div className="table-wrap" style={{ marginTop: 12 }}><DataTable ent={ENTITY.contract} rows={recent} /></div>
      </section>
    </>
  );
}
