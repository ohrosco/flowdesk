const { Pool } = require("pg");

const PW = "Erksteez33@og";
const PROJECT = "dptaxocdmdojlwvepaeb";

async function tryAll() {
  const hosts = [
    // SNI-based approach: set servername
    { host: "aws-0-us-east-1.pooler.supabase.com", port: 5432, user: `postgres.${PROJECT}`, ssl: { rejectUnauthorized: false, servername: `db.${PROJECT}.supabase.co` } },
    { host: "aws-0-us-east-1.pooler.supabase.com", port: 6543, user: `postgres.${PROJECT}`, ssl: { rejectUnauthorized: false, servername: `db.${PROJECT}.supabase.co` } },
    // Try with host as the default host
    { host: `db.${PROJECT}.supabase.co`, port: 5432, user: "postgres", ssl: { rejectUnauthorized: false, servername: `db.${PROJECT}.supabase.co` } },
    // Try connection string format
  ];

  for (const cfg of hosts) {
    try {
      const pool = new Pool({ database: "postgres", password: PW, ...cfg, connectionTimeoutMillis: 8000 });
      const r = await pool.query("SELECT 1 as test");
      console.log(`✅ ${cfg.host}:${cfg.port} — Connected!`);

      await pool.query("alter table appointments add column if not exists google_calendar_event_id text");
      console.log("✅ Column added");
      await pool.query("create index if not exists appts_gcal_idx on appointments(google_calendar_event_id)");
      console.log("✅ Index created");
      await pool.query(`
        create table if not exists tenant_calendars (
          id uuid default gen_random_uuid() primary key,
          tenant_name text not null unique,
          tenant_email text,
          google_refresh_token text,
          google_calendar_id text,
          google_calendar_email text,
          connected_at timestamptz default now(),
          updated_at timestamptz default now()
        )
      `);
      console.log("✅ Table tenant_calendars created");
      await pool.query("create index if not exists tc_tenant_idx on tenant_calendars(tenant_name)");
      await pool.query("alter table tenant_calendars enable row level security");
      await pool.query(`create policy if not exists "public_all_tenant_calendars" on tenant_calendars for all using (true) with check (true)`);
      console.log("\n🚀 ALL MIGRATIONS COMPLETE!");
      await pool.end();
      process.exit(0);
    } catch (e) {
      console.log(`❌ ${cfg.host}:${cfg.port}: ${e.message.substring(0, 100)}`);
    }
  }

  // One more try: connection string format
  try {
    const connStr = `postgresql://postgres.${PROJECT}:${encodeURIComponent(PW)}@aws-0-us-east-1.pooler.supabase.com:5432/postgres`;
    const pool = new Pool({ connectionString: connStr, ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 8000 });
    const r = await pool.query("SELECT 1 as test");
    console.log(`✅ Connection string: Connected!`);
    process.exit(0);
  } catch (e) {
    console.log(`❌ Connection string: ${e.message.substring(0, 100)}`);
  }

  console.log("\nAll failed");
  process.exit(1);
}

tryAll().catch(e => { console.error(e.message); process.exit(1); });
