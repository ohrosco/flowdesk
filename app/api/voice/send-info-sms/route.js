import { NextResponse } from "next/server";
import { sendSMS } from "../../../../lib/twilio";

// ─── GET /api/voice/send-info-sms ──────────────────────────────────────
// Sends booking info SMS to a caller who pressed 3

export async function GET(req) {
  try {
    const phone = req.nextUrl.searchParams.get("phone");
    if (!phone) {
      return NextResponse.json({ error: "Missing phone" }, { status: 400 });
    }

    const businessName = process.env.NEXT_PUBLIC_BUSINESS_NAME || "FlowDesk";
    const bookingUrl = process.env.BOOKING_URL || "our website";

    const message = [
      `Thanks for calling ${businessName}!`,
      ``,
      `📅 Book online: ${bookingUrl}`,
      `📞 Reply anytime for help`,
    ].join("\n");

    const result = await sendSMS(phone, message);
    return NextResponse.json({ ok: true, sid: result.sid });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}