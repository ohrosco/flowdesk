"use client";
import { useState, useEffect } from "react";

const T = {
  bg:"#0A0A07", surface:"#14130E", card:"#1A1812", border:"#2A271D",
  gold:"#F0B429", goldDim:"#C49020", goldGlow:"rgba(240,180,41,0.12)",
  text:"#F0EAD6", muted:"#8A8470", green:"#5ABF8A",
};

const TIMES = [
  "8:00 AM","9:00 AM","10:00 AM","11:00 AM",
  "12:00 PM","1:00 PM","2:00 PM","3:00 PM","4:00 PM",
];

const SERVICES = [
  "HVAC Install","HVAC Repair","Plumbing","Electrical",
  "Roofing","Landscaping","Painting","General Contracting","Other",
];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%;background:${T.bg};color:${T.text};font-family:'IBM Plex Sans',sans-serif}
.page{min-height:100vh;display:flex;flex-direction:column;align-items:center;padding:40px 20px}
.page h1{font-family:'Playfair Display',serif;font-size:1.8rem;font-weight:700;color:${T.gold};margin-bottom:6px}
.page .sub{color:${T.muted};font-size:0.9rem;margin-bottom:32px;text-align:center}
.container{width:100%;max-width:560px}
.card{background:${T.card};border:1px solid ${T.border};border-radius:16px;padding:28px;margin-bottom:16px}
.card-hd{font-family:'Playfair Display',serif;font-size:1rem;font-weight:600;margin-bottom:16px;color:${T.text}}
.step-ind{display:flex;gap:8px;margin-bottom:24px;justify-content:center}
.step-dot{width:10px;height:10px;border-radius:50%;background:${T.border};transition:all .3s}
.step-dot.active{background:${T.gold};box-shadow:0 0 8px ${T.goldGlow}}
.step-dot.done{background:${T.green}}
.field{display:flex;flex-direction:column;gap:5px;margin-bottom:14px}
.field label{font-size:0.72rem;font-weight:600;text-transform:uppercase;letter-spacing:0.09em;color:${T.muted}}
.field input,.field select{background:${T.surface};border:1px solid ${T.border};border-radius:9px;padding:11px 14px;color:${T.text};font-size:0.88rem;font-family:'IBM Plex Sans',sans-serif;outline:none;transition:border-color .2s;width:100%}
.field input:focus,.field select:focus{border-color:${T.gold}}
.field select option{background:${T.card}}
.two-col{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin-bottom:16px}
.cal-hdr{text-align:center;font-size:0.68rem;font-weight:600;text-transform:uppercase;letter-spacing:0.07em;color:${T.muted};padding:6px 0}
.cal-day{min-height:48px;background:${T.surface};border:1px solid ${T.border};border-radius:8px;padding:5px;cursor:pointer;transition:all .15s;text-align:center;font-size:0.78rem}
.cal-day:hover{border-color:${T.borderHover}}
.cal-day.sel{background:${T.goldGlow};border-color:${T.gold};color:${T.gold};font-weight:600}
.cal-day.past{opacity:.3;cursor:not-allowed}
.cal-day.empty{background:transparent;border-color:transparent;cursor:default}
.cal-day .badge{font-size:0.55rem;background:${T.gold};color:#0A0A07;border-radius:50px;padding:1px 5px;margin-top:2px;display:inline-block}
.month-nav{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}
.month-nav span{font-size:0.9rem;font-weight:600}
.month-nav button{background:none;border:1px solid ${T.border};color:${T.text};border-radius:8px;padding:6px 12px;cursor:pointer;font-size:0.85rem;transition:border-color .2s}
.month-nav button:hover{border-color:${T.gold}}
.slots{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.slot{padding:10px;border-radius:8px;font-size:0.82rem;font-weight:500;text-align:center;border:1px solid ${T.border};background:${T.surface};color:${T.muted};cursor:pointer;transition:all .15s}
.slot:hover{border-color:${T.gold};color:${T.text}}
.slot.sel{background:${T.goldGlow};border-color:${T.gold};color:${T.gold}}
.slot.bkd{opacity:.3;cursor:not-allowed;text-decoration:line-through}
.btn{display:inline-flex;align-items:center;gap:7px;padding:12px 24px;border-radius:10px;font-size:0.88rem;font-weight:600;font-family:'IBM Plex Sans',sans-serif;cursor:pointer;border:none;transition:all .2s;width:100%;justify-content:center}
.btn-g{background:${T.gold};color:#0A0A07}
.btn-g:hover{background:${T.goldDim};transform:translateY(-1px)}
.btn:disabled{opacity:.4;cursor:not-allowed;transform:none!important}
.spin{animation:spin 1s linear infinite;display:inline-block}
@keyframes spin{to{transform:rotate(360deg)}}
.confirm{text-align:center;padding:30px 0}
.confirm .icon{font-size:3rem;margin-bottom:16px}
.confirm h2{font-family:'Playfair Display',serif;font-size:1.4rem;font-weight:700;color:${T.green};margin-bottom:10px}
.confirm p{color:${T.muted};font-size:0.9rem;line-height:1.7;margin-bottom:6px}
.confirm .detail{color:${T.gold};font-weight:600}
.err{color:#E05A5A;font-size:0.82rem;margin-top:6px}
.footer{text-align:center;padding:24px;font-size:0.75rem;color:${T.muted};border-top:1px solid ${T.border};max-width:560px;width:100%;margin-top:20px}
.footer a{color:${T.gold};text-decoration:none}
`;

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

export default function BookPage() {
  const [mounted, setMounted] = useState(false);
  const now = new Date();
  const [step, setStep] = useState(1);
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selDay, setSelDay] = useState(null);
  const [selTime, setSelTime] = useState(null);
  const [bookedSlots, setBookedSlots] = useState({});
  const [form, setForm] = useState({ name:"", phone:"", email:"", service:"" });
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayDate = now.getDate();
  const monthStr = `${year}-${String(month + 1).padStart(2,"0")}`;

  const cells = [...Array(firstDay).fill(null), ...Array.from({length: daysInMonth}, (_, i) => i + 1)];

  // Fetch booked appointments for current month
  useEffect(() => {
    fetch(`/api/schedule?month=${monthStr}`)
      .then(r => r.json())
      .then(data => {
        const map = {};
        if (Array.isArray(data)) {
          data.forEach(a => {
            const key = `${a.appt_date}_${a.appt_time}`;
            map[key] = true;
          });
        }
        setBookedSlots(map);
      })
      .catch(() => {});
  }, [monthStr]);

  function prevM() {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
    setSelDay(null); setSelTime(null);
  }

  function nextM() {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
    setSelDay(null); setSelTime(null);
  }

  function isPast(d) {
    const d1 = new Date(year, month, d + 1);
    const now = new Date();
    now.setHours(0,0,0,0);
    return d1 <= now;
  }

  function monthName() {
    return `${MONTHS[month]} ${year}`;
  }

  function dateStr(d) {
    return `${monthStr}-${String(d).padStart(2,"0")}`;
  }

  function isBooked(d, t) {
    return bookedSlots[`${dateStr(d)}_${t}`];
  }

  async function submit() {
    if (!form.name || !form.phone || !selDay || !selTime) return;
    setSaving(true); setError("");

    const res = await fetch("/api/schedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lead_name: form.name,
        lead_phone: form.phone,
        lead_email: form.email || null,
        appt_type: form.service || "estimate",
        appt_date: dateStr(selDay),
        appt_time: selTime,
      }),
    }).catch(() => null);

    if (res && res.ok) {
      setDone(true);
    } else {
      setError("Something went wrong. Please try again or call us directly.");
    }
    setSaving(false);
  }

  if (done) {
    return (
      <div className="page">
        <style>{CSS}</style>
        <div className="container">
          <div className="card">
            <div className="confirm">
              <div className="icon">✅</div>
              <h2>You&apos;re Booked!</h2>
              <p>Your <span className="detail">{form.service || "estimate"}</span> appointment is confirmed for <span className="detail">{MONTHS[month]} {selDay}</span> at <span className="detail">{selTime}</span>.</p>
              <p>A confirmation text has been sent to {form.phone}.</p>
              <p style={{marginTop:20,fontSize:"0.82rem"}}>We&apos;ll send a reminder 24 hours before your appointment.</p>
              <button className="btn btn-g" style={{marginTop:24}} onClick={() => { setStep(1); setSelDay(null); setSelTime(null); setForm({name:"",phone:"",email:"",service:""}); setDone(false); }}>Book Another →</button>
            </div>
          </div>
          <div className="footer">Powered by <a href="/">FlowDesk</a></div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <style>{CSS}</style>
      <h1>📅 Book an Appointment</h1>
      <p className="sub">Choose a date and time that works for you.</p>

      <div className="container">
        <div className="step-ind">
          <div className={`step-dot ${step >= 1 ? (step > 1 ? "done" : "active") : ""}`} />
          <div className={`step-dot ${step >= 2 ? (step > 2 ? "done" : "active") : ""}`} />
          <div className={`step-dot ${step >= 3 ? "active" : ""}`} />
        </div>

        {/* STEP 1: Date */}
        <div className="card" style={{display: step === 1 ? "block" : "none"}}>
          <div className="card-hd">1. Pick a Date</div>
          <div className="month-nav">
            <button onClick={prevM}>←</button>
            <span>{monthName()}</span>
            <button onClick={nextM}>→</button>
          </div>
          <div className="cal-grid">
            {DAYS.map(d => <div key={d} className="cal-hdr">{d}</div>)}
            {cells.map((d, i) =>
              d === null
                ? <div key={`e${i}`} className="cal-day empty" />
                : <div
                    key={d}
                    className={`cal-day ${selDay === d ? "sel" : ""} ${isPast(d) ? "past" : ""}`}
                    onClick={() => { if (!isPast(d)) { setSelDay(d); setSelTime(null); } }}
                  >{d}</div>
            )}
          </div>
          <button className="btn btn-g" disabled={!selDay} onClick={() => setStep(2)}>Next: Pick Time →</button>
        </div>

        {/* STEP 2: Time */}
        <div className="card" style={{display: step === 2 ? "block" : "none"}}>
          <div className="card-hd">2. Pick a Time</div>
          <div style={{fontSize:"0.82rem",color:T.muted,marginBottom:14}}>{MONTHS[month]} {selDay}</div>
          <div className="slots">
            {TIMES.map(t => {
              const booked = selDay ? isBooked(selDay, t) : false;
              return (
                <div
                  key={t}
                  className={`slot ${selTime === t ? "sel" : ""} ${booked ? "bkd" : ""}`}
                  onClick={() => { if (!booked) setSelTime(t); }}
                >{booked ? "✕" : t}</div>
              );
            })}
          </div>
          <div className="two-col" style={{marginTop:16}}>
            <button className="btn btn-o" style={{border:"1px solid "+T.border,color:T.text}} onClick={() => setStep(1)}>← Back</button>
            <button className="btn btn-g" disabled={!selTime} onClick={() => setStep(3)}>Next: Your Info →</button>
          </div>
        </div>

        {/* STEP 3: Info */}
        <div className="card" style={{display: step === 3 ? "block" : "none"}}>
          <div className="card-hd">3. Your Information</div>
          <div style={{fontSize:"0.82rem",color:T.gold,marginBottom:16,background:T.goldGlow,padding:"8px 12px",borderRadius:8}}>
            📅 {MONTHS[month]} {selDay} at {selTime}
          </div>
          <div className="field">
            <label>Full Name *</label>
            <input placeholder="Your name" value={form.name} onChange={e => setForm(p=>({...p,name:e.target.value}))} />
          </div>
          <div className="field">
            <label>Phone Number *</label>
            <input placeholder="(555) 000-0000" value={form.phone} onChange={e => setForm(p=>({...p,phone:e.target.value}))} />
          </div>
          <div className="field">
            <label>Email (for confirmation)</label>
            <input type="email" placeholder="you@email.com" value={form.email} onChange={e => setForm(p=>({...p,email:e.target.value}))} />
          </div>
          <div className="field">
            <label>Service Needed</label>
            <select value={form.service} onChange={e => setForm(p=>({...p,service:e.target.value}))}>
              <option value="">Select…</option>
              {SERVICES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          {error && <div className="err">{error}</div>}
          <div className="two-col" style={{marginTop:16}}>
            <button className="btn btn-o" style={{border:"1px solid "+T.border,color:T.text}} onClick={() => setStep(2)}>← Back</button>
            <button className="btn btn-g" disabled={!form.name || !form.phone || saving} onClick={submit}>
              {saving ? <><span className="spin">◌</span> Booking…</> : "✅ Confirm Booking"}
            </button>
          </div>
        </div>
      </div>

      <div className="footer">
        Powered by <a href="/">FlowDesk</a> — <a href="/dashboard">Business Dashboard</a>
      </div>
    </div>
  );
}
