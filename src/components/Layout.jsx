import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useStore } from "../store.jsx";
import { ROLES } from "../lib/schema.js";
import { Brand, Icon } from "./Icons.jsx";

const NAV = [
  ["dashboard", "Dashboard"],
  ["records", "Records"],
  ["workflow", "Deal workflow"],
  ["reports", "Reports"],
  ["users", "Users"],
  ["about", "About this project"],
];

export default function Layout() {
  const { session, signOut, resetData, downloadDb, toast } = useStore();
  const [navOpen, setNavOpen] = useState(false);
  const role = ROLES[session.role];

  const reset = async () => {
    if (!confirm("Put all demo data back the way it started?")) return;
    await resetData();
    toast("Demo data reset");
  };

  return (
    <div className={`app ${navOpen ? "nav-open" : ""}`}>
      <aside className="sidebar" aria-label="Main navigation">
        <Brand />
        <nav className="nav">
          {NAV.map(([id, l]) => (
            <NavLink key={id} to={`/${id}`} onClick={() => setNavOpen(false)}>
              <Icon name={id} />{l}
            </NavLink>
          ))}
        </nav>
        <div className="spacer" />
        <div className="whoami">
          <strong>{role.who}</strong>{role.name}<br />
          <button className="ghost" onClick={signOut} style={{ color: "inherit", paddingLeft: 0 }}>Switch role →</button>
        </div>
      </aside>
      <div>
        <div className="mobile-bar">
          <button onClick={() => setNavOpen((o) => !o)} aria-label="Open menu" aria-expanded={navOpen}>☰</button>
          Bloom IMS
        </div>
        <main className="main">
          <div className="banner">
            Demo mode: the data is a real SQLite database running in your browser. It's fictional, and your changes stay on this device.
            <span style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
              <button onClick={downloadDb}>Download .sqlite</button>
              <button onClick={reset}>Reset demo data</button>
            </span>
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function PageHead({ title, subtitle, children }) {
  return (
    <div className="page-head">
      <div><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div>
      {children}
    </div>
  );
}
