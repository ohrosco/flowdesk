"use client";
import { useState } from "react";

const T = {
  bg:"#0A0A07", surface:"#14130E", card:"#1A1812", border:"#2A271D",
  gold:"#F0B429", goldDim:"#C49020", goldGlow:"rgba(240,180,41,0.12)",
  text:"#F0EAD6", muted:"#8A8470",
};

const FEATURES = [
  { icon:"🌐", title:"Professional Website", desc:"A modern 3-5 page website built for your business — shows up on Google, looks great on every device." },
  { icon:"📞", title:"24/7 AI Phone Answering", desc:"Never miss a lead again. Our AI answers every call, captures details, and books appointments — even after hours." },
  { icon:"📋", title:"Smart Lead Capture", desc:"Every call, web form, and text message automatically creates a lead in your CRM. No data entry needed." },
  { icon:"⚡", title:"Auto Follow-Up Sequence", desc:"SMS, email, and phone call reminders go out automatically. 14-day sequence turns cold leads into paying jobs." },
  { icon:"📅", title:"Online Booking & Calendar", desc:"Customers book their own appointments online. Syncs with your schedule. Reduces no-shows with auto-reminders." },
  { icon:"📊", title:"Pipeline Dashboard", desc:"See every lead, every follow-up, every appointment in one place. Know exactly who to call today." },
];

const PRICING = [
  {
    name:"Starter", price:"$197", desc:"For solo operators testing the waters",
    features:["1-page website", "AI phone answering (100 min/mo)", "Lead capture CRM", "SMS follow-up sequence", "Online booking widget"],
    cta:"Start Free Trial",
    popular:false,
  },
  {
    name:"Professional", price:"$297", desc:"For growing teams that want it all",
    features:["5-page custom website", "AI phone answering (300 min/mo)", "Full lead CRM + pipeline", "SMS + Email + Call follow-ups", "Online booking + auto-reminders", "AI draft follow-ups", "Priority support"],
    cta:"Start Free Trial",
    popular:true,
  },
  {
    name:"Agency", price:"$497", desc:"For multi-location businesses",
    features:["10-page website + sub-pages", "AI phone answering (unlimited)", "Multi-location CRM", "White-label dashboard", "Custom integrations", "Dedicated account manager"],
    cta:"Contact Us",
    popular:false,
  },
];

