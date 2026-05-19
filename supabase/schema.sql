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

-- TENANT CALENDARS TABLE
create table if not exists tenant_calendars (
  id              uuid default gen_random_uuid() primary key,
  tenant_name     text not null unique,
  tenant_email    text,
  google_refresh_token text,
  google_calendar_id   text,
  google_calendar_email text,
  connected_at    timestamptz default now(),
  updated_at      timestamptz default now()
);

create index if not exists tc_tenant_idx on tenant_calendars(tenant_name);

alter table tenant_calendars enable row level security;
create policy "public_all_tenant_calendars"
  on tenant_calendars for all using (true) with check (true);

-- SETTINGS TABLE
-- Single-row config store (id = 1). Holds business settings + Stripe subscription state.
-- Created here so fresh deployments don't break on first Stripe webhook.
create table if not exists settings (
  id                      int primary key default 1,
  -- Business identity
  business_name           text,
  business_phone          text,
  business_address        text,
  open_hour               int default 8,
  close_hour              int default 18,
  timezone                text default 'America/Los_Angeles',
  hours_text              text default 'Monday through Friday, 8 AM to 6 PM',
  emergency_phone         text,
  booking_url             text,
  -- Stripe subscription state (written by /api/stripe/webhook)
  stripe_customer_id      text,
  stripe_subscription_id  text,
  subscription_status     text,   -- active | trialing | past_due | canceled
  subscription_tier       text,   -- starter | professional | agency
  -- Timestamps
  created_at              timestamptz default now(),
  updated_at              timestamptz default now()
);

-- Seed the single row so upserts always hit an existing record
insert into settings (id) values (1) on conflict (id) do nothing;

alter table settings enable row level security;
create policy "public_all_settings"
  on settings for all using (true) with check (true);

-- SETTINGS TABLE
-- Single-row config store (id = 1). Holds business config + Stripe subscription state.
-- Required by /api/