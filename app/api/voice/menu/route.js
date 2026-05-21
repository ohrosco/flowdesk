import { NextResponse } from "next/server";
import twilio from "twilio";
import { getTenantById } from "../../../../lib/tenant-lookup";

const VoiceResponse = twilio.twiml.VoiceResponse;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://flowdesk-ruby.vercel.app";

// ─── POST /api/voice/menu ──────────────────────────────────────────────
// Handles DTMF keypress from the IVR menu

export async function POST(req) {
  try {
    // ─── Twilio Signature Validation ─────────────────────────────────────
    const rawBody = await req.text();
    const signature = req.headers.get("x-twilio-signature");
    if (signature && process.env.TWILIO_AUTH_TOKEN) {
      const isValid = twilio.validateRequest(
        process.env.TWILIO_AUTH_TOKEN,
        signature,
        `${process.env.NEXT_PUBLIC_APP_URL}/api/voice/menu`,
        Object.fromEntries(new URLSearchParams(rawBody))
      );
      if (!isValid) {
        return new NextResponse("Invalid signature", { status: 403 });
      }
    }

    const params = new URLSearchParams(rawBody);
    const digits = params.get("Digits") || req.nextUrl.searchParams.get("Digits") || "";
    const callerNumber = params.get("Caller") || req.nextUrl.searchParams.get("Caller") || "unknown";
    const tenantId = req.nextUrl.searchParams.get("tid") || "";
    const tidParam = tenantId ? `&tid=${encodeURIComponent(tenantId)}` : "";

    // ─── Load tenant settings ─────────────────────────────────────────
    const ctx = tenantId ? await getTenantById(tenantId) : null;
    const settings = ctx?.settings || {};
    const businessName = settings.business_name || process.env.NEXT_PUBLIC_BUSINESS_NAME || "FlowDesk";
    const emergencyPhone = settings.emergency_phone || process.env.EMERGENCY_PHONE || "";
    const hoursText = settings.hours_text || process.env.BUSINESS_HOURS_TEXT || "Monday through Friday, 8 AM to 6 PM";
    const address = settings.business_address || process.env.BUSINESS_ADDRESS || "";

    const vr = new VoiceResponse();

    if (digits === "1") {
      // ─── Emergency ──────────────────────────────────────────────────
      if (emergencyPhone && emergencyPhone.startsWith("+")) {
        vr.dial(emergencyPhone);

        fetch(`${APP_URL}/api/voice/emergency-sms`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: emergencyPhone, callerNumber }),
        }).catch(() => {});

        vr.say({ voice: "Polly.Joanna" }, "Your call is being connected. Please hold.");
      } else {
        vr.say({ voice: "Polly.Joanna" }, "Please hold while we connect you to emergency dispatch.");
        vr.hangup();
      }
    } else if (digits === "2") {
      // ─── New Estimate / Service ──────────────────────────────────────
      vr.say({ voice: "Polly.Joanna" }, "Let us get you scheduled. Please enter your 5 digit zip code using your keypad.");
      const gather = vr.gather({
        numDigits: 5,
        action: `${APP_URL}/api/voice/lead-capture?caller=${encodeURIComponent(callerNumber)}${tidParam}`,
        timeout: 10,
      });
      gather.say({ voice: "Polly.Joanna" }, "Enter your 5 digit zip code now.");
      vr.say({ voice: "Polly.Joanna" }, "We did not receive your zip code. Goodbye.");
    } else if (digits === "3") {
      // ─── Business Info ───────────────────────────────────────────────
      vr.say({ voice: "Polly.Joanna" }, `Our business hours are ${hoursText}.`);
      if (address) {
        vr.say({ voice: "Polly.Joanna" }, `We are located at ${address}.`);
      }
      vr.say({ voice: "Polly.Joanna" }, "We will text you a link to book online. Thank you for calling!");

      fetch(`${APP_URL}/api/voice/send-info-sms?phone=${encodeURIComponent(callerNumber)}${tidParam}`, {
        method: "GET",
      }).catch(() => {});

      vr.hangup();
    } else {
      // ─── Invalid Input ──────────────────────────────────────────────
      vr.say({ voice: "Polly.Joanna" }, "Sorry, I did not understand that.");
      vr.redirect(`/api/voice/incoming`);
    }

    return new NextResponse(vr.toString(), {
      headers: { "Content-Type": "text/xml" },
    });
  } catch (err) {
    console.error("menu route error:", err.message);
    const vr = new VoiceResponse();
    vr.say({ voice: "Polly.Joanna" }, "Sorry, something went wrong. Please try again.");
    return new NextResponse(vr.toString(), {
      headers: { "Content-Type": "text/xml" },
    });
  }
}
