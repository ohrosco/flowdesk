import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getTenantId, getTenantSettings } from "@/lib/tenant";
import { sendSMS } from "@/lib/twilio";

// ─── GET /api/reviews ──────────────────────────────────────────────────────────
// List review requests sent for this tenant.
export async function GET(req) {
  const tenantId = getTenantId(req);
  if (!tenantId) return NextResponse.json({ error: "No tenant context" }, { status: 401 });

  const db = supabaseAdmin();
  const { data, error } = await db
    .from("review_requests")
    .select("*, leads(name, phone, service)")
    .eq("tenant_id", tenantId)
    .order("sent_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

// ─── POST /api/reviews ─────────────────────────────────────────────────────────
// Send a Google review request SMS to one or more leads.
// Body: { lead_ids: string[] }  OR  { send_to_all_won: true }
export async function POST(req) {
  const tenantId = getTenantId(req);
  if (!tenantId) return NextResponse.json({ error: "No tenant context" }, { status: 401 });

  try {
    const body = await req.json();
    const { lead_ids, send_to_all_won } = body;

    const db = supabaseAdmin();

    // Get tenant settings for business name + review URL
    const settings = await getTenantSettings(tenantId);
    const bizName = settings.business_name || process.env.NEXT_PUBLIC_BUSINESS_NAME || "us";
    const reviewUrl = settings.booking_url
      ? `${settings.booking_url.replace(/\/book$/, "")}/review`
      : null;

    // Build the Google review request message
    function reviewMessage(leadName) {
      const first = leadName.split(" ")[0];
      const urlPart = reviewUrl ? ` Leave us a review: ${reviewUrl}` : "";
      return `Hi ${first}! Thank you for choosing ${bizName}. We'd love your feedback!${urlPart} It takes 30 seconds and helps us a lot. 🙏`;
    }

    // Determine recipients
    let leads = [];
    if (send_to_all_won) {
      const { data } = await db
        .from("leads")
        .select("id, name, phone")
        .eq("tenant_id", tenantId)
        .eq("stage", "Won")
        .not("phone", "is", null);
      leads = data || [];
    } else if (lead_ids?.length) {
      const { data } = await db
        .from("leads")
        .select("id, name, phone")
        .eq("tenant_id", tenantId)
        .in("id", lead_ids);
      leads = data || [];
    }

    if (leads.length === 0) {
      return NextResponse.json({ error: "No eligible leads found" }, { status: 400 });
    }

    const results = [];
    for (const lead of leads) {
      try {
        const message = reviewMessage(lead.name || "there");

        if (process.env.TWILIO_ACCOUNT_SID) {
          await sendSMS(lead.phone, message);
        }

        const { data: rr } = await db.from("review_requests").insert({
          tenant_id: tenantId,
          lead_id: lead.id,
          phone: lead.phone,
          status: "sent",
          review_url: reviewUrl,
        }).select().single();

        // Update lead stage
        await db.from("leads")
          .update({ stage: "Review Requested", last_contact: new Date().toISOString() })
          .eq("id", lead.id);

        results.push({ lead_id: lead.id, status: "sent", id: rr?.id });
      } catch (e) {
        results.push({ lead_id: lead.id, status: "failed", error: e.message });
      }
    }

    return NextResponse.json({ sent: results.filter(r=>r.status==="sent").length, results }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
