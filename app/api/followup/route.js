import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { sendSMS, getSMSTemplate } from "@/lib/twilio";
import { sendEmail, getFollowUpEmail } from "@/lib/resend";

// ─── GET /api/followup ────────────────────────────────────────────────────────
// Returns all follow-up messages for a lead
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const leadId = searchParams.get("lead_id");
  const db = supabaseAdmin();

  let query = db.from("followup_messages").select("*, leads(name, phone, email, service)").order("step");
  if (leadId) query = query.eq("lead_id", leadId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// ─── POST /api/followup ───────────────────────────────────────────────────────
// Manually trigger a follow-up (or called by a cron job)
// Body: { message_id } OR { lead_id, step, channel }
export async function POST(req) {
  const body = await req.json();
  const db = supabaseAdmin();

  // If message_id passed, send that specific message
  if (body.message_id) {
    return sendFollowUp(db, body.message_id);
  }

  // Process all PENDING messages that are past their scheduled_at
  // This endpoint is called by Vercel Cron (see vercel.json)
  if (body.process_due) {
    const { data: due, error } = await db
      .from("followup_messages")
      .select("*, leads(name, phone, email, service)")
      .eq("status", "pending")
      .lte("scheduled_at", new Date().toISOString())
      .limit(50);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const results = await Promise.allSettled(due.map(msg => sendFollowUp(db, msg.id, msg)));
    const sent = results.filter(r => r.status === "fulfilled").length;
    return NextResponse.json({ processed: due.length, sent });
  }

  return NextResponse.json({ error: "Provide message_id or process_due:true" }, { status: 400 });
}

// ─── HELPER ───────────────────────────────────────────────────────────────────
async function sendFollowUp(db, messageId, prefetched = null) {
  let msg = prefetched;
  if (!msg) {
    const { data } = await db.from("followup_messages").select("*, leads(name,phone,email,service)").eq("id", messageId).single();
    msg = data;
  }
  if (!msg) throw new Error("Message not found");

  const lead = msg.leads;
  let sent = false;

  try {
    if (msg.channel === "sms") {
      const body = getSMSTemplate(msg.step, lead.name) || msg.message_body;
      if (body && process.env.TWILIO_ACCOUNT_SID) {
        await sendSMS(lead.phone, body);
        sent = true;
      }
    }

    if (msg.channel === "email" && lead.email) {
      const template = getFollowUpEmail(msg.step, lead);
      if (template && process.env.RESEND_API_KEY) {
        await sendEmail({ to: lead.email, ...template });
        sent = true;
      }
    }

    await db.from("followup_messages")
      .update({ status: sent ? "sent" : "skipped", sent_at: new Date().toISOString() })
      .eq("id", messageId);

    // Update lead's last_contact and stage
    await db.from("leads")
      .update({ last_contact: new Date().toISOString(), stage: "Follow-Up Sent" })
      .eq("id", msg.lead_id);

    return { id: messageId, status: sent ? "sent" : "skipped" };
  } catch (err) {
    await db.from("followup_messages").update({ status: "failed" }).eq("id", messageId);
    throw err;
  }
}
