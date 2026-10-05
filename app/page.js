"use client";
import "./globals.css";
import { useState } from "react";

const LINES = [
  "I quit. The date is today.",
  "We are done. This is the record.",
  "I said I would be there. I will."
];

export default function Home() {
  const [text, setText] = useState(LINES[0]);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const line = text.trim().replace(/\s+/g, " ");

  async function pay(e) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text: line })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.url) {
      setErr(data.error || "Kunde inte öppna kortbetalning.");
      setBusy(false);
      return;
    }
    window.location = data.url;
  }

  return (
    <main>
      <div className="kicker">SAID · NYTTO LABS</div>
      <h1>Säg det en gång. Sidan blir kvittot.</h1>
      <p className="sub">En mening. €2. En publik sida med tiden du betalade och en hash av orden. Inget konto. Sidan är beviset.</p>
      <div className="chips">
        {LINES.map((item) => (
          <button type="button" className="chip" key={item} onClick={() => setText(item)}>{item}</button>
        ))}
      </div>
      <form onSubmit={pay}>
        <label className="fieldlabel">Meningen</label>
        <textarea maxLength={240} value={text} onChange={(e) => setText(e.target.value)} placeholder="Meningen du vill ha på pränt." />
        <article className="receipt">
          <div className="kicker">SÅ HÄR SER SIDAN UT</div>
          <p className="line">“{line || "Skriv meningen först."}”</p>
          <p className="meta">Betald tid · hash av exakt den här texten · {line.length} tecken</p>
        </article>
        <div className="meta">{line.length}/240 · €2 · kort via Stripe</div>
        <button disabled={busy || line.length < 8}>{busy ? "Öppnar kortbetalning" : "Försegla meningen · €2"}</button>
        {err ? <p className="err">{err}</p> : null}
      </form>
      <footer>Sidan visar orden och betalningstiden. Den visar inte att meningen är sann. hello@nyttolabs.com</footer>
    </main>
  );
}
