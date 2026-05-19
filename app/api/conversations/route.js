import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getTenantId } from "@/lib/tenant";
import { sendSMS } from "@/lib/twilio";

// ─── GET /api/conversations ────────────────────────────────────────────────────
// Returns conversation threads grouped by contact phone number.
// Each thread = the most recent message + unread count.
export async function GET(req) {
  const tenantId = getTenantId(req);
  if (!tenantId) return NextResponse.json({ error: "No tenant context" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const phone = searchParams.get("phone"); // if set, return full thread for this number

  const db = supabaseAdmin();

  if (phone) {
    // Full thread for one contact
    const { data, error } = await db
      .from("conversations")
      .select("*")
      .eq("tenant_id", tenantId)
      .eq("from_number", phone)
      .order("created_at", { ascending: true });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Mark all as read
    await db.from("conversations")
      .update({ read: true })
      .eq("tenant_id", tenantId)
      .eq("from_number", phone)
      .eq("direction", "inbound");

    return NextResponse.json(data || []);
  }

  // Thread summary — latest message per contact, unread count
  const { data, error } = await db
    .from("conversations")
    .select("from_number, body, direction, created_at, read, lead_id")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Group by from_number, keep only the latest per thread
  const threads = {};
  for (const msg of (data || [])) {
    const key = msg.direction === "outbound" ? msg.to_number || msg.from_number : msg.from_number;
    if (!threads[key]) {
      threads[key] = { phone: key, lastMessage: msg.body, direction: msg.direction, time: msg.created_at, unread: 0, lead_id: msg.lead_id };
    }
    if (!msg.read && msg.direction === "inbound") threads[key].unread++;
  }

  return NextResponse.json(Object.values(threads).sort((a,b) => new Date(b.time) - new Date(a.time)));
}

// ─── POST /api/conversations ───────────────────────────────────────────────────
// Send an outbound SMS reply in a conversation thread.
export async function POST(req) {
  const tenantId = getTenantId(req);
  if (!tenantId) return NextResponse.json({ error: "No tenant context" }, { status: 401 });

  try {
    const { to, body } = await req.json();
    if (!to || !body) return NextResponse.json({ error: "to and body required" }, { status: 400 });

    const db = supabaseAdmin();
    const fromNumber = process.env.TWILIO_PHONE_NUMBER || "";

    // Send via Twilio
    let twilioSid = null;
    if (process.env.TWILIO_ACCOUNT_SID) {
      const result = await sendSMS(to, body);
      twilioSid = result.sid;
    }

    // Store in conversations
    const { data, error } = await db.from("conversations").insert({
      tenant_id: tenantId,
      from_number: fromNumber,
      to_number: to,
      body,
      direction: "outbound",
      twilio_sid: twilioSid,
      read: true,
    }).select().single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
