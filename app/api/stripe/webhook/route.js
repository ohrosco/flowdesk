import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import Stripe from "stripe";

// ─── POST /api/stripe/webhook ──────────────────────────────────────────────────
// Handles Stripe webhook events, verifies signature, and updates subscription
// status in the Supabase settings table.
export async function POST(req) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Stripe webhook secret not configured" },
      { status: 500 }
    );
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return NextResponse.json(
      { error: "Stripe secret key not configured" },
      { status: 500 }
    );
  }

  const stripe = new Stripe(stripeKey, { apiVersion: "2025-02-24.acacia" });

  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "Missing stripe-signature header" },
        { status: 400 }
      );
    }

    // Verify webhook signature
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    // Handle checkout.session.completed
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const customerId = session.customer;
      const subscriptionId = session.subscription;
      const tier = session.metadata?.tier || "starter";
      const status = "active";

      // Get subscription status from the subscription object if available
      let subscriptionStatus = status;
      if (subscriptionId) {
        try {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          subscriptionStatus = subscription.status;
        } catch (subErr) {
          // If we can't fetch the subscription, use "active" as default
          console.error("Failed to fetch subscription:", subErr.message);
        }
      }

      // Store in settings table (upsert id=1)
      const db = supabaseAdmin();
      const { error } = await db
        .from("settings")
        .upsert(
          {
            id: 1,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            subscription_status: subscriptionStatus,
            subscription_tier: tier,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "id" }
        );

      if (error) {
        console.error("Failed to update settings with subscription data:", error.message);
        return NextResponse.json(
          { error: "Failed to store subscription data" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Stripe webhook error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}