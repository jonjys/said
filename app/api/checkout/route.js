import Stripe from "stripe";

export async function POST(req) {
  const { text } = await req.json().catch(() => ({}));
  const line = String(text || "").trim().replace(/\s+/g, " ");
  if (line.length < 8 || line.length > 240) {
    return Response.json({ error: "Write between 8 and 240 characters." }, { status: 400 });
  }
  if (!process.env.STRIPE_SECRET_KEY) {
    return Response.json({ error: "Stripe is not connected on this deploy yet." }, { status: 500 });
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_URL;
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: process.env.STRIPE_PRICE_ID || "price_1UNHHOBEo0Yzuylw5NNOviXB", quantity: 1 }],
    success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: origin,
    metadata: { text: line, app: "said" },
    payment_intent_data: { metadata: { text: line, app: "said" } }
  });
  return Response.json({ url: session.url });
}
