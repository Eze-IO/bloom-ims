// Mirrors the original SQL Server tables, constraints and triggers.
import { date } from "./format.jsx";

export const KEYS = {
  contract_type: "contract_type_id", contract_status: "contract_status_id", incoterms: "incoterms_id",
  bl_status: "bl_status_id", counterparty_type: "counterparty_type_id", inventory_status: "inventory_status_id",
  unit_measurement: "unit_measurement_id", product: "product_id", warehouse: "warehouse_id", trader: "trader_id",
  counterparty: "counterparty_id", agent: "agent_id", bl: "bl_id", link: "link_id", payment_terms: "payment_terms_id",
  lc: "lc_id", trucker: "trucker_id", inventory: "inventory_id", contract: "contract_id",
};

export const LABELS = {
  contract_type: (r) => r.contract_type_desc,
  contract_status: (r) => r.contract_status_desc,
  incoterms: (r) => r.incoterms_type,
  bl_status: (r) => r.bl_status_type,
  counterparty_type: (r) => r.counterparty_type_desc,
  inventory_status: (r) => `${r.inventory_status_type} (${r.designation})`,
  unit_measurement: (r) => r.unit_measurement_desc.toUpperCase(),
  product: (r) => `${r.grade} · RC ${r.rc_number}`,
  warehouse: (r) => r.location_desc,
  trader: (r) => r.trader_name,
  counterparty: (r) => r.counterparty_name,
  agent: (r) => `Agent ${r.agent_id} · ${r.agent_country}`,
  bl: (r) => `${r.booking_number} · ${r.vessel}`,
  link: (r) => `Deal ${r.link_id}`,
  payment_terms: (r) => `${r.payment_terms_type} · ${date(r.shipment_date)}`,
  lc: (r) => r.lc_number,
  trucker: (r) => r.company,
  inventory: (r) => `Lot ${r.inventory_id}`,
};

export const find = (db, table, id) => (id == null ? null : db[table].find((r) => r[KEYS[table]] == id));
export const label = (db, table, id) => {
  const r = find(db, table, id);
  return r ? LABELS[table](r) : null;
};

