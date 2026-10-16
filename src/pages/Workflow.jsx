import { useState } from "react";
import { Link } from "react-router-dom";
import { PageHead } from "../components/Layout.jsx";

const FLOW = [
  { t: "Trader sends the deal", d: "A trader emails logistics with the deal: product, quantity, price and buyer." },
  { t: "Back-to-back or from inventory?", decision: true,
    d: "Decide whether we are simply passing goods between a seller and a buyer, or selling our own stock.",
    branch: <><strong>Back-to-back (B2B):</strong> we sit between the two counterparties. Wait for the seller's documents, prepare our own set and send it to the buyer.</> },
  { t: "Check stock", decision: true, link: "/records/inventory",
    d: "Look up the product in Inventory. If we're short, tell the trader so they can buy more or adjust the deal." },
  { t: "Agree the shipping date", link: "/records/bl", d: "As soon as possible, or a specific month? Find a vessel booking that fits." },
  { t: "Get the product ready", link: "/records/inventory_schedule", d: "If the lot isn't bagged and at the warehouse yet, ask the warehouse to package it." },
  { t: "Send shipping instructions", link: "/records/schedule", d: "Give the warehouse the booking and make sure they stick to the trucking schedule." },
  { t: "Document cutoff", link: "/records/lc", d: "Five days before the estimated departure, finish the document cutoffs." },
  { t: "Load the vessel", d: "When the truck arrives, make sure the container actually gets onto the ship." },
  { t: "Vessel sails, collect originals", d: "Wait for the original documents, then prepare and copy the full set." },
  { t: "Send documents to the buyer", d: "The buyer uses them to collect the cargo at the destination port." },
  { t: "Get paid", link: "/records/payment_terms", d: "Wait for payment under the agreed terms, then close the contract." },
];

export default function Workflow() {
  const [at, setAt] = useState(0);

  return (
    <>
      <PageHead title="Deal workflow" subtitle="The real process the logistics team followed, which this system was designed around. Step through it.">
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setAt((n) => Math.max(0, n - 1))}>← Back</button>
          <button className="primary" onClick={() => setAt((n) => Math.min(FLOW.length, n + 1))}>Next step →</button>
        </div>
      </PageHead>
      <section className="card">
        <ol className="flow" style={{ listStyle: "none", margin: 0 }}>
          {FLOW.map((s, i) => (
            <li key={s.t} className={`step ${i < at ? "done" : ""} ${s.decision ? "decision" : ""}`} aria-current={i === at ? "step" : undefined}>
              <div>
                <div className="dot"><b>{i < at ? "✓" : i + 1}</b></div>
                {i < FLOW.length - 1 && <div className="line" />}
              </div>
              <div className="body" style={{ opacity: i > at ? 0.45 : 1 }}>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
                {s.branch && i <= at && <div className="branch">{s.branch}</div>}
                {s.link && i <= at && <p><Link to={s.link}>Open in Records →</Link></p>}
              </div>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
