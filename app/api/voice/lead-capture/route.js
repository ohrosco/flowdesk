import { NextResponse } from "next/server";
import twilio from "twilio";
import { supabaseAdmin } from "../../../../lib/supabase";

const VoiceResponse = twilio.twiml.VoiceResponse;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://flowdesk-ruby.vercel.app";

// ─── POST /api/voice/lead-capture ──────────────────────────────────────
// Handles zip code entry from <Gather> and creates a lead

export async function POST(req) {
  try {
    const text = await req.text();
    const params = new URLSearchParams(text);
    const zipCode = params.get("Digits") || "";
    const callerNumber =
      req.nextUrl.searchParams.get("caller") ||
      params.get("Caller") ||
      "unknown";
    const businessName = process.env.NEXT_PUBLIC_BUSINESS_NAME || "FlowDesk";
    const vr = new VoiceResponse();

    // Validate zip code (5 digits)
    if (zipCode.length !== 5 || !/^\d{5}$/.test(zipCode)) {
      vr.say(
        { voice: "Polly.Joanna" },
        "That doesn't look like a valid 5 digit zip code. Please try again."
      );
      const gather = vr.gather({
        numDigits: 5,
        action: `${APP_URL}/api/voice/lead-capture?caller=${encodeURIComponent(callerNumber)}`,
        timeout: 10,
      });
      gather.say(
        { voice: "Polly.Joanna" },
        "Enter your 5 digit zip code."
      );
      return new NextResponse(vr.toString(), {
        headers: { "Content-Type": "text/xml" },
      });
    }

    // Create lead in Supabase
    let leadId = null;
    try {
      const db = supabaseAdmin();
      const { data: lead, error } = await db
        .from("leads")
        .insert({
          name: "Unknown (Caller)",
          phone: callerNumber,
          service: "Unknown",
          source: "Phone Call",
          notes: JSON.stringify({ zip: zipCode, source: "Phone Call: IVR" }),
          status: "new",
          stage: "New Lead",
        })
        .select()
        .single();

      if (error) {
        console.error("Supabase lead insert failed:", error.message);
      } else {
        leadId = lead.id;
      }
    } catch (supaErr) {
      console.error("Supabase lead insert threw:", supaErr.message);
    }

    // Send SMS to collect name and service details
    const smsPayload = {
      phone: callerNumber,
      text: `Thanks for calling ${businessName}! Reply with your name and what service you need and we'll get you scheduled.`,
    };
    if (leadId) {
      smsPayload.leadId = leadId;
    }
    fetch(`${APP_URL}/api/voice/send-sms`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(smsPayload),
    }).catch(() => {});

    vr.say(
      { voice: "Polly.Joanna" },
      "Thanks! You'll receive a text shortly to collect the rest of your information. Goodbye!"
    );
    vr.hangup();

    return new NextResponse(vr.toString(), {
      headers: { "Content-Type": "text/xml" },
    });
  } catch (err) {
    const vr = new VoiceResponse();
    vr.say({ voice: "Polly.Joanna" }, "Sorry, something went wrong. Please try again later.");
    return new NextResponse(vr.toString(), {
      headers: { "Content-Type": "text/xml" },
    });
  }
}