import { NextResponse } from "next/server";
import { sendSMS } from "../../../../lib/twilio";

// ─── POST /api/voice/send-sms ──────────────────────────────────────────
// Generic internal SMS sender (fire-and-forget from voice handlers)

export async function POST(req) {
  try {
    const { phone, text } = await req.json();
    if (!phone || !text) {
      return NextResponse.json({ error: "Missing phone or text" }, { status: 400 });
    }

    const result = await sendSMS(phone, text);
    return NextResponse.json({ ok: true, sid: result.sid });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}