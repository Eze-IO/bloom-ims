# Bloom IMS

An inventory management system for a polymer (plastics) trading desk. It tracks product lots in warehouses, purchase and sale contracts, ocean shipments, letters of credit, and the profit on every deal.

**[▶ Try the live demo](https://OWNER.github.io/REPO/)**: no sign-up, just pick a role.

![Original AWS architecture](public/docs/aws-architecture.png)

## The problem

The logistics team at a plastics trading company ran everything on spreadsheets and email. For each deal they had to work out:

- Do we have the product, and in which warehouse?
- Which trucker picks it up, and which vessel is it booked on?
- Which letter of credit backs the sale, and when is the document cutoff?
- Did the deal make money after fees?

This system puts all of that in one place and follows the team's real deal workflow, from the trader's email through to payment.

## What you can do in the demo

| Page | What it shows |
| --- | --- |
| **Dashboard** | Stock on hand, open contracts, shipments at sea, net P&L, inventory by warehouse, P&L per deal |
| **Records** | All 14 business tables from the original database, with search, sort, add, edit and delete |
| **Deal workflow** | A walkthrough of the logistics process the system was designed around |
| **Reports** | Profit by customer, stock by warehouse, shipments by port and more, each downloadable as CSV |
| **Users** | Administrator, Editor and Viewer roles (originally Amazon Cognito user pools) |

The demo also keeps the original database's rules:

- A lot can't hold more than 2,000 MT, and its release date must come after its received date.
- A letter of credit's arrival date (ETA) must come after its sailing date (ETS).
- Deal P&L and gross are calculated as `sale − purchase` and `P&L − fees`.
- Deleting an agent, counterparty, bill of lading, deal or payment term also deletes its contracts. The original database did this with triggers.
- Deleting something that other records still use is blocked, just as a foreign key would block it.

## How it was originally built (2020)

| Layer | Technology |
| --- | --- |
| Front end | Angular on AWS Elastic Beanstalk, with CloudFront and Route 53 |
| Sign-in | Amazon Cognito (Administrator and Editor user pools, email confirmation) |
| API | API Gateway + AWS Lambda functions in C# / .NET Core |
| Database | Microsoft SQL Server on Amazon RDS, in a private subnet |
| Storage | Amazon S3 for configuration, profile pictures and database backups |

The database started as a whiteboard sketch:

![Whiteboard ERD](public/docs/whiteboard-erd.jpg)

## How this demo works

The AWS environment has been shut down, so this repo rebuilds the app in **React** as a static site that runs entirely in the browser:

- **React 18 + Vite**, with React Router (hash routing, so deep links work on GitHub Pages)
- `src/lib/schema.js` describes every table, plus the original database's rules and cascades
- `src/data/seed.js` is the original sample data, converted from the SQL load scripts
- Your changes are saved in your browser's local storage. Use **Reset demo data** to start over.
- Every push to `main` builds the site and publishes it to GitHub Pages (`.github/workflows/deploy.yml`)

### Run it locally

```bash
npm install
npm run dev
```

## Repository layout

```
src/                       The React app
  pages/                   Dashboard, Records, Reports, Workflow, Users, About, Login
  components/              Layout, data table, record form, icons
  lib/                     Table definitions, rules and formatting
  store.jsx                App state (data, role, users) saved to local storage
public/docs/               Architecture diagram and whiteboard ERD
original/database/         SQL Server scripts: schema, triggers, lookup data, sample data
original/lambda-functions/ C# AWS Lambda functions (entities, reports, users, auth)
```

## Looking back: what I'd change

Rereading the 2020 code with fresh eyes, these are the improvements I'd make next:

1. **Credentials.** The functions originally read config with an access key written into the code. In this repo that's replaced with the Lambda's IAM role. The next step would be AWS Secrets Manager for the database password.
2. **Parameterized SQL.** The entity and report functions build SQL by joining strings together (`exec {0} {1}`, `insert into {0} ...`). Switching to `SqlParameter` would remove the risk of SQL injection.
3. **Built-in cascades.** The six cascade-delete triggers could be replaced with `FOREIGN KEY ... ON DELETE CASCADE`.
4. **A missing link.** `contract_details` has no `contract_id`, so contract lines can't be tied to their contract. That needs a foreign key.
5. **Cleaner sample data.** Some generated rows point to deals and shipments that don't exist. The demo marks these as "missing" instead of hiding them.

## Note on names

The company has been renamed to "Bloom", and every person, company and figure in the data is fictional.