export const ENTITIES = [
  { id: "contract", title: "Contracts", desc: "Purchase and sale agreements with counterparties.", cols: [
    { k: "contract_id", l: "#", t: "id" },
    { k: "contract_date", l: "Date", t: "datetime", req: true },
    { k: "contract_type_id", l: "Type", t: "ref", ref: "contract_type" },
    { k: "contract_status_id", l: "Status", t: "ref", ref: "contract_status", pill: true, req: true },
    { k: "counterparty_id", l: "Counterparty", t: "ref", ref: "counterparty", req: true },
    { k: "agent_id", l: "Agent", t: "ref", ref: "agent" },
    { k: "incoterms_id", l: "Incoterms", t: "ref", ref: "incoterms" },
    { k: "payment_terms_id", l: "Payment terms", t: "ref", ref: "payment_terms" },
    { k: "bl_id", l: "Bill of lading", t: "ref", ref: "bl" },
    { k: "link_id", l: "Deal", t: "ref", ref: "link" },
  ] },
  { id: "inventory", title: "Inventory", desc: "Product lots sitting in warehouses.", cols: [
    { k: "inventory_id", l: "Lot", t: "id" },
    { k: "product_id", l: "Product", t: "ref", ref: "product", req: true },
    { k: "warehouse_id", l: "Warehouse", t: "ref", ref: "warehouse", req: true },
    { k: "quantity", l: "Quantity (MT)", t: "qty", req: true, hint: "Max 2,000 MT per lot" },
    { k: "received_date", l: "Received", t: "datetime", req: true },
    { k: "release_date", l: "Release", t: "datetime", req: true, hint: "Must be after received" },
  ],
  validate: (r) => {
    const e = {};
    if (r.quantity > 2000) e.quantity = "A lot can hold at most 2,000 MT.";
    if (r.quantity != null && r.quantity <= 0) e.quantity = "Quantity must be positive.";
    if (r.received_date && r.release_date && r.received_date >= r.release_date) e.release_date = "Release must come after the received date.";
    return e;
  } },
  { id: "bl", title: "Bills of lading", desc: "Ocean shipments: vessel, booking and ports.", cols: [
    { k: "bl_id", l: "#", t: "id" },
    { k: "booking_number", l: "Booking", t: "text", req: true },
    { k: "vessel", l: "Vessel", t: "text", req: true },
    { k: "port_of_loading", l: "Loading port", t: "text" },
    { k: "port_of_discharge", l: "Discharge port", t: "text" },
    { k: "bl_date", l: "B/L date", t: "date" },
    { k: "bl_status_id", l: "Status", t: "ref", ref: "bl_status", pill: true, req: true },
  ] },
  { id: "lc", title: "Letters of credit", desc: "Bank guarantees backing each sale.", cols: [
    { k: "lc_id", l: "#", t: "id" },
    { k: "lc_number", l: "LC number", t: "text", req: true },
    { k: "customer", l: "Customer", t: "text", req: true },
    { k: "product", l: "Product", t: "text" },
    { k: "quantity", l: "Quantity", t: "qty" },
    { k: "unit_measurement_id", l: "Unit", t: "ref", ref: "unit_measurement" },
    { k: "lc_price", l: "Price", t: "money" },
    { k: "fee", l: "Fee", t: "money" },
    { k: "lc_date", l: "LC date", t: "date" },
    { k: "cutoff", l: "Doc cutoff", t: "date" },
    { k: "ets", l: "ETS", t: "date", hint: "Estimated time of sailing" },
    { k: "eta", l: "ETA", t: "date", hint: "Must be after ETS" },
    { k: "lc_location", l: "Destination", t: "text" },
  ],
  validate: (r) => (r.eta && r.ets && r.eta <= r.ets ? { eta: "Arrival (ETA) must be after sailing (ETS)." } : {}) },
  { id: "link", title: "Deal P&L", desc: "Links a purchase to a sale. P&L and gross are calculated for you.", cols: [
    { k: "link_id", l: "Deal", t: "id" },
    { k: "lc_id", l: "Letter of credit", t: "ref", ref: "lc" },
    { k: "purchase", l: "Purchase", t: "money", req: true },
    { k: "sale", l: "Sale", t: "money", req: true },
    { k: "fees", l: "Fees", t: "money" },
    { k: "pnl", l: "P&L", t: "money", calc: true, signed: true },
    { k: "gross", l: "Gross", t: "money", calc: true, signed: true },
  ],
  compute: (r) => ({ ...r, pnl: (r.sale || 0) - (r.purchase || 0), gross: (r.sale || 0) - (r.purchase || 0) - (r.fees || 0) }) },
  { id: "counterparty", title: "Counterparties", desc: "Buyers and sellers we trade with.", cols: [
    { k: "counterparty_id", l: "#", t: "id" },
    { k: "counterparty_name", l: "Name", t: "text", req: true },
    { k: "counterparty_type_id", l: "Role", t: "ref", ref: "counterparty_type", pill: true, req: true },
  ] },
  { id: "agent", title: "Agents", desc: "Local agents and their commissions.", cols: [
    { k: "agent_id", l: "#", t: "id" },
    { k: "agent_country", l: "Country", t: "text", req: true },
    { k: "agent_commission", l: "Commission", t: "money" },
  ] },
  { id: "payment_terms", title: "Payment terms", desc: "How and when buyers pay.", cols: [
    { k: "payment_terms_id", l: "#", t: "id" },
    { k: "payment_terms_type", l: "Terms", t: "text", req: true, hint: "e.g. 20/80, 30/70, 100, LC" },
    { k: "shipment_date", l: "Shipment date", t: "datetime" },
  ] },
  { id: "warehouse", title: "Warehouses", desc: "Storage locations and their rates.", cols: [
    { k: "warehouse_id", l: "#", t: "id" },
    { k: "location_desc", l: "Location", t: "text", req: true },
    { k: "warehouse_rate", l: "Rate / MT", t: "money" },
    { k: "unit_measurement_id", l: "Unit", t: "ref", ref: "unit_measurement" },
    { k: "trader_id", l: "Trader", t: "ref", ref: "trader" },
  ] },
  { id: "trucker", title: "Truckers", desc: "Trucking companies serving each warehouse.", cols: [
    { k: "trucker_id", l: "#", t: "id" },
    { k: "company", l: "Company", t: "text", req: true },
    { k: "rate", l: "Rate", t: "money" },
    { k: "warehouse_id", l: "Home warehouse", t: "ref", ref: "warehouse" },
  ] },
  { id: "schedule", title: "Truck schedule", desc: "Which truckers pick up at which warehouse.", cols: [
    { k: "trucker_id", l: "Trucker", t: "ref", ref: "trucker", req: true },
    { k: "warehouse_id", l: "Warehouse", t: "ref", ref: "warehouse", req: true },
  ] },
  { id: "inventory_schedule", title: "Inventory schedule", desc: "Packaging status of each lot.", cols: [
    { k: "inventory_id", l: "Lot", t: "ref", ref: "inventory", req: true },
    { k: "product_id", l: "Product", t: "ref", ref: "product" },
    { k: "inventory_status_id", l: "Status", t: "ref", ref: "inventory_status", pill: true },
  ] },
  { id: "contract_details", title: "Contract lines", desc: "Product, quantity and price lines.", cols: [
    { k: "contract_product", l: "Product", t: "text", req: true },
    { k: "contract_quantity", l: "Quantity", t: "qty" },
    { k: "unit_measurement_id", l: "Unit", t: "ref", ref: "unit_measurement" },
    { k: "contract_price", l: "Price", t: "money" },
  ] },
  { id: "product", title: "Products", desc: "Polymer grades we trade.", cols: [
    { k: "product_id", l: "#", t: "id" },
    { k: "grade", l: "Grade", t: "text", req: true },
    { k: "rc_number", l: "Railcar #", t: "qty" },
  ] },
];
export const ENTITY = Object.fromEntries(ENTITIES.map((e) => [e.id, e]));

// The original database used triggers to delete contracts when one of these parents was deleted.
const CASCADE_TO_CONTRACT = ["agent", "bl", "incoterms", "counterparty", "link", "payment_terms"];

/** Rows in other tables that point at `row`, and whether a trigger would cascade-delete them. */
export function dependents(db, table, row) {
  const key = KEYS[table];
  if (!key) return [];
  const out = [];
  for (const e of ENTITIES) {
    for (const c of e.cols) {
      if (c.ref !== table) continue;
      const n = db[e.id].filter((r) => r[c.k] == row[key]).length;
      if (n) out.push({ table: e.id, n, col: c.k, cascade: e.id === "contract" && CASCADE_TO_CONTRACT.includes(table) });
    }
  }
  return out;
}

export const ROLES = {
  admin: { name: "Administrator", who: "Dana Whitfield", desc: "Full access, including user management." },
  editor: { name: "Editor", who: "Marco Ilves", desc: "Can add, edit and delete records." },
  viewer: { name: "Viewer", who: "Guest", desc: "Read-only. Good for a quick look around." },
};
