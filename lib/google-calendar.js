import { google } from "googleapis";

// ─── OAuth2 client for multi-tenant Google Calendar ─────────────────────────
// Uses the shared GCP OAuth client credentials + per-tenant refresh tokens.

const SCOPES = ["https://www.googleapis.com/auth/calendar"];

export function getOAuth2Client() {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;

  return new google.auth.OAuth2({
    clientId,
    clientSecret,
    redirectUri: process.env.GOOGLE_OAUTH_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL || ""}/api/calendar/callback`,
  });
}

// ─── Generate Google OAuth consent URL for a tenant ─────────────────────────
export function getAuthUrl(tenantName) {
  const oauth2 = getOAuth2Client();
  if (!oauth2) return null;

  return oauth2.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",                          // force refresh token every time
    state: JSON.stringify({ tenant: tenantName }),
  });
}

// ─── Exchange auth code for tokens ──────────────────────────────────────────
export async function exchangeCodeForTokens(code) {
  const oauth2 = getOAuth2Client();
  if (!oauth2) throw new Error("Google OAuth not configured");

  const { tokens } = await oauth2.getToken(code);
  oauth2.setCredentials(tokens);

  // Fetch the user's calendar email to display in UI
  const calendar = google.calendar({ version: "v3", auth: oauth2 });
  const { data: calList } = await calendar.calendarList.list();
  const primaryCal = calList.items?.find(c => c.primary) || calList.items?.[0];

  return {
    refreshToken: tokens.refresh_token,
    calendarId: primaryCal?.id || "primary",
    calendarEmail: primaryCal?.summary || "Primary Calendar",
  };
}

// ─── Get an authenticated Calendar client for a specific tenant ─────────────
export async function getTenantCalendarClient(tenantName) {
  const oauth2 = getOAuth2Client();
  if (!oauth2) throw new Error("Google OAuth not configured");

  // Fetch tenant's refresh token from Supabase
  const { supabaseAdmin } = await import("@/lib/supabase");
  const db = supabaseAdmin();
  const { data: tenant } = await db
    .from("tenant_calendars")
    .select("google_refresh_token, google_calendar_id")
    .eq("tenant_name", tenantName)
    .single();

  if (!tenant?.google_refresh_token) return null;

  oauth2.setCredentials({ refresh_token: tenant.google_refresh_token });

  return {
    client: google.calendar({ version: "v3", auth: oauth2 }),
    calendarId: tenant.google_calendar_id || "primary",
  };
}

// ─── Parse "2:00 PM" or "09:00" into hours/minutes ────────────────────────
function parseTime(timeStr) {
  if (!timeStr) return [9, 0];
  const trimmed = timeStr.trim().toUpperCase();
  const isPM = trimmed.includes("PM");
  const isAM = trimmed.includes("AM");
  const clean = trimmed.replace(/[^0-9:]/g, "");
  const [h, m] = clean.split(":").map(Number);
  let hour = h || 9;
  const min = m || 0;
  if (isPM && hour !== 12) hour += 12;
  if (isAM && hour === 12) hour = 0;
  return [hour, min];
}

// ─── Create a Google Calendar event for a tenant ────────────────────────────
export async function createCalendarEvent(tenantName, appt) {
  const calCtx = await getTenantCalendarClient(tenantName);
  if (!calCtx) {
    console.error(`Google Calendar: no token for tenant "${tenantName}", skipping`);
    return null;
  }

  const { client, calendarId } = calCtx;
  const [y, m, d] = appt.appt_date.split("-").map(Number);
  const [hh, mi] = parseTime(appt.appt_time);
  const startDt = new Date(y, m - 1, d, hh, mi);
  const endDt = new Date(startDt.getTime() + 60 * 60 * 1000);

  const event = {
    summary: `${appt.appt_type?.charAt(0).toUpperCase() + appt.appt_type?.slice(1) || "Appointment"} — ${appt.lead_name}`,
    description: appt.notes || "",
    start:   { dateTime: startDt.toISOString(), timeZone: process.env.GOOGLE_TIMEZONE || "America/Chicago" },
    end:     { dateTime: endDt.toISOString(),   timeZone: process.env.GOOGLE_TIMEZONE || "America/Chicago" },
    attendees: appt.lead_email ? [{ email: appt.lead_email }] : [],
    reminders: {
      useDefault: false,
      overrides: [
        { method: "email", minutes: 24 * 60 },
        { method: "popup", minutes: 30 },
      ],
    },
  };

  try {
    const res = await client.events.insert({ calendarId, requestBody: event });
    return res.data.id;
  } catch (err) {
    console.error(`Google Calendar: create failed for "${tenantName}":`, err.message);
    return null;
  }
}

// ─── Update an existing event ───────────────────────────────────────────────
export async function updateCalendarEvent(tenantName, eventId, appt) {
  const calCtx = await getTenantCalendarClient(tenantName);
  if (!calCtx || !eventId) return null;
  const { client, calendarId } = calCtx;

  const [y, m, d] = appt.appt_date.split("-").map(Number);
  const [hh, mi] = parseTime(appt.appt_time);
  const startDt = new Date(y, m - 1, d, hh, mi);
  const endDt = new Date(startDt.getTime() + 60 * 60 * 1000);

  try {
    await client.events.update({
      calendarId, eventId,
      requestBody: {
        summary: `${appt.appt_type?.charAt(0).toUpperCase() + appt.appt_type?.slice(1) || "Appointment"} — ${appt.lead_name}`,
        description: appt.notes || "",
        start: { dateTime: startDt.toISOString(), timeZone: process.env.GOOGLE_TIMEZONE || "America/Chicago" },
        end:   { dateTime: endDt.toISOString(),   timeZone: process.env.GOOGLE_TIMEZONE || "America/Chicago" },
        attendees: appt.lead_email ? [{ email: appt.lead_email }] : [],
      },
    });
    return eventId;
  } catch (err) {
    console.error(`Google Calendar: update failed for "${tenantName}":`, err.message);
    return null;
  }
}

// ─── Delete an event ────────────────────────────────────────────────────────
export async function deleteCalendarEvent(tenantName, eventId) {
  const calCtx = await getTenantCalendarClient(tenantName);
  if (!calCtx || !eventId) return;
  const { client, calendarId } = calCtx;

  try {
    await client.events.delete({ calendarId, eventId });
  } catch (err) {
    console.error(`Google Calendar: delete failed for "${tenantName}":`, err.message);
  }
}
