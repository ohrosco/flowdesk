"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const T = {
  bg: "#0A0A07", surface: "#14130E", card: "#1A1812", border: "#2A271D",
  gold: "#F0B429", goldDim: "#C49020", goldGlow: "rgba(240,180,41,0.12)",
  text: "#F0EAD6", muted: "#8A8470", red: "#E05A5A",
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%}
body{background:${T.bg};color:${T.text};font-family:'IBM Plex Sans',sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:20px}
.login-wrap{width:100%;max-width:400px;text-align:center}
.logo{font-family:'Playfair Display',serif;font-size:1.8rem;font-weight:800;color:${T.gold};letter-spacing:-0.5px;margin-bottom:4px}
.logo sub{font-family:'IBM Plex Sans',sans-serif;font-size:0.65rem;color:${T.muted};font-weight:400;text-transform:uppercase;letter-spacing:0.12em;display:block;margin-top:-2px}
.tenant-badge{display:inline-flex;align-items:center;gap:6px;background:rgba(240,180,41,.1);border:1px solid rgba(240,180,41,.25);border-radius:20px;padding:5px 14px;font-size:0.75rem;color:${T.gold};margin-bottom:18px}
.card{background:${T.card};border:1px solid ${T.border};border-radius:16px;padding:32px;margin-top:28px}
.field{display:flex;flex-direction:column;gap:6px;margin-bottom:20px;text-align:left}
.field label{font-size:0.72rem;font-weight:600;text-transform:uppercase;letter-spacing:0.09em;color:${T.muted}}
.field input{background:${T.surface};border:1px solid ${T.border};border-radius:10px;padding:12px 14px;color:${T.text};font-size:0.9rem;font-family:'IBM Plex Sans',sans-serif;outline:none;transition:border-color .2s;width:100%}
.field input:focus{border-color:${T.gold}}
.field input::placeholder{color:${T.muted}}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;padding:12px 24px;border-radius:10px;font-size:0.9rem;font-weight:600;font-family:'IBM Plex Sans',sans-serif;cursor:pointer;border:none;transition:all .2s;width:100%;text-decoration:none}
.btn-g{background:${T.gold};color:#0A0A07}
.btn-g:hover{background:${T.goldDim};transform:translateY(-1px);box-shadow:0 4px 20px ${T.goldGlow}}
.btn:disabled{opacity:.5;cursor:not-allowed;transform:none!important}
.err{background:rgba(224,90,90,.08);border:1px solid rgba(224,90,90,.25);border-radius:10px;padding:12px 14px;font-size:0.82rem;color:${T.red};margin-bottom:16px;text-align:left;display:flex;align-items:center;gap:8px}
.footer{font-size:0.72rem;color:${T.muted};margin-top:24px;text-align:center}
`;

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [tenantSlug, setTenantSlug] = useState(null); // set when ?t=<slug> is in URL
  const [isAgency, setIsAgency] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("t");
    const agency = params.get("agency");
    if (t) setTenantSlug(t);
    if (agency) setIsAgency(true);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Tenant client login (slug in URL)
      if (tenantSlug) {
        const res = await fetch("/api/auth/tenant-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug: tenantSlug, password }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          const redirectTo = new URLSearchParams(window.location.search).get("redirect") || "/dashboard";
          router.push(redirectTo);
        } else {
          setError(data.error || "Wrong password");
        }
        setLoading(false);
        return;
      }

      // Agency / legacy single-tenant login
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const redirectTo = new URLSearchParams(window.location.search).get("redirect") ||
          (isAgency ? "/agency" : "/dashboard");
        router.push(redirectTo);
      } else {
        setError(data.error || "Wrong password");
      }
    } catch {
      setError("Connection error. Try again.");
    }
    setLoading(false);
  }

  return (
    <>
      <style>{CSS}</style>
      <div className="login-wrap">
        <div className="logo">
          <svg width="140" height="42" viewBox="0 0 400 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs><linearGradient id="gl" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#F0B429"/><stop offset="100%" stopColor="#C49020"/></linearGradient></defs>
            <rect x="0" y="0" width="60" height="10" rx="3" fill="url(#gl)"/>
            <rect x="8" y="18" width="44" height="10" rx="3" fill="url(#gl)" opacity="0.85"/>
            <rect x="16" y="36" width="28" height="10" rx="3" fill="url(#gl)" opacity="0.7"/>
            <polygon points="22,52 38,52 46,70 14,70" fill="url(#gl)" opacity="0.6"/>
            <rect x="14" y="64" width="32" height="10" rx="8" fill="url(#gl)" opacity="0.5"/>
            <text x="115" y="58" fontFamily="Georgia,serif" fontSize="44" fontWeight="700" fill="#F0EAD6" letterSpacing="-0.5">Flow</text>
            <text x="115" y="90" fontFamily="Arial,sans-serif" fontSize="20" fontWeight="500" fill="#8A8470" letterSpacing="3.5">DESK</text>
            <circle cx="225" cy="50" r="3" fill="#F0B429"/>
          </svg>
          <sub>Lead Engine</sub>
        </div>

        {tenantSlug && (
          <div className="tenant-badge">
            🏢 Logging in to: <strong>{tenantSlug}</strong>
          </div>
        )}

        <div className="card">
          <form onSubmit={handleSubmit}>
            {error && <div className="err">✕ {error}</div>}
            <div className="field">
              <label>Password</label>
              <input
                type="password"
                placeholder={tenantSlug ? "Enter your account password" : "Enter admin password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                required
              />
            </div>
            <button type="submit" className="btn btn-g" disabled={loading}>
              {loading ? "Signing in…" : "Login →"}
            </button>
          </form>
        </div>
        <div className="footer">
          FlowDesk — Lead Engine
          {!tenantSlug && (
            <> · <a href="/login?agency=1" style={{color:T.muted,textDecoration:"none"}}>Agency login</a></>
          )}
        </div>
      </div>
    </>
  );
}
