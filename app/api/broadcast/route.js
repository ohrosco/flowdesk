import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getTenantId } from "@/lib/tenant";
import { sendSMS } from "@/lib/twilio";

// ─── GET /api/broadcast ────────────────────────────────────────────────────────
// List all broadcasts for this tenant.
export async function GET(req) {
  const tenantId = getTenantId(req);
  if (!tenantId) return NextResponse.json({ error: "No tenant context" }, { status: 401 });

  const db = supabaseAdmin();
  const { data, error } = await db
    .from("broadcasts")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

// ─── POST /api/broadcast ───────────────────────────────────────────────────────
// Create a broadcast. If send_now=true, fires immediately.
// Body: { name, message, segment, send_now, scheduled_at }
export async function POST(req) {
  const tenantId = getTenantId(req);
  if (!tenantId) return NextResponse.json({ error: "No tenant context" }, { status: 401 });

  try {
    const body = await req.json();
    const { name, message, segment = "all", send_now = false, scheduled_at } = body;

    if (!name || !message) {
      return NextResponse.json({ error: "name and message are required" }, { status: 400 });
    }
    if (message.length > 160) {
      return NextResponse.json({ error: "Message must be 160 characters or fewer (1 SMS segment)" }, { status: 400 });
    }

    const db = supabaseAdmin();

    // Build recipient list based on segment
    let query = db.from("leads").select("id, name, phone").eq("tenant_id", tenantId).not("phone", "is", null);
    if (segment !== "all") {
      const segmentMap = { new:"new", hot:"hot", warm:"warm", won:"Won", lost:"Lost" };
      const statusVal = segmentMap[segment];
      if (statusVal) query = query.eq("status", statusVal);
    }

    const { data: leads, error: leadsErr } = await query;
    if (leadsErr) return NextResponse.json({ error: leadsErr.message }, { status: 500 });

    // Create broadcast record
    const { data: broadcast, error: bcErr } = await db.from("broadcasts").insert({
      tenant_id: tenantId,
      name,
      message,
      segment,
      status: send_now ? "sending" : "scheduled",
      recipient_count: leads.length,
      scheduled_at: scheduled_at || null,
    }).select().single();

    if (bcErr) return NextResponse.json({ error: bcErr.message }, { status: 500 });

    if (send_now && process.env.TWILIO_ACCOUNT_SID) {
      // Fire SMS to all recipients (throttle: 10/second to stay within Twilio limits)
      let sentCount = 0;
      for (let i = 0; i < leads.length; i++) {
        const lead = leads[i];
        try {
          await sendSMS(lead.phone, message);
          sentCount++;
          // Log as outbound conversation
          await db.from("conversations").insert({
            tenant_id: tenantId,
            lead_id: lead.id,
            from_number: process.env.TWILIO_PHONE_NUMBER || "",
            to_number: lead.phone,
            body: message,
            direction: "outbound",
            read: true,
          });
        } catch (e) {
          console.error(`Broadcast SMS failed for ${lead.phone}:`, e.message);
        }
        // Throttle: 100ms between sends
        if (i < leads.length - 1) await new Promise(r => setTimeout(r, 100));
      }

      await db.from("broadcasts").update({
        status: "sent",
        sent_count: sentCount,
        sent_at: new Date().toISOString(),
      }).eq("id", broadcast.id);

      return NextResponse.json({ ...broadcast, sent_count: sentCount, status: "sent" }, { status: 201 });
    }

    return NextResponse.json(broadcast, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
