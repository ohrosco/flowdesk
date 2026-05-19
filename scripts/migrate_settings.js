const { Pool } = require("pg");

const PW = "Erksteez33@og";
const PROJECT = "dptaxocdmdojlwvepaeb";

async function migrate() {
  const configs = [
    { host: "aws-0-us-east-1.pooler.supabase.com", port: 5432, user: `postgres.${PROJECT}`, password: PW, database: "postgres", ssl: { rejectUnauthorized: false, servername: `db.${PROJECT}.supabase.co` }, connectionTimeoutMillis: 8000 },
    { host: "aws-0-us-east-1.pooler.supabase.com", port: 6543, user: `postgres.${PROJECT}`, password: PW, database: "postgres", ssl: { rejectUnauthorized: false, servername: `db.${PROJECT}.supabase.co` }, connectionTimeoutMillis: 8000 },
  ];

  for (const cfg of configs) {
    try {
      console.log(`Trying ${cfg.host}:${cfg.port}...`);
      const pool = new Pool(cfg);
      await pool.query("SELECT 1");
      console.log("Connected!");

      await pool.query(`
        CREATE TABLE IF NOT EXISTS settings (
          id SERIAL PRIMARY KEY,
          business_name   TEXT,
          business_phone   TEXT,
          business_address TEXT,
          open_hour       INTEGER DEFAULT 8,
close_hour      INTEGER DEFAULT 18,
          timezone        TEXT DEFAULT 'America/Chicago',
          hours_text      TEXT DEFAULT 'Monday through Friday, 8 AM to 6 PM',
          emergency_phone TEXT,
          booking_url     TEXT,
          updated_at      TIMESTAMPTZ DEFAULT now()`

`);
      console.log("Table created");

      await pool.query(`INSERT INTO settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING`);
      console.log("Default seeded");
      console.log("DONE");
      await pool.end();
      process.exit(0);
    } catch (100)}`);
    }
  }
  process.exit(1);
}

migrate();
