import Stripe from "stripe";

// SECRET KEY — server-side only. Never import this file from a "use client" component.
// Set STRIPE_SECRET_KEY in your host's environment variables, never in code.
let cachedClient: Stripe | null = null;

export function getStripeClient(): Stripe {
  if (cachedClient) return cachedClient;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      "STRIPE_SECRET_KEY is not set. Add it to your environment variables before accepting payments."
    );
  }
  cachedClient = new Stripe(key, { apiVersion: "2026-08-26.dahlia" });
  return cachedClient;
}
