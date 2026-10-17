import { useState } from "react";
import { useStore } from "../store.jsx";
import { ROLES } from "../lib/schema.js";
import { Brand } from "../components/Icons.jsx";

export default function Login() {
  const { signIn } = useStore();
  const [role, setRole] = useState("admin");

  return (
    <div className="login">
      <section className="login-art">
        <Brand />
        <div>
          <h1>From warehouse to vessel, in one place.</h1>
          <p>An inventory management system for a plastics trading desk. It tracks product lots, contracts,
            ocean shipments, letters of credit and profit per deal.</p>
        </div>
        <p style={{ fontSize: 12 }}>Portfolio demo · runs on React and SQLite (sql.js) in your browser, hosted on GitHub Pages. Originally built on AWS with Angular, .NET Lambda functions and SQL Server.</p>
      </section>
      <section className="login-form">
        <form className="card" onSubmit={(e) => { e.preventDefault(); signIn(role); }}>
          <div>
            <h2>Try the demo</h2>
            <p className="muted" style={{ margin: "4px 0 0" }}>No sign-up needed. Pick a role to see what each kind of user can do.</p>
          </div>
          <div className="roles" role="radiogroup" aria-label="Role">
            {Object.entries(ROLES).map(([id, r]) => (
              <label className="role" key={id}>
                <input type="radio" name="role" value={id} checked={role === id} onChange={() => setRole(id)} />
                <div><strong>{r.name}</strong><span>{r.desc}</span></div>
              </label>
            ))}
          </div>
          <button className="primary" type="submit" style={{ justifyContent: "center" }}>Enter demo</button>
        </form>
      </section>
    </div>
  );
}
