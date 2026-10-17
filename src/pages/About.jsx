import { PageHead } from "../components/Layout.jsx";
import StackDiagram from "../components/StackDiagram.jsx";
import { STACK } from "../lib/stack.js";

const REPO_URL = "https://github.com/Eze-IO/bloom-ims";

export default function About() {
  return (
    <>
      <PageHead title="About this project" subtitle="What it is, how it runs today, and how it was originally built.">
        <a className="btn primary" href={REPO_URL} target="_blank" rel="noopener noreferrer">View the code on GitHub</a>
      </PageHead>

      <section className="card card-pad prose" style={{ maxWidth: "none" }}>
        <h2>How it runs today</h2>
        <p className="muted">
          A React app served by GitHub Pages. The data is a real SQLite database file that opens in your browser through sql.js
          (SQLite compiled to WebAssembly). Screens read it and edits write to it with parameterized SQL. The database enforces the
          rules itself with foreign keys, <code>CHECK</code> constraints and <code>ON DELETE CASCADE</code>. Your edits are saved on
          your device, and the banner's <strong>Download .sqlite</strong> button gives you the file.
        </p>
        <StackDiagram />
      </section>

      <section className="card" style={{ marginTop: 16 }}>
        <div className="card-head"><h2>Then and now</h2></div>
        <div className="table-wrap" style={{ marginTop: 12 }}>
          <table className="compare">
            <thead><tr><th>Layer</th><th>Today</th><th>Original (2020, AWS)</th></tr></thead>
            <tbody>
              {STACK.map((s) => (
                <tr key={s.layer}><td>{s.layer}</td><td>{s.now}</td><td className="muted">{s.then}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card card-pad prose" style={{ marginTop: 16, maxWidth: "none" }}>
        <h2>The problem</h2>
        <p>A plastics trading desk was running its logistics on spreadsheets and email: which lots sat in which warehouse, which vessel each
          container was booked on, which letter of credit backed each sale, and whether each deal made money.</p>
        <h2 style={{ marginTop: 16 }}>The original system (2020)</h2>
        <p>A cloud consulting team project built on AWS:</p>
        <ul>
          <li><strong>Angular</strong> front end on AWS Elastic Beanstalk, behind CloudFront and Route 53</li>
          <li><strong>Amazon Cognito</strong> for sign-up, confirmation and Administrator / Editor roles</li>
          <li><strong>API Gateway + AWS Lambda</strong> functions written in C# (.NET Core), in a private subnet</li>
          <li><strong>Microsoft SQL Server</strong> on RDS: 23 tables, foreign keys, check constraints and cascade-delete triggers</li>
          <li><strong>S3</strong> for configuration, profile pictures and database backups</li>
        </ul>
        <p>That AWS environment has been retired. Its source is kept in the repo's <code>original/</code> folder, and the company
          name and people in this demo are fictional.</p>
      </section>
    </>
  );
}
