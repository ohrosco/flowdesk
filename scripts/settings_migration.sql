/*
 * RUN THIS SQL IN SUPABASE SQL Editor
 * https://supabase.com/dashboard/project/dptaxocdmdojlwvepaeb/sql/new
 * 
 * Or paste and run via psql/npx pgtyped
 */

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
