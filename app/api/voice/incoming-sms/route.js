import { NextResponse } from "next/server";
import twilio from "twilio";
import { supabaseAdmin } from "@/lib/supabase";

const MessagingResponse = twilio.twiml.MessagingResponse;

// ─── SERVICE KEYWORDS (for extracting service from SMS body) ────────────
const SERVICE_KEYWORDS = [
  "plumbing",
  "electrical",
  "hvac",
  "heating",
  "cooling",
  "ac",
  "roofing",
  "roof",
  "painting",
  "paint",
  "landscaping",
  "landscape",
  "cleaning",
  "clean",
  "moving",
  "move",
  "remodeling",
  "remodel",
  "construction",
  "concrete",
  "handyman",
  "repair",
  "installation",
  "install",
  "maintenance",
  "inspection",
  "design",
  "consulting",
  "consultation",
  "drywall",
  "flooring",
  "floor",
  "tile",
  "carpentry",
  "fencing",
  "fence",
  "deck",
  "paving",
  "pest",
  "exterminat",
];

// ─── HELPERS ─────────────────────────────────────────────────────────────

/** Extract a probable name from the first 1-2 words of the message */
function extractName(msg) {
  const words = msg.trim().replace(/[,.!?]+$/, "").split(/\s+/);
  if (words.length === 0) return null;
  if (words.length === 1) return words[0];
  // Skip common greeting words when extracting a name
  const greetings = new Set([
    "hi",
    "hello",
    "hey",
    "yo",
    "sup",
    "good",
    "morning",
    "afternoon",
    "evening",
  ]);
  const startIdx = greetings.has(words[0].toLowerCase()) &&
    words.length > 1
    ? 1
    : 0;
  // Take at most 2 meaningful words as the name
  return words.slice(startIdx, startIdx + 2).join(" ");
}

/** Find a known service keyword in the message */
function extractService(msg) {
  const lower = msg.toLowerCase();
  for (const kw of SERVICE_KEYWORDS) {
    if (lower.includes(kw)) {
      // Capitalize first letter
      return kw.charAt(0).toUpperCase() + kw.slice(1);
    }
  }
  return null;
}

/** Append an interaction entry to the notes JSON array */
function appendToNotes(existingNotesRaw, newEntry) {
  let notes = [];
  try {
    if (existingNotesRaw) {
      const parsed = JSON.parse(existingNotesRaw);
      if (Array.isArray(parsed)) {
        notes = parsed;
      } else {
        // Wrap single object in array
        notes = [parsed];
      }
    }
  } catch {
    // If notes is a plain string, preserve it as a previous entry
    if (existingNotesRaw && typeof existingNotesRaw === "string") {
      notes = [{ previous: existingNotesRaw }];
    }
  }
  notes.push(newEntry);
  return JSON.stringify(notes);
}

// ─── POST /api/voice/incoming-sms ───────────────────────────────────────
// Handles incoming SMS webhook from Twilio

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
  req.text = () => Promise.resolve(rawBody);

  try {
    // 1. Parse Twilio's form-encoded POST body
    const rawText = await req.text();
    const params = new URLSearchParams(rawText);
    const fromNumber = params.get("From") || "";
    const messageBody = params.get("Body") || "";
    const messageSid = params.get("MessageSid") || "";

    // Log inbound SMS for debugging
    console.log(
      `incoming-sms: from=${fromNumber} body="${messageBody.substring(0, 100)}" sid=${messageSid}`
    );

    // Must have a sender
    if (!fromNumber) {
      console.error("incoming-sms: missing From number");
      return respondTwiML(new MessagingResponse());
    }

    const db = supabaseAdmin();

    // 2. Look up lead by phone number
    const { data: existingLead, error: lookupError } = await db
      .from("leads")
      .select("*")
      .eq("phone", fromNumber)
      .maybeSingle();

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

      // Extract name if current name is unknown or missing
      const currentName = (existingLead.name || "").trim();
      if (!currentName || currentName === "Unknown (Caller)" || currentName === "Unknown (SMS)") {
        const extracted = extractName(messageBody);
        if (extracted) {
          updates.name = extracted;
        }
      }

      // Extract service if current service is unknown or missing
      const currentService = (existingLead.service || "").trim();
      if (!currentService || currentService === "Unknown") {
        const extracted = extractService(messageBody);
        if (extracted) {
          updates.service = extracted;
        }
      }

      // Append SMS reply to notes
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
        console.log(
          `incoming-sms: updated lead ${existingLead.id} (${existingLead.name || "unknown"})`
        );
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
        notes: JSON.stringify([
          {
            type: "sms_reply",
            from: fromNumber,
            message: messageBody,
            message_sid: messageSid,
            timestamp,
          },
        ]),
        status: "new",
        stage: "SMS Reply Received",
      };

      const { error: insertError } = await db.from("leads").insert(newLead);

      if (insertError) {
        console.error("incoming-sms: create lead failed:", insertError.message);
      } else {
        console.log(`incoming-sms: created new lead for ${fromNumber}`);
      }
    }

    // 3. Return empty TwiML response (Twilio default behaviour — no reply sent)
    return respondTwiML(new MessagingResponse());
  } catch (err) {
    console.error("incoming-sms: unexpected error:", err.message);
    // Always return valid TwiML even on error
    return respondTwiML(new MessagingResponse());
  }
}

/** Helper: wrap a TwiML object in a NextResponse with XML content-type */
function respondTwiML(twiml) {
  return new NextResponse(twiml.toString(), {
    headers: { "Content-Type": "text/xml" },
  });
}
