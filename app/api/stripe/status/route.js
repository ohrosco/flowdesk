import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// ─── GET /api/stripe/status ─────────────────────────────────────────────────────
// Returns the current subscription status from the settings table.
// Returns: { active: bool, tier: string|null, customerId: string|null }
export async function GET() {
  try {
    const db = supabaseAdmin();
    const { data, error } = await db
      .from("settings")
      .select("subscription_status, subscription_tier, stripe_customer_id")
      .eq("id", 1)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 = no rows returned — not an error on first load
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({
        active: false,
        tier: null,
        customerId: null,
      });
    }

    const active =
      data.subscription_status === "active" ||
      data.subscription_status === "trialing" ||
      data.subscription_status === "complete";

    return NextResponse.json({
      active,
      tier: data.subscription_tier || null,
      customerId: data.stripe_customer_id || null,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}