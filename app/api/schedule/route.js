import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { sendSMS } from "@/lib/twilio";
import { sendAppointmentConfirmation } from "@/lib/resend";

// ─── GET /api/schedule ────────────────────────────────────────────────────────
export async function GET(req) {
  const db = supabaseAdmin();
  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month"); // e.g. "2026-05"

  let query = db.from("appointments").select("*").order("appt_date").order("appt_time");
  if (month) query = query.gte("appt_date", `${month}-01`).lt("appt_date", nextMonth(month));

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// ─── POST /api/schedule ───────────────────────────────────────────────────────
export async function POST(req) {
  const body = await req.json();
  const { lead_id, lead_name, lead_phone, lead_email, appt_type, appt_date, appt_time, notes, reminder_24h, reminder_2h } = body;

  if (!lead_name || !lead_phone || !appt_date || !appt_time) {
    return NextResponse.json({ error: "lead_name, lead_phone, appt_date, and appt_time are required" }, { status: 400 });
  }

  const db = supabaseAdmin();

  // Insert appointment
  const { data: appt, error } = await db
    .from("appointments")
    .insert({ lead_id, lead_name, lead_phone, appt_type: appt_type || "estimate", appt_date, appt_time, notes, reminder_24h: reminder_24h !== false, reminder_2h: reminder_2h !== false })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Update lead stage
  if (lead_id) {
    await db.from("leads").update({ stage: "Estimate Scheduled", status: "hot" }).eq("id", lead_id);
  }

  // Fire confirmation SMS
  const smsBody = `Hi ${lead_name.split(" ")[0]}! Your ${appt_type || "estimate"} is confirmed for ${appt_date} at ${appt_time}. Reply STOP to opt out.`;
  if (process.env.TWILIO_ACCOUNT_SID) {
    try { await sendSMS(lead_phone, smsBody); } catch (e) { console.error("SMS failed:", e.message); }
  }

  // Fire confirmation email
  if (lead_email && process.env.RESEND_API_KEY) {
    try { await sendAppointmentConfirmation({ ...appt, email: lead_email }); } catch (e) { console.error("Email failed:", e.message); }
  }

  return NextResponse.json(appt, { status: 201 });
}

function nextMonth(month) {
  const [y, m] = month.split("-").map(Number);
  return m === 12 ? `${y + 1}-01` : `${y}-${String(m + 1).padStart(2, "0")}`;
}
