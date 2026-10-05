import Stripe from "stripe";
import { signSeal } from "../../../lib/seal";

export async function POST(req) {
  const body = await req.json().catch(() => null);
  const session_id = body?.session_id;
  if (typeof session_id !== "string" || !/^cs_(live|test)_[a-zA-Z0-9]+$/.test(session_id)) {
    return Response.json({ error: "No valid payment session." }, { status: 400 });
  }
  if (!process.env.STRIPE_SECRET_KEY || !process.env.SEAL_SECRET) {
    return Response.json({ error: "Payment checking is temporarily unavailable. Keep this link and try again." }, { status: 503 });
  }
  try {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const session = await stripe.checkout.sessions.retrieve(session_id);
  if (session.payment_status !== "paid" || session.status !== "complete" || session.mode !== "payment" ||
      session.metadata?.app !== "said" || session.currency !== "eur" || session.amount_total !== 200) {
    return Response.json({ error: "This payment is not a paid Said seal." }, { status: 402 });
  }
  if (typeof session.metadata.text !== "string" || session.metadata.text.length < 8 || session.metadata.text.length > 240) {
    return Response.json({ error: "The payment has no valid sentence. Contact support@nyttolabs.com." }, { status: 422 });
  }
  const token = signSeal({ text: session.metadata.text, at: new Date(session.created * 1000).toISOString(), sid: session.id, timeKind: "checkout_started" }, process.env.SEAL_SECRET);
  return Response.json({ token }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "Could not check this payment. Keep this link and try again." }, { status: 502 });
  }
}
