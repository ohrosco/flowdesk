"use client";

const T = {
  bg: "#0A0A07", surface: "#14130E", card: "#1A1812", border: "#2A271D",
  gold: "#F0B429", goldDim: "#C49020", goldGlow: "rgba(240,180,41,0.12)",
  text: "#F0EAD6", muted: "#8A8470",
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{background:${T.bg};color:${T.text};font-family:'IBM Plex Sans',sans-serif;line-height:1.8}
.nav{position:fixed;top:0;left:0;right:0;z-index:100;background:rgba(10,10,7,.85);backdrop-filter:blur(12px);border-bottom:1px solid ${T.border};padding:14px 28px;display:flex;align-items:center;justify-content:space-between}
.logo{font-family:'Playfair Display',serif;font-size:1.35rem;font-weight:700;color:${T.gold}}
.logo sub{font-family:'IBM Plex Sans',sans-serif;font-size:0.6rem;color:${T.muted};font-weight:400;text-transform:uppercase;letter-spacing:0.12em;display:block}
.nav-links{display:flex;gap:24px;align-items:center}
.nav-links a{color:${T.muted};text-decoration:none;font-size:0.82rem;font-weight:500;transition:color .2s}
.nav-links a:hover{color:${T.text}}
.container{max-width:800px;margin:0 auto;padding:120px 28px 80px}
h1{font-family:'Playfair Display',serif;font-size:2.2rem;font-weight:700;color:${T.gold};margin-bottom:8px}
.updated{font-size:0.8rem;color:${T.muted};margin-bottom:40px}
h2{font-family:'Playfair Display',serif;font-size:1.3rem;font-weight:600;color:${T.gold};margin-top:36px;margin-bottom:12px}
h3{font-size:1rem;font-weight:600;color:${T.text};margin-top:24px;margin-bottom:8px}
p{margin-bottom:16px;font-size:0.92rem;color:${T.text};opacity:.92}
ul{margin-bottom:16px;padding-left:24px}
li{margin-bottom:6px;font-size:0.92rem;color:${T.text};opacity:.88}
.footer{border-top:1px solid ${T.border};padding:40px 28px;text-align:center;font-size:0.78rem;color:${T.muted}}
.footer a{color:${T.gold};text-decoration:none}
`;

export default function TermsPage() {
  return (
    <>
      <style>{CSS}</style>
      <nav className="nav">
        <a href="/" style={{textDecoration:"none"}}>
          <div className="logo">
            <svg width="125" height="38" viewBox="0 0 400 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs><linearGradient id="gt" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#F0B429"/><stop offset="100%" stop-color="#C49020"/></linearGradient></defs>
              <rect x="0" y="0" width="60" height="10" rx="3" fill="url(#gt)"/>
              <rect x="8" y="18" width="44" height="10" rx="3" fill="url(#gt)" opacity="0.85"/>
              <rect x="16" y="36" width="28" height="10" rx="3" fill="url(#gt)" opacity="0.7"/>
              <polygon points="22,52 38,52 46,70 14,70" fill="url(#gt)" opacity="0.6"/>
              <rect x="14" y="64" width="32" height="10" rx="8" fill="url(#gt)" opacity="0.5"/>
              <text x="115" y="58" font-family="Georgia,serif" font-size="44" font-weight="700" fill="#F0EAD6" letter-spacing="-0.5">Flow</text>
              <text x="115" y="90" font-family="Arial,sans-serif" font-size="20" font-weight="500" fill="#8A8470" letter-spacing="3.5">DESK</text>
              <circle cx="225" cy="50" r="3" fill="#F0B429"/>
            </svg>
            <sub>Lead Engine</sub>
          </div>
        </a>
        <div className="nav-links">
          <a href="/">Home</a>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
          <a href="/book">Book Now</a>
        </div>
      </nav>

      <div className="container">
        <h1>Terms of Service</h1>
        <div className="updated">Last updated: May 18, 2026</div>

        <h2>1. Acceptance of Terms</h2>
        <p>By using FlowDesk (&quot;the Service&quot;), you agree to these Terms of Service. If you do not agree, do not use the Service.</p>

        <h2>2. Description of Service</h2>
        <p>FlowDesk provides website development, AI phone answering, lead capture, CRM, appointment scheduling, and automated follow-up services for local service businesses.</p>

        <h2>3. Subscription & Billing</h2>
        <p>Service is provided on a month-to-month subscription basis. Fees are charged in advance and are non-refundable except as specified in our refund policy. You authorize us to charge your payment method on the billing date.</p>
        <p>Subscription tiers and pricing are displayed on our website. We may change pricing with 30 days notice.</p>

        <h3>Refund Policy</h3>
        <p>You may cancel at any time. Upon cancellation, service continues until the end of the current billing period. No prorated refunds for partial months. Setup fees, if any, are non-refundable.</p>

        <h2>4. Your Responsibilities</h2>
        <p>You agree to:</p>
        <ul>
          <li>Provide accurate business information</li>
          <li>Maintain the confidentiality of your login credentials</li>
          <li>Use the Service in compliance with all applicable laws</li>
          <li>Not use the Service for spam, fraud, or illegal activities</li>
          <li>Not attempt to reverse-engineer or misuse the AI phone system</li>
        </ul>

        <h2>5. Service Availability</h2>
        <p>We aim for 99.9% uptime but do not guarantee uninterrupted service. We are not liable for downtime caused by third-party services (Twilio, Vercel, Supabase), maintenance windows, or force majeure events.</p>

        <h2>6. Intellectual Property</h2>
        <p>FlowDesk retains all rights to the software, AI models, and technology powering the Service. You retain ownership of your business content, including website copy, logos, and customer data.</p>

        <h2>7. Limitation of Liability</h2>
        <p>FlowDesk is not liable for lost profits, lost revenue, lost leads, or incidental damages arising from use of the Service. Our total liability is limited to the amount you paid in the 12 months preceding the claim.</p>

        <h2>8. Termination</h2>
        <p>Either party may terminate at any time. We may terminate immediately if you violate these terms. Upon termination, your data will be exported and provided to you within 14 days upon request.</p>

        <h2>9. Data Export</h2>
        <p>Upon request within 30 days of termination, we will provide your lead data, appointment data, and website content in a commonly used format (CSV/HTML). After 30 days, data may be permanently deleted.</p>

        <h2>10. Changes to Terms</h2>
        <p>We may update these terms. Material changes will be notified via email 30 days in advance. Continued use after changes take effect constitutes acceptance.</p>

        <h2>11. Governing Law</h2>
        <p>These terms are governed by the laws of the State of Louisiana. Any disputes shall be resolved in the courts of Livingston Parish, Louisiana.</p>

        <h2>12. Contact</h2>
        <p>For questions about these terms:<br/>
        Email: roscommedia@gmail.com<br/>
        Phone: +1 (225) 460-1636<br/>
        FlowDesk — Denham Springs, Louisiana</p>
      </div>

      <footer className="footer">
        <p>FlowDesk — Lead Engine for Local Service Businesses<br/>
        <a href="/privacy">Privacy Policy</a> · <a href="/terms">Terms of Service</a> · <a href="/">Home</a></p>
      </footer>
    </>
  );
}
