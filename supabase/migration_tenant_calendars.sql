-- Migration: Add tenant_calendars table for multi-client Google Calendar OAuth
-- Run in Supabase Dashboard → SQL Editor

create table if not exists tenant_calendars (
  id              uuid default gen_random_uuid() primary key,
  tenant_name     text not null unique,       -- business/client identifier
  tenant_email    text,                        -- business owner email
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
