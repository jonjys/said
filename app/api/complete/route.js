import Stripe from "stripe";
import { signSeal } from "../../../lib/seal";

export async function POST(req) {
  const { session_id } = await req.json().catch(() => ({}));
  if (!session_id || !process.env.STRIPE_SECRET_KEY || !process.env.SEAL_SECRET) {
    return Response.json({ error: "Missing session or server secret." }, { status: 400 });
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const session = await stripe.checkout.sessions.retrieve(session_id);
  if (session.payment_status !== "paid" || session.metadata?.app !== "said") {
    return Response.json({ error: "This payment is not a paid Said seal." }, { status: 402 });
  }
  const token = signSeal({ text: session.metadata.text, at: new Date(session.created * 1000).toISOString(), sid: session.id }, process.env.SEAL_SECRET);
  return Response.json({ token });
}
