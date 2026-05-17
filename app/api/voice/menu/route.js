import { NextResponse } from "next/server";
import twilio from "twilio";

const VoiceResponse = twilio.twiml.VoiceResponse;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://flowdesk-ruby.vercel.app";

// ─── POST /api/voice/menu ──────────────────────────────────────────────
// Handles DTMF keypress from the IVR menu

export async function POST(req) {
  try {
    const text = await req.text();
    const params = new URLSearchParams(text);
    const digits = params.get("Digits") || req.nextUrl.searchParams.get("Digits") || "";
    const callerNumber = params.get("Caller") || req.nextUrl.searchParams.get("Caller") || "unknown";
    const source = req.nextUrl.searchParams.get("source") || "";
    const businessName = process.env.NEXT_PUBLIC_BUSINESS_NAME || "FlowDesk";
    const vr = new VoiceResponse();

    if (digits === "1") {
      // ─── Emergency ──────────────────────────────────────────────────
      const emergencyPhone = process.env.EMERGENCY_PHONE;
      if (emergencyPhone && emergencyPhone.startsWith("+")) {
        vr.dial(emergencyPhone);

        // Fire SMS alert (don't wait for it — fire-and-forget)
        fetch(`${APP_URL}/api/voice/emergency-sms`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: emergencyPhone, callerNumber }),
        }).catch(() => {});

        vr.say({ voice: "Polly.Joanna" }, "Your call is being connected. Please hold.");
      } else {
        vr.say(
          { voice: "Polly.Joanna" },
          "Please hold while we connect you to emergency dispatch."
        );
        vr.hangup();
      }
    } else if (digits === "2") {
      // ─── New Estimate / Service ──────────────────────────────────────
      vr.say(
        { voice: "Polly.Joanna" },
        "Let's get you scheduled. Please enter your 5 digit zip code using your keypad."
      );
      const gather = vr.gather({
        numDigits: 5,
        action: `${APP_URL}/api/voice/lead-capture?caller=${encodeURIComponent(callerNumber)}`,
        timeout: 10,
      });
      gather.say(
        { voice: "Polly.Joanna" },
        "Enter your 5 digit zip code now."
      );
      vr.say(
        { voice: "Polly.Joanna" },
        "We didn't receive your zip code. Goodbye."
      );
    } else if (digits === "3") {
      // ─── Business Info ───────────────────────────────────────────────
      const hoursText = process.env.BUSINESS_HOURS_TEXT || "Monday through Friday, 8 AM to 6 PM";
      const address = process.env.BUSINESS_ADDRESS || "";

      vr.say(
        { voice: "Polly.Joanna" },
        `Our business hours are ${hoursText}.`
      );
      if (address) {
        vr.say(
          { voice: "Polly.Joanna" },
          `We're located at ${address}.`
        );
      }
      vr.say(
        { voice: "Polly.Joanna" },
        "We'll text you a link to book online. Thank you for calling!"
      );

      // Send SMS with booking info (fire-and-forget)
      fetch(`${APP_URL}/api/voice/send-info-sms?phone=${encodeURIComponent(callerNumber)}`, {
        method: "GET",
      }).catch(() => {});

      vr.hangup();
    } else {
      // ─── Invalid Input ──────────────────────────────────────────────
      vr.say({ voice: "Polly.Joanna" }, "Sorry, I didn't understand that.");
      vr.redirect("/api/voice/incoming");
    }

    return new NextResponse(vr.toString(), {
      headers: { "Content-Type": "text/xml" },
    });
  } catch (err) {
    const vr = new VoiceResponse();
    vr.say({ voice: "Polly.Joanna" }, "Sorry, something went wrong. Please try again.");
    return new NextResponse(vr.toString(), {
      headers: { "Content-Type": "text/xml" },
    });
  }
}