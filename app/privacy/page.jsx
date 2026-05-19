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
p{margin-bottom:16px;font-size:0.92rem;color:${T.text};opacity:.92}
ul{margin-bottom:16px;padding-left:24px}
li{margin-bottom:6px;font-size:0.92rem;color:${T.text};opacity:.88}
.footer{border-top:1px solid ${T.border};padding:40px 28px;text-align:center;font-size:0.78rem;color:${T.muted}}
.footer a{color:${T.gold};text-decoration:none}
`;

export default function PrivacyPage() {
  return (
    <>
      <style>{CSS}</style>
      <nav className="nav">
        <a href="/" style={{textDecoration:"none"}}>
          <div className="logo">
            <svg width="125" height="38" viewBox="0 0 400 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs><linearGradient id="gp" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#F0B429"/><stop offset="100%" stopColor="#C49020"/></linearGradient></defs>
              <rect x="0" y="0" width="60" height="10" rx="3" fill="url(#gp)"/>
              <rect x="8" y="18" width="44" height="10" rx="3" fill="url(#gp)" opacity="0.85"/>
              <rect x="16" y="36" width="28" height="10" rx="3" fill="url(#gp)" opacity="0.7"/>
              <polygon points="22,52 38,52 46,70 14,70" fill="url(#gp)" opacity="0.6"/>
              <rect x="14" y="64" width="32" height="10" rx="8" fill="url(#gp)" opacity="0.5"/>
              <text x="115" y="58" fontFamily="Georgia,serif" fontSize="44" fontWeight="700" fill="#F0EAD6" letterSpacing="-0.5">Flow</text>
              <text x="115" y="90" fontFamily="Arial,sans-serif" fontSize="20" fontWeight="500" fill="#8A8470" letterSpacing="3.5">DESK</text>
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
        <h1>Privacy Policy</h1>
        <div className="updated">Last updated: May 18, 2026</div>

        <h2>1. Information We Collect</h2>
        <p>We collect information you provide directly: name, phone number, email address, service address, and service needs when you call, fill out a form, or communicate with us via SMS.</p>
        <p>We automatically collect: call recordings (for quality and training), SMS message content, the date/time of interactions, and technical data such as IP address and browser type when you visit our website.</p>

        <h2>2. How We Use Your Information</h2>
        <p>We use your information to:</p>
        <ul>
          <li>Respond to your service requests and schedule appointments</li>
          <li>Send SMS and email follow-ups about your service needs</li>
          <li>Improve our AI phone system and lead capture services</li>
          <li>Comply with legal obligations</li>
        </ul>

        <h2>3. SMS & Communication</h2>
        <p>By providing your phone number, you consent to receive SMS messages from FlowDesk regarding your service request. Message and data rates may apply. You can reply STOP at any time to opt out of SMS communications.</p>
        <p>Call recordings are stored securely and used for quality assurance and AI training. Recordings are retained for 90 days unless otherwise required.</p>

        <h2>4. Data Sharing</h2>
        <p>We do not sell your personal information. We share data only with:</p>
        <ul>
          <li>Twilio — to process voice calls and SMS messages</li>
          <li>Supabase — for secure database storage</li>
          <li>Stripe — for payment processing (when applicable)</li>
          <li>Our business clients (the service providers you contacted) — so they can fulfill your service request</li>
        </ul>

        <h2>5. Data Retention</h2>
        <p>We retain your information for as long as needed to provide services and comply with legal obligations. Lead data is retained for 2 years after last contact. Call recordings are retained for 90 days.</p>

        <h2>6. Your Rights</h2>
        <p>Depending on your location, you may have rights to access, correct, delete, or port your data. To exercise these rights, contact us at roscommedia@gmail.com. We will respond within 30 days.</p>

        <h2>7. Security</h2>
        <p>We use industry-standard encryption (TLS/SSL) for data in transit and encryption at rest for stored data. Access to personal data is restricted to authorized personnel only.</p>

        <h2>8. Changes to This Policy</h2>
        <p>We may update this policy. Material changes will be notified via email or a prominent notice on our website.</p>

        <h2>9. Contact</h2>
        <p>For questions about this policy, contact:<br/>
        Email: roscommedia@gmail.com<br/>
        Phone: +1 (225) 460-1636</p>
      </div>

      <footer className="footer">
        <p>FlowDesk — Lead Engine for Local Service Businesses<br/>
        <a href="/privacy">Privacy Policy</a> · <a href="/terms">Terms of Service</a> · <a href="/">Home</a></p>
      </footer>
    </>
  );
}
