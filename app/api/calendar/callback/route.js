import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { exchangeCodeForTokens } from "@/lib/google-calendar";

// ─── GET /api/calendar/callback?code=...&state=... ──────────────────────────
// Handles the OAuth callback from Google. Stores refresh token in Supabase.
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  if (error) {
    return new Response(`<h2>Authorization denied</h2><p>Google returned: ${error}</p><a href="/dashboard">← Back to Dashboard</a>`, {
      status: 400,
      headers: { "Content-Type": "text/html" },
    });
  }

  if (!code || !state) {
    return new Response(`<h2>Missing parameters</h2><a href="/dashboard">← Back to Dashboard</a>`, {
      status: 400,
      headers: { "Content-Type": "text/html" },
    });
  }

  let tenantName;
  try {
    tenantName = JSON.parse(state).tenant;
  } catch {
    return new Response(`<h2>Invalid state</h2><a href="/dashboard">← Back to Dashboard</a>`, {
      status: 400,
      headers: { "Content-Type": "text/html" },
    });
  }

  try {
    const { refreshToken, calendarId, calendarEmail } = await exchangeCodeForTokens(code);

    if (!refreshToken) {
      return new Response(`
        <h2>No refresh token received</h2>
        <p>Google didn't return a refresh token. This usually means the account was already authorized before.</p>
        <p>Revoke access at <a href="https://myaccount.google.com/permissions" target="_blank">Google Account Permissions</a> and try again.</p>
        <a href="/dashboard">← Back to Dashboard</a>
      `, { status: 200, headers: { "Content-Type": "text/html" } });
    }

    const db = supabaseAdmin();

    // Upsert: insert or update the tenant's calendar token
    const { error: upsertError } = await db
      .from("tenant_calendars")
      .upsert({
        tenant_name: tenantName,
        google_refresh_token: refreshToken,
        google_calendar_id: calendarId,
        google_calendar_email: calendarEmail,
        updated_at: new Date().toISOString(),
      }, { onConflict: "tenant_name" });

    if (upsertError) {
      return new Response(`<h2>Database error</h2><p>${upsertError.message}</p><a href="/dashboard">← Back to Dashboard</a>`, {
        status: 500,
        headers: { "Content-Type": "text/html" },
      });
    }

    return new Response(`
      <h2>✅ Google Calendar connected!</h2>
      <p>Your calendar <strong>${calendarEmail}</strong> is now linked to <strong>${tenantName}</strong>.</p>
      <p>New bookings will automatically appear on your Google Calendar.</p>
      <a href="/dashboard" style="display:inline-block;margin-top:16px;padding:10px 24px;background:#F0B429;color:#000;text-decoration:none;border-radius:8px;font-weight:600;">← Back to Dashboard</a>
      <script>setTimeout(() => window.close(), 3000)</script>
    `, { status: 200, headers: { "Content-Type": "text/html" } });

  } catch (err) {
    return new Response(`<h2>Error</h2><p>${err.message}</p><a href="/dashboard">← Back to Dashboard</a>`, {
      status: 500,
      headers: { "Content-Type": "text/html" },
    });
  }
}
