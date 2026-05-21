import { supabaseAdmin } from "./supabase";

/**
 * Look up a tenant by their assigned Twilio phone number.
 * Returns { tenant, settings } or null if not found.
 *
 * @param {string} toNumber - The "To" number from Twilio webhook (E.164)
 */
export async function getTenantByPhone(toNumber) {
  if (!toNumber) return null;

  const db = supabaseAdmin();
  const normalized = toNumber.trim();

  const { data: tenant, error } = await db
    .from("tenants")
    .select("*")
    .eq("twilio_number", normalized)
    .eq("active", true)
    .maybeSingle();

  if (error || !tenant) return null;

  const { data: settings } = await db
    .from("settings")
    .select("*")
    .eq("tenant_id", tenant.id)
    .maybeSingle();

  return { tenant, settings: settings || {} };
}

/**
 * Look up a tenant + settings by tenant UUID.
 *
 * @param {string} tenantId - UUID from tenants.id
 */
export async function getTenantById(tenantId) {
  if (!tenantId) return null;

  const db = supabaseAdmin();

  const { data: tenant, error } = await db
    .from("tenants")
    .select("*")
    .eq("id", tenantId)
    .eq("active", true)
    .maybeSingle();

  if (error || !tenant) return null;

  const { data: settings } = await db
    .from("settings")
    .select("*")
    .eq("tenant_id", tenantId)
    .maybeSingle();

  return { tenant, settings: settings || {} };
}
