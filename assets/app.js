/* Harborline IMS — static demo of a polymer trading inventory system.
 * All data lives in the browser (localStorage); nothing is sent anywhere. */
(function () {
  "use strict";

  const REPO_URL = "https://github.com/";
  const STORE_KEY = "harborline-ims:data:v1";
  const SESSION_KEY = "harborline-ims:session:v1";

  // ---------- Storage (wrapped: private windows can throw) ----------
  const store = {
    get(key) { try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } },
    set(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* ignore */ } },
    del(key) { try { localStorage.removeItem(key); } catch { /* ignore */ } },
  };

  function freshData() {
    const d = JSON.parse(JSON.stringify(window.SEED));
    let rid = 1;
    for (const rows of Object.values(d)) for (const r of rows) r._rid = rid++;
    d._nextRid = rid;
    return d;
  }
  let db = store.get(STORE_KEY) || freshData();
  let session = store.get(SESSION_KEY);
  const save = () => store.set(STORE_KEY, db);

  // ---------- Formatting ----------
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const money = (n) => n == null || n === "" ? "—" : (n < 0 ? "−$" : "$") + Math.abs(+n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const qty = (n) => n == null || n === "" ? "—" : (+n).toLocaleString("en-US", { maximumFractionDigits: 2 });
  const date = (s) => {
    if (!s) return "—";
    const d = new Date(s.length <= 10 ? s + "T00:00" : s);
    return isNaN(d) ? esc(s) : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };
  const signed = (n) => `<span class="${n > 0 ? "pos" : n < 0 ? "neg" : ""}">${money(n)}</span>`;

  // ---------- Schema (mirrors the original SQL Server tables) ----------
  const LABELS = {
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
  const KEYS = {
    contract_type: "contract_type_id", contract_status: "contract_status_id", incoterms: "incoterms_id",
    bl_status: "bl_status_id", counterparty_type: "counterparty_type_id", inventory_status: "inventory_status_id",
    unit_measurement: "unit_measurement_id", product: "product_id", warehouse: "warehouse_id", trader: "trader_id",
    counterparty: "counterparty_id", agent: "agent_id", bl: "bl_id", link: "link_id", payment_terms: "payment_terms_id",
    lc: "lc_id", trucker: "trucker_id", inventory: "inventory_id", contract: "contract_id",
  };
  const find = (table, id) => id == null ? null : db[table].find((r) => r[KEYS[table]] == id);
  const label = (table, id) => { const r = find(table, id); return r ? LABELS[table](r) : null; };

  const ENTITIES = [
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
    compute: (r) => { r.pnl = (r.sale || 0) - (r.purchase || 0); r.gross = r.pnl - (r.fees || 0); } },
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
  const ENTITY = Object.fromEntries(ENTITIES.map((e) => [e.id, e]));

  // The original database used triggers to delete contracts when one of these parents was deleted.
  const CASCADE_TO_CONTRACT = ["agent", "bl", "incoterms", "counterparty", "link", "payment_terms"];

  function dependents(table, row) {
    const key = KEYS[table];
    if (!key) return [];
    const out = [];
    for (const e of ENTITIES) {
      for (const c of e.cols) {
        if (c.ref !== table) continue;
        const n = db[e.id].filter((r) => r[c.k] == row[key]).length;
        if (n) out.push({ table: e.id, n, cascade: e.id === "contract" && CASCADE_TO_CONTRACT.includes(table), col: c.k });
      }
    }
    return out;
  }

  // ---------- Roles ----------
  const ROLES = {
    admin: { name: "Administrator", who: "Dana Whitfield", desc: "Full access, including user management." },
    editor: { name: "Editor", who: "Marco Ilves", desc: "Can add, edit and delete records." },
    viewer: { name: "Viewer", who: "Guest", desc: "Read-only. Good for a quick look around." },
  };
  const canEdit = () => session && session.role !== "viewer";

  // ---------- Icons ----------
  const ICON = {
    dashboard: '<path d="M3 13h8V3H3zm10 8h8V11h-8zM3 21h8v-6H3zm10-18v6h8V3z" fill="currentColor"/>',
    records: '<path d="M4 4h16v4H4zm0 6h16v4H4zm0 6h16v4H4z" fill="none" stroke="currentColor" stroke-width="2"/>',
    workflow: '<path d="M5 3v6m0 6v6M5 9a3 3 0 100 6 3 3 0 000-6zm14-6v18M8 12h11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    reports: '<path d="M4 20V10m6 10V4m6 16v-7m4 7H2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    users: '<path d="M16 19v-1a4 4 0 00-4-4H6a4 4 0 00-4 4v1M9 10a3 3 0 100-6 3 3 0 000 6zm13 9v-1a4 4 0 00-3-3.9M16 4.1a3 3 0 010 5.8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    about: '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 11v6m0-10v.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  };
  const icon = (n) => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICON[n]}</svg>`;
  const LOGO = '<svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="8" fill="#22b8cf"/><path d="M6 20c3 0 3-2 5-2s2 2 5 2 3-2 5-2 2 2 5 2M6 25c3 0 3-2 5-2s2 2 5 2 3-2 5-2 2 2 5 2M10 15V7h3v4h6V7h3v8" fill="none" stroke="#04161c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  // ---------- Router ----------
  const root = document.getElementById("root");
  const ui = { sort: {}, q: {} };

  function route() {
    const parts = location.hash.replace(/^#\/?/, "").split("/");
    return { page: parts[0] || "dashboard", arg: parts[1] };
  }

  function render() {
    if (!session) return renderLogin();
    const { page, arg } = route();
    const pages = { dashboard: pageDashboard, records: pageRecords, workflow: pageWorkflow, reports: pageReports, users: pageUsers, about: pageAbout };
    const fn = pages[page] || pageDashboard;
    root.innerHTML = shell(page, fn(arg));
    bindShell();
    if (fn.bind) fn.bind(arg);
  }

  function shell(page, content) {
    const nav = [
      ["dashboard", "Dashboard"], ["records", "Records"], ["workflow", "Deal workflow"],
      ["reports", "Reports"], ["users", "Users"], ["about", "About this project"],
    ].map(([id, l]) => `<a href="#/${id}" class="${page === id ? "active" : ""}">${icon(id)}${l}</a>`).join("");
    const role = ROLES[session.role];
    return `
      <div class="app" id="app">
        <aside class="sidebar" aria-label="Main navigation">
          <div class="brand">${LOGO}<div>Harborline IMS<small>POLYMER TRADING</small></div></div>
          <nav class="nav">${nav}</nav>
          <div class="spacer"></div>
          <div class="whoami"><strong>${esc(role.who)}</strong>${role.name}<br>
            <button class="ghost" data-act="logout" style="color:inherit;padding-left:0">Switch role →</button></div>
        </aside>
        <div>
          <div class="mobile-bar"><button data-act="nav" aria-label="Open menu">☰</button>Harborline IMS</div>
          <main class="main">
            <div class="banner">Demo mode: all data is fictional and your changes stay in this browser.
              <button data-act="reset">Reset demo data</button></div>
            ${content}
          </main>
        </div>
      </div>`;
  }

  function bindShell() {
    root.querySelector('[data-act="logout"]').onclick = () => { session = null; store.del(SESSION_KEY); location.hash = ""; render(); };
    root.querySelector('[data-act="reset"]').onclick = () => {
      if (!confirm("Put all demo data back the way it started?")) return;
      db = freshData(); save(); render(); toast("Demo data reset");
    };
    const app = root.querySelector("#app");
    root.querySelector('[data-act="nav"]').onclick = () => app.classList.toggle("nav-open");
    root.querySelectorAll(".nav a").forEach((a) => a.addEventListener("click", () => app.classList.remove("nav-open")));
  }

  function toast(msg) {
    const t = document.createElement("div");
    t.className = "toast"; t.textContent = msg; t.setAttribute("role", "status");
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2200);
  }

  // ---------- Login ----------
  function renderLogin() {
    root.innerHTML = `
      <div class="login">
        <section class="login-art">
          <div class="brand" style="padding:0">${LOGO}<div>Harborline IMS<small>POLYMER TRADING</small></div></div>
          <div>
            <h1>From warehouse to vessel, in one place.</h1>
            <p>An inventory management system for a plastics trading desk. It tracks product lots, contracts,
              ocean shipments, letters of credit and profit per deal.</p>
          </div>
          <p style="font-size:12px">Portfolio demo · originally built on AWS with Angular, .NET Lambda functions and SQL Server.</p>
        </section>
        <section class="login-form">
          <form class="card" id="login">
            <div><h2>Try the demo</h2><p class="muted" style="margin:4px 0 0">No sign-up needed. Pick a role to see what each kind of user can do.</p></div>
            <div class="roles" role="radiogroup" aria-label="Role">
              ${Object.entries(ROLES).map(([id, r], i) => `
                <label class="role"><input type="radio" name="role" value="${id}" ${i === 0 ? "checked" : ""}>
                  <div><strong>${r.name}</strong><span>${r.desc}</span></div></label>`).join("")}
            </div>
            <button class="primary" type="submit" style="justify-content:center">Enter demo</button>
          </form>
        </section>
      </div>`;
    root.querySelector("#login").onsubmit = (e) => {
      e.preventDefault();
      session = { role: new FormData(e.target).get("role") };
      store.set(SESSION_KEY, session);
      if (!location.hash || location.hash === "#/") location.hash = "#/dashboard"; else render();
    };
  }

  // ---------- Dashboard ----------
  function pageDashboard() {
    const totalQty = db.inventory.reduce((s, r) => s + (+r.quantity || 0), 0);
    const complete = db.contract_status.find((s) => s.contract_status_desc === "complete");
    const open = db.contract.filter((c) => !complete || c.contract_status_id != complete.contract_status_id).length;
    const arrived = db.bl_status.find((s) => s.bl_status_type === "arrived");
    const transit = db.bl.filter((b) => !arrived || b.bl_status_id != arrived.bl_status_id).length;
    const gross = db.link.reduce((s, r) => s + (+r.gross || 0), 0);

    const byWh = db.warehouse.map((w) => ({ name: w.location_desc, v: db.inventory.filter((i) => i.warehouse_id == w.warehouse_id).reduce((s, i) => s + (+i.quantity || 0), 0) }));
    const maxWh = Math.max(1, ...byWh.map((x) => x.v));

    const deals = db.link.map((l) => ({ name: label("lc", l.lc_id) ? `${label("link", l.link_id)} · ${find("lc", l.lc_id).customer}` : label("link", l.link_id), v: +l.gross || 0 }));
    const maxDeal = Math.max(1, ...deals.map((x) => Math.abs(x.v)));

    const recent = [...db.contract].sort((a, b) => (b.contract_date || "").localeCompare(a.contract_date || "")).slice(0, 6);

    return `
      <div class="page-head"><div><h1>Dashboard</h1><p>Where everything stands right now.</p></div></div>
      <div class="grid kpis">
        ${kpi("Inventory on hand", qty(totalQty) + " MT", `${db.inventory.length} lots in ${db.warehouse.length} warehouses`)}
        ${kpi("Open contracts", open, `${db.contract.length - open} completed`)}
        ${kpi("Shipments at sea", transit, `${db.bl.length - transit} arrived`)}
        ${kpi("Net deal P&L", signed(gross), `across ${db.link.length} deals, after fees`)}
      </div>
      <div class="grid two" style="margin-top:16px">
        <section class="card"><div class="card-head"><h2>Inventory by warehouse</h2><a href="#/records/inventory">View lots</a></div>
          <div class="bars">${byWh.map((x) => `
            <div class="bar-row"><span>${esc(x.name)}</span>
              <div class="bar-track"><div class="bar-fill" style="width:${(x.v / maxWh) * 100}%"></div></div>
              <span class="num">${qty(x.v)} MT</span></div>`).join("")}</div></section>
        <section class="card"><div class="card-head"><h2>Profit and loss by deal</h2><a href="#/records/link">View deals</a></div>
          <div class="bars">${deals.map((x) => `
            <div class="bar-row"><span title="${esc(x.name)}" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(x.name)}</span>
              <div class="diverge"><div class="left"><div style="width:${x.v < 0 ? (-x.v / maxDeal) * 100 : 0}%"></div></div>
                <div class="right"><div style="width:${x.v > 0 ? (x.v / maxDeal) * 100 : 0}%"></div></div></div>
              <span class="num">${signed(x.v)}</span></div>`).join("")}</div></section>
      </div>
      <section class="card" style="margin-top:16px"><div class="card-head"><h2>Latest contracts</h2><a href="#/records/contract">All contracts</a></div>
        <div class="table-wrap" style="margin-top:12px">${table(ENTITY.contract, recent, { compact: true })}</div></section>`;
  }
  const kpi = (l, v, sub) => `<div class="card kpi"><div class="label">${l}</div><div class="value">${v}</div><div class="sub">${sub}</div></div>`;

  // ---------- Records ----------
  function cell(col, row) {
    const v = row[col.k];
    switch (col.t) {
      case "ref": {
        const l = label(col.ref, v);
        if (v == null) return '<span class="muted">—</span>';
        if (!l) return `<span class="muted" title="This record points to an ID that doesn't exist">#${esc(v)} missing</span>`;
        return col.pill ? `<span class="pill ${pillTone(l)}">${esc(l)}</span>` : esc(l);
      }
      case "money": return col.signed ? signed(v) : money(v);
      case "qty": return qty(v);
      case "date": case "datetime": return date(v);
      case "id": return `<span class="muted">${esc(v)}</span>`;
      default: return v == null || v === "" ? '<span class="muted">—</span>' : esc(v);
    }
  }
  function pillTone(l) {
    l = l.toLowerCase();
    if (/complete|arrived|packaged|buyer/.test(l) && !/unpackaged/.test(l)) return "pos";
    if (/revised|incoming|unpackaged/.test(l)) return "warn";
    return "";
  }
  const numeric = (c) => ["money", "qty", "id"].includes(c.t);

  function table(ent, rows, opts = {}) {
    const sort = ui.sort[ent.id] || {};
    const head = ent.cols.map((c) => `<th class="${opts.compact ? "" : "sortable"} ${numeric(c) ? "num" : ""}" data-sort="${c.k}" ${!opts.compact ? `aria-sort="${sort.k === c.k ? (sort.dir > 0 ? "ascending" : "descending") : "none"}"` : ""}>${c.l}${sort.k === c.k && !opts.compact ? (sort.dir > 0 ? " ↑" : " ↓") : ""}</th>`).join("");
    const body = rows.length
      ? rows.map((r) => `<tr class="${opts.compact ? "" : "clickable"}" data-rid="${r._rid}" ${opts.compact ? "" : 'tabindex="0"'}>${ent.cols.map((c) => `<td class="${numeric(c) ? "num" : ""}">${cell(c, r)}</td>`).join("")}</tr>`).join("")
      : `<tr><td class="empty" colspan="${ent.cols.length}">No matching records.</td></tr>`;
    return `<table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`;
  }

  function sortValue(col, row) {
    const v = row[col.k];
    if (col.t === "ref") return (label(col.ref, v) || "").toLowerCase();
    if (typeof v === "string") return v.toLowerCase();
    return v ?? -Infinity;
  }

  function visibleRows(ent) {
    const q = (ui.q[ent.id] || "").trim().toLowerCase();
    let rows = db[ent.id];
    if (q) rows = rows.filter((r) => ent.cols.some((c) => String(c.t === "ref" ? label(c.ref, r[c.k]) ?? "" : r[c.k] ?? "").toLowerCase().includes(q)));
    const s = ui.sort[ent.id];
    if (s) {
      const col = ent.cols.find((c) => c.k === s.k);
      rows = [...rows].sort((a, b) => { const x = sortValue(col, a), y = sortValue(col, b); return x < y ? -s.dir : x > y ? s.dir : 0; });
    }
    return rows;
  }

  function pageRecords(arg) {
    const ent = ENTITY[arg] || ENTITY.contract;
    const rows = visibleRows(ent);
    return `
      <div class="page-head"><div><h1>Records</h1><p>Every table from the original database. Click a row to ${canEdit() ? "edit it" : "see its details"}.</p></div></div>
      <nav class="tabs" aria-label="Tables">${ENTITIES.map((e) => `<a href="#/records/${e.id}" class="${e === ent ? "active" : ""}">${e.title}</a>`).join("")}</nav>
      <section class="card">
        <div class="toolbar">
          <div class="count"><strong style="color:var(--text)">${ent.title}</strong> · ${ent.desc} <span>(${rows.length} of ${db[ent.id].length})</span></div>
          <input type="search" id="q" placeholder="Search ${ent.title.toLowerCase()}…" value="${esc(ui.q[ent.id] || "")}" aria-label="Search">
          ${canEdit() ? `<button class="primary" id="add">+ Add</button>` : `<span class="pill">Read-only role</span>`}
        </div>
        <div class="table-wrap" id="tbl">${table(ent, rows)}</div>
      </section>`;
  }
  pageRecords.bind = (arg) => {
    const ent = ENTITY[arg] || ENTITY.contract;
    const q = root.querySelector("#q");
    q.oninput = () => {
      ui.q[ent.id] = q.value;
      root.querySelector("#tbl").innerHTML = table(ent, visibleRows(ent));
      root.querySelector(".toolbar .count span").textContent = `(${visibleRows(ent).length} of ${db[ent.id].length})`;
    };
    root.querySelector("#tbl").onclick = (e) => {
      const th = e.target.closest("th[data-sort]");
      if (th) {
        const cur = ui.sort[ent.id];
        ui.sort[ent.id] = { k: th.dataset.sort, dir: cur && cur.k === th.dataset.sort ? -cur.dir : 1 };
        root.querySelector("#tbl").innerHTML = table(ent, visibleRows(ent));
        return;
      }
      const tr = e.target.closest("tr[data-rid]");
      if (tr) openForm(ent, db[ent.id].find((r) => r._rid == tr.dataset.rid));
    };
    root.querySelector("#tbl").onkeydown = (e) => {
      const tr = e.target.closest("tr[data-rid]");
      if (tr && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); openForm(ent, db[ent.id].find((r) => r._rid == tr.dataset.rid)); }
    };
    const add = root.querySelector("#add");
    if (add) add.onclick = () => openForm(ent, null);
  };

  function inputFor(col, row, ro) {
    const v = row ? row[col.k] : null;
    const dis = ro || col.calc ? "disabled" : "";
    if (col.t === "ref") {
      const opts = db[col.ref].map((r) => `<option value="${r[KEYS[col.ref]]}" ${r[KEYS[col.ref]] == v ? "selected" : ""}>${esc(LABELS[col.ref](r))}</option>`).join("");
      return `<select name="${col.k}" ${dis}><option value="">—</option>${opts}</select>`;
    }
    if (col.t === "money" || col.t === "qty") return `<input type="number" step="any" name="${col.k}" value="${v ?? ""}" ${dis}>`;
    if (col.t === "date") return `<input type="date" name="${col.k}" value="${esc(v ?? "")}" ${dis}>`;
    if (col.t === "datetime") return `<input type="datetime-local" name="${col.k}" value="${esc(v ?? "")}" ${dis}>`;
    return `<input type="text" name="${col.k}" value="${esc(v ?? "")}" ${dis}>`;
  }

  function openForm(ent, row) {
    const ro = !canEdit();
    const isNew = !row;
    const cols = ent.cols.filter((c) => c.t !== "id");
    const idCol = ent.cols.find((c) => c.t === "id");
    const title = isNew ? `New ${ent.title.toLowerCase().replace(/s$/, "")}` : `${ent.title.replace(/s$/, "")}${idCol ? " " + row[idCol.k] : ""}`;
    const ov = document.createElement("div");
    ov.className = "overlay";
    ov.innerHTML = `
      <form class="card modal" role="dialog" aria-modal="true" aria-label="${esc(title)}" novalidate>
        <header><h2>${esc(title)}</h2><button type="button" class="ghost" data-x aria-label="Close">✕</button></header>
        <div class="form-grid">${cols.map((c) => `
          <label class="field">${c.l}${c.req && !ro ? " *" : ""}${c.calc ? ' <span class="hint">(calculated)</span>' : ""}
            ${inputFor(c, row, ro)}
            ${c.hint && !ro ? `<span class="hint">${c.hint}</span>` : ""}<span class="err" data-err="${c.k}"></span></label>`).join("")}</div>
        <footer>
          ${!isNew && !ro ? `<button type="button" class="danger left" data-del>Delete</button>` : ""}
          <button type="button" data-x>${ro ? "Close" : "Cancel"}</button>
          ${ro ? "" : `<button type="submit" class="primary">${isNew ? "Add record" : "Save changes"}</button>`}
        </footer>
      </form>`;
    document.body.appendChild(ov);
    const form = ov.querySelector("form");
    const close = () => { ov.remove(); document.removeEventListener("keydown", onKey); };
    const onKey = (e) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    ov.addEventListener("click", (e) => { if (e.target === ov || e.target.closest("[data-x]")) close(); });
    (form.querySelector("input:not([disabled]),select:not([disabled])") || form.querySelector("[data-x]")).focus();

    if (ent.compute) form.addEventListener("input", () => {
      const tmp = readForm(form, cols); ent.compute(tmp);
      cols.filter((c) => c.calc).forEach((c) => { form.elements[c.k].value = tmp[c.k]; });
    });

    form.onsubmit = (e) => {
      e.preventDefault();
      const data = readForm(form, cols);
      if (ent.compute) ent.compute(data);
      const errs = {};
      cols.forEach((c) => { if (c.req && (data[c.k] == null || data[c.k] === "")) errs[c.k] = "Required."; });
      Object.assign(errs, ent.validate ? ent.validate(data) : {});
      form.querySelectorAll("[data-err]").forEach((el) => { el.textContent = errs[el.dataset.err] || ""; });
      if (Object.keys(errs).length) return;
      if (isNew) {
        const rec = { ...data, _rid: db._nextRid++ };
        if (idCol) rec[idCol.k] = Math.max(0, ...db[ent.id].map((r) => +r[idCol.k] || 0)) + 1;
        db[ent.id].push(rec);
      } else Object.assign(row, data);
      save(); close(); render(); toast(isNew ? "Record added" : "Changes saved");
    };

    const del = form.querySelector("[data-del]");
    if (del) del.onclick = () => {
      const deps = dependents(ent.id, row);
      const blocking = deps.filter((d) => !d.cascade);
      if (blocking.length) {
        alert(`This can't be deleted yet: ${blocking.map((d) => `${d.n} ${ENTITY[d.table].title.toLowerCase()}`).join(", ")} still point to it.\n\nThe original database's foreign keys would block this too.`);
        return;
      }
      const casc = deps.find((d) => d.cascade);
      const msg = casc
        ? `Delete this record and its ${casc.n} linked contract${casc.n > 1 ? "s" : ""}?\n\n(The original database did the same thing with a trigger.)`
        : "Delete this record?";
      if (!confirm(msg)) return;
      db[ent.id] = db[ent.id].filter((r) => r !== row);
      if (casc) db.contract = db.contract.filter((c) => c[casc.col] != row[KEYS[ent.id]]);
      save(); close(); render(); toast(casc ? `Deleted, plus ${casc.n} contract${casc.n > 1 ? "s" : ""}` : "Deleted");
    };
  }

  function readForm(form, cols) {
    const out = {};
    for (const c of cols) {
      const raw = form.elements[c.k].value;
      if (raw === "") out[c.k] = null;
      else if (c.t === "ref") out[c.k] = isNaN(+raw) ? raw : +raw;
      else if (c.t === "money" || c.t === "qty") out[c.k] = +raw;
      else out[c.k] = raw.trim();
    }
    return out;
  }

  // ---------- Reports ----------
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

  const REPORTS = [
    { id: "pnl", title: "Profit by customer", desc: "Deal results grouped by the customer on each letter of credit.",
      run: () => groupSum(db.link, (l) => (find("lc", l.lc_id) || {}).customer || "No LC", ["purchase", "sale", "fees", "gross"]).sort((a, b) => b.gross - a.gross),
      cols: [["key", "Customer"], ["count", "Deals", "n"], ["purchase", "Purchases", "$"], ["sale", "Sales", "$"], ["fees", "Fees", "$"], ["gross", "Gross P&L", "±"]] },
    { id: "stock", title: "Stock by warehouse and product", desc: "Total quantity on hand for each product in each warehouse.",
      run: () => groupSum(db.inventory, (i) => `${label("warehouse", i.warehouse_id) || "Unknown"}|${(find("product", i.product_id) || {}).grade || "Unknown"}`, ["quantity"])
        .map((g) => ({ ...g, wh: g.key.split("|")[0], grade: g.key.split("|")[1] })).sort((a, b) => a.wh.localeCompare(b.wh) || b.quantity - a.quantity),
      cols: [["wh", "Warehouse"], ["grade", "Product"], ["count", "Lots", "n"], ["quantity", "Quantity (MT)", "q"]] },
    { id: "ports", title: "Shipments by destination", desc: "Bills of lading grouped by port of discharge.",
      run: () => {
        const arrived = (db.bl_status.find((s) => s.bl_status_type === "arrived") || {}).bl_status_id;
        return groupSum(db.bl.map((b) => ({ ...b, atSea: b.bl_status_id != arrived ? 1 : 0, done: b.bl_status_id == arrived ? 1 : 0 })), (b) => b.port_of_discharge || "Unknown", ["atSea", "done"]).sort((a, b) => b.count - a.count);
      },
      cols: [["key", "Port of discharge"], ["count", "Shipments", "n"], ["atSea", "At sea", "n"], ["done", "Arrived", "n"]] },
    { id: "agents", title: "Agent commissions by country", desc: "Commission totals for agents in each country.",
      run: () => groupSum(db.agent, (a) => a.agent_country || "Unknown", ["agent_commission"]).sort((a, b) => b.agent_commission - a.agent_commission),
      cols: [["key", "Country"], ["count", "Agents", "n"], ["agent_commission", "Commission", "$"]] },
    { id: "counterparties", title: "Contracts by counterparty", desc: "How many contracts each buyer or seller has, and how many are still open.",
      run: () => {
        const done = (db.contract_status.find((s) => s.contract_status_desc === "complete") || {}).contract_status_id;
        return groupSum(db.contract.map((c) => ({ ...c, open: c.contract_status_id != done ? 1 : 0 })), (c) => label("counterparty", c.counterparty_id) || "Unknown", ["open"]).sort((a, b) => b.count - a.count);
      },
      cols: [["key", "Counterparty"], ["count", "Contracts", "n"], ["open", "Open", "n"]] },
  ];

  function fmtReport(kind, v) {
    if (kind === "$") return money(v);
    if (kind === "±") return signed(v);
    if (kind === "q") return qty(v);
    if (kind === "n") return esc(v);
    return esc(v);
  }

  function pageReports(arg) {
    const rep = REPORTS.find((r) => r.id === arg) || REPORTS[0];
    const rows = rep.run();
    return `
      <div class="page-head"><div><h1>Reports</h1><p>Summaries the trading desk used to ask for by email.</p></div></div>
      <nav class="tabs" aria-label="Reports">${REPORTS.map((r) => `<a href="#/reports/${r.id}" class="${r === rep ? "active" : ""}">${r.title}</a>`).join("")}</nav>
      <section class="card">
        <div class="toolbar"><div class="count"><strong style="color:var(--text)">${rep.title}</strong> · ${rep.desc}</div>
          <button id="csv">Download CSV</button></div>
        <div class="table-wrap"><table>
          <thead><tr>${rep.cols.map(([, l, k]) => `<th class="${k ? "num" : ""}">${l}</th>`).join("")}</tr></thead>
          <tbody>${rows.map((r) => `<tr>${rep.cols.map(([f, , k]) => `<td class="${k ? "num" : ""}">${fmtReport(k, r[f])}</td>`).join("")}</tr>`).join("") || `<tr><td class="empty" colspan="${rep.cols.length}">Nothing to report.</td></tr>`}</tbody>
        </table></div>
      </section>`;
  }
  pageReports.bind = (arg) => {
    const rep = REPORTS.find((r) => r.id === arg) || REPORTS[0];
    root.querySelector("#csv").onclick = () => {
      const rows = rep.run();
      const q = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
      const csv = [rep.cols.map(([, l]) => q(l)).join(","), ...rows.map((r) => rep.cols.map(([f, , k]) => (k === "$" || k === "±" || k === "q") ? (+r[f]).toFixed(2) : q(r[f])).join(","))].join("\n");
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
      a.download = `harborline-${rep.id}.csv`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    };
  };

  // ---------- Workflow ----------
  const FLOW = [
    { t: "Trader sends the deal", d: "A trader emails logistics with the deal: product, quantity, price and buyer." },
    { t: "Back-to-back or from inventory?", d: "Decide whether we are simply passing goods between a seller and a buyer, or selling our own stock.", decision: true,
      branch: "<strong>Back-to-back (B2B):</strong> we sit between the two counterparties. Wait for the seller's documents, prepare our own set and send it to the buyer." },
    { t: "Check stock", d: "Look up the product in Inventory. If we're short, tell the trader so they can buy more or adjust the deal.", decision: true, link: "#/records/inventory" },
    { t: "Agree the shipping date", d: "As soon as possible, or a specific month? Find a vessel booking that fits." , link: "#/records/bl" },
    { t: "Get the product ready", d: "If the lot isn't bagged and at the warehouse yet, ask the warehouse to package it.", link: "#/records/inventory_schedule" },
    { t: "Send shipping instructions", d: "Give the warehouse the booking and make sure they stick to the trucking schedule.", link: "#/records/schedule" },
    { t: "Document cutoff", d: "Five days before the estimated departure, finish the document cutoffs.", link: "#/records/lc" },
    { t: "Load the vessel", d: "When the truck arrives, make sure the container actually gets onto the ship." },
    { t: "Vessel sails, collect originals", d: "Wait for the original documents, then prepare and copy the full set." },
    { t: "Send documents to the buyer", d: "The buyer uses them to collect the cargo at the destination port." },
    { t: "Get paid", d: "Wait for payment under the agreed terms, then close the contract.", link: "#/records/payment_terms" },
  ];
  let flowAt = 0;
  function pageWorkflow() {
    return `
      <div class="page-head"><div><h1>Deal workflow</h1><p>The real process the logistics team followed, which this system was designed around. Step through it.</p></div>
        <div style="display:flex;gap:8px"><button id="prev">← Back</button><button class="primary" id="next">Next step →</button></div></div>
      <section class="card"><div class="flow">${FLOW.map((s, i) => `
        <div class="step ${i < flowAt ? "done" : ""} ${s.decision ? "decision" : ""}" ${i === flowAt ? 'aria-current="step"' : ""}>
          <div><div class="dot"><b>${i < flowAt ? "✓" : i + 1}</b></div>${i < FLOW.length - 1 ? '<div class="line"></div>' : ""}</div>
          <div class="body" style="${i > flowAt ? "opacity:.45" : ""}">
            <h3>${s.t}</h3><p>${s.d}</p>
            ${s.branch && i <= flowAt ? `<div class="branch">${s.branch}</div>` : ""}
            ${s.link && i <= flowAt ? `<p><a href="${s.link}">Open in Records →</a></p>` : ""}
          </div></div>`).join("")}</div></section>`;
  }
  pageWorkflow.bind = () => {
    root.querySelector("#next").onclick = () => { flowAt = Math.min(FLOW.length, flowAt + 1); render(); root.querySelector("#next").focus(); };
    root.querySelector("#prev").onclick = () => { flowAt = Math.max(0, flowAt - 1); render(); root.querySelector("#prev").focus(); };
  };

  // ---------- Users ----------
  const USERS_KEY = "harborline-ims:users:v1";
  const SEED_USERS = [
    { name: "Dana Whitfield", email: "dana@harborline.example", role: "admin", confirmed: true },
    { name: "Marco Ilves", email: "marco@harborline.example", role: "editor", confirmed: true },
    { name: "Priya Nandakumar", email: "priya@harborline.example", role: "editor", confirmed: true },
    { name: "Sam Okafor", email: "sam@harborline.example", role: "viewer", confirmed: false },
  ];
  let users = store.get(USERS_KEY) || SEED_USERS.map((u) => ({ ...u }));
  function pageUsers() {
    const admin = session.role === "admin";
    return `
      <div class="page-head"><div><h1>Users</h1><p>${admin ? "Change roles or remove people. In the original app this was backed by Amazon Cognito." : "Only administrators can manage users. Switch role to try it."}</p></div></div>
      <section class="card"><div class="table-wrap"><table>
        <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th>${admin ? "<th></th>" : ""}</tr></thead>
        <tbody>${users.map((u, i) => `<tr>
          <td>${esc(u.name)}</td><td class="muted">${esc(u.email)}</td>
          <td>${admin ? `<select data-role="${i}" aria-label="Role for ${esc(u.name)}" style="width:auto">${Object.entries(ROLES).map(([id, r]) => `<option value="${id}" ${u.role === id ? "selected" : ""}>${r.name}</option>`).join("")}</select>` : ROLES[u.role].name}</td>
          <td>${u.confirmed ? '<span class="pill pos">Confirmed</span>' : '<span class="pill warn">Invite pending</span>'}</td>
          ${admin ? `<td class="num">${u.confirmed ? "" : `<button data-confirm="${i}">Confirm</button> `}<button class="danger" data-remove="${i}">Remove</button></td>` : ""}
        </tr>`).join("")}</tbody></table></div></section>`;
  }
  pageUsers.bind = () => {
    const persist = (msg) => { store.set(USERS_KEY, users); render(); toast(msg); };
    root.querySelectorAll("[data-role]").forEach((s) => { s.onchange = () => { users[s.dataset.role].role = s.value; persist("Role updated"); }; });
    root.querySelectorAll("[data-confirm]").forEach((b) => { b.onclick = () => { users[b.dataset.confirm].confirmed = true; persist("User confirmed"); }; });
    root.querySelectorAll("[data-remove]").forEach((b) => { b.onclick = () => { if (confirm(`Remove ${users[b.dataset.remove].name}?`)) { users.splice(b.dataset.remove, 1); persist("User removed"); } }; });
  };

  // ---------- About ----------
  function pageAbout() {
    return `
      <div class="page-head"><div><h1>About this project</h1><p>What it is, how it was built, and what this demo changes.</p></div>
        <a class="btn primary" href="${REPO_URL}" target="_blank" rel="noopener">View the code on GitHub</a></div>
      <div class="grid two">
        <section class="card card-pad prose">
          <h2>The problem</h2>
          <p>A plastics trading desk was running its logistics on spreadsheets and email: which lots sat in which warehouse, which vessel each
            container was booked on, which letter of credit backed each sale, and whether each deal made money.</p>
          <h2 style="margin-top:16px">The original system (2020)</h2>
          <p>A cloud consulting team project, designed from the whiteboard up:</p>
          <ul>
            <li><strong>Angular</strong> front end on AWS Elastic Beanstalk, behind CloudFront and Route 53</li>
            <li><strong>Amazon Cognito</strong> for sign-up, confirmation and Administrator / Editor roles</li>
            <li><strong>API Gateway + AWS Lambda</strong> functions written in C# (.NET Core)</li>
            <li><strong>Microsoft SQL Server</strong> on RDS: 23 tables, foreign keys, check constraints and cascade-delete triggers</li>
            <li><strong>S3</strong> for configuration, profile pictures and database backups</li>
          </ul>
          <h2 style="margin-top:16px">This demo</h2>
          <p>The AWS stack has been retired, so this version recreates the app's screens as a static site that runs entirely in your browser
            with the same tables, sample data and database rules (quantity limits, date checks, and the cascade deletes the triggers performed).
            The company name and people are fictional.</p>
        </section>
        <section class="card card-pad prose">
          <h2>Original AWS architecture</h2>
          <p class="muted">Employees reach the app through Route 53. Lambda functions in a private subnet talk to SQL Server.</p>
          <img src="docs/aws-architecture.png" alt="AWS architecture: Route 53 to Elastic Beanstalk, Cognito, API Gateway, Lambda and SQL Server, with S3 backups and CloudFront" loading="lazy">
          <h2 style="margin-top:16px">Where it started</h2>
          <img src="docs/whiteboard-erd.jpg" alt="Whiteboard sketch of the database design with tables for contracts, inventory, warehouses and shipments" loading="lazy">
        </section>
      </div>`;
  }

  window.addEventListener("hashchange", render);
  render();
})();
