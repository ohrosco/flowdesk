import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// ─── GET /api/calendar/status?tenant=<business-name> ────────────────────────
// Returns connection status for a tenant's Google Calendar.
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const tenant = searchParams.get("tenant");

  if (!tenant) {
    return NextResponse.json({ error: "tenant query param required" }, { status: 400 });
  }

  const db = supabaseAdmin();
  const { data } = await db
    .from("tenant_calendars")
    .select("google_calendar_email, google_calendar_id, connected_at, updated_at")
    .eq("tenant_name", tenant)
    .single();

  if (!data) {
    return NextResponse.json({ connected: false });
  }

  return NextResponse.json({
    connected: true,
    calendarEmail: data.google_calendar_email,
    calendarId: data.google_calendar_id,
    connectedAt: data.connected_at,
  });
}

// ─── DELETE /api/calendar/status?tenant=<business-name> ─────────────────────
// Disconnects a tenant's Google Calendar (deletes stored tokens).
export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const tenant = searchParams.get("tenant");

  if (!tenant) {
    return NextResponse.json({ error: "tenant query param required" }, { status: 400 });
  }

  const db = supabaseAdmin();
  const { error } = await db
    .from("tenant_calendars")
    .delete()
    .eq("tenant_name", tenant);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, connected: false });
}
