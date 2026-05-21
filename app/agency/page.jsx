"use client";
import { useState, useEffect } from "react";

const T = {
  bg:"#0A0A07", surface:"#14130E", card:"#1A1812", border:"#2A271D",
  gold:"#F0B429", goldDim:"#C49020", goldGlow:"rgba(240,180,41,0.12)",
  text:"#F0EAD6", muted:"#8A8470", red:"#E05A5A", green:"#5ABF8A", blue:"#5A9FE0",
};

const PLAN_COLORS = { starter: T.blue, professional: T.gold, agency: T.green };
const STATUS_COLORS = { trial: T.blue, active: T.green, past_due: "#F97316", canceled: T.red };

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%;background:${T.bg};font-family:'IBM Plex Sans',sans-serif;color:${T.text}}
.wrap{min-height:100vh;display:flex;flex-direction:column}
.hdr{padding:16px 28px;border-bottom:1px solid ${T.border};display:flex;align-items:center;justify-content:space-between;background:${T.surface}}
.logo{font-family:'Playfair Display',serif;font-size:1.2rem;font-weight:700;color:${T.gold}}
.agency-badge{background:rgba(240,180,41,.12);border:1px solid rgba(240,180,41,.25);border-radius:20px;padding:3px 12px;font-size:0.72rem;font-weight:600;color:${T.gold};margin-left:10px}
.main{flex:1;padding:28px;max-width:1200px;width:100%;margin:0 auto}
.page-hd{font-family:'Playfair Display',serif;font-size:1.6rem;font-weight:700;color:${T.gold};margin-bottom:6px}
.page-sub{font-size:0.84rem;color:${T.muted};margin-bottom:28px}
.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:28px}
.stat{background:${T.card};border:1px solid ${T.border};border-radius:12px;padding:18px;position:relative;overflow:hidden}
.stat::after{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:var(--c,${T.gold})}
.stat-n{font-family:'Playfair Display',serif;font-size:1.8rem;font-weight:700;color:var(--c,${T.gold})}
.stat-l{font-size:0.72rem;color:${T.muted};text-transform:uppercase;letter-spacing:0.08em;margin-top:2px}
.card{background:${T.card};border:1px solid ${T.border};border-radius:14px}
.card-hd{padding:16px 20px;border-bottom:1px solid ${T.border};display:flex;align-items:center;justify-content:space-between}
.card-title{font-weight:600;font-size:0.95rem}
.btn{display:inline-flex;align-items:center;gap:7px;padding:9px 18px;border-radius:9px;font-size:0.84rem;font-weight:600;font-family:'IBM Plex Sans',sans-serif;cursor:pointer;border:none;transition:all .2s}
.btn-g{background:${T.gold};color:#111}
.btn-g:hover{background:${T.goldDim}}
.btn-o{background:transparent;color:${T.text};border:1px solid ${T.border}}
.btn-o:hover{border-color:${T.gold};color:${T.gold}}
.btn-s{padding:6px 12px;font-size:0.78rem}
.btn-danger{background:rgba(224,90,90,.15);color:${T.red};border:1px solid rgba(224,90,90,.3)}
.btn-danger:hover{background:rgba(224,90,90,.25)}
.badge{display:inline-flex;align-items:center;padding:2px 9px;border-radius:20px;font-size:0.68rem;font-weight:600;border:1px solid transparent}
table{width:100%;border-collapse:collapse}
th{padding:10px 16px;text-align:left;font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:${T.muted};border-bottom:1px solid ${T.border};background:${T.surface}}
td{padding:12px 16px;font-size:0.86rem;border-bottom:1px solid ${T.border}}
tr:last-child td{border-bottom:none}
tr:hover td{background:rgba(255,255,255,.02)}
.modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.75);backdrop-filter:blur(4px);z-index:100;display:flex;align-items:center;justify-content:center;padding:20px}
.modal{background:${T.card};border:1px solid ${T.border};border-radius:18px;padding:28px;width:100%;max-width:480px;max-height:90vh;overflow-y:auto}
.modal-t{font-family:'Playfair Display',serif;font-size:1.1rem;font-weight:700;color:${T.gold};margin-bottom:20px}
.field{margin-bottom:14px}
.field label{display:block;font-size:0.72rem;font-weight:600;text-transform:uppercase;letter-spacing:0.09em;color:${T.muted};margin-bottom:5px}
.field input,.field select{width:100%;background:${T.surface};border:1px solid ${T.border};border-radius:9px;padding:10px 13px;color:${T.text};font-size:0.86rem;font-family:'IBM Plex Sans',sans-serif;outline:none;transition:border-color .2s}
.field input:focus,.field select:focus{border-color:${T.gold}}
.field input::placeholder{color:${T.muted}}
.two-col{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.form-actions{display:flex;gap:10px;justify-content:flex-end;margin-top:20px}
.err{background:rgba(224,90,90,.08);border:1px solid rgba(224,90,90,.25);border-radius:9px;padding:10px 14px;font-size:0.82rem;color:${T.red};margin-bottom:14px}
.toast{position:fixed;bottom:24px;right:24px;background:${T.card};border:1px solid ${T.green};border-radius:12px;padding:12px 18px;font-size:0.84rem;color:${T.green};z-index:200;display:flex;align-items:center;gap:8px;box-shadow:0 8px 32px rgba(0,0,0,.4)}
.login-url{font-size:0.75rem;color:${T.muted};font-family:monospace;background:${T.surface};padding:4px 8px;border-radius:5px;display:inline-block;margin-top:4px}
.empty{text-align:center;padding:40px;color:${T.muted};font-size:0.88rem}
.gs-wrap{padding:40px 32px;display:flex;flex-direction:column;align-items:center;gap:24px}
.gs-icon{font-size:2.8rem;line-height:1}
.gs-title{font-family:'Playfair Display',serif;font-size:1.25rem;font-weight:700;color:${T.text};text-align:center}
.gs-sub{font-size:0.86rem;color:${T.muted};text-align:center;max-width:440px;line-height:1.6}
.gs-checklist{width:100%;max-width:520px;display:flex;flex-direction:column;gap:10px}
.gs-item{display:flex;align-items:flex-start;gap:14px;background:${T.surface};border:1px solid ${T.border};border-radius:11px;padding:14px 16px}
.gs-item.done{border-color:rgba(90,191,138,.3);background:rgba(90,191,138,.05)}
.gs-dot{width:22px;height:22px;border-radius:50%;border:2px solid ${T.border};flex-shrink:0;margin-top:1px;display:flex;align-items:center;justify-content:center;font-size:0.7rem}
.gs-item.done .gs-dot{background:${T.green};border-color:${T.green};color:#fff}
.gs-item-body{flex:1}
.gs-item-title{font-weight:600;font-size:0.86rem;color:${T.text};margin-bottom:2px}
.gs-item-desc{font-size:0.78rem;color:${T.muted};line-height:1.5}
.gs-cta{display:flex;flex-direction:column;align-items:center;gap:8px}
.gs-cta-hint{font-size:0.76rem;color:${T.muted}}
`;

export default function AgencyPage() {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editTenant, setEditTenant] = useState(null);
  const [toast, setToast] = useState("");
  const [form, setForm] = useState({ name:"", slug:"", password:"", owner_email:"", plan:"starter", business_phone:"", notes:"" });
  const [formErr, setFormErr] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadTenants(); }, []);

  async function loadTenants() {
    setLoading(true);
    const res = await fetch("/api/tenants");
    if (res.ok) setTenants(await res.json());
    setLoading(false);
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  }

  function openCreate() {
    setForm({ name:"", slug:"", password:"", owner_email:"", plan:"starter", business_phone:"", notes:"" });
    setFormErr("");
    setEditTenant(null);
    setShowCreate(true);
  }

  function openEdit(t) {
    setForm({ name:t.name, slug:t.slug, password:"", owner_email:t.owner_email||"", plan:t.plan, business_phone:t.business_phone||"", notes:t.notes||"" });
    setFormErr("");
    setEditTenant(t);
    setShowCreate(true);
  }

  function autoSlug(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function setField(k, v) {
    setForm(f => {
      const next = { ...f, [k]: v };
      if (k === "name" && !editTenant) next.slug = autoSlug(v);
      return next;
    });
  }

  async function handleSave() {
    setFormErr("");
    if (!form.name || !form.slug) { setFormErr("Name and slug are required"); return; }
    if (!editTenant && !form.password) { setFormErr("Password is required for new accounts"); return; }

    setSaving(true);
    const method = editTenant ? "PATCH" : "POST";
    const body = editTenant ? { id: editTenant.id, ...form } : form;
    const res = await fetch("/api/tenants", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setSaving(false);

    if (!res.ok) { setFormErr(data.error || "Save failed"); return; }
    setShowCreate(false);
    await loadTenants();
    showToast(editTenant ? `✅ ${form.name} updated` : `✅ ${form.name} created — share their login URL`);
  }

  async function handleDeactivate(t) {
    if (!confirm(`Deactivate "${t.name}"? They won't be able to log in.`)) return;
    await fetch(`/api/tenants?id=${t.id}`, { method: "DELETE" });
    await loadTenants();
    showToast(`🔒 ${t.name} deactivated`);
  }

  async function handleReactivate(t) {
    await fetch("/api/tenants", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: t.id, active: true }),
    });
    await loadTenants();
    showToast(`✅ ${t.name} reactivated`);
  }

  const active = tenants.filter(t => t.active);
  const trial = tenants.filter(t => t.subscription_status === "trial");
  const mrr = active.filter(t => t.subscription_status === "active").length *
    (tenants.some(t => t.plan === "agency") ? 497 : 297);

  const appUrl = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <>
      <style>{CSS}</style>
      <div className="wrap">
        {/* HEADER */}
        <div className="hdr">
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span className="logo">FlowDesk</span>
            <span className="agency-badge">Agency Dashboard</span>
          </div>
          <div style={{display:"flex",gap:10}}>
            <a className="btn btn-o btn-s" href="/dashboard">My Dashboard</a>
            <button className="btn btn-g btn-s" onClick={openCreate}>+ New Sub-Account</button>
          </div>
        </div>

        <div className="main">
          <div className="page-hd">Sub-Account Manager</div>
          <div className="page-sub">Create and manage client accounts. Each gets their own login URL, dashboard, and isolated data.</div>

          {/* STATS */}
          <div className="stats">
            {[
              { n: active.length, l: "Active Accounts", c: T.green },
              { n: trial.length,  l: "On Trial", c: T.blue },
              { n: `$${mrr.toLocaleString()}`, l: "Est. MRR", c: T.gold },
              { n: tenants.length, l: "Total Created", c: T.muted },
            ].map((s,i) => (
              <div key={i} className="stat" style={{"--c":s.c}}>
                <div className="stat-n">{s.n}</div>
                <div className="stat-l">{s.l}</div>
              </div>
            ))}
          </div>

          {/* TENANT TABLE */}
          <div className="card">
            <div className="card-hd">
              <span className="card-title">All Sub-Accounts ({tenants.length})</span>
            </div>
            {loading ? (
              <div className="empty">Loading…</div>
            ) : tenants.length === 0 ? (
              <div className="gs-wrap">
                <div className="gs-icon">🏢</div>
                <div className="gs-title">No sub-accounts yet</div>
                <div className="gs-sub">
                  Before you onboard your first client, make sure these four items are ready. Each one takes about 5 minutes.
                </div>

                <div className="gs-checklist">
                  {[
                    {
                      title: "Connect Stripe",
                      desc: "Add STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET to your Vercel environment variables so client billing works.",
                    },
                    {
                      title: "Fund your Twilio account",
                      desc: "Make sure your Twilio balance is topped up and your messaging service is approved for A2P 10DLC (required for US SMS).",
                    },
                    {
                      title: "Point a custom domain",
                      desc: "Add your agency domain (e.g. app.youragency.com) in Vercel → Settings → Domains, then update DNS with your registrar.",
                    },
                    {
                      title: "Verify your sending domain in Resend",
                      desc: "Add the DNS records Resend provides for your domain so follow-up emails don't land in spam.",
                    },
                  ].map((item, i) => (
                    <div key={i} className="gs-item">
                      <div className="gs-dot" style={{borderColor:T.gold,color:T.gold,fontWeight:700,fontSize:"0.72rem"}}>{i + 1}</div>
                      <div className="gs-item-body">
                        <div className="gs-item-title">{item.title}</div>
                        <div className="gs-item-desc">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="gs-cta">
                  <button className="btn btn-g" onClick={openCreate}>+ Create First Sub-Account</button>
                  <span className="gs-cta-hint">You can create accounts before setup is complete — clients just won&apos;t be able to pay yet.</span>
                </div>
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Client</th>
                    <th>Login URL</th>
                    <th>Plan</th>
                    <th>Status</th>
                    <th>Trial / Renews</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tenants.map(t => (
                    <tr key={t.id}>
                      <td>
                        <div style={{fontWeight:600}}>{t.name}</div>
                        <div style={{fontSize:"0.74rem",color:T.muted}}>{t.owner_email || "—"}</div>
                      </td>
                      <td>
                        <div
                          className="login-url"
                          style={{cursor:"pointer"}}
                          onClick={() => { navigator.clipboard?.writeText(`${appUrl}/login?t=${t.slug}`); showToast("📋 Login URL copied"); }}
                          title="Click to copy"
                        >
                          /login?t={t.slug}
                        </div>
                      </td>
                      <td>
                        <span className="badge" style={{background:`${PLAN_COLORS[t.plan]}18`,color:PLAN_COLORS[t.plan],borderColor:`${PLAN_COLORS[t.plan]}40`}}>
                          {t.plan}
                        </span>
                      </td>
                      <td>
                        <span className="badge" style={{background:`${STATUS_COLORS[t.subscription_status] || T.muted}18`,color:STATUS_COLORS[t.subscription_status] || T.muted,borderColor:`${STATUS_COLORS[t.subscription_status] || T.muted}40`}}>
                          {t.subscription_status}
                        </span>
                        {!t.active && <span className="badge" style={{marginLeft:6,background:"rgba(224,90,90,.12)",color:T.red,borderColor:"rgba(224,90,90,.3)"}}>inactive</span>}
                      </td>
                      <td style={{fontSize:"0.8rem",color:T.muted}}>
                        {t.trial_ends_at ? new Date(t.trial_ends_at).toLocaleDateString() : "—"}
                      </td>
                      <td style={{fontSize:"0.8rem",color:T.muted}}>
                        {new Date(t.created_at).toLocaleDateString()}
                      </td>
                      <td>
                        <div style={{display:"flex",gap:6}}>
                          <button className="btn btn-o btn-s" onClick={() => openEdit(t)}>Edit</button>
                          <a className="btn btn-o btn-s" href={`/dashboard`} target="_blank" rel="noreferrer">View</a>
                          {t.active
                            ? <button className="btn btn-danger btn-s" onClick={() => handleDeactivate(t)}>Deactivate</button>
                            : <button className="btn btn-o btn-s" onClick={() => handleReactivate(t)}>Reactivate</button>
                          }
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* NOTES */}
          <div style={{marginTop:24,fontSize:"0.8rem",color:T.muted,lineHeight:1.7}}>
            <strong style={{color:T.text}}>How sub-accounts work:</strong> Each client logs in at <code style={{color:T.gold}}>/login?t=their-slug</code> with their password. Their leads, appointments, follow-ups, and settings are fully isolated. You can impersonate any account by visiting their dashboard while logged in as agency.
          </div>
        </div>
      </div>

      {/* CREATE / EDIT MODAL */}
      {showCreate && (
        <div className="modal-bg" onClick={e => e.target === e.currentTarget && setShowCreate(false)}>
          <div className="modal">
            <div className="modal-t">{editTenant ? "Edit Sub-Account" : "New Sub-Account"}</div>
            {formErr && <div className="err">✕ {formErr}</div>}

            <div className="field">
              <label>Business Name *</label>
              <input value={form.name} onChange={e => setField("name", e.target.value)} placeholder="Premier HVAC" />
            </div>
            <div className="two-col">
              <div className="field">
                <label>Slug (URL) *</label>
                <input value={form.slug} onChange={e => setField("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g,""))} placeholder="premier-hvac" />
              </div>
              <div className="field">
                <label>Plan</label>
                <select value={form.plan} onChange={e => setField("plan", e.target.value)}>
                  <option value="starter">Starter — $197/mo</option>
                  <option value="professional">Professional — $297/mo</option>
                  <option value="agency">Agency — $497/mo</option>
                </select>
              </div>
            </div>
            <div className="field">
              <label>{editTenant ? "New Password (leave blank to keep)" : "Password *"}</label>
              <input type="password" value={form.password} onChange={e => setField("password", e.target.value)} placeholder={editTenant ? "Leave blank to keep current" : "Set client login password"} />
            </div>
            <div className="two-col">
              <div className="field">
                <label>Owner Email</label>
                <input value={form.owner_email} onChange={e => setField("owner_email", e.target.value)} placeholder="owner@business.com" />
              </div>
              <div className="field">
                <label>Business Phone</label>
                <input value={form.business_phone} onChange={e => setField("business_phone", e.target.value)} placeholder="+13105550000" />
              </div>
            </div>
            <div className="field">
              <label>Internal Notes</label>
              <input value={form.notes} onChange={e => setField("notes", e.target.value)} placeholder="Referred by… onboarded on…" />
            </div>

            {form.slug && (
              <div style={{fontSize:"0.78rem",color:T.muted,marginBottom:16}}>
                Login URL: <span style={{color:T.gold,fontFamily:"monospace"}}>/login?t={form.slug}</span>
              </div>
            )}

            <div className="form-actions">
              <button className="btn btn-o" onClick={() => setShowCreate(false)}>Cancel</button>
              <button className="btn btn-g" onClick={handleSave} disabled={saving}>
                {saving ? "Saving…" : editTenant ? "Save Changes" : "Create Account"}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="toast">✅ {toast}</div>
      )}
    </>
  );
}
