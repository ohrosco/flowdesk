import { NextResponse } from "next/server";
import { sendSMS } from "../../../../lib/twilio";

// ─── POST /api/voice/emergency-sms ─────────────────────────────────────
// Sends an emergency alert SMS to the business owner
// Called internally (fire-and-forget) when caller presses 1

export async function POST(req) {
  try {
    const { phone, callerNumber } = await req.json();
    if (!phone) {
      return NextResponse.json({ error: "Missing phone" }, { status: 400 });
    }

    const timestamp = new Date().toLocaleString("en-US", {
      timeZone: process.env.BUSINESS_TIMEZONE || "America/New_York",
      weekday: "long",
      hour: "2-digit",
      minute: "2-digit",
    });

    const message = [
      `🚨 EMERGENCY CALL`,
      `From: ${callerNumber || "Unknown"}`,
      `Time: ${timestamp}`,
      `This caller pressed 1 for emergency service in the FlowDesk IVR.`,
      ``,
      `Call them back: ${callerNumber}`,
    ].join("\n");

    const result = await sendSMS(phone, message);
    return NextResponse.json({ ok: true, sid: result.sid });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}