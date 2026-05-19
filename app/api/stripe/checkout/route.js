import { NextResponse } from "next/server";
import { createCheckoutSession } from "@/lib/stripe";

// ─── POST /api/stripe/checkout ─────────────────────────────────────────────────
// Creates a Stripe Checkout Session for the given price tier.
// Body: { priceTier: "starter" | "professional" | "agency" }
// Returns: { url: string } for redirect, or { error: string }
export async function POST(req) {
  try {
    const body = await req.json();
    const { priceTier } = body;

    if (!priceTier || !["starter", "professional", "agency"].includes(priceTier)) {
      return NextResponse.json(
        { error: "Invalid or missing priceTier. Must be 'starter', 'professional', or 'agency'." },
        { status: 400 }
      );
    }

    const result = await createCheckoutSession(priceTier);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      url: result.url,
      sessionId: result.sessionId,
      ...(result.warning ? { warning: result.warning } : {}),
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}