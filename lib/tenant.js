import { supabaseAdmin } from "@/lib/supabase";

/**
 * Read the tenant_id from the x-tenant-id header set by middleware.
 * Returns null for agency-level requests (no tenant context).
 */
export function getTenantId(request) {
  return request.headers.get("x-tenant-id") || null;
}

/**
 * Look up a tenant by slug. Used at login time.
 */
export async function getTenantBySlug(slug) {
  const db = supabaseAdmin();
  const { data, error } = await db
    .from("tenants")
    .select("*")
    .eq("slug", slug)
    .eq("active", true)
    .single();
  if (error) return null;
  return data;
}

/**
 * Look up a tenant by ID.
 */
export async function getTenantById(id) {
  const db = supabaseAdmin();
  const { data, error } = await db
    .from("tenants")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return data;
}

/**
 * List all tenants (agency view).
 */
export async function getAllTenants() {
  const db = supabaseAdmin();
  const { data, error } = await db
    .from("tenants")
    .select("id, slug, name, owner_email, plan, subscription_status, trial_ends_at, active, created_at")
    .order("created_at", { ascending: false });
  if (error) return [];
  return data;
}

/**
 * Get per-tenant settings row.
 */
export async function getTenantSettings(tenantId) {
  const db = supabaseAdmin();
  const { data } = await db
    .from("settings")
    .select("*")
    .eq("tenant_id", tenantId)
    .maybeSingle();
  return data || {};
}

/**
 * Simple bcrypt-compatible hash using Node's crypto.
 * For production, swap with the `bcrypt` package.
 * We use HMAC-SHA256 here to avoid a native dependency.
 */
import crypto from "crypto";

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .createHmac("sha256", salt)
    .update(password)
    .digest("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const attempt = crypto
    .createHmac("sha256", salt)
    .update(password)
    .digest("hex");
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(attempt));
}

/**
 * Sign a tenant session token.
 * Format: `<tenantId>|<HMAC>`
 */
export function signTenantToken(tenantId, secret) {
  const payload = tenantId;
  const sig = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");
  return `${payload}|${sig}`;
}

/**
 * Verify and extract tenant_id from a signed token.
 * Returns tenant_id string or null if invalid.
 */
export function verifyTenantToken(token, secret) {
  if (!token || !token.includes("|")) return null;
  const lastPipe = token.lastIndexOf("|");
  const payload = token.slice(0, lastPipe);
  const sig = token.slice(lastPipe + 1);
  const expected = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");
  try {
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  } catch {
    return null;
  }
  return payload; // the tenant_id UUID
}
