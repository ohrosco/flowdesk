import { NextResponse } from "next/server";
import twilio from "twilio";
import { getTenantByPhone } from "../../../../lib/tenant-lookup";

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

  const params = new URLSearchParams(rawBody);
  const toNumber = params.get("To") || "";

  // ─── Tenant lookup ────────────────────────────────────────────────────
  const ctx = await getTenantByPhone(toNumber);
  const tenantId = ctx?.tenant?.id || null;
  const settings = ctx?.settings || {};
  const businessName = settings.business_name || process.env.NEXT_PUBLIC_BUSINESS_NAME || "FlowDesk";
  const openHour = parseInt(settings.open_hour ?? process.env.BUSINESS_OPEN_HOUR ?? "8", 10);
  const closeHour = parseInt(settings.close_hour ?? process.env.BUSINESS_CLOSE_HOUR ?? "18", 10);
  const tz = settings.timezone || process.env.BUSINESS_TIMEZONE || "America/New_York";

  // ─── After-hours detection ────────────────────────────────────────────
  const now = new Date();
  const hourStr = now.toLocaleString("en-US", { timeZone: tz, hour: "numeric", hour12: false });
  const hour = parseInt(hourStr, 10);
  const dowStr = now.toLocaleString("en-US", { timeZone: tz, weekday: "short" });
  const isWeekend = dowStr === "Sat" || dowStr === "Sun";
  const isAfterHours = isWeekend || hour < openHour || hour >= closeHour;

  const tidParam = tenantId ? `&tid=${encodeURIComponent(tenantId)}` : "";
  const vr = new VoiceResponse();

  if (isAfterHours) {
    vr.say({ voice: "Polly.Joanna" }, `Thanks for calling ${businessName}. We are currently closed.`);
    const g = vr.gather({ numDigits: 1, action: `/api/voice/menu?source=afterhours${tidParam}`, timeout: 8 });
    g.say({ voice: "Polly.Joanna" }, "For emergencies press 1. To leave a message press 2.");
    vr.redirect(`/api/voice/incoming`);
  } else {
    vr.say({ voice: "Polly.Joanna" }, `Thanks for calling ${businessName}!`);
    const g = vr.gather({ numDigits: 1, action: `/api/voice/menu?source=hours${tidParam}`, timeout: 5 });
    g.say({ voice: "Polly.Joanna" }, "Press 1 for emergencies. Press 2 for a free estimate. Press 3 for hours and location.");
    vr.redirect(`/api/voice/incoming`);
  }

  return new NextResponse(vr.toString(), {
    headers: { "Content-Type": "text/xml" },
  });
}
