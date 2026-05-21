import { NextResponse } from "next/server";
import twilio from "twilio";
import { supabaseAdmin } from "../../../../lib/supabase";
import { getTenantById } from "../../../../lib/tenant-lookup";

const VoiceResponse = twilio.twiml.VoiceResponse;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://flowdesk-ruby.vercel.app";

// ─── POST /api/voice/lead-capture ──────────────────────────────────────
// Handles zip code entry from <Gather> and creates a lead scoped to tenant

export async function POST(req) {
  try {
    // ─── Twilio Signature Validation ─────────────────────────────────────
    const rawBody = await req.text();
    const signature = req.headers.get("x-twilio-signature");
    if (signature && process.env.TWILIO_AUTH_TOKEN) {
      const isValid = twilio.validateRequest(
        process.env.TWILIO_AUTH_TOKEN,
        signature,
        `${process.env.NEXT_PUBLIC_APP_URL}/api/voice/lead-capture`,
        Object.fromEntries(new URLSearchParams(rawBody))
      );
      if (!isValid) {
        return new NextResponse("Invalid signature", { status: 403 });
      }
    }

    const params = new URLSearchParams(rawBody);
    const zipCode = params.get("Digits") || "";
    const callerNumber =
      req.nextUrl.searchParams.get("caller") ||
      params.get("Caller") ||
      "unknown";
    const tenantId = req.nextUrl.searchParams.get("tid") || null;
    const tidParam = tenantId ? `&tid=${encodeURIComponent(tenantId)}` : "";

    // ─── Load tenant settings ─────────────────────────────────────────
    const ctx = tenantId ? await getTenantById(tenantId) : null;
    const settings = ctx?.settings || {};
    const businessName = settings.business_name || process.env.NEXT_PUBLIC_BUSINESS_NAME || "FlowDesk";

    const vr = new VoiceResponse();

    // Validate zip code (5 digits)
    if (zipCode.length !== 5 || !/^\d{5}$/.test(zipCode)) {
      vr.say({ voice: "Polly.Joanna" }, "That does not look like a valid 5 digit zip code. Please try again.");
      const gather = vr.gather({
        numDigits: 5,
        action: `${APP_URL}/api/voice/lead-capture?caller=${encodeURIComponent(callerNumber)}${tidParam}`,
        timeout: 10,
      });
      gather.say({ voice: "Polly.Joanna" }, "Enter your 5 digit zip code.");
      return new NextResponse(vr.toString(), {
        headers: { "Content-Type": "text/xml" },
      });
    }

    // ─── Create lead scoped to tenant ────────────────────────────────
    let leadId = null;
    try {
      const db = supabaseAdmin();
      const insertData = {
        name: "Unknown (Caller)",
        phone: callerNumber,
        service: "Unknown",
        source: "Phone Call",
        notes: JSON.stringify({ zip: zipCode, source: "Phone Call: IVR" }),
        status: "new",
        stage: "New Lead",
      };
      if (tenantId) {
        insertData.tenant_id = tenantId;
      }

      const { data: lead, error } = await db
        .from("leads")
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error("lead-capture: Supabase insert failed:", error.message);
      } else {
        leadId = lead.id;
      }
    } catch (supaErr) {
      console.error("lead-capture: Supabase threw:", supaErr.message);
    }

    // ─── Send follow-up SMS ───────────────────────────────────────────
    const smsPayload = {
      phone: callerNumber,
      text: `Thanks for calling ${businessName}! Reply with your name and what service you need and we will get you scheduled.`,
    };
    if (leadId) smsPayload.leadId = leadId;
    if (tenantId) smsPayload.tenantId = tenantId;

    fetch(`${APP_URL}/api/voice/send-sms`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(smsPayload),
    }).catch(() => {});

    vr.say({ voice: "Polly.Joanna" }, "Thanks! You will receive a text shortly to collect the rest of your information. Goodbye!");
    vr.hangup();

    return new NextResponse(vr.toString(), {
      headers: { "Content-Type": "text/xml" },
    });
  } catch (err) {
    console.error("lead-capture error:", err.message);
    const vr = new VoiceResponse();
    vr.say({ voice: "Polly.Joanna" }, "Sorry, something went wrong. Please try again later.");
    return new NextResponse(vr.toString(), {
      headers: { "Content-Type": "text/xml" },
    });
  }
}
