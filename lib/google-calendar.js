import { google } from "googleapis";

// ─── Init Google Calendar client via Service Account ────────────────────────
export function getCalendarClient() {
  const credentials = process.env.GOOGLE_SERVICE_ACCOUNT;
  if (!credentials) return null;

  const auth = new google.auth.JWT({
    email:    JSON.parse(credentials).client_email,
    key:      JSON.parse(credentials).private_key,
    scopes:   ["https://www.googleapis.com/auth/calendar"],
  });

  return google.calendar({ version: "v3", auth });
}

// ─── Create a Google Calendar event from an appointment ──────────────────────
export async function createCalendarEvent(appt) {
  const calendar = getCalendarClient();
  if (!calendar) {
    console.error("Google Calendar: GOOGLE_SERVICE_ACCOUNT not configured, skipping event creation");
    return null;
  }

  const calendarId = process.env.GOOGLE_CALENDAR_ID || "primary";

  // Parse date + time into ISO start/end (assumes 1-hour slots by default)
  const [y, m, d] = appt.appt_date.split("-").map(Number);
  const [hh, mi] = (appt.appt_time || "09:00").split(":").map(Number);
  const startDt = new Date(y, m - 1, d, hh, mi);
  const endDt = new Date(startDt.getTime() + 60 * 60 * 1000); // 1 hr default

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
    const res = await calendar.events.insert({ calendarId, requestBody: event });
    return res.data.id; // Google Calendar event ID
  } catch (err) {
    console.error("Google Calendar: createCalendarEvent failed:", err.message);
    return null;
  }
}

// ─── Update an existing Google Calendar event ────────────────────────────────
export async function updateCalendarEvent(eventId, appt) {
  const calendar = getCalendarClient();
  if (!calendar || !eventId) return null;

  const calendarId = process.env.GOOGLE_CALENDAR_ID || "primary";

  const [y, m, d] = appt.appt_date.split("-").map(Number);
  const [hh, mi] = (appt.appt_time || "09:00").split(":").map(Number);
  const startDt = new Date(y, m - 1, d, hh, mi);
  const endDt = new Date(startDt.getTime() + 60 * 60 * 1000);

  try {
    const res = await calendar.events.update({
      calendarId,
      eventId,
      requestBody: {
        summary: `${appt.appt_type?.charAt(0).toUpperCase() + appt.appt_type?.slice(1) || "Appointment"} — ${appt.lead_name}`,
        description: appt.notes || "",
        start: { dateTime: startDt.toISOString(), timeZone: process.env.GOOGLE_TIMEZONE || "America/Chicago" },
        end:   { dateTime: endDt.toISOString(),   timeZone: process.env.GOOGLE_TIMEZONE || "America/Chicago" },
        attendees: appt.lead_email ? [{ email: appt.lead_email }] : [],
      },
    });
    return res.data.id;
  } catch (err) {
    console.error("Google Calendar: updateCalendarEvent failed:", err.message);
    return null;
  }
}

// ─── Delete a Google Calendar event ──────────────────────────────────────────
export async function deleteCalendarEvent(eventId) {
  const calendar = getCalendarClient();
  if (!calendar || !eventId) return;

  const calendarId = process.env.GOOGLE_CALENDAR_ID || "primary";

  try {
    await calendar.events.delete({ calendarId, eventId });
  } catch (err) {
    console.error("Google Calendar: deleteCalendarEvent failed:", err.message);
  }
}
