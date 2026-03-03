import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Stripe is not configured" }, { status: 400 });
  }

  const body = await request.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  try {
    const event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);

    if (event.type === "customer.subscription.updated") {
      return NextResponse.json({ ok: true, message: "Subscription update received" });
    }

    return NextResponse.json({ ok: true, message: `Unhandled event ${event.type}` });
  } catch {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }
}
