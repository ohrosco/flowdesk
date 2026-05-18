-- Migration: Add google_calendar_event_id to appointments table
-- Run in Supabase Dashboard → SQL Editor

alter table appointments
  add column if not exists google_calendar_event_id text;

create index if not exists appts_gcal_idx
  on appointments(google_calendar_event_id);
