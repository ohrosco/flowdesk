import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { hashPassword, getAllTenants } from "@/lib/tenant";

// ─── GET /api/tenants ──────────────────────────────────────────────────────────
// List all tenants. Agency-only — protected by middleware.
export async function GET() {
  const tenants = await getAllTenants();
  return NextResponse.json(tenants);
}

// ─── POST /api/tenants ─────────────────────────────────────────────────────────
// Create a new sub-account (tenant). Agency-only.
export async function POST(req) {
  try {
    const body = await req.json();
    const { name, slug, password, owner_email, plan, business_phone, twilio_number, notes } = body;

    if (!name || !slug || !password) {
      return NextResponse.json(
        { error: "name, slug, and password are required" },
        { status: 400 }
      );
    }

    // Validate slug format
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json(
        { error: "slug must be lowercase letters, numbers, and hyphens only" },
        { status: 400 }
      );
    }

    const db = supabaseAdmin();
    const password_hash = hashPassword(password);

    const { data, error } = await db
      .from("tenants")
      .insert({
        name,
        slug,
        password_hash,
        owner_email: owner_email || null,
        plan: plan || "starter",
        business_phone: business_phone || null,
        twilio_number: twilio_number || null,
        notes: notes || null,
        active: true,
        subscription_status: "trial",
        trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .select("id, slug, name, owner_email, plan, subscription_status, trial_ends_at, created_at")
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: "A tenant with this slug already exists" }, { status: 409 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Seed default settings row for this tenant
    await db.from("settings").insert({
      tenant_id: data.id,
      business_name: name,
      business_phone: business_phone || null,
    }).onConflict("tenant_id").ignore();

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ─── PATCH /api/tenants ────────────────────────────────────────────────────────
// Update a tenant (plan, status, notes, password reset, etc.). Agency-only.
export async function PATCH(req) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    // Hash password if being reset
    if (updates.password) {
      updates.password_hash = hashPassword(updates.password);
      delete updates.password;
    }

    // Don't allow direct slug change without validation
    if (updates.slug && !/^[a-z0-9-]+$/.test(updates.slug)) {
      return NextResponse.json({ error: "Invalid slug format" }, { status: 400 });
    }

    updates.updated_at = new Date().toISOString();

    const db = supabaseAdmin();
    const { data, error } = await db
      .from("tenants")
      .update(updates)
      .eq("id", id)
      .select("id, slug, name, owner_email, plan, subscription_status, active")
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ─── DELETE /api/tenants ───────────────────────────────────────────────────────
// Deactivate a tenant (soft delete). Agency-only.
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

    const db = supabaseAdmin();
    await db.from("tenants").update({ active: false, updated_at: new Date().toISOString() }).eq("id", id);

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
