"use client";
import "./globals.css";
import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  async function pay(e) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    const res = await fetch("/api/checkout", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ text }) });
    const data = await res.json();
    if (!res.ok) { setErr(data.error || "Could not start checkout"); setBusy(false); return; }
    window.location = data.url;
  }
  return (
    <main>
      <div className="kicker">SAID · NYTTO LABS</div>
      <h1>Say it once. Keep the page.</h1>
      <p className="sub">One sentence. €2. A public page with the time you paid and a hash of the exact words. No account. The page is the receipt.</p>
      <form onSubmit={pay}>
        <textarea maxLength={240} value={text} onChange={(e) => setText(e.target.value)} placeholder="The sentence you want on the record." />
        <div className="meta">{text.trim().length}/240 · €2 · card via Stripe</div>
        <button disabled={busy || text.trim().length < 8}>{busy ? "Opening checkout" : "Seal this line · €2"}</button>
        {err ? <p className="meta">{err}</p> : null}
      </form>
      <footer>The page proves the words and the payment time. It does not prove the sentence is true. hello@nyttolabs.com</footer>
    </main>
  );
}
