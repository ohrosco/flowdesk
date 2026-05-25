"use client";
import { useState } from "react";

const T = {
  bg:"#0A0A07", surface:"#14130E", card:"#1A1812", border:"#2A271D",
  gold:"#F0B429", goldDim:"#C49020", goldGlow:"rgba(240,180,41,0.12)",
  text:"#F0EAD6", muted:"#8A8470",
};

const FEATURES = [
  { title:"Professional Website", desc:"Shows up on Google, loads fast on mobile, and turns visitors into calls. Built in 5-7 days. You approve it before anything goes live." },
  { title:"24/7 AI Phone Answering", desc:"Your phone gets answered at 2am on Sunday the same way it does at noon Tuesday. Every caller is greeted, qualified, and booked. Without you lifting a finger." },
  { title:"Smart Lead Capture", desc:"Every call, form, and text automatically creates a lead with the caller's name, number, service request, and address. Zero data entry. Nothing falls through the cracks." },
  { title:"Auto Follow-Up Sequence", desc:"14 days of SMS, email, and call reminders fire automatically after every new lead. Most clients close 30-40% more jobs just from the follow-up sequence alone." },
  { title:"Online Booking and Calendar", desc:"Customers pick their own time slot. You get a notification. The AI sends a reminder the day before. No-shows drop. You stop playing phone tag." },
  { title:"Pipeline Dashboard", desc:"Every lead, every follow-up status, every appointment in one view. Log in each morning and know exactly who to call, who's booked, and who needs a nudge." },
];

const PRICING = [
  {
    name:"Starter", price:"$197", setup:"$97", desc:"For the solo operator who needs to stop missing calls today.",
    features:["1-page website", "AI phone answering (100 min/mo)", "Lead capture CRM", "SMS follow-up sequence", "Online booking widget"],
    cta:"Get Started",
    tier:"starter",
    popular:false,
  },
  {
    name:"Professional", price:"$297", setup:"$97", desc:"We handle the full setup: website, AI phone scripts, CRM, every automation. You show up to a working system.",
    features:["5-page custom website", "AI phone answering (300 min/mo)", "Full lead CRM + pipeline", "SMS + Email + Call follow-ups", "Online booking + auto-reminders", "AI draft follow-ups", "Priority support"],
    cta:"Get Started",
    tier:"professional",
    popular:true,
  },
  {
    name:"Agency", price:"$497", noSetup:true, desc:"Running 2+ locations, or want a white-labeled system for your own clients? This is your tier.",
    features:["10-page website + sub-pages", "AI phone answering (unlimited)", "Multi-location CRM", "White-label dashboard", "Custom integrations", "Dedicated account manager"],
    cta:"Contact Us",
    tier:"agency",
    popular:false,
  },
];

const QUIZ = [
  {
    q: "How many inbound leads or calls do you get per month?",
    opts: [
      { label: "Under 20", value: "low" },
      { label: "20-60", value: "mid" },
      { label: "60+", value: "high" },
    ],
  },
  {
    q: "Who handles calls and scheduling right now?",
    opts: [
      { label: "Just me", value: "solo" },
      { label: "Small team", value: "team" },
      { label: "Office staff", value: "staff" },
    ],
  },
  {
    q: "How are you currently tracking leads?",
    opts: [
      { label: "Phone and memory", value: "none" },
      { label: "Spreadsheet", value: "sheet" },
      { label: "A CRM or software", value: "crm" },
    ],
  },
  {
    q: "Are you setting this up for one business or multiple?",
    opts: [
      { label: "One business", value: "one" },
      { label: "Multiple locations", value: "multi" },
      { label: "I'm an agency or consultant", value: "agency" },
    ],
  },
];

const QUIZ_RESULTS = {
  starter: {
    tier: "Starter",
    desc: "Based on your answers, the Starter plan is your best fit. You'll stop missing calls immediately without paying for features you don't need yet. Upgrade anytime as you grow.",
  },
  professional: {
    tier: "Professional",
    desc: "Based on your volume and setup, Professional is your tier. $97 to get fully set up, then $297/mo. One extra job a month covers it. Most clients see that in the first week.",
  },
  agency: {
    tier: "Agency",
    desc: "You need multi-account management. The Agency plan gives you a white-label dashboard for every client or location, with unlimited AI call handling across all of them.",
  },
};

