# FlowDesk — Lead Engine for Local Service Businesses

## Project Overview
Next.js 14 App Router SaaS ($297/mo) for local LA service businesses. Website + AI phone system + lead CRM + appointment booking + auto follow-ups.

## URL
- **Production:** https://flowdesk-ruby.vercel.app
- **Password:** flowdesk123 (env var: `ADMIN_PASSWORD`)
- **Repo:** https://github.com/ohrosco/flowdesk

## Pages
| Route | Description |
|---|---|
| `/` | Landing page (features, pricing tiers, FAQ, footer) |
| `/login` | Password auth |
| `/dashboard` | Main app (Leads, Follow-Up, Sales Pipeline, Schedule, Settings tabs) |
| `/privacy` | Privacy Policy |
| `/terms` | Terms of Service |
| `/book` | Public booking page |
| `/outreach` | Outreach dashboard |

## Key Architecture
- **Auth:** Password-based, HMAC-signed cookie via `middleware.js`. Protects `/dashboard`, `/book`, `/outreach`
- **Styling:** CSS-in-JS with dark gold theme (`#0A0A07` bg, `#F0B429` gold)
- **State:** Everything client-side in `components/FlowDesk.jsx` (1300+ lines)
- **Database:** Supabase with tables: `leads`, `appointments`, `followup_messages`, `tenant_calendars`, `settings`
- **Deployment:** Vercel, auto-aliased to flowdesk-ruby.vercel.app

## API Routes
| Route | Description |
|---|---|
| `POST /api/auth/login` | Validate password, set session cookie |
| `GET/POST /api/auth/logout` | Clear session |
| `GET /api/leads` | List leads |
| `POST /api/leads` | Create lead + fire SMS + schedule follow-up sequence |
| `GET/POST/DELETE /api/schedule` | Appointment CRUD + Google Calendar sync |
| `POST /api/followup` | Process follow-up messages (manual or cron) |
| `GET/POST /api/settings` | Business settings CRUD (name, hours, timezone, etc.) |
| `GET /api/migrate` | Migration SQL (settings table created manually in Supabase) |
| `POST /api/voice/incoming` | Twilio IVR — after-hours detection, DTMF menu |
| `POST /api/voice/menu` | DTMF handler (1=emergency, 2=zip input, 3=info SMS) |
| `POST /api/voice/lead-capture` | Zip code → Supabase lead + SMS follow-up |
| `POST /api/voice/send-sms` | Internal SMS sender |
| `GET /api/voice/send-info-sms` | Booking info SMS sender |
| `POST /api/voice/emergency-sms` | Emergency SMS alert |
| `POST /api/voice/incoming-sms` | Inbound SMS handler — parse reply, update lead |
| `POST /api/stripe/checkout` | Stripe checkout session (needs API keys to work) |
| `GET /api/stripe/status` | Subscription status |
| `POST /api/stripe/webhook` | Stripe webhook handler (needs STRIPE_WEBHOOK_SECRET) |
| `GET/POST /api/calendar/auth` | Google Calendar OAuth start |
| `GET /api/calendar/callback` | Google Calendar OAuth callback |
| `GET /api/calendar/status` | Calendar connection status |
| `POST /api/claude` | AI follow-up draft generator |

## Tests
- Jest + babel-jest setup at `jest.config.js`
- 20 tests in `tests/voice/` (incoming, menu, lead-capture webhooks)
- Run: `npm test`

## To Ship (blocking)
1. **Stripe API keys** — set `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, price IDs in Vercel env vars
2. **Twilio funding** — add ~$20 to Twilio account to remove trial restrictions
3. **Custom domain** — buy domain, configure in Vercel, update `NEXT_PUBLIC_APP_URL` and `BOOKING_URL` env vars
4. **Resend domain verification** — verify sending domain for follow-up emails

## Known Config
- Supabase project: `dptaxocdmdojlwvepaeb`
- Twilio phone: `+18452558020`
- Twilio webhooks already configured → voice → `/api/voice/incoming`, SMS → `/api/voice/incoming-sms`
- Google Calendar OAuth: GCP client ID + secret set on Vercel
- Settings table was created manually in Supabase SQL Editor

## Tests
`npm test` — 20 tests, 3 suites (voice webhooks)
