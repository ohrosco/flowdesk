import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// ─── GET /api/settings ─────────────────────────────────────────────────────────
// Returns current business settings (single row, id=1)
export async function GET() {
  const db = supabaseAdmin();
  const { data, error } = await db
    .from("settings")
    .select("*")
    .eq("id", 1)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 = no rows returned — not an error on first load
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data || {});
}

// ─── POST /api/settings ────────────────────────────────────────────────────────
// Saves business settings (upserts row id=1)
export async function POST(req) {
  const body = await req.json();

  const allowed = [
    "business_name",
    "business_phone",
    "business_address",
    "open_hour",
    "close_hour",
    "timezone",
    "hours_text",
    "emergency_phone",
    "booking_url",
  ];

  const payload = {};
  for (const key of allowed) {
    if (body[key] !== undefined) {
      payload[key] = body[key];
    }
  }

  payload.updated_at = new Date().toISOString();

  const db = supabaseAdmin();

  // Upsert: try to update row 1, insert if not exists
  const { data, error } = await db
    .from("settings")
    .upsert({ id: 1, ...payload })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}