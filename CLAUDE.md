# FlowDesk — Lead Engine for Local Service Businesses

## Project Overview
Next.js 14 App Router SaaS for local LA service businesses. Website + AI phone system + lead CRM + appointment booking + auto follow-ups. Multi-tenant: one agency account manages many sub-accounts (clients), each fully isolated.

**Pricing tiers:** Starter $97/mo · Professional $297/mo · Agency $497/mo · Setup fee $39 (all tiers)

## URLs
- **Production:** https://flowdesk-ruby.vercel.app
- **Agency password:** flowdesk123 (env var: `ADMIN_PASSWORD`)
- **Tenant login:** `/login?t=<slug>` with tenant-specific password
- **Repo:** https://github.com/ohrosco/flowdesk

## Pages
| Route | Description |
|---|---|
| `/` | Landing page (features, pricing tiers, FAQ, footer) |
| `/login` | Password auth — agency login OR tenant login via `?t=slug` |
| `/dashboard` | Main app — Leads, Follow-Up, Inbox, Broadcast, Reviews, Sales Pipeline, Schedule, Settings tabs |
| `/agency` | Agency dashboard — create/manage sub-accounts, MRR stats, setup checklist |
| `/outreach` | Outreach dashboard |
| `/book` | Public booking page |
| `/privacy` | Privacy Policy |
| `/terms` | Terms of Service |

## Key Architecture

### Auth
- HMAC-signed cookie via `middleware.js` (Web Crypto, Edge Runtime compatible)
- Agency login: `POST /api/auth/login` — validates `ADMIN_PASSWORD`, sets `fd_session` cookie with `role: "agency"`
- Tenant login: `POST /api/auth/tenant-login` — validates slug + password against `tenants` table, sets `fd_session` cookie with `role: "tenant"`, `tenant_id`, `tenant_slug`
- Protected routes: `/dashboard`, `/book`, `/outreach`, `/agency` (agency role only)

### Multi-Tenancy
- `tenants` table in Supabase — each row is a client sub-account with slug, hashed password, plan, subscription_status, active flag, trial_ends_at
- All data tables (`leads`, `appointments`, `followup_messages`, `settings`) are scoped by `tenant_id`
- Agency can create/edit/deactivate any tenant via `/agency` + `GET/POST/PATCH/DELETE /api/tenants`
- Tenant slug auto-generated from business name; login URL is `/login?t=<slug>`

### Styling
CSS-in-JS, dark gold theme: `#0A0A07` bg, `#F0B429` gold, IBM Plex Sans + Playfair Display

### State
All dashboard state is client-side in `components/FlowDesk.jsx` (~1910 lines). Agency dashboard state is self-contained in `app/agency/page.jsx`.

### Database (Supabase project: `dptaxocdmdojlwvepaeb`)
| Table | Description |
|---|---|
| `tenants` | Sub-accounts — slug, password_hash, plan, status, active |
| `leads` | Lead records, scoped by tenant_id |
| `appointments` | Appointments, scoped by tenant_id |
| `followup_messages` | Scheduled follow-up SMS/email queue, scoped by tenant_id |
| `tenant_calendars` | Google Calendar tokens per tenant |
| `settings` | Per-tenant business config (name, hours, timezone, etc.) |

### Deployment
Vercel, auto-aliased to flowdesk-ruby.vercel.app. Pushes to `master` auto-deploy.

## API Routes
| Route | Description |
|---|---|
| `POST /api/auth/login` | Agency login — validate ADMIN_PASSWORD, set session cookie |
| `POST /api/auth/tenant-login` | Tenant login — validate slug + password, set tenant session |
| `GET/POST /api/auth/logout` | Clear session cookie |
| `GET/POST/PATCH/DELETE /api/tenants` | Sub-account CRUD (agency only) |
| `GET /api/leads` | List leads (scoped to tenant) |
| `POST /api/leads` | Create lead + fire SMS + schedule follow-up sequence |
| `GET/POST/DELETE /api/schedule` | Appointment CRUD + Google Calendar sync |
| `POST /api/followup` | Process follow-up messages (manual or cron) |
| `GET /api/cron` | Cron endpoint — triggers follow-up processing |
| `GET/POST /api/settings` | Business settings CRUD |
| `GET /api/migrate` | Migration SQL reference |
| `GET/POST /api/conversations` | SMS thread list + per-thread messages; POST sends outbound SMS |
| `GET/POST /api/broadcast` | List past broadcasts; POST sends/schedules SMS campaign |
| `GET/POST /api/reviews` | List sent review requests; POST sends review request SMS |
| `POST /api/voice/incoming` | Twilio IVR — after-hours detection, DTMF menu |
| `POST /api/voice/menu` | DTMF handler (1=emergency, 2=zip input, 3=info SMS) |
| `POST /api/voice/lead-capture` | Zip code → Supabase lead + SMS follow-up |
| `POST /api/voice/send-sms` | Internal SMS sender |
| `GET /api/voice/send-info-sms` | Booking info SMS sender |
| `POST /api/voice/emergency-sms` | Emergency SMS alert |
| `POST /api/voice/incoming-sms` | Inbound SMS handler — parse reply, update lead |
| `POST /api/stripe/checkout` | Stripe checkout session |
| `GET /api/stripe/status` | Subscription status |
| `POST /api/stripe/webhook` | Stripe webhook handler |
| `GET/POST /api/calendar/auth` | Google Calendar OAuth start |
| `GET /api/calendar/callback` | Google Calendar OAuth callback |
| `GET /api/calendar/status` | Calendar connection status |
| `POST /api/claude` | AI follow-up draft generator |

## Tests
- Jest + babel-jest at `jest.config.js`
- 20 tests in `tests/voice/` (incoming, menu, lead-capture webhooks)
- Run: `npm test`

## Known Config
- Twilio phone: `+18452558020`
- Twilio webhooks: voice → `/api/voice/incoming`, SMS → `/api/voice/incoming-sms`
- Google Calendar OAuth: GCP client ID + secret in Vercel env vars
- `settings` table created manually in Supabase SQL Editor

## To Ship (blocking)
1. **Stripe API keys** — set `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, and price IDs in Vercel env vars
2. **Twilio funding** — top up Twilio balance (~$20) and ensure A2P 10DLC messaging service is approved for US SMS
3. **Custom domain** — add domain in Vercel → Settings → Domains; update `NEXT_PUBLIC_APP_URL` and `BOOKING_URL` env vars
4. **Resend domain verification** — add DNS records in Resend so follow-up emails don't land in spam
