"use client";
import "../globals.css";
import { useEffect, useState } from "react";

export default function Success() {
  const [href, setHref] = useState("");
  const [err, setErr] = useState("");
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("session_id");
    if (!id) { setErr("No payment session."); return; }
    fetch("/api/complete", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ session_id: id }) })
      .then(async (r) => ({ ok: r.ok, data: await r.json() }))
      .then(({ ok, data }) => { if (!ok) setErr(data.error || "Could not seal"); else setHref(`${window.location.origin}/s/${data.token}`); })
      .catch(() => setErr("Could not seal"));
  }, []);
  return (
    <main>
      <div className="kicker">PAID</div>
      <h1>Your line is sealed.</h1>
      {err ? <p>{err}</p> : href ? <p><a className="btn" href={href}>Open the public page</a></p> : <p className="meta">Checking the payment.</p>}
      <p className="meta">Send that link. The bottom of it sells the next seal.</p>
    </main>
  );
}
