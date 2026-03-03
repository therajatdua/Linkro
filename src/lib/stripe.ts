import Stripe from "stripe";

import { hasStripeEnv } from "@/lib/env";

export const stripe = hasStripeEnv
  ? new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: "2026-02-25.clover",
      typescript: true,
    })
  : null;
