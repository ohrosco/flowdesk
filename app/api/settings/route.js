import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getTenantId } from "@/lib/tenant";

const DEFAULT_TENANT_ID = "00000000-0000-0000-0000-000000000001";

// ─── GET /api/settings ─────────────────────────────────────────────────────────
export async function GET(req) {
  const tenantId = getTenantId(req) || DEFAULT_TENANT_ID;
  const db = supabaseAdmin();
  const { data, error } = await db
    .from("settings")
    .select("*")
    .eq("tenant_id", tenantId)
    .single();

  if (error && error.code !== "PGRST116") {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data || {});
}

// ─── POST /api/settings ────────────────────────────────────────────────────────
export async function POST(req) {
  const tenantId = getTenantId(req) || DEFAULT_TENANT_ID;
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

  const { data, error } = await db
    .from("settings")
    .upsert({ tenant_id: tenantId, ...payload }, { onConflict: "tenant_id" })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.messa