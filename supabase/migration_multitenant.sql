-- ─────────────────────────────────────────────────────────────────────────────
-- FLOWDESK — Multi-Tenant Migration
-- Run this in: Supabase Dashboard → SQL Editor → New Query → Run
-- Run AFTER the base schema.sql has been applied.
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── 1. TENANTS TABLE ─────────────────────────────────────────────────────────
-- One row per client business (sub-account). The agency owner manages all of these.
create table if not exists tenants (
  id                     uuid default gen_random_uuid() primary key,
  slug                   text unique not null,        -- URL-safe identifier: "premier-hvac"
  name                   text not null,               -- Display name: "Premier HVAC"
  owner_email            text,
  password_hash          text not null,               -- bcrypt hash of client's login password
  plan                   text default 'starter',      -- starter | professional | agency
  -- Stripe
  stripe_customer_id     text,
  stripe_subscription_id text,
  subscription_status    text default 'trial',        -- trial | active | past_due | canceled
  trial_ends_at          timestamptz default (now() + interval '14 days'),
  -- Business info (mirrors settings table — source of truth for IVR etc.)
  business_phone         text,
  business_address       text,
  twilio_phone_number    text,                        -- their dedicated Twilio number (future)
  -- Status
  active                 boolean default true,
  notes                  text,                        -- internal agency notes on this client
  created_at             timestamptz default now(),
  updated_at             timestamptz default now()
);

create index if not exists tenants_slug_idx on tenants(slug);
create index if not exists tenants_active_idx on tenants(active);

-- Default tenant for existing single-tenant data
insert into tenants (id, slug, name, password_hash, plan, subscription_status)
values (
  '00000000-0000-0000-0000-000000000001',
  'default',
  'Default Account',
  -- placeholder hash — real clients get their own passwords via agency dashboard
  '$2b$10$placeholder_hash_replace_on_setup',
  'professional',
  'active'
) on conflict (slug) do nothing;


-- ─── 2. ADD tenant_id TO ALL DATA TABLES ──────────────────────────────────────

-- LEADS
alter table leads
  add column if not exists tenant_id uuid references tenants(id) on delete cascade
    default '00000000-0000-0000-0000-000000000001';

-- Backfill existing rows to default tenant
update leads set tenant_id = '00000000-0000-0000-0000-000000000001'
  where tenant_id is null;

-- Make it non-nullable once backfilled
alter table leads alter column tenant_id set not null;

create index if not exists leads_tenant_idx on leads(tenant_id);


-- APPOINTMENTS
alter table appointments
  add column if not exists tenant_id uuid references tenants(id) on delete cascade
    default '00000000-0000-0000-0000-000000000001';

update appointments set tenant_id = '00000000-0000-0000-0000-000000000001'
  where tenant_id is null;

alter table appointments alter column tenant_id set not null;

create index if not exists appts_tenant_idx on appointments(tenant_id);


-- FOLLOW-UP MESSAGES
alter table followup_messages
  add column if not exists tenant_id uuid references tenants(id) on delete cascade
    default '00000000-0000-0000-0000-000000000001';

update followup_messages set tenant_id = '00000000-0000-0000-0000-000000000001'
  where tenant_id is null;

alter table followup_messages alter column tenant_id set not null;

create index if not exists fu_tenant_idx on followup_messages(tenant_id);


-- ─── 3. PER-TENANT SETTINGS ────────────────────────────────────────────────────
-- Drop the single-row constraint on settings and add tenant_id.
-- Now settings is one row PER TENANT instead of one global row.

alter table settings drop column if exists id;

alter table settings
  add column if not exists tenant_id uuid references tenants(id) on delete cascade;

-- Backfill existing row
update settings set tenant_id = '00000000-0000-0000-0000-000000000001'
  where tenant_id is null;

alter table settings alter column tenant_id set not null;

alter table settings add primary key (tenant_id);

create index if not exists settings_tenant_idx on settings(tenant_id);