const FAQ = [
  { q:"Do I need a website already?", a:"Nope! We build it for you. Most of our customers don't have one — that's the whole point. We design, build, and launch your site in about a week." },
  { q:"What if I already have a website?", a:"We can work with what you have, or rebuild it. The FlowDesk system integrates with your existing site or replaces it entirely." },
  { q:"How does the AI phone system work?", a:"When a customer calls your FlowDesk number, our AI greets them, asks what they need, captures their info, and books them — just like a human receptionist. You get a notification instantly." },
  { q:"Can I keep my current phone number?", a:"Yes. We can port your existing number to FlowDesk, or you keep it and add a FlowDesk number alongside it. Both forward to the same system." },
  { q:"How long to get set up?", a:"Website: 5-7 days. AI phone system: 24 hours. Full setup including porting your number: about a week." },
  { q:"Is there a contract?", a:"Month-to-month. No long-term contracts. You can cancel anytime — we'll help you export everything." },
];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{background:${T.bg};color:${T.text};font-family:'IBM Plex Sans',sans-serif;overflow-x:hidden}
.nav{position:fixed;top:0;left:0;right:0;z-index:100;background:rgba(10,10,7,.85);backdrop-filter:blur(12px);border-bottom:1px solid ${T.border};padding:14px 28px;display:flex;align-items:center;justify-content:space-between}
.logo{font-family:'Playfair Display',serif;font-size:1.35rem;font-weight:700;color:${T.gold};letter-spacing:-0.3px}
.logo sub{font-family:'IBM Plex Sans',sans-serif;font-size:0.6rem;color:${T.muted};font-weight:400;text-transform:uppercase;letter-spacing:0.12em;display:block;margin-top:-2px}
.nav-links{display:flex;gap:24px;align-items:center}
.nav-links a{color:${T.muted};text-decoration:none;font-size:0.82rem;font-weight:500;transition:color .2s;cursor:pointer}
.nav-links a:hover{color:${T.text}}
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
.stats-row{display:flex;justify-content:center;gap:40px;flex-wrap:wrap;margin-top:60px;padding-top:40px;border-top:1px solid ${T.border}}
.stat-item{text-align:center}
.stat-num{font-family:'Playfair Display',serif;font-size:1.6rem;font-weight:700;color:${T.gold}}
.stat-lbl{font-size:0.75rem;color:${T.muted};text-transform:uppercase;letter-spacing:0.08em;margin-top:4px}
.section{padding:80px 28px;max-width:1100px;margin:0 auto}
.section-tag{font-size:0.75rem;font-weight:600;color:${T.gold};text-transform:uppercase;letter-spacing:0.12em;margin-bottom:12px;text-align:center}
.section-hd{font-family:'Playfair Display',serif;font-size:clamp(1.6rem,4vw,2.4rem);font-weight:700;text-align:center;margin-bottom:12px;letter-spacing:-0.3px}
.section-sub{font-size:0.95rem;color:${T.muted};text-align:center;max-width:600px;margin:0 auto 50px;line-height:1.7}
.feature-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
@media(max-width:800px){.feature-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:500px){.feature-grid{grid-template-columns:1fr}}
.f-card{background:${T.card};border:1px solid ${T.border};border-radius:16px;padding:28px;transition:all .25s;cursor:default}
.f-card:hover{border-color:${T.gold};transform:translateY(-3px);box-shadow:0 8px 30px rgba(0,0,0,.3)}
.f-icon{font-size:2rem;margin-bottom:16px}
.f-title{font-size:1rem;font-weight:600;margin-bottom:8px}
.f-desc{font-size:0.84rem;color:${T.muted};line-height:1.65}
.pricing-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;align-items:start}
@media(max-width:800px){.pricing-grid{grid-template-columns:1fr;max-width:400px;margin:0 auto}}
.p-card{background:${T.card};border:1px solid ${T.border};border-radius:16px;padding:32px;position:relative;transition:all .25s}
.p-card.popular{border-color:${T.gold};background:linear-gradient(135deg,${T.card},rgba(240,180,41,.04))}
.p-card:hover{transform:translateY(-3px)}
.p-pop{position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:${T.gold};color:#0A0A07;font-size:0.7rem;font-weight:700;padding:4px 14px;border-radius:50px;text-transform:uppercase;letter-spacing:0.08em}
.p-name{font-family:'Playfair Display',serif;font-size:1.3rem;font-weight:700;margin-bottom:4px}
.p-price{font-family:'Playfair Display',serif;font-size:2.4rem;font-weight:800;color:${T.gold};margin-bottom:4px}
.p-price sub{font-size:0.9rem;font-weight:400;color:${T.muted}}
.p-desc{font-size:0.82rem;color:${T.muted};margin-bottom:24px}
.p-features{list-style:none;margin-bottom:28px}
.p-features li{padding:8px 0;font-size:0.85rem;border-bottom:1px solid ${T.border};display:flex;align-items:center;gap:8px}
.p-features li:last-child{border-bottom:none}
.p-features li::before{content:"✓";color:${T.gold};font-weight:700}
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
.faq-grid{max-width:700px;margin:0 auto;display:flex;flex-direction:column;gap:8px}
.faq-q{background:${T.card};border:1px solid ${T.border};border-radius:12px;padding:18px 20px;cursor:pointer;transition:border-color .2s;font-size:0.9rem;font-weight:500}
.faq-q:hover{border-color:${T.gold}}
.faq-q.open{border-color:${T.gold}}
.faq-a{padding:0 20px 18px;font-size:0.84rem;color:${T.muted};line-height:1.7;display:none}
.faq-q.open + .faq-a{display:block}
.cta-section{text-align:center;padding:80px 28px;background:linear-gradient(180deg,${T.bg},${T.surface})}
.cta-section h2{font-family:'Playfair Display',serif;font-size:clamp(1.6rem,4vw,2.4rem);font-weight:700;margin-bottom:16px}
.cta-section p{color:${T.muted};max-width:500px;margin:0 auto 28px;font-size:0.95rem;line-height:1.7}
.footer{border-top:1px solid ${T.border};padding:40px 28px;text-align:center;font-size:0.78rem;color:${T.muted}}
.footer a{color:${T.gold};text-decoration:none}
`;

export default function Landing() {
  const [openFaq, setOpenFaq] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <style>{CSS}</style>

      {/* NAV */}
      <nav className="nav">
        <div className="logo">
          <svg width="125" height="38" viewBox="0 0 400 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs><linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#F0B429"/><stop offset="100%" stop-color="#C49020"/></linearGradient></defs>
            <rect x="0" y="0" width="60" height="10" rx="3" fill="url(#g2)"/>
            <rect x="8" y="18" width="44" height="10" rx="3" fill="url(#g2)" opacity="0.85"/>
            <rect x="16" y="36" width="28" height="10" rx="3" fill="url(#g2)" opacity="0.7"/>
            <polygon points="22,52 38,52 46,70 14,70" fill="url(#g2)" opacity="0.6"/>
            <rect x="14" y="64" width="32" height="10" rx="8" fill="url(#g2)" opacity="0.5"/>
            <text x="115" y="58" font-family="Georgia,serif" font-size="44" font-weight="700" fill="#F0EAD6" letter-spacing="-0.5">Flow</text>
            <text x="115" y="90" font-family="Arial,sans-serif" font-size="20" font-weight="500" fill="#8A8470" letter-spacing="3.5">DESK</text>
            <circle cx="225" cy="50" r="3" fill="#F0B429"/>
          </svg>
          <sub>Lead Engine</sub>
        </div>
        <div className="nav-links" style={{display:mobileOpen?"flex":"none"}}>
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="#faq">FAQ</a>
          <a href="/book">Book Now</a>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
          <a className="btn btn-g btn-s" style={{padding:"8px 18px"}} href="/dashboard">Dashboard →</a>
        </div>
        <div style={{display:"flex",gap:12,alignItems:"center"}}>
          <a className="btn btn-g btn-s" style={{padding:"8px 18px"}} href="/dashboard">Dashboard →</a>
          <div style={{cursor:"pointer",fontSize:"1.2rem",display:"none"}} onClick={()=>setMobileOpen(!mobileOpen)}>☰</div>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-badge"><span>NEW</span> Your website + AI phone system — one flat price</div>
        <h1>A website + AI that<br/>answers your calls<br/>and <span>fills your schedule.</span></h1>
        <p>We build you a professional website. We set up an AI phone system that answers every call, captures leads, and books jobs. No website? No problem. That&apos;s the whole point.</p>
        <div className="hero-actions">
          <a className="btn btn-g" href="#pricing">See Plans & Pricing</a>
          <a className="btn btn-w" href="#how">How It Works</a>
        </div>
        <div className="hero-note">🚀 First 5 customers get setup fees waived</div>
        <div className="stats-row">
          <div className="stat-item"><div className="stat-num">98%</div><div className="stat-lbl">of local businesses have no AI</div></div>
          <div className="stat-item"><div className="stat-num">67%</div><div className="stat-lbl">of calls after hours go unanswered</div></div>
          <div className="stat-item"><div className="stat-num">3x</div><div className="stat-lbl">more leads with auto follow-up</div></div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="section" id="features">
        <div className="section-tag">Everything You Need</div>
        <h2 className="section-hd">Six tools. One price. Zero hassle.</h2>
        <p className="section-sub">We handle the tech. You handle the jobs. Everything syncs — website, phone, CRM, booking, follow-ups — in one system.</p>
        <div className="feature-grid">
          {FEATURES.map((f,i) => (
            <div key={i} className="f-card">
              <div className="f-icon">{f.icon}</div>
              <div className="f-title">{f.title}</div>
              <div className="f-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section" id="how">
        <div className="section-tag">How It Works</div>
        <h2 className="section-hd">From signup to your first lead in 7 days</h2>
        <p className="section-sub">No technical skills needed. We do everything.</p>
        <div className="steps">
          <div className="step"><div className="step-num">1</div><div className="step-title">We Build Your Site</div><div className="step-desc">You tell us about your business. We design and launch your website in 5-7 days.</div></div>
          <div className="step"><div className="step-num">2</div><div className="step-title">We Set Up Your Phone</div><div className="step-desc">We configure your AI phone system. Port your existing number or get a new one. Working in 24 hours.</div></div>
          <div className="step"><div className="step-num">3</div><div className="step-title">Leads Start Flowing</div><div className="step-desc">Calls get answered. Forms get submitted. Follow-ups go out. You just show up and do the work.</div></div>
        </div>
        <div className="quote">
          <div className="quote-text">&quot;I was paying $400/mo for a basic website and still missing calls. FlowDesk built me a better site AND answers my phones for less than I was paying for just the website.&quot;</div>
          <div className="quote-author">— Mike R.</div>
          <div className="quote-role">Roofing Contractor, Denham Springs</div>
        </div>
      </section>

      {/* PRICING */}
      <section className="section" id="pricing">
        <div className="section-tag">Simple Pricing</div>
        <h2 className="section-hd">One flat rate. No surprises.</h2>
        <p className="section-sub">Website build, AI phone system, CRM, booking, follow-ups — all included. Month-to-month. Cancel anytime.</p>
        <div className="pricing-grid">
          {PRICING.map((p,i) => (
            <div key={i} className={`p-card ${p.popular?"popular":""}`}>
              {p.popular && <div className="p-pop">Most Popular</div>}
              <div className="p-name">{p.name}</div>
              <div className="p-price">{p.price}<sub>/mo</sub></div>
              <div className="p-desc">{p.desc}</div>
              <ul className="p-features">{p.features.map((f,j) => <li key={j}>{f}</li>)}</ul>
              <a className={`btn ${p.popular?"btn-g":"btn-o"}`} href="/login">{p.cta}</a>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="section" id="faq">
        <div className="section-tag">Questions?</div>
        <h2 className="section-hd">Frequently Asked Questions</h2>
        <p className="section-sub">Everything you need to know before signing up.</p>
        <div className="faq-grid">
          {FAQ.map((item,i) => (
            <div key={i}>
              <div className={`faq-q ${openFaq===i?"open":""}`} onClick={() => setOpenFaq(openFaq===i ? null : i)}>
                {item.q}
              </div>
              <div className="faq-a" style={{display:openFaq===i?"block":"none"}}>{item.a}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <h2>Ready to stop missing leads?</h2>
        <p>Get your website + AI phone system in one week. First 5 customers get setup fees waived.</p>
        <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap"}}>
          <a className="btn btn-g" href="#pricing">Choose Your Plan →</a>
          <a className="btn btn-o" href="#faq">Still Have Questions?</a>
        </div>
      </section>

      <footer className="footer">
        <p>FlowDesk — Lead Engine for Local Service Businesses<br/>
        Built for contractors, roofers, plumbers, electricians, landscapers, and every business that lives on the phone.<br/>
        <a href="/dashboard">Dashboard</a> · <a href="/privacy">Privacy</a> · <a href="/terms">Terms</a></p>
      </footer>
    </>
  );
}
