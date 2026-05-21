import { NextResponse } from "next/server";
import twilio from "twilio";
import { supabaseAdmin } from "@/lib/supabase";
import { getTenantByPhone } from "@/lib/tenant-lookup";

const MessagingResponse = twilio.twiml.MessagingResponse;

// ─── SERVICE KEYWORDS (for extracting service from SMS body) ────────────
const SERVICE_KEYWORDS = [
  "plumbing", "electrical", "hvac", "heating", "cooling", "ac",
  "roofing", "roof", "painting", "paint", "landscaping", "landscape",
  "cleaning", "clean", "moving", "move", "remodeling", "remodel",
  "construction", "concrete", "handyman", "repair", "installation",
  "install", "maintenance", "inspection", "design", "consulting",
  "consultation", "drywall", "flooring", "floor", "tile", "carpentry",
  "fencing", "fence", "deck", "paving", "pest", "exterminat",
];

// ─── HELPERS ─────────────────────────────────────────────────────────────

function extractName(msg) {
  const words = msg.trim().replace(/[,.!?]+$/, "").split(/\s+/);
  if (words.length === 0) return null;
  if (words.length === 1) return words[0];
  const greetings = new Set(["hi", "hello", "hey", "yo", "sup", "good", "morning", "afternoon", "evening"]);
  const startIdx = greetings.has(words[0].toLowerCase()) && words.length > 1 ? 1 : 0;
  return words.slice(startIdx, startIdx + 2).join(" ");
}

function extractService(msg) {
  const lower = msg.toLowerCase();
  for (const kw of SERVICE_KEYWORDS) {
    if (lower.includes(kw)) {
      return kw.charAt(0).toUpperCase() + kw.slice(1);
    }
  }
  return null;
}

function appendToNotes(existingNotesRaw, newEntry) {
  let notes = [];
  try {
    if (existingNotesRaw) {
      const parsed = JSON.parse(existingNotesRaw);
      notes = Array.isArray(parsed) ? parsed : [parsed];
    }
  } catch {
    if (existingNotesRaw && typeof existingNotesRaw === "string") {
      notes = [{ previous: existingNotesRaw }];
    }
  }
  notes.push(newEntry);
  return JSON.stringify(notes);
}

// ─── POST /api/voice/incoming-sms ───────────────────────────────────────

export async function POST(req) {
  // ─── Twilio Signature Validation ─────────────────────────────────────
  const rawBody = await req.text();
  const signature = req.headers.get("x-twilio-signature");
  if (signature && process.env.TWILIO_AUTH_TOKEN) {
    const isValid = twilio.validateRequest(
      process.env.TWILIO_AUTH_TOKEN,
      signature,
      `${process.env.NEXT_PUBLIC_APP_URL}/api/voice/incoming-sms`,
      Object.fromEntries(new URLSearchParams(rawBody))
    );
    if (!isValid) {
      return new NextResponse("Invalid signature", { status: 403 });
    }
  }

  try {
    const params = new URLSearchParams(rawBody);
    const fromNumber = params.get("From") || "";
    const toNumber = params.get("To") || "";
    const messageBody = params.get("Body") || "";
    const messageSid = params.get("MessageSid") || "";

    console.log(`incoming-sms: from=${fromNumber} to=${toNumber} body="${messageBody.substring(0, 100)}" sid=${messageSid}`);

    if (!fromNumber) {
      console.error("incoming-sms: missing From number");
      return respondTwiML(new MessagingResponse());
    }

    // ─── Tenant lookup ────────────────────────────────────────────────
    const ctx = await getTenantByPhone(toNumber);
    const tenantId = ctx?.tenant?.id || null;

    const db = supabaseAdmin();

    // ─── Look up lead scoped to tenant ────────────────────────────────
    let leadQuery = db.from("leads").select("*").eq("phone", fromNumber);
    if (tenantId) {
      leadQuery = leadQuery.eq("tenant_id", tenantId);
    }
    const { data: existingLead, error: lookupError } = await leadQuery.maybeSingle();

    if (lookupError) {
      console.error("incoming-sms: lead lookup failed:", lookupError.message);
      return respondTwiML(new MessagingResponse());
    }

    const timestamp = new Date().toISOString();

    if (existingLead) {
      // ── LEAD FOUND — update existing ──────────────────────────────────
      const updates = {
        stage: "SMS Reply Received",
        last_contact: timestamp,
      };

      const currentName = (existingLead.name || "").trim();
      if (!currentName || currentName === "Unknown (Caller)" || currentName === "Unknown (SMS)") {
        const extracted = extractName(messageBody);
        if (extracted) updates.name = extracted;
      }

      const currentService = (existingLead.service || "").trim();
      if (!currentService || currentService === "Unknown") {
        const extracted = extractService(messageBody);
        if (extracted) updates.service = extracted;
      }

      updates.notes = appendToNotes(existingLead.notes, {
        type: "sms_reply",
        from: fromNumber,
        message: messageBody,
        message_sid: messageSid,
        timestamp,
      });

      const { error: updateError } = await db
        .from("leads")
        .update(updates)
        .eq("id", existingLead.id);

      if (updateError) {
        console.error("incoming-sms: update lead failed:", updateError.message);
      } else {
        console.log(`incoming-sms: updated lead ${existingLead.id} (${existingLead.name || "unknown"})`);
      }
    } else {
      // ── LEAD NOT FOUND — create new ──────────────────────────────────
      const extractedName = extractName(messageBody);
      const extractedService = extractService(messageBody);

      const newLead = {
        name: extractedName || "Unknown (SMS)",
        phone: fromNumber,
        service: extractedService || "Unknown",
        source: "SMS",
        notes: JSON.stringify([{
          type: "sms_reply",
          from: fromNumber,
          message: messageBody,
          message_sid: messageSid,
          timestamp,
        }]),
        status: "new",
        stage: "SMS Reply Received",
      };
      if (tenantId) newLead.tenant_id = tenantId;

      const { error: insertError } = await db.from("leads").insert(newLead);

      if (insertError) {
        console.error("incoming-sms: create lead failed:", insertError.message);
      } else {
        console.log(`incoming-sms: created new lead for ${fromNumber} (tenant=${tenantId || "none"})`);
      }
    }

    return respondTwiML(new MessagingResponse());
  } catch (err) {
    console.error("incoming-sms: unexpected error:", err.message);
    return respondTwiML(new MessagingResponse());
  }
}

function respondTwiML(twiml) {
  return new NextResponse(twiml.toString(), {
    headers: { "Content-Type": "text/xml" },
  });
}
