import { NextResponse } from "next/server";

// Called hourly by Vercel Cron (see vercel.json)
// Triggers the followup processor
export async function GET(req) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const res = await fetch(`${appUrl}/api/followup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ process_due: true }),
  });

  const data = await res.json();
  return NextResponse.json({ ok: true, ...data });
}
