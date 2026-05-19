const { createClient } = require("@supabase/supabase-js");

const PROJECT = "dptaxocdmdojlwvepaeb";
const URL = `https://${PROJECT}.supabase.co`;
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwdGF4b2NkbWRvamx3dmVwYWViIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwOTY3NzY3MCwiZXhwIjoyMDI1MjUzNjcwfQ.6vsBmT9tZxTgJqT_mB6t9pAiINk_X8K2xAi1c9mhYsU";

async function run() {
  // First create the exec_sql function via Management API
  // Or use the SQL API endpoint
  const sql = `
    CREATE OR REPLACE FUNCTION exec_sql(query text)
    RETURNS void
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$ BEGIN EXECUTE query; END; $$;
  `;

  // Try to create function via raw management endpoint
  const res = await fetch(`${URL}/rest/v1/rpc/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: KEY,
      Authorization: `Bearer ${KEY}`,
    },
    body: JSON.stringify({}),
  });

  console.log("RPC test:", res.status, await res.text().catch(() => ""));

  // Try the pg_dump endpoint for direct SQL
  const res2 = await fetch(`${URL}/auth/v1/`, {
    method: "GET",
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${KEY}`,
    },
  });
  console.log("Auth test:", res2.status);

  // Try a direct table query
  const res3 = await fetch(`${URL}/rest/v1/settings`, {
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${KEY}`,
      Prefer: "return=representation",
    },
  });
  console.log("Settings table query:", res3.status, await res3.text().catch(() => ""));

  // Try the migration SQL
  const migrateSQL = `
    CREATE TABLE IF NOT EXISTS settings (
      id              SERIAL PRIMARY KEY,
      business_name   TEXT,
      business_phone  TEXT,
      business_address TEXT,
      open_hour       INTEGER DEFAULT 8,
      close_hour      INTEGER DEFAULT 18,
      timezone        TEXT DEFAULT 'America/Chicago',
      hours_text      TEXT DEFAULT 'Monday through Friday, 8 AM to 6 PM',
      emergency_phone TEXT,
      booking_url     TEXT,
      updated_at      TIMESTAMPTZ DEFAULT now()
    );
    INSERT INTO settings (id, business_name, business_phone, business_address, open_hour, close_hour, timezone, hours_text, emergency_phone, booking_url)
    SELECT 1, NULL, NULL, NULL, 8, 18, 'America/Chicago', 'Monday through Friday, 8 AM to 6 PM', NULL, NULL
    WHERE NOT EXISTS (SELECT 1 FROM settings WHERE id = 1);
  `;

  // Use the management API endpoint
  const res4 = await fetch(`${URL}/rest/v1/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: KEY,
      Authorization: `Bearer ${KEY}`,
      Prefer: "params=single-object",
    },
    body: JSON.stringify({ query: migrateSQL }),
  });
  console.log("SQL exec test:", res4.status, await res4.text().catch(() => ""));
}

run().catch(console.error);
