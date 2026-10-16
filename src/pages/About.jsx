import { PageHead } from "../components/Layout.jsx";

const REPO_URL = "https://github.com/Eze-IO/bloom-ims";

export default function About() {
  return (
    <>
      <PageHead title="About this project" subtitle="What it is, how it was built, and what this demo changes.">
        <a className="btn primary" href={REPO_URL} target="_blank" rel="noopener noreferrer">View the code on GitHub</a>
      </PageHead>
      <div className="grid two">
        <section className="card card-pad prose">
          <h2>The problem</h2>
          <p>A plastics trading desk was running its logistics on spreadsheets and email: which lots sat in which warehouse, which vessel each
            container was booked on, which letter of credit backed each sale, and whether each deal made money.</p>
          <h2 style={{ marginTop: 16 }}>The original system (2020)</h2>
          <p>A cloud consulting team project, designed from the whiteboard up:</p>
          <ul>
            <li><strong>Angular</strong> front end on AWS Elastic Beanstalk, behind CloudFront and Route 53</li>
            <li><strong>Amazon Cognito</strong> for sign-up, confirmation and Administrator / Editor roles</li>
            <li><strong>API Gateway + AWS Lambda</strong> functions written in C# (.NET Core)</li>
            <li><strong>Microsoft SQL Server</strong> on RDS: 23 tables, foreign keys, check constraints and cascade-delete triggers</li>
            <li><strong>S3</strong> for configuration, profile pictures and database backups</li>
          </ul>
          <h2 style={{ marginTop: 16 }}>This demo</h2>
          <p>The AWS stack has been retired, so this version rebuilds the app in <strong>React</strong> as a static site that runs entirely
            in your browser. It uses the same tables, sample data and database rules (quantity limits, date checks, and the cascade deletes
            the triggers performed). The company name and people are fictional.</p>
        </section>
        <section className="card card-pad prose">
          <h2>Original AWS architecture</h2>
          <p className="muted">Employees reach the app through Route 53. Lambda functions in a private subnet talk to SQL Server.</p>
          <img src="docs/aws-architecture.png" loading="lazy"
            alt="AWS architecture: Route 53 to Elastic Beanstalk, Cognito, API Gateway, Lambda and SQL Server, with S3 backups and CloudFront" />
          <h2 style={{ marginTop: 16 }}>Where it started</h2>
          <img src="docs/whiteboard-erd.jpg" loading="lazy"
            alt="Whiteboard sketch of the database design with tables for contracts, inventory, warehouses and shipments" />
        </section>
      </div>
    </>
  );
}
