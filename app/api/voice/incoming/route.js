import { NextResponse } from "next/server";
import twilio from "twilio";

const VoiceResponse = twilio.twiml.VoiceResponse;

export async function POST(req) {
  // ─── Twilio Signature Validation ─────────────────────────────────────
  const rawBody = await req.text();
  const signature = req.headers.get("x-twilio-signature");
  if (signature && process.env.TWILIO_AUTH_TOKEN) {
    const isValid = twilio.validateRequest(
      process.env.TWILIO_AUTH_TOKEN,
      signature,
      `${process.env.NEXT_PUBLIC_APP_URL}/api/voice/incoming`,
      Object.fromEntries(new URLSearchParams(rawBody))
    );
    if (!isValid) {
      return new NextResponse("Invalid signature", { status: 403 });
    }
  }
  req.text = () => Promise.resolve(rawBody);

  const vr = new VoiceResponse();

  const openHour = parseInt(process.env.BUSINESS_OPEN_HOUR || "8", 10);
  const closeHour = parseInt(process.env.BUSINESS_CLOSE_HOUR || "18", 10);

  const now = new Date();
  const tz = process.env.BUSINESS_TIMEZONE || "America/New_York";
  const hourStr = now.toLocaleString("en-US", { timeZone: tz, hour: "numeric", hour12: false });
  const hour = parseInt(hourStr, 10);
  // Convert UTC day to timezone-aware day using locale
  const dowStr = now.toLocaleString("en-US", { timeZone: tz, weekday: "short" });
  const isWeekend = dowStr === "Sat" || dowStr === "Sun";
  const isAfterHours = isWeekend || hour < openHour || hour >= closeHour;

  if (isAfterHours) {
    vr.say({ voice: "Polly.Joanna" }, "We're currently closed. For emergencies, press 1.");
    const g = vr.gather({ numDigits: 1, action: "/api/voice/menu?source=afterhours", timeout: 8 });
    g.say({ voice: "Polly.Joanna" }, "Press 1 for emergency. Press 2 to leave a message.");
    vr.redirect("/api/voice/incoming");
  } else {
    vr.say({ voice: "Polly.Joanna" }, "Thanks for calling FlowDesk!");
    const g = vr.gather({ numDigits: 1, action: "/api/voice/menu", timeout: 5 });
    g.say({ voice: "Polly.Joanna" }, "Press 1 for emergency. Press 2 for a free estimate. Press 3 for hours.");
    vr.redirect("/api/voice/incoming");
  }

  return new NextResponse(vr.toString(), {
    headers: { "Content-Type": "text/xml" },
  });
}
