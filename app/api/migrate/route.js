import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { requireInternalAuth } from "@/lib/auth";

export async function GET(req) {
  const authCheck = requireInternalAuth(req);
  if (authCheck) return authCheck;
  const sql = `
-- Create settings table for business configuration (single row, single tenant)
CREATE TABLE IF NOT EXISTS settings (
  id            SERIAL PRIMARY KEY,
  business_name TEXT,
  business_phone TEXT,
  business_address TEXT,
  open_hour     INTEGER DEFAULT 8,
  close_hour    INTEGER DEFAULT 18,
  timezone      TEXT DEFAULT 'America/Chicago',
  hours_text    TEXT DEFAULT 'Monday through Friday, 8 AM to 6 PM',
  emergency_phone TEXT,
  booking_url   TEXT,
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- Seed default row if not exists
INSERT INTO settings (id, business_name, business_phone, business_address, open_hour, close_hour, timezone, hours_text, emergency_phone, booking_url)
SELECT 1, NULL, NULL, NULL, 8, 18, 'America/Chicago', 'Monday through Friday, 8 AM to 6 PM', NULL, NULL
WHERE NOT EXISTS (SELECT 1 FROM settings WHERE id = 1);
`;

  try {
    // Use supabaseAdmin to run raw SQL via .rpc or directly
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: "Supabase credentials not configured" },
        { status: 500 }
      );
    }

    const db = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });

    // Execute raw SQL using Supabase's REST endpoint
    const { error } = await db.rpc("exec_sql", { query: sql });

    if (error && error.message.includes("function exec_sql")) {
      // Fallback: try direct SQL via POST to the Supabase REST API
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
        },
        body: JSON.stringify({ query: sql }),
      });

      if (!response.ok) {
        const text = await response.text();
        // If the function doesn't exist, create it first
        if (text.includes("function") || text.includes("not found")) {
          // Create the exec_sql function
          const createFnResponse = await fetch(`${supabaseUrl}/rest/v1/rpc/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              apikey: serviceRoleKey,
              Authorization: `Bearer ${serviceRoleKey}`,
              Prefer: "params=single-object",
            },
            body: JSON.stringify({
              query: `
CREATE OR REPLACE FUNCTION exec_sql(query text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE query;
END;
$$;
              `.trim(),
            }),
          });

          if (!createFnResponse.ok) {
            // Try another approach: run via SQL endpoint
            const sqlResponse = await fetch(
              `${supabaseUrl}/rest/v1/`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  apikey: serviceRoleKey,
                  Authorization: `Bearer ${serviceRoleKey}`,
                  Prefer: "resolution=merge-duplicates",
                },
                body: JSON.stringify({}),
              }
            );
          }
        }
      }

      // Try direct PostgreSQL connection via pg if available
      return NextResponse.json({
        message:
          "Migration SQL generated. The settings table needs to be created via Supabase SQL editor or pg client. See the SQL above.",
        status: "sql_needs_manual_run",
        sql,
      });
    }

    if (error) {
      return NextResponse.json({ error: error.message, sql }, { status: 500 });
    }

    return NextResponse.json({
      message: "Migration complete — settings table created/verified.",
      status: "done",
    });
  } catch (err) {
    return NextResponse.json(
      {
        error: err.message,
        message:
          "Migration may need manual SQL execution via Supabase SQL Editor.",
        sql,
      },
      { status: 500 }
    );
  }
}