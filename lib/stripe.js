import Stripe from "stripe";

/**
 * Stripe client initialized from STRIPE_SECRET_KEY env var.
 * Returns null if the key is not configured.
 */
export function getStripeClient() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key, { apiVersion: "2025-02-24.acacia" });
}

/**
 * Price ID lookup configurable via env vars, with fallback hardcoded IDs.
 * Set STRIPE_PRICE_STARTER, STRIPE_PRICE_PROFESSIONAL, STRIPE_PRICE_AGENCY
 * in your environment to override.
 */
function getPriceId(tier) {
  const envMap = {
    starter: process.env.STRIPE_PRICE_STARTER,
    professional: process.env.STRIPE_PRICE_PROFESSIONAL,
    agency: process.env.STRIPE_PRICE_AGENCY,
  };

  // Hardcoded fallback IDs (replace with real Stripe price IDs in production)
  const fallbackMap = {
    starter: "price_starter_fallback",
    professional: "price_professional_fallback",
    agency: "price_agency_fallback",
  };

  return envMap[tier] || fallbackMap[tier] || null;
}

/**
 * Create a Stripe Checkout Session for the given price tier.
 *
 * @param {string} tier - "starter", "professional", or "agency"
 * @returns {Promise<{url: string|null, error: string|null, sessionId: string|null}>}
 */
export async function createCheckoutSession(tier) {
  const stripe = getStripeClient();
  if (!stripe) {
    return { url: null, error: "Stripe not configured", sessionId: null };
  }

  const priceId = getPriceId(tier);
  if (!priceId) {
    return { url: null, error: `No price ID found for tier: ${tier}`, sessionId: null };
  }

  // If using fallback hardcoded IDs, warn via the response
  const isFallback =
    !process.env[`STRIPE_PRICE_${tier.toUpperCase()}`];

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/#pricing`,
      metadata: { tier, source: "flowdesk_landing" },
    });

    return {
      url: session.url,
      error: null,
      sessionId: session.id,
      ...(isFallback ? { warning: "Using fallback price ID — set STRIPE_PRICE_* env vars for real prices" } : {}),
    };
  } catch (err) {
    return { url: null, error: err.message, sessionId: null };
  }
}