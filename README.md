# FlowDesk — Lead Capture, Follow-Up & Scheduling

Automated lead management and appointment scheduling for small businesses.
Built with Next.js, Supabase, Twilio, and Resend.

---

## ⚡ Quick Deploy to Vercel (30–45 minutes)

### Step 1 — Set Up Supabase (Free)

1. Go to [supabase.com](https://supabase.com) → **New Project**
2. Name it `flowdesk`, pick a region close to you, set a password
3. Wait ~2 minutes for it to spin up
4. Go to **SQL Editor** → **New Query**
5. Paste the entire contents of `supabase/schema.sql` → Click **Run**
6. Go to **Project Settings → API** and copy:
   - `Project URL` → this is your `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → this is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → this is your `SUPABASE_SERVICE_ROLE_KEY`

---

### Step 2 — Set Up Twilio (SMS) — Optional but recommended

1. Go to [twilio.com](https://twilio.com) → Sign up (free trial gives you $15 credit)
2. From the Console Dashboard, copy:
   - **Account SID** → `TWILIO_ACCOUNT_SID`
   - **Auth Token** → `TWILIO_AUTH_TOKEN`
3. Go to **Phone Numbers → Manage → Buy a Number** (~$1.15/month)
4. Copy your new number → `TWILIO_PHONE_NUMBER` (format: `+15550001234`)

> Skip Twilio for now? The app works without it — SMS just won't send.

---

### Step 3 — Set Up Resend (Email) — Optional

1. Go to [resend.com](https://resend.com) → Sign up (free tier: 3,000 emails/month)
2. Go to **API Keys → Create API Key** → copy it → `RESEND_API_KEY`
3. For the From address:
   - Quick test: use `onboarding@resend.dev` as `RESEND_FROM_EMAIL` (no domain needed)
   - Production: add your domain in Resend → verify DNS → use `you@yourdomain.com`

---

### Step 4 — Get Anthropic API Key (for AI follow-up drafts)

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. **API Keys → Create Key** → copy it → `ANTHROPIC_API_KEY`
3. Add $5 credit to start (more than enough for testing)

---

### Step 5 — Deploy to Vercel

#### Option A: GitHub (recommended)
```bash
# 1. Create a new GitHub repo and push this code
git init
git add .
git commit -m "Initial FlowDesk"
git remote add origin https://github.com/YOUR_USERNAME/flowdesk.git
git push -u origin main

# 2. Go to vercel.com → New Project → Import your repo
# 3. Add all environment variables (see list below)
# 4. Click Deploy
```

#### Option B: Vercel CLI
```bash
npm install -g vercel
vercel login
vercel --prod
# Follow the prompts, add env vars when asked
```

---

### Step 6 — Add Environment Variables in Vercel

In your Vercel project → **Settings → Environment Variables**, add each of these:

| Variable | Where to get it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API |
| `TWILIO_ACCOUNT_SID` | Twilio Console Dashboard |
| `TWILIO_AUTH_TOKEN` | Twilio Console Dashboard |
| `TWILIO_PHONE_NUMBER` | Twilio → Phone Numbers (E.164 format) |
| `RESEND_API_KEY` | Resend → API Keys |
| `RESEND_FROM_EMAIL` | Your verified email or `onboarding@resend.dev` |
| `RESEND_FROM_NAME` | Your business name (e.g. "Premier HVAC") |
| `ANTHROPIC_API_KEY` | console.anthropic.com → API Keys |
| `NEXT_PUBLIC_APP_URL` | Your Vercel URL (e.g. `https://flowdesk.vercel.app`) |
| `NEXT_PUBLIC_BUSINESS_NAME` | Your business name |

---

### Step 7 — Test It

1. Open your deployed app
2. Go to **Lead Capture** → fill out the form → click **Capture Lead**
3. Check:
   - ✅ Lead appears in the pipeline
   - ✅ SMS arrives on the customer's phone (if Twilio is set up)
   - ✅ Follow-up sequence is created in Supabase (`followup_messages` table)
4. Go to **Schedule** → pick a date → book an appointment
5. Check: ✅ Appointment appears on the calendar

---

## 🔄 How Follow-Ups Are Sent

Follow-ups are triggered by a **Vercel Cron Job** that runs every hour (`vercel.json`).

The sequence for every new lead:
- **Step 0** — SMS fires immediately when lead is captured
- **Step 1** — Call reminder note at 2 hours
- **Step 2** — Email at 24 hours
- **Step 3** — SMS at 3 days
- **Step 4** — Email at 7 days
- **Step 5** — Final SMS at 14 days

> Cron jobs require Vercel's **Hobby plan** (free) or above.

---

## 🛠 Local Development

```bash
# Clone and install
npm install

# Copy env file
cp .env.example .env.local
# Fill in your values in .env.local

# Run locally
npm run dev
# Open http://localhost:3000
```

---

## 📁 Project Structure

```
flowdesk/
├── app/
│   ├── api/
│   │   ├── leads/route.js       ← Create & fetch leads, trigger instant SMS
│   │   ├── schedule/route.js    ← Book & fetch appointments
│   │   ├── followup/route.js    ← Send follow-up messages
│   │   ├── claude/route.js      ← AI message generation proxy
│   │   └── cron/route.js        ← Hourly cron trigger
│   ├── layout.jsx
│   ├── page.jsx
│   └── globals.css
├── components/
│   └── FlowDesk.jsx             ← Main UI (all tabs)
├── lib/
│   ├── supabase.js              ← DB client
│   ├── twilio.js                ← SMS helper
│   └── resend.js                ← Email helper
├── supabase/
│   └── schema.sql               ← Run this in Supabase SQL editor
├── vercel.json                  ← Cron job config
├── .env.example                 ← Copy to .env.local
└── package.json
```

---

## 💰 Monthly Cost Estimate (per client)

| Service | Usage | Cost |
|---|---|---|
| Vercel | Hosting | Free |
| Supabase | Database | Free (up to 500MB) |
| Twilio | ~50 SMS/month | ~$0.50 |
| Resend | ~30 emails/month | Free |
| Anthropic | AI drafts (on demand) | ~$0.50 |
| **Total** | | **~$1–2/month** |

---

## 🚀 Next Steps (Phase 2)

- [ ] Add Stripe billing for client subscriptions
- [ ] Two-way SMS inbox (Twilio webhook)
- [ ] Client onboarding / white-label
- [ ] Google Calendar sync
- [ ] Mobile PWA

---

Built with Next.js 14 · Supabase · Twilio · Resend · Anthropic Claude
