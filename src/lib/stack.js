// The technology behind Bloom IMS today, and what each piece replaced from the 2020 AWS build.
export const STACK = [
  { layer: "Front end", now: "React 18 + Vite, React Router", then: "Angular on Elastic Beanstalk" },
  { layer: "Database", now: "SQLite (bloom.sqlite) via sql.js / WebAssembly", then: "Microsoft SQL Server on Amazon RDS" },
  { layer: "Data access", now: "Parameterized SQL in the browser", then: "C# Lambda functions behind API Gateway" },
  { layer: "Business rules", now: "SQLite foreign keys, CHECK constraints, ON DELETE CASCADE", then: "SQL Server constraints + cascade-delete triggers" },
  { layer: "Saving edits", now: "IndexedDB in each visitor's browser", then: "Shared RDS database" },
  { layer: "Users and roles", now: "Demo roles + app_user table", then: "Amazon Cognito user pools" },
  { layer: "Hosting", now: "GitHub Pages", then: "Elastic Beanstalk, CloudFront, Route 53" },
  { layer: "Deploys", now: "GitHub Actions on every push to main", then: "AWS Lambda tools and Elastic Beanstalk deploys" },
];

export const STACK_CHIPS = ["React 18", "Vite", "SQLite", "sql.js (WebAssembly)", "IndexedDB", "GitHub Pages", "GitHub Actions"];
