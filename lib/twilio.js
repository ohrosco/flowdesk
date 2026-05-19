import twilio from "twilio";

let _client = null;
let _from = null;
function getClient() {
  if (!_client) {
    const sid = process.env.TWILIO_ACCOUNT_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;
    if (!sid || !token) throw new Error("Twilio not configured");
    _client = twilio(sid, token);
    _from = process.env.TWILIO_PHONE_NUMBER;
  }
  return { client: _client, from: _from };
}

/**
 * Send an SMS message via Twilio
 * @param {string} to   - E.164 format: +15550001234
 * @param {string} body - Message text (max 160 chars for 1 segment)
 */
export async function sendSMS(to, body) {
  // Normalize phone number to E.164
  const normalized = normalizePhone(to);
  if (!normalized) throw new Error(`Invalid phone number: ${to}`);

  const { client, from } = getClient();
  const msg = await client.messages.create({ from, to: normalized, body });
  return { sid: msg.sid, status: msg.status };
}

/**
 * Convert common US phone formats to E.164 (+1xxxxxxxxxx)
 */
function normalizePhone(phone) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits[0] === "1") return `+${digits}`;
  if (digits.length > 10) return `+${digits}`;
  return null;
}

// ─── FOLLOW-UP MESSAGE TEMPLATES ─────────────────────────────────────────────
export function getSMSTemplate(step, leadName, businessName = "us") {
  const first = leadName.split(" ")[0];
  const templates = {
    0: `Hi ${first}! Thanks for reaching out to ${businessName}. We received your request and will be in touch shortly. Reply STOP to opt out.`,
    3: `Hey ${first}, just checking in! We'd love to get you a free estimate. Are you still interested? Reply or call us anytime.`,
    5: `Hi ${first}, last follow-up from ${businessName}. We'd still love to help — just reply or call when you're ready. No pressure!`,
  };
  return templates[step] || null;
}
