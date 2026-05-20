import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getTenantId } from "@/lib/tenant";
import { sendSMS, getSMSTemplate } from "@/lib/twilio";
import { sendEmail, getFollowUpEmail } from "@/lib/resend";

const DEFAULT_TENANT_ID = "00000000-0000-0000-0000-000000000001";

// ─── GET /api/leads ───────────────────────────────────────────────────────────
export async function GET(req) {
  const tenantId = getTenantId(req) || DEFAULT_TENANT_ID;
  const db = supabaseAdmin();
  const { data, error } = await db
    .from("leads")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// ─── POST /api/leads ──────────────────────────────────────────────────────────
// Creates a lead, fires instant SMS, and schedules the follow-up sequence
export async function POST(req) {
  const tenantId = getTenantId(req) || DEFAULT_TENANT_ID;
  const body = await req.json();
  const { name, phone, email, address, service, source, timeline, notes } = body;

  if (!name || !phone || !service) {
    return NextResponse.json({ error: "name, phone, and service are required" }, { status: 400 });
  }

  const db = supabaseAdmin();

  // 1. Insert lead
  const { data: lead, error: leadErr } = await db
    .from("leads")
    .insert({ tenant_id: tenantId, name, phone, email, address, service, source, timeline, notes, status: "new", stage: "New Lead" })
    .select()
    .single();

  if (leadErr) return NextResponse.json({ error: leadErr.message }, { status: 500 });

  // 2. Fire instant SMS (step 0)
  const smsBody = getSMSTemplate(0, name, process.env.RESEND_FROM_NAME);
  let smsResult = null;
  if (smsBody && process.env.TWILIO_ACCOUNT_SID) {
    try {
      smsResult = await sendSMS(phone, smsBody);
      await db.from("followup_messages").insert({
        tenant_id: tenantId, lead_id: lead.id, step: 0, channel: "sms",
        message_body: smsBody, status: "sent", sent_at: new Date().toISOString(),
      });
    } catch (e) {
      console.error("SMS send failed:", e.message);
      await db.from("followup_messages").insert({
        tenant_id: tenantId, lead_id: lead.id, step: 0, channel: "sms",
        message_body: smsBody, status: "failed",
      });
    }
  }

  // 3. Schedule the follow-up sequence
  const now = new Date();
  const sequence = [
    { step: 1, channel: "call",  delayHours: 2 },
    { step: 2, channel: "email", delayHours: 24 },
    { step: 3, channel: "sms",   delayHours: 72 },
    { step: 4, channel: "email", delayHours: 168 },  // 7 days
    { step: 5, channel: "sms",   delayHours: 336 },  // 14 days
  ];

  const scheduled = sequence.map(({ step, channel, delayHours }) => {
    const scheduledAt = new Date(now.getTime() + delayHours * 60 * 60 * 1000);
    return { tenant_id: tenantId, lead_id: lead.id, step, channel, status: "pending", scheduled_at: scheduledAt.toISOString() };
  });

  await db.from("followup_messages").insert(scheduled);

  return NextResponse.json({ lead, sms: smsResult }, { status: 201 });
}
