import "../../globals.css";
import { readSeal } from "../../../lib/seal";
import crypto from "crypto";

export default function Seal({ params }) {
  const data = process.env.SEAL_SECRET ? readSeal(params.token, process.env.SEAL_SECRET) : null;
  if (!data) return <main><h1>This seal does not check out.</h1><a className="btn" href="/">Say your own</a></main>;
  const hash = crypto.createHash("sha256").update(data.text, "utf8").digest("hex").slice(0, 16);
  return (
    <main>
      <div className="kicker">SAID · PAID €2</div>
      <p className="line">“{data.text}”</p>
      <p className="meta">Hash {hash} · payment {data.sid}</p>
      <p className="meta">Checkout opened {data.at.replace("T", " ").replace(".000Z", "")} UTC. Stripe confirmed the €2 payment before this page was issued. This timestamp is the start of checkout, not the time the payment cleared.</p>
      <p className="meta">This page records the words. It does not prove that the words are true.</p>
      <a className="btn" href="/">Seal your own line · €2</a>
    </main>
  );
}