-- ─── 4. CONVERSATIONS TABLE ────────────────────────────────────────────────────
-- Two-way SMS inbox. Each row is one message (inbound OR outbound).
create table if not exists conversations (
  id           uuid default gen_random_uuid() primary key,
  tenant_id    uuid not null references tenants(id) on delete cascade,
  lead_id      uuid references leads(id) on delete set null,
  from_number  text not null,
  to_number    text not null,
  body         text not null,
  direction    text not null,          -- inbound | outbound
  twilio_sid   text,
  read         boolean default false,
  created_at   timestamptz default now()
);

create index if not exists conv_tenant_idx  on conversations(tenant_id);
create index if not exists conv_lead_idx    on conversations(lead_id);
create index if not exists conv_from_idx    on conversations(from_number);
create index if not exists conv_created_idx on conversations(tenant_id, created_at desc);

alter table conversations enable row level security;
create policy "tenant_conversations"
  on conversations for all using (true) with check (true);


-- ─── 5. BROADCASTS TABLE ───────────────────────────────────────────────────────
-- Mass SMS campaigns to a segment of leads.
create table if not exists broadcasts (
  id           uuid default gen_random_uuid() primary key,
  tenant_id    uuid not null references tenants(id) on delete cascade,
  name         text not null,
  message      text not null,          -- SMS body (max 160 chars for 1 segment)
  segment      text default 'all',     -- all | new | hot | warm | won | custom
  status       text default 'draft',   -- draft | scheduled | sending | sent | failed
  recipient_count int default 0,
  sent_count   int default 0,
  scheduled_at timestamptz,
  sent_at      timestamptz,
  created_at   timestamptz default now()
);

create index if not exists bc_tenant_idx on broadcasts(tenant_id);

alter table broadcasts enable row level security;
create policy "tenant_broadcasts"
  on broadcasts for all using (true) with check (true);


-- ─── 6. REVIEW REQUESTS TABLE ──────────────────────────────────────────────────
-- Tracks Google review request SMS sent to won clients.
create table if not exists review_requests (
  id           uuid default gen_random_uuid() primary key,
  tenant_id    uuid not null references tenants(id) on delete cascade,
  lead_id      uuid references leads(id) on delete set null,
  phone        text not null,
  status       text default 'sent',    -- sent | clicked | reviewed | failed
  sent_at      timestamptz default now(),
  review_url   text
);

create index if not exists rr_tenant_idx on review_requests(tenant_id);
create index if not exists rr_lead_idx   on review_requests(lead_id);

alter table review_requests enable row level security;
create policy "tenant_review_requests"
  on review_requests for all using (true) with check (true);


-- ─── 7. UPDATE RLS POLICIES ────────────────────────────────────────────────────
-- Drop the old "allow all" policies and replace with tenant-scoped ones.
-- NOTE: These still use `using (true)` because auth is handled at the API layer
-- (service_role key bypasses RLS). When you add Supabase Auth, replace with
-- `using (auth.uid() = ... )` patterns.

drop policy if exists "public_all_leads" on leads;
create policy "tenant_leads"
  on leads for all using (true) with check (true);

drop policy if exists "public_all_appointments" on appointments;
create policy "tenant_appointments"
  on appointments for all using (true) with check (true);

drop policy if exists "public_all_followup" on followup_messages;
create policy "tenant_followup"
  on followup_messages for all using (true) with check (true);

drop policy if exists "public_all_settings" on settings;
create policy "tenant_settings"
  on settings for all using (true) with check (true);


-- ─── 8. TENANTS RLS ────────────────────────────────────────────────────────────
alter table tenants enable row level security;
create policy "agency_all_tenants"
  on tenants for all using (true) with check (true);


-- ─── DONE ─────────────────────────────────────────────────────────────────────
-- After running this migration:
-- 1. Update ADMIN_PASSWORD in your env (agency master password)
-- 2. Go to /agency to create your first real tenant
-- 3. Each tenant gets their own /login?t=<slug> URL
