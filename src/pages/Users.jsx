import { useStore } from "../store.jsx";
import { ROLES } from "../lib/schema.js";
import { PageHead } from "../components/Layout.jsx";

export default function Users() {
  const { session, users, setUsers, toast } = useStore();
  const admin = session.role === "admin";

  const update = (i, patch, msg) => {
    setUsers((list) => list.map((u, j) => (j === i ? { ...u, ...patch } : u)));
    toast(msg);
  };
  const remove = (i) => {
    if (!confirm(`Remove ${users[i].name}?`)) return;
    setUsers((list) => list.filter((_, j) => j !== i));
    toast("User removed");
  };

  return (
    <>
      <PageHead title="Users" subtitle={admin
        ? "Change roles or remove people. In the original app this was backed by Amazon Cognito."
        : "Only administrators can manage users. Switch role to try it."} />
      <section className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th>{admin && <th />}</tr></thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={u.email}>
                  <td>{u.name}</td>
                  <td className="muted">{u.email}</td>
                  <td>
                    {admin ? (
                      <select value={u.role} aria-label={`Role for ${u.name}`} style={{ width: "auto" }}
                        onChange={(e) => update(i, { role: e.target.value }, "Role updated")}>
                        {Object.entries(ROLES).map(([id, r]) => <option key={id} value={id}>{r.name}</option>)}
                      </select>
                    ) : ROLES[u.role].name}
                  </td>
                  <td>{u.confirmed ? <span className="pill pos">Confirmed</span> : <span className="pill warn">Invite pending</span>}</td>
                  {admin && (
                    <td className="num">
                      {!u.confirmed && <button onClick={() => update(i, { confirmed: true }, "User confirmed")}>Confirm</button>}{" "}
                      <button className="danger" onClick={() => remove(i)}>Remove</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
