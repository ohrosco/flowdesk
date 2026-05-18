import { NextResponse } from "next/server";
import { getAuthUrl } from "@/lib/google-calendar";

// ─── GET /api/calendar/auth?tenant=<business-name> ──────────────────────────
// Redirects the user to Google's OAuth consent screen.
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const tenant = searchParams.get("tenant");

  if (!tenant) {
    return NextResponse.json({ error: "tenant query param required (e.g. ?tenant=My+Business)" }, { status: 400 });
  }

  const url = getAuthUrl(tenant);
  if (!url) {
    return NextResponse.json({
      error: "Google Calendar is not configured. Set GOOGLE_OAUTH_CLIENT_ID and GOOGLE_OAUTH_CLIENT_SECRET.",
    }, { status: 500 });
  }

  return NextResponse.redirect(url);
}