const FAQ = [
  { q:"What's the typical ROI?", a:"The average contractor misses 7 calls per week. At a $250 average service call, that's over $1,500/mo walking out the door. Our Professional plan pays for itself if we help you book one extra job a month. Most clients see that in the first week." },
  { q:"Do I need a website already?", a:"Nope. We build it for you. Most of our customers don't have one — that's the whole point. We design, build, and launch your site in about a week. You approve it before it goes live." },
  { q:"What if I already have a website?", a:"We can work with what you have, or rebuild it. The FlowDesk system integrates with your existing site or replaces it entirely. Either way, the AI phone system and CRM work the same." },
  { q:"How does the AI phone system work?", a:"When a customer calls your FlowDesk number, our AI answers, asks what they need, captures their info, and books them, just like a human receptionist. You get a text notification instantly. It works at 2am the same as it does at noon." },
  { q:"Can I keep my current phone number?", a:"Yes. We can port your existing number to FlowDesk, or you keep it and add a FlowDesk number alongside it. Your customers call the same number they always have." },
  { q:"How long to get set up?", a:"AI phone system: 24 hours. Website: 5-7 days. Full setup including number porting: about a week. You'll be capturing leads before your site is even live." },
  { q:"Is there a contract?", a:"Month-to-month. No long-term contracts. Cancel anytime. We'll help you export everything. We'd rather earn your business every month than lock you in." },
];

const CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{background:${T.bg};color:${T.text};font-family:'IBM Plex Sans',sans-serif;overflow-x:hidden}
:focus-visible{outline:2px solid ${T.gold};outline-offset:3px;border-radius:4px}
.nav{position:fixed;top:0;left:0;right:0;z-index:100;background:rgba(10,10,7,.88);backdrop-filter:blur(12px);border-bottom:1px solid ${T.border};padding:14px 28px;display:flex;align-items:center;justify-content:space-between}
.logo{font-family:'Playfair Display',serif;font-size:1.35rem;font-weight:700;color:${T.gold};letter-spacing:-0.3px}
.logo sub{font-family:'IBM Plex Sans',sans-serif;font-size:0.6rem;color:${T.muted};font-weight:400;text-transform:uppercase;letter-spacing:0.12em;display:block;margin-top:-2px}
.nav-links{display:flex;gap:24px;align-items:center}
.nav-links a{color:${T.muted};text-decoration:none;font-size:0.82rem;font-weight:500;transition:color .2s;cursor:pointer}
.nav-links a:hover{color:${T.text}}
.hamburger{display:none;cursor:pointer;background:none;border:none;color:${T.text};font-size:1.2rem;padding:4px;line-height:1}
@media(max-width:700px){
  .hamburger{display:block}
  .nav-links{display:none;flex-direction:column;align-items:flex-start;position:fixed;top:57px;left:0;right:0;background:rgba(10,10,7,.97);backdrop-filter:blur(12px);padding:24px 28px;gap:20px;border-bottom:1px solid ${T.border};z-index:99}
  .nav-links.open{display:flex}
  .nav-desktop{display:none}
}
.btn{display:inline-flex;align-items:center;gap:7px;padding:11px 24px;border-radius:10px;font-size:0.85rem;font-weight:600;font-family:'IBM Plex Sans',sans-serif;cursor:pointer;border:none;transition:all .2s;text-decoration:none}
.btn-g{background:${T.gold};color:#0A0A07}
.btn-g:hover{background:${T.goldDim};transform:translateY(-1px);box-shadow:0 4px 20px ${T.goldGlow}}
.btn-o{background:transparent;color:${T.text};border:1px solid ${T.border}}
.btn-o:hover{border-color:${T.gold};color:${T.gold}}
.btn-w{background:transparent;color:${T.text};border:1px solid rgba(240,234,214,.15)}
.btn-w:hover{background:rgba(255,255,255,.05)}
.hero{padding:140px 28px 80px;max-width:1100px;margin:0 auto;text-align:center}
.hero-badge{display:inline-flex;align-items:center;gap:6px;background:${T.goldGlow};border:1px solid rgba(240,180,41,.2);border-radius:50px;padding:6px 16px 6px 8px;font-size:0.75rem;color:${T.gold};margin-bottom:28px}
.hero-badge span{background:${T.gold};color:#0A0A07;border-radius:50px;padding:2px 8px;font-weight:700;font-size:0.65rem}
.hero h1{font-family:'Playfair Display',serif;font-size:clamp(2.5rem,6vw,4.2rem);font-weight:800;line-height:1.1;margin-bottom:20px;letter-spacing:-0.5px}
.hero h1 span{color:${T.gold}}
.hero p{font-size:clamp(1rem,2vw,1.2rem);color:${T.muted};max-width:700px;margin:0 auto 36px;line-height:1.7}
.hero-actions{display:flex;gap:14px;justify-content:center;flex-wrap:wrap}
.hero-note{font-size:0.75rem;color:${T.muted};margin-top:20px}
.proof-strip{display:flex;justify-content:center;gap:32px;flex-wrap:wrap;margin-top:56px;padding-top:40px;border-top:1px solid ${T.border}}
.proof-item{font-size:0.78rem;color:${T.muted};display:flex;align-items:center;gap:6px;letter-spacing:0.02em}
.proof-item::before{content:"";display:block;width:6px;height:6px;border-radius:50%;background:${T.gold};flex-shrink:0}
.section{padding:80px 28px;max-width:1100px;margin:0 auto}
.section-tag{font-size:0.75rem;font-weight:600;color:${T.gold};text-transform:uppercase;letter-spacing:0.12em;margin-bottom:12px;text-align:center}
.section-hd{font-family:'Playfair Display',serif;font-size:clamp(1.6rem,4vw,2.4rem);font-weight:700;text-align:center;margin-bottom:12px;letter-spacing:-0.3px}
.section-sub{font-size:0.95rem;color:${T.muted};text-align:center;max-width:600px;margin:0 auto 50px;line-height:1.7}
.feat-list{display:grid;grid-template-columns:1fr 1fr;margin-top:40px}
@media(max-width:700px){.feat-list{grid-template-columns:1fr}}
.feat-item{padding:24px 0;border-bottom:1px solid ${T.border};display:grid;grid-template-columns:36px 1fr;gap:14px;align-items:start}
.feat-item:nth-child(odd){padding-right:48px}
@media(min-width:701px){.feat-item:nth-child(odd){border-right:1px solid ${T.border}}}
@media(min-width:701px){.feat-item:nth-child(even){padding-left:48px}}
@media(min-width:701px){.feat-item:nth-last-child(-n+2){border-bottom:none}}
@media(max-width:700px){.feat-item:last-child{border-bottom:none}.feat-item:nth-child(odd){padding-right:0}}
.feat-num{font-family:'Playfair Display',serif;font-size:0.88rem;font-weight:700;color:${T.gold};opacity:0.45;padding-top:3px;text-align:right}
.feat-title{font-size:0.93rem;font-weight:600;margin-bottom:6px;color:${T.text}}
.feat-desc{font-size:0.82rem;color:${T.muted};line-height:1.65}
.pricing-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;align-items:start}
@media(max-width:800px){.pricing-grid{grid-template-columns:1fr;max-width:400px;margin:0 auto}}
.p-card{background:${T.card};border:1px solid ${T.border};border-radius:16px;padding:32px;position:relative;transition:border-color .2s,transform .2s}
.p-card.popular{border-color:${T.gold};background:linear-gradient(135deg,${T.card},rgba(240,180,41,.04))}
.p-card.recommended{border-color:${T.gold};box-shadow:0 0 30px rgba(240,180,41,.1)}
.p-card:hover{transform:translateY(-3px)}
.p-pop{position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:${T.gold};color:#0A0A07;font-size:0.7rem;font-weight:700;padding:4px 14px;border-radius:50px;text-transform:uppercase;letter-spacing:0.08em;white-space:nowrap}
.p-rec{position:absolute;top:-12px;right:16px;background:${T.goldGlow};border:1px solid rgba(240,180,41,.3);color:${T.gold};font-size:0.68rem;font-weight:600;padding:4px 12px;border-radius:50px;text-transform:uppercase;letter-spacing:0.08em;white-space:nowrap}
.p-name{font-family:'Playfair Display',serif;font-size:1.3rem;font-weight:700;margin-bottom:4px}
.p-setup{font-size:0.82rem;font-weight:600;color:${T.gold};margin-bottom:2px}
.p-setup span{font-weight:400;color:${T.muted}}
.p-price{font-family:'Playfair Display',serif;font-size:2.4rem;font-weight:800;color:${T.gold};margin-bottom:4px}
.p-price sub{font-size:0.9rem;font-weight:400;color:${T.muted}}
.p-desc{font-size:0.82rem;color:${T.muted};margin-bottom:24px;line-height:1.6}
.p-features{list-style:none;margin-bottom:28px}
.p-features li{padding:8px 0;font-size:0.85rem;border-bottom:1px solid ${T.border};display:flex;align-items:center;gap:8px}
.p-features li:last-child{border-bottom:none}
.p-features li::before{content:"✓";color:${T.gold};font-weight:700;flex-shrink:0}
.p-card .btn{width:100%;justify-content:center}
.steps{display:flex;gap:0;position:relative;margin:40px 0}
@media(max-width:700px){.steps{flex-direction:column;gap:20px}}
.step{flex:1;text-align:center;position:relative;padding:0 16px}
.step:not(:last-child)::after{content:'';position:absolute;top:32px;left:60%;right:-40%;height:1px;background:linear-gradient(90deg,${T.gold},${T.border})}
@media(max-width:700px){.step:not(:last-child)::after{display:none}}
.step-num{width:40px;height:40px;border-radius:50%;background:${T.goldGlow};border:1px solid rgba(240,180,41,.3);display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-weight:700;font-size:0.9rem;color:${T.gold}}
.step-title{font-size:0.95rem;font-weight:600;margin-bottom:6px}
.step-desc{font-size:0.82rem;color:${T.muted};line-height:1.55}
.quote{background:${T.card};border:1px solid ${T.border};border-radius:16px;padding:40px;max-width:700px;margin:40px auto;text-align:center}
.quote-text{font-family:'Playfair Display',serif;font-size:1.2rem;font-style:italic;line-height:1.7;margin-bottom:16px;color:${T.text}}
.quote-author{font-size:0.85rem;font-weight:600;color:${T.gold}}
.quote-role{font-size:0.75rem;color:${T.muted}}
.quiz-card{max-width:600px;margin:0 auto;background:${T.card};border:1px solid ${T.border};border-radius:20px;padding:40px}
.quiz-progress{font-size:0.78rem;color:${T.muted};margin-bottom:20px;display:flex;flex-direction:column;gap:8px}
.quiz-bar{height:3px;background:${T.border};border-radius:2px;overflow:hidden}
.quiz-fill{height:100%;background:${T.gold};border-radius:2px;transition:width .35s ease-out}
.quiz-q{font-family:'Playfair Display',serif;font-size:1.25rem;font-weight:600;margin-bottom:28px;line-height:1.4}
.quiz-opts{display:flex;flex-direction:column;gap:10px;margin-bottom:20px}
.quiz-opt{background:${T.surface};border:1px solid ${T.border};border-radius:12px;padding:14px 20px;font-family:'IBM Plex Sans',sans-serif;font-size:0.9rem;color:${T.text};cursor:pointer;text-align:left;transition:border-color .2s,background .2s,color .2s;font-weight:500}
.quiz-opt:hover{border-color:${T.gold};color:${T.gold};background:${T.goldGlow}}
.quiz-back{background:none;border:none;color:${T.muted};font-size:0.8rem;cursor:pointer;font-family:'IBM Plex Sans',sans-serif;padding:0;transition:color .2s}
.quiz-back:hover{color:${T.text}}
.quiz-result{max-width:600px;margin:0 auto;background:linear-gradient(135deg,${T.card},rgba(240,180,41,.05));border:1px solid ${T.gold};border-radius:20px;padding:48px 40px;text-align:center}
.quiz-result-tag{font-size:0.75rem;font-weight:600;color:${T.gold};text-transform:uppercase;letter-spacing:0.12em;margin-bottom:12px}
.quiz-result-tier{font-family:'Playfair Display',serif;font-size:2.6rem;font-weight:800;color:${T.gold};margin-bottom:14px}
.quiz-result-desc{font-size:0.92rem;color:${T.muted};line-height:1.75;max-width:460px;margin:0 auto}
.dfy-card{background:${T.card};border:1px solid ${T.border};border-radius:16px;padding:40px 44px;margin-top:20px;position:relative;overflow:hidden}
.dfy-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,${T.gold},transparent)}
.dfy-badge{display:inline-block;background:${T.goldGlow};border:1px solid rgba(240,180,41,.25);color:${T.gold};font-size:0.72rem;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;padding:4px 14px;border-radius:50px;margin-bottom:16px}
.dfy-inner{display:flex;justify-content:space-between;align-items:flex-start;gap:40px;flex-wrap:wrap}
.dfy-price{font-family:'Playfair Display',serif;font-size:1.7rem;color:${T.text};margin-bottom:10px}
.dfy-price span{color:${T.gold};font-weight:800}
.dfy-price small{font-family:'IBM Plex Sans',sans-serif;font-size:0.85rem;color:${T.muted};font-weight:400}
.faq-grid{max-width:700px;margin:0 auto;display:flex;flex-direction:column;gap:8px}
.faq-item{display:grid;grid-template-rows:auto 0fr;transition:grid-template-rows .25s ease-out}
.faq-item.open{grid-template-rows:auto 1fr}
.faq-q{background:${T.card};border:1px solid ${T.border};border-radius:12px;padding:18px 20px;cursor:pointer;transition:border-color .2s,border-radius .2s;font-size:0.9rem;font-weight:500;text-align:left;width:100%;font-family:'IBM Plex Sans',sans-serif;color:${T.text};display:flex;justify-content:space-between;align-items:center;gap:12px}
.faq-q:hover{border-color:${T.gold}}
.faq-item.open .faq-q{border-color:${T.gold};border-radius:12px 12px 0 0}
.faq-chevron{font-size:0.7rem;color:${T.muted};transition:transform .25s ease-out;flex-shrink:0}
.faq-item.open .faq-chevron{transform:rotate(180deg)}
.faq-body{overflow:hidden;min-height:0}
.faq-a{background:${T.card};border:1px solid ${T.gold};border-top:none;border-radius:0 0 12px 12px;padding:0 20px 18px;font-size:0.84rem;color:${T.muted};line-height:1.7}
.cta-section{text-align:center;padding:80px 28px;background:linear-gradient(180deg,${T.bg},${T.surface})}
.cta-section h2{font-family:'Playfair Display',serif;font-size:clamp(1.6rem,4vw,2.4rem);font-weight:700;margin-bottom:16px}
.cta-section p{color:${T.muted};max-width:500px;margin:0 auto 28px;font-size:0.95rem;line-height:1.7}
.footer{border-top:1px solid ${T.border};padding:40px 28px;text-align:center;font-size:0.78rem;color:${T.muted}}
.footer a{color:${T.gold};text-decoration:none}
@media(prefers-reduced-motion:reduce){*{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important;scroll-behavior:auto!important}}
`;

export default function Landing() {
  const [openFaq, setOpenFaq] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(null);
  const [checkoutError, setCheckoutError] = useState("");

  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);

  function calcQuizResult(answers) {
    if (answers[3] === "multi" || answers[3] === "agency") return "agency";
    let score = 0;
    if (answers[0] === "mid") score += 1;
    if (answers[0] === "high") score += 2;
    if (answers[1] === "team" || answers[1] === "staff") score += 1;
    if (answers[2] === "sheet") score += 1;
    if (answers[2] === "crm") score += 2;
    return score >= 2 ? "professional" : "starter";
  }

  function handleQuizAnswer(stepIndex, value) {
    const newAnswers = { ...quizAnswers, [stepIndex]: value };
    setQuizAnswers(newAnswers);
    if (stepIndex === 3) {
      setQuizResult(calcQuizResult(newAnswers));
      setQuizStep(5);
    } else {
      setQuizStep(stepIndex + 2);
    }
  }

  function resetQuiz() {
    setQuizStep(0);
    setQuizAnswers({});
    setQuizResult(null);
  }

  async function handleCheckout(tier) {
    if (tier === "agency") {
      window.location.href = "mailto:goflowdesk@proton.me?subject=Agency Plan Inquiry";
      return;
    }
    setCheckoutLoading(tier);
    setCheckoutError("");
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceTier: tier }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setCheckoutError(data.error || "Checkout unavailable. Please contact us to sign up.");
      }
    } catch {
      setCheckoutError("Connection error. Please try again.");
    }
    setCheckoutLoading(null);
  }

  return (
    <div style={{background:T.bg,color:T.text,minHeight:"100vh"}}>
      <style>{CSS}</style>

      {/* NAV */}
      <nav className="nav">
        <div className="logo">
          <svg width="125" height="38" viewBox="0 0 400 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs><linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#F0B429"/><stop offset="100%" stopColor="#C49020"/></linearGradient></defs>
            <rect x="0" y="0" width="60" height="10" rx="3" fill="url(#g2)"/>
            <rect x="8" y="18" width="44" height="10" rx="3" fill="url(#g2)" opacity="0.85"/>
            <rect x="16" y="36" width="28" height="10" rx="3" fill="url(#g2)" opacity="0.7"/>
            <polygon points="22,52 38,52 46,70 14,70" fill="url(#g2)" opacity="0.6"/>
            <rect x="14" y="64" width="32" height="10" rx="8" fill="url(#g2)" opacity="0.5"/>
            <text x="115" y="58" fontFamily="Georgia,serif" fontSize="44" fontWeight="700" fill="#F0EAD6" letterSpacing="-0.5">Flow</text>
            <text x="115" y="90" fontFamily="Arial,sans-serif" fontSize="20" fontWeight="500" fill="#8A8470" letterSpacing="3.5">DESK</text>
            <circle cx="225" cy="50" r="3" fill="#F0B429"/>
          </svg>
          <sub>Lead Engine</sub>
        </div>
        <div className={`nav-links${mobileOpen ? " open" : ""}`}>
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="#faq">FAQ</a>
          <a href="/book">Book Now</a>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
          <a className="btn btn-g btn-s" style={{padding:"8px 18px"}} href="/dashboard">Dashboard →</a>
        </div>
        <div style={{display:"flex",gap:12,alignItems:"center"}}>
          <a className="btn btn-g btn-s nav-desktop" style={{padding:"8px 18px"}} href="/dashboard">Dashboard →</a>
          <button className="hamburger" aria-label="Toggle menu" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-badge"><span>PRICING</span> $97 setup, then $197/mo. No contracts.</div>
        <h1>The average contractor<br/>misses 7 calls a week.<br/><span>That&apos;s $1,500+ walking out the door.</span></h1>
        <p>FlowDesk answers every call, captures every lead, and sends automatic follow-ups 24/7, no receptionist needed. We build your website too. You just show up and do the jobs.</p>
        <div className="hero-actions">
          <a className="btn btn-g" href="#quiz">Find My Plan, Free</a>
          <a className="btn btn-w" href="#how">See How It Works</a>
        </div>
        <div className="hero-note">30-day free trial · No contract · Cancel anytime</div>
        <div className="proof-strip">
          <span className="proof-item">Every call answered 24/7</span>
          <span className="proof-item">Every lead captured automatically</span>
          <span className="proof-item">14-day follow-up sequence</span>
        </div>
      </section>

      {/* FEATURES */}
      <section className="section" id="features">
        <h2 className="section-hd">Six tools. One price. Zero hassle.</h2>
        <p className="section-sub">We handle the tech. You handle the jobs. Website, phone, CRM, booking, follow-ups — all connected, all running.</p>
        <div className="feat-list">
          {FEATURES.map((f, i) => (
            <div key={i} className="feat-item">
              <div className="feat-num">{String(i + 1).padStart(2, "0")}</div>
              <div>
                <div className="feat-title">{f.title}</div>
                <div className="feat-desc">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section" id="how">
        <h2 className="section-hd">From signup to your first lead in 7 days</h2>
        <p className="section-sub">No technical skills needed. We do everything.</p>
        <div className="steps">
          <div className="step"><div className="step-num">1</div><div className="step-title">We Build Your Site</div><div className="step-desc">Tell us about your business. We design and launch your website in 5-7 days. You approve it before anything goes live.</div></div>
          <div className="step"><div className="step-num">2</div><div className="step-title">Your Phone Goes Live</div><div className="step-desc">We configure your AI phone system in 24 hours. Port your existing number or get a new one. Your customers notice nothing changed.</div></div>
          <div className="step"><div className="step-num">3</div><div className="step-title">You Stop Missing Money</div><div className="step-desc">Every call is answered. Every lead is captured. Follow-ups go out automatically. You just show up and do the jobs.</div></div>
        </div>
        <div className="quote">
          <div className="quote-text">&quot;First week with FlowDesk, the AI caught three after-hours calls I would have missed. Two of them booked estimates. That paid for six months right there.&quot;</div>
          <div className="quote-author">— Carlos M.</div>
          <div className="quote-role">HVAC Contractor, Los Angeles</div>
        </div>
      </section>

      {/* QUALIFIER QUIZ */}
      <section className="section" id="quiz">
        <div className="section-tag">Find Your Fit</div>
        <h2 className="section-hd">Not sure which plan is right?</h2>
        <p className="section-sub">Answer 4 quick questions and we&apos;ll tell you exactly which tier fits your business, and why.</p>

        {quizStep === 0 && (
          <div style={{textAlign:"center"}}>
            <button className="btn btn-g" style={{fontSize:"0.95rem",padding:"14px 32px"}} onClick={() => setQuizStep(1)}>
              Take the 60-Second Quiz →
            </button>
          </div>
        )}

        {quizStep >= 1 && quizStep <= 4 && (
          <div className="quiz-card">
            <div className="quiz-progress">
              <span>Question {quizStep} of 4</span>
              <div className="quiz-bar"><div className="quiz-fill" style={{width:`${(quizStep/4)*100}%`}} /></div>
            </div>
            <div className="quiz-q">{QUIZ[quizStep - 1].q}</div>
            <div className="quiz-opts">
              {QUIZ[quizStep - 1].opts.map((opt, i) => (
                <button key={i} className="quiz-opt" onClick={() => handleQuizAnswer(quizStep - 1, opt.value)}>
                  {opt.label}
                </button>
              ))}
            </div>
            {quizStep > 1 && (
              <button className="quiz-back" onClick={() => setQuizStep(quizStep - 1)}>← Back</button>
            )}
          </div>
        )}

        {quizStep === 5 && quizResult && (
          <div className="quiz-result">
            <div className="quiz-result-tag">Your Recommended Plan</div>
            <div className="quiz-result-tier">{QUIZ_RESULTS[quizResult].tier}</div>
            <div className="quiz-result-desc">{QUIZ_RESULTS[quizResult].desc}</div>
            <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap",marginTop:28}}>
              <a className="btn btn-g" href="#pricing">See My Plan →</a>
              <button className="btn btn-o" onClick={resetQuiz}>Retake Quiz</button>
            </div>
          </div>
        )}
      </section>

      {/* PRICING */}
      <section className="section" id="pricing">
        <div className="section-tag">Simple Pricing</div>
        <h2 className="section-hd">$97 setup. Month-to-month after that.</h2>
        <p className="section-sub">Website build, AI phone system, CRM, booking, follow-ups — all included. One-time setup fee, then month-to-month. Cancel anytime.</p>
        {checkoutError && (
          <div style={{maxWidth:480,margin:"0 auto 24px",background:"rgba(224,90,90,.08)",border:"1px solid rgba(224,90,90,.25)",borderRadius:10,padding:"12px 16px",fontSize:"0.84rem",color:"#E05A5A",textAlign:"center"}}>
            {checkoutError}. <a href="mailto:goflowdesk@proton.me" style={{color:"#E05A5A"}}>Email us to sign up</a>
          </div>
        )}
        <div className="pricing-grid">
          {PRICING.map((p,i) => (
            <div key={i} className={`p-card ${p.popular?"popular":""} ${quizResult===p.tier?"recommended":""}`}>
              {p.popular && <div className="p-pop">Most Popular</div>}
              {quizResult === p.tier && <div className="p-rec">★ Recommended for you</div>}
              <div className="p-name">{p.name}</div>
              {p.setup ? (
                <div>
                  <div className="p-setup">{p.setup} <span>one-time setup</span></div>
                  <div className="p-price">{p.price}<sub>/mo</sub></div>
                </div>
              ) : p.noSetup ? (
                <div>
                  <div className="p-setup" style={{color:T.muted,fontWeight:400}}>No setup fee</div>
                  <div className="p-price">{p.price}<sub>/mo</sub></div>
                </div>
              ) : (
                <div className="p-price">{p.price}<sub>/mo</sub></div>
              )}
              <div className="p-desc">{p.desc}</div>
              <ul className="p-features">{p.features.map((f,j) => <li key={j}>{f}</li>)}</ul>
              <button
                className={`btn ${p.popular || quizResult===p.tier ? "btn-g":"btn-o"}`}
                onClick={() => handleCheckout(p.tier)}
                disabled={checkoutLoading !== null}
              >
                {checkoutLoading === p.tier ? "Redirecting…" : p.cta}
              </button>
            </div>
          ))}
        </div>

        {/* DONE-FOR-YOU CARD */}
        <div className="dfy-card">
          <div className="dfy-badge">Premium Service</div>
          <div className="dfy-inner">
            <div style={{flex:"1",minWidth:260}}>
              <div className="p-name" style={{fontSize:"1.5rem",marginBottom:8}}>Done-For-You AI Setup</div>
              <div className="dfy-price">From <span>$1,500</span> <small>one-time</small></div>
              <div className="p-desc" style={{maxWidth:460,fontSize:"0.88rem",lineHeight:1.75}}>
                Not sure where to start, or just want it handled? We audit your operations, build out your entire FlowDesk system, write your AI phone scripts, and configure every automation, top to bottom. You show up to a fully working system.
              </div>
            </div>
            <div style={{flex:"1",minWidth:220}}>
              <ul className="p-features" style={{marginBottom:24}}>
                <li>Full business operations audit</li>
                <li>Done-for-you FlowDesk setup &amp; config</li>
                <li>Custom AI phone scripts &amp; IVR flows</li>
                <li>Tailored SMS &amp; email follow-up sequences</li>
                <li>30-day optimization &amp; support call</li>
                <li>Staff training &amp; handoff documentation</li>
              </ul>
              <a className="btn btn-g" href="/book" style={{display:"inline-flex"}}>Book a Strategy Call →</a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section" id="faq">
        <h2 className="section-hd">Frequently Asked Questions</h2>
        <p className="section-sub">Everything you need to know before signing up.</p>
        <div className="faq-grid">
          {FAQ.map((item, i) => (
            <div key={i} className={`faq-item${openFaq === i ? " open" : ""}`}>
              <button className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                {item.q}
                <span className="faq-chevron">▼</span>
              </button>
              <div className="faq-body">
                <div className="faq-a">{item.a}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <h2>You&apos;re losing $1,500/mo in missed calls.<br/>Let&apos;s fix that.</h2>
        <p>30-day free trial. Setup in one week. No contract. Cancel anytime if it doesn&apos;t pay for itself.</p>
        <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap"}}>
          <a className="btn btn-g" href="#quiz">Find My Plan →</a>
          <a className="btn btn-o" href="#faq">Have Questions?</a>
        </div>
      </section>

      <footer className="footer">
        <p>FlowDesk, Lead Engine for Local Service Businesses<br/>
        Built for contractors, roofers, plumbers, electricians, landscapers, and every business that lives on the phone.<br/>
        <a href="/dashboard">Dashboard</a> · <a href="/privacy">Privacy</a> · <a href="/terms">Terms</a></p>
      </footer>
    </div>
  );
}
