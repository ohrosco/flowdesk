-- ─────────────────────────────────────────────────────────────────────────────
-- FLOWDESK — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query → Run
-- ─────────────────────────────────────────────────────────────────────────────

-- LEADS TABLE
create table if not exists leads (
  id           uuid default gen_random_uuid() primary key,
  name         text not null,
  phone        text not null,
  email        text,
  address      text,
  service      text not null,
  source       text,
  timeline     text,
  notes        text,
  status       text default 'new',        -- new | hot | warm | cold
  stage        text default 'New Lead',   -- New Lead | Follow-Up Due | Estimate Sent | etc.
  last_contact timestamptz default now(),
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- APPOINTMENTS TABLE
create table if not exists appointments (
  id           uuid default gen_random_uuid() primary key,
  lead_id      uuid references leads(id) on delete cascade,
  lead_name    text not null,
  lead_phone   text not null,
  appt_type    text default 'estimate',   -- estimate | follow-up | service | install
  appt_date    date not null,
  appt_time    text not null,
  notes        text,
  reminder_24h boolean default true,
  reminder_2h  boolean default true,
  status       text default 'confirmed',  -- confirmed | cancelled | completed
  google_calendar_event_id text,
  created_at   timestamptz default now()
);

-- FOLLOW-UP MESSAGES TABLE
create table if not exists followup_messages (
  id           uuid default gen_random_uuid() primary key,
  lead_id      uuid references leads(id) on delete cascade,
  step         int not null,              -- 0-5 (which step in the sequence)
  channel      text not null,             -- sms | email | call
  message_body text,
  status       text default 'pending',    -- pending | sent | failed | skipped
  scheduled_at timestamptz,
  sent_at      timestamptz,
  created_at   timestamptz default now()
);

-- INDEXES for performance
create index if not exists leads_status_idx      on leads(status);
create index if not exists leads_created_at_idx  on leads(created_at desc);
create index if not exists appts_date_idx        on appointments(appt_date);
create index if not exists followup_lead_idx     on followup_messages(lead_id);
create index if not exists followup_status_idx   on followup_messages(status, scheduled_at);

-- AUTO-UPDATE updated_at on leads
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger leads_updated_at
  before update on leads
  for each row execute function update_updated_at();

-- ROW LEVEL SECURITY (basic — tighten per-tenant later)
alter table leads              enable row level security;
alter table appointments       enable row level security;
alter table followup_messages  enable row level security;

-- Allow all for now (lock down per client when you add auth)
create policy "public_all_leads"
  on leads for all using (true) with check (true);

create policy "public_all_appointments"
  on appointments for all using (true) with check (true);

create policy "public_all_followup"
  on followup_messages for all using (true) with check (true);
