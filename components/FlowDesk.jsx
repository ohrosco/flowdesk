"use client";
import { useState, useEffect, useRef } from "react";

// ─── THEME ────────────────────────────────────────────────────────────────────
const T = {
  bg:"#111008",surface:"#1A1810",card:"#201E14",border:"#2E2B1E",
  borderHover:"#4A4530",gold:"#F0B429",goldDim:"#C49020",goldGlow:"rgba(240,180,41,0.15)",
  text:"#F0EAD6",muted:"#8A8470",red:"#E05A5A",green:"#5ABF8A",blue:"#5A9FE0",
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%;background:${T.bg};font-family:'IBM Plex Sans',sans-serif;color:${T.text}}
.app{min-height:100vh;display:flex;flex-direction:column;background:${T.bg}}
.app::before{content:'';position:fixed;inset:0;pointer-events:none;z-index:0;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");opacity:0.6}
.z1{position:relative;z-index:1}
.hdr{padding:16px 28px;border-bottom:1px solid ${T.border};display:flex;align-items:center;justify-content:space-between;background:${T.surface}}
.logo{font-family:'Playfair Display',serif;font-size:1.3rem;font-weight:700;color:${T.gold};letter-spacing:-0.3px}
.logo sub{font-family:'IBM Plex Sans',sans-serif;font-size:0.62rem;color:${T.muted};font-weight:400;text-transform:uppercase;letter-spacing:0.12em;display:block;margin-top:-2px}
.pulse-dot{width:8px;height:8px;border-radius:50%;background:${T.green};box-shadow:0 0 8px ${T.green};animation:pulse 2.5s infinite}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(0.9)}}
.hdr-stat-num{font-size:1rem;font-weight:600;color:${T.gold}}
.hdr-stat-lbl{font-size:0.68rem;color:${T.muted};text-transform:uppercase;letter-spacing:0.08em}
.nav{display:flex;gap:0;border-bottom:1px solid ${T.border};background:${T.surface};padding:0 28px;overflow-x:auto}
.nav::-webkit-scrollbar{display:none}
.nav-btn{padding:13px 18px;font-size:0.82rem;font-weight:500;color:${T.muted};cursor:pointer;border:none;border-bottom:2px solid transparent;background:none;font-family:'IBM Plex Sans',sans-serif;white-space:nowrap;transition:all .2s;display:flex;align-items:center;gap:6px}
.nav-btn:hover{color:${T.text}}
.nav-btn.on{color:${T.gold};border-bottom-color:${T.gold}}
.main{flex:1;padding:28px;overflow-y:auto}
.main::-webkit-scrollbar{width:4px}
.main::-webkit-scrollbar-thumb{background:${T.border};border-radius:4px}
.card{background:${T.card};border:1px solid ${T.border};border-radius:14px;padding:22px}
.card-sm{background:${T.card};border:1px solid ${T.border};border-radius:12px;padding:16px 18px}
.card-title{font-family:'Playfair Display',serif;font-size:0.95rem;font-weight:600;margin-bottom:16px;color:${T.text}}
.section-hd{font-family:'Playfair Display',serif;font-size:1.2rem;font-weight:700;color:${T.gold};margin-bottom:20px;display:flex;align-items:center;gap:10px}
.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:24px}
@media(max-width:640px){.stats{grid-template-columns:repeat(2,1fr)}}
.stat{background:${T.card};border:1px solid ${T.border};border-radius:12px;padding:18px;position:relative;overflow:hidden}
.stat::after{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:var(--c,${T.gold})}
.stat-n{font-family:'Playfair Display',serif;font-size:1.8rem;font-weight:700;color:var(--c,${T.gold})}
.stat-l{font-size:0.72rem;color:${T.muted};text-transform:uppercase;letter-spacing:0.08em;margin-top:2px}
.stat-d{font-size:0.75rem;font-weight:500;color:${T.green};margin-top:6px}
.two-col{display:grid;grid-template-columns:1fr 1fr;gap:16px}
@media(max-width:700px){.two-col{grid-template-columns:1fr}}
.field{display:flex;flex-direction:column;gap:5px}
.field label{font-size:0.72rem;font-weight:600;text-transform:uppercase;letter-spacing:0.09em;color:${T.muted}}
.field input,.field select,.field textarea{background:${T.surface};border:1px solid ${T.border};border-radius:9px;padding:10px 13px;color:${T.text};font-size:0.86rem;font-family:'IBM Plex Sans',sans-serif;outline:none;transition:border-color .2s;width:100%}
.field input:focus,.field select:focus,.field textarea:focus{border-color:${T.gold}}
.field select option{background:${T.card}}
.field textarea{resize:vertical;min-height:76px;line-height:1.55}
.field input::placeholder,.field textarea::placeholder{color:${T.muted}}
.fg{display:grid;grid-template-columns:1fr 1fr;gap:13px}
.fg .s2{grid-column:1/-1}
@media(max-width:560px){.fg{grid-template-columns:1fr}}
.btn{display:inline-flex;align-items:center;gap:7px;padding:10px 20px;border-radius:9px;font-size:0.84rem;font-weight:600;font-family:'IBM Plex Sans',sans-serif;cursor:pointer;border:none;transition:all .2s}
.btn-g{background:${T.gold};color:#111}
.btn-g:hover{background:${T.goldDim};transform:translateY(-1px)}
.btn-o{background:transparent;color:${T.text};border:1px solid ${T.border}}
.btn-o:hover{border-color:${T.borderHover}}
.btn-s{padding:7px 14px;font-size:0.78rem}
.btn:disabled{opacity:.4;cursor:not-allowed;transform:none!important}
.badge{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:20px;font-size:0.7rem;font-weight:600}
.b-hot{background:rgba(240,100,80,.15);color:#F06450;border:1px solid rgba(240,100,80,.25)}
.b-warm{background:rgba(240,180,41,.12);color:${T.gold};border:1px solid rgba(240,180,41,.25)}
.b-cold{background:rgba(138,132,112,.1);color:${T.muted};border:1px solid ${T.border}}
.b-new{background:rgba(90,159,224,.12);color:${T.blue};border:1px solid rgba(90,159,224,.25)}
.b-done{background:rgba(90,191,138,.12);color:${T.green};border:1px solid rgba(90,191,138,.25)}
.divider{border:none;border-top:1px solid ${T.border};margin:20px 0}
.lr{display:flex;align-items:center;gap:14px;padding:13px 0;border-bottom:1px solid ${T.border};animation:fu .3s ease both}
.lr:last-child{border-bottom:none}
@keyframes fu{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
.lav{width:36px;height:36px;border-radius:50%;background:${T.goldGlow};border:1px solid rgba(240,180,41,.3);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.82rem;color:${T.gold};flex-shrink:0}
.ln{font-size:0.88rem;font-weight:600}
.lm{font-size:0.75rem;color:${T.muted};margin-top:1px}
.la{margin-left:auto;display:flex;gap:6px}
.tl{display:flex;flex-direction:column;gap:0}
.tli{display:flex;gap:14px;padding-bottom:20px;position:relative}
.tli::before{content:'';position:absolute;left:15px;top:28px;bottom:0;width:1px;background:${T.border}}
.tli:last-child::before{display:none}
.tld{width:30px;height:30px;border-radius:50%;background:${T.card};border:2px solid ${T.border};display:flex;align-items:center;justify-content:center;font-size:0.75rem;flex-shrink:0;z-index:1;transition:border-color .2s}
.tld.sent{border-color:${T.green};background:rgba(90,191,138,.1)}
.tld.pend{border-color:${T.gold};background:rgba(240,180,41,.08)}
.tlb{flex:1;padding-top:4px}
.tll{font-size:0.82rem;font-weight:600;margin-bottom:2px}
.tls{font-size:0.74rem;color:${T.muted}}
.tlm{margin-top:8px;background:${T.surface};border:1px solid ${T.border};border-radius:8px;padding:10px 12px;font-size:0.8rem;color:${T.muted};line-height:1.55;font-style:italic}
.cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:4px}
.cal-hdr{text-align:center;font-size:0.68rem;font-weight:600;text-transform:uppercase;letter-spacing:0.07em;color:${T.muted};padding:6px 0}
.cal-day{min-height:58px;background:${T.surface};border:1px solid ${T.border};border-radius:8px;padding:6px;cursor:pointer;transition:all .15s}
.cal-day:hover{border-color:${T.borderHover}}
.cal-day.today{border-color:${T.gold}}
.cal-day.sel{background:${T.goldGlow};border-color:${T.gold}}
.cal-day.empty{background:transparent;border-color:transparent;cursor:default}
.cdn{font-size:0.72rem;font-weight:600;color:${T.muted}}
.cal-day.today .cdn{color:${T.gold}}
.cap{background:rgba(240,180,41,.15);border-left:2px solid ${T.gold};border-radius:3px;padding:2px 5px;font-size:0.6rem;color:${T.gold};margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cap.bl{background:rgba(90,159,224,.12);border-left-color:${T.blue};color:${T.blue}}
.cap.gr{background:rgba(90,191,138,.1);border-left-color:${T.green};color:${T.green}}
.slots{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:10px}
@media(max-width:480px){.slots{grid-template-columns:repeat(3,1fr)}}
.slot{padding:9px 8px;border-radius:8px;font-size:0.78rem;font-weight:500;text-align:center;border:1px solid ${T.border};background:${T.surface};color:${T.muted};cursor:pointer;transition:all .15s}
.slot:hover{border-color:${T.borderHover};color:${T.text}}
.slot.on{background:${T.goldGlow};border-color:${T.gold};color:${T.gold}}
.slot.bkd{opacity:.35;cursor:not-allowed;text-decoration:line-through}
.modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.75);backdrop-filter:blur(4px);z-index:100;display:flex;align-items:center;justify-content:center;padding:20px;animation:fi .2s ease}
@keyframes fi{from{opacity:0}to{opacity:1}}
.modal{background:${T.card};border:1px solid ${T.border};border-radius:18px;padding:28px;width:100%;max-width:520px;max-height:90vh;overflow-y:auto;animation:su .25s ease}
@keyframes su{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
.mod-t{font-family:'Playfair Display',serif;font-size:1.1rem;font-weight:700;color:${T.gold};margin-bottom:18px;display:flex;align-items:center;gap:10px}
.toast{position:fixed;bottom:24px;right:24px;background:${T.card};border:1px solid ${T.green};border-radius:12px;padding:14px 20px;font-size:0.85rem;color:${T.green};z-index:200;animation:su .3s ease;display:flex;align-items:center;gap:9px;box-shadow:0 8px 32px rgba(0,0,0,.4)}
.toast.err{border-color:${T.red};color:${T.red}}
.ail{display:flex;gap:5px;align-items:center;padding:14px 0}
.ail span{width:6px;height:6px;background:${T.gold};border-radius:50%;animation:bo 1.2s infinite}
.ail span:nth-child(2){animation-delay:.2s}
.ail span:nth-child(3){animation-delay:.4s}
@keyframes bo{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-7px)}}
.ai-box{background:${T.surface};border:1px solid ${T.border};border-radius:10px;padding:14px;font-size:0.84rem;line-height:1.65;color:${T.text};white-space:pre-wrap}
.err-banner{background:rgba(224,90,90,.08);border:1px solid rgba(224,90,90,.25);border-radius:10px;padding:12px 16px;font-size:0.82rem;color:${T.red};margin-bottom:16px}
.spin{animation:spin 1s linear infinite;display:inline-block}
@keyframes spin{to{transform:rotate(360deg)}}
.flex{display:flex}.aic{align-items:center}.jcb{justify-content:space-between}.gap8{gap:8px}.gap12{gap:12px}
.mb8{margin-bottom:8px}.mb12{margin-bottom:12px}.mb16{margin-bottom:16px}.mb20{margin-bottom:20px}.mb24{margin-bottom:24px}
`;

const TIMES = ["8:00 AM","9:00 AM","10:00 AM","11:00 AM","12:00 PM","1:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM"];
const SEQ = [
  {step:0,label:"Instant SMS",       icon:"⚡",channel:"SMS",  delay:"Immediately"},
  {step:1,label:"Phone Call Reminder",icon:"📞",channel:"Call", delay:"After 2 hours"},
  {step:2,label:"Day 1 Email",        icon:"📧",channel:"Email",delay:"Day 1 — 9 AM"},
  {step:3,label:"Day 3 SMS",          icon:"💬",channel:"SMS",  delay:"Day 3 — 10 AM"},
  {step:4,label:"Day 7 Email",        icon:"📧",channel:"Email",delay:"Day 7 — 9 AM"},
  {step:5,label:"Day 14 Final SMS",   icon:"💬",channel:"SMS",  delay:"Day 14 — 10 AM"},
];

function ini(n){return(n||"?").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()}

function parsePipeline(lead){
  try{return JSON.parse(lead.notes||"{}")}catch{return{}}
}

const PIPELINE_STAGES=["Contacted","Demo Booked","Demo Done","Proposal Sent","Negotiating","Signed","Lost","Cold"];
const STAGE_COLORS={"Contacted":T.blue,"Demo Booked":T.gold,"Demo Done":T.goldDim,"Proposal Sent":"#A78BFA","Negotiating":"#F97316","Signed":T.green,"Lost":T.red,"Cold":T.muted};

const CALL_SCRIPT=[
  {phase:1,title:"OPEN",time:"0–2 min",icon:"👋",color:T.blue,desc:"Build rapport, set agenda",lines:[
    "Hi, is this [Name]? Hey [Name], this is [Your Name] — I'm calling because you reached out about [Service/Pain Point]. Did I catch you at an okay time?",
    "Great. I've got about 20 minutes blocked. I'd love to learn a bit about your situation, then if it makes sense, show you a quick demo of how we've helped businesses like yours. Sound fair?",
  ]},
  {phase:2,title:"QUALIFY",time:"2–7 min",icon:"🔍",color:T.gold,desc:"Find the pain — 4 key questions",lines:[
    "Q1: Walk me through how you're currently handling [problem area]. What does that process look like today?",
    "Q2: What's the biggest headache with the way you're doing it now? What's it actually costing you — time, money, customers?",
    "Q3: Have you tried solving this before? What happened?",
    "Q4: If we could solve this completely — what would that mean for your business in the next 90 days?",
  ]},
  {phase:3,title:"DEMO",time:"7–15 min",icon:"💻",color:"#A78BFA",desc:"Show live — make it about them",lines:[
    "Okay, based on what you told me — the [specific pain] — let me show you exactly how FlowDesk handles that.",
    "* Screen share / live walkthrough *",
    "What you're seeing is [feature] — this is what handles the [pain]. Notice how [outcome]. For your business, this means [their specific win].",
    "Does this solve the [pain point] you mentioned?",
  ]},
  {phase:4,title:"CLOSE",time:"15–20 min",icon:"🤝",color:T.green,desc:"Trial close → decision",lines:[
    "So based on everything — [summarize their pain + what you showed] — does this feel like the right fit?",
    "Here's what I'd recommend: let's get you started. It's [price] and you'll have [key feature] live within [timeframe]. I can walk you through setup right now — takes 10 minutes.",
    "What's your preferred way to get started — card, ACH, or invoice?",
    "[If hesitation]: What's the one thing that's making you pause?",
  ]},
];

// ─── TOAST ────────────────────────────────────────────────────────────────────
function Toast({msg,type="ok",onDone}){
  useEffect(()=>{const t=setTimeout(onDone,3500);return()=>clearTimeout(t)},[]);
  return <div className={`toast ${type==="err"?"err":""}`}>{type==="ok"?"✅":"❌"} {msg}</div>;
}

// ─── AI MODAL ─────────────────────────────────────────────────────────────────
function AiModal({lead,onClose}){
  const [channel,setChannel]=useState("");
  const [loading,setLoading]=useState(false);
  const [result,setResult]=useState("");

  async function gen(ch){
    setChannel(ch);setLoading(true);setResult("");
    const prompts={
      SMS:`Write a short friendly SMS follow-up (under 160 chars) for a home service lead. Name: ${lead.name}. Service: ${lead.service}. Stage: ${lead.stage}. No hashtags. Sign off from "the team".`,
      Email:`Write a follow-up email (Subject line + 3 short paragraphs) for a home service lead. Name: ${lead.name}. Service: ${lead.service}. Stage: ${lead.stage}. Professional, value-focused, clear CTA to schedule free estimate.`,
      Call:`Write a short phone call script (under 200 words) for following up. Customer: ${lead.name}. Service: ${lead.service}. Include opening, value statement, and soft close to schedule estimate.`,
    };
    const res=await fetch("/api/claude",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({prompt:prompts[ch]})}).catch(()=>null);
    if(res?.ok){const d=await res.json();setResult(d.text||"No response.")}
    else setResult("Could not generate — check ANTHROPIC_API_KEY in your .env.local");
    setLoading(false);
  }

  return(
    <div className="modal-bg" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal">
        <div className="mod-t">✨ AI Follow-Up Generator</div>
        <div className="card-sm mb16" style={{background:T.surface}}>
          <div style={{fontSize:"0.82rem",fontWeight:600,marginBottom:4}}>{lead.name}</div>
          <div style={{fontSize:"0.75rem",color:T.muted}}>{lead.service} · {lead.stage}</div>
        </div>
        <div style={{fontSize:"0.75rem",fontWeight:600,color:T.muted,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:10}}>Generate for:</div>
        <div className="flex gap8 mb20">
          {[["SMS","💬 SMS"],["Email","📧 Email"],["Call","📞 Call Script"]].map(([k,l])=>(
            <button key={k} className={`btn btn-s ${channel===k?"btn-g":"btn-o"}`} onClick={()=>gen(k)}>{l}</button>
          ))}
        </div>
        {loading&&<div className="ail"><span/><span/><span/><span style={{fontSize:"0.8rem",color:T.muted,marginLeft:4}}>Generating…</span></div>}
        {result&&!loading&&(
          <>
            <div className="ai-box mb16">{result}</div>
            <div className="flex gap8">
              <button className="btn btn-g btn-s" onClick={()=>navigator.clipboard?.writeText(result)}>📋 Copy</button>
              <button className="btn btn-o btn-s" onClick={()=>gen(channel)}>↻ Redo</button>
            </div>
          </>
        )}
        <div className="divider"/>
        <button className="btn btn-o btn-s" onClick={onClose}>✕ Close</button>
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({leads,appts,onTab}){
  const hot=leads.filter(l=>l.status==="hot").length;
  const due=leads.filter(l=>l.stage?.includes("Follow")||l.stage?.includes("New")).length;
  const today=new Date().toISOString().slice(0,10);
  const todayAppts=appts.filter(a=>a.appt_date===today);
  return(
    <div className="z1">
      <div className="stats">
        {[
          {n:leads.length,l:"Total Leads",c:T.gold,d:"All time"},
          {n:hot,l:"Hot Leads",c:T.red,d:"Need action"},
          {n:due,l:"Follow-Ups Due",c:T.blue,d:"Today's priority"},
          {n:appts.length,l:"Appointments",c:T.green,d:"Scheduled"},
        ].map((s,i)=>(
          <div key={i} className="stat" style={{"--c":s.c}}>
            <div className="stat-n">{s.n}</div>
            <div className="stat-l">{s.l}</div>
            <div className="stat-d">{s.d}</div>
          </div>
        ))}
      </div>
      <div className="two-col mb20">
        <div className="card">
          <div className="card-title">🔥 Recent Leads</div>
          {leads.slice(0,5).map(l=>(
            <div key={l.id} className="lr">
              <div className="lav">{ini(l.name)}</div>
              <div style={{flex:1}}>
                <div className="ln">{l.name}</div>
                <div className="lm">{l.service} · {l.source||"—"}</div>
              </div>
              <span className={`badge b-${l.status||"new"}`}>{l.status||"new"}</span>
            </div>
          ))}
          {leads.length===0&&<div style={{fontSize:"0.82rem",color:T.muted,padding:"20px 0",textAlign:"center"}}>No leads yet — capture your first one!</div>}
          <button className="btn btn-o btn-s" style={{marginTop:12,width:"100%"}} onClick={()=>onTab("leads")}>View All →</button>
        </div>
        <div className="card">
          <div className="card-title">📅 Today's Appointments</div>
          {todayAppts.length===0&&<div style={{fontSize:"0.82rem",color:T.muted,padding:"20px 0",textAlign:"center"}}>No appointments today.</div>}
          {todayAppts.map(a=>(
            <div key={a.id} className="lr">
              <div className="lav">{ini(a.lead_name)}</div>
              <div style={{flex:1}}>
                <div className="ln">{a.lead_name}</div>
                <div className="lm">{a.appt_type} · {a.appt_time}</div>
              </div>
              <span className="badge b-done">Confirmed</span>
            </div>
          ))}
          <button className="btn btn-o btn-s" style={{marginTop:12,width:"100%"}} onClick={()=>onTab("schedule")}>Open Calendar →</button>
        </div>
      </div>
      <div className="card">
        <div className="card-title">⚡ Follow-Up Sequence Overview</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
          {SEQ.map((s,i)=>(
            <div key={i} className="card-sm" style={{borderColor:i===0?T.gold:T.border}}>
              <div style={{fontSize:"1.1rem",marginBottom:6}}>{s.icon}</div>
              <div style={{fontSize:"0.78rem",fontWeight:600,marginBottom:2}}>{s.label}</div>
              <div style={{fontSize:"0.7rem",color:T.muted}}>{s.delay}</div>
              <div style={{fontSize:"0.7rem",color:T.blue,marginTop:4}}>{s.channel}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── LEADS ────────────────────────────────────────────────────────────────────
function LeadsView({leads,setLeads,setAiLead}){
  const EMPTY={name:"",phone:"",email:"",address:"",service:"",source:"",timeline:"ASAP",notes:""};
  const [form,setForm]=useState(EMPTY);
  const [saving,setSaving]=useState(false);
  const [toast,setToast]=useState(null);
  const [filter,setFilter]=useState("all");

  async function submit(e){
    e.preventDefault();setSaving(true);
    const res=await fetch("/api/leads",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)}).catch(()=>null);
    if(res?.ok){
      const {lead}=await res.json();
      setLeads(prev=>[lead,...prev]);
      setForm(EMPTY);
      setToast({msg:"Lead saved! Instant SMS sent & follow-up sequence started.",type:"ok"});
    } else {
      setToast({msg:"Error saving lead. Check your API keys.",type:"err"});
    }
    setSaving(false);
  }

  const filtered=filter==="all"?leads:leads.filter(l=>l.status===filter||(filter==="due"&&(l.stage?.includes("Follow")||l.stage?.includes("New"))));

  return(
    <div className="z1">
      {toast&&<Toast msg={toast.msg} type={toast.type} onDone={()=>setToast(null)}/>}
      <div className="two-col">
        <div>
          <div className="section-hd">📋 New Lead Capture</div>
          <div className="card">
            <form onSubmit={submit}>
              <div className="fg mb16">
                <div className="field"><label>Full Name *</label><input required placeholder="Jane Smith" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))}/></div>
                <div className="field"><label>Phone *</label><input required placeholder="(555) 000-0000" value={form.phone} onChange={e=>setForm(p=>({...p,phone:e.target.value}))}/></div>
                <div className="field"><label>Email</label><input type="email" placeholder="jane@email.com" value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))}/></div>
                <div className="field">
                  <label>Lead Source</label>
                  <select value={form.source} onChange={e=>setForm(p=>({...p,source:e.target.value}))}>
                    <option value="">Select…</option>
                    {["Phone Call","Google","Website","Referral","Facebook","Door Hanger","Yelp","Other"].map(s=><option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="field s2"><label>Service Address</label><input placeholder="123 Main St, City, ST" value={form.address} onChange={e=>setForm(p=>({...p,address:e.target.value}))}/></div>
                <div className="field">
                  <label>Service Needed *</label>
                  <select required value={form.service} onChange={e=>setForm(p=>({...p,service:e.target.value}))}>
                    <option value="">Select…</option>
                    {["HVAC Install","HVAC Repair","Plumbing","Electrical","Roofing","Landscaping","Painting","General Contracting","Other"].map(s=><option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label>Timeline</label>
                  <select value={form.timeline} onChange={e=>setForm(p=>({...p,timeline:e.target.value}))}>
                    {["ASAP","Within 1 week","1–2 weeks","This month","No rush"].map(t=><option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="field s2"><label>Notes</label><textarea placeholder="Project details, concerns, access info…" value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))}/></div>
              </div>
              <button type="submit" className="btn btn-g" disabled={saving}>
                {saving?<><span className="spin">◌</span> Saving…</>:"⚡ Capture Lead + Start Follow-Up"}
              </button>
            </form>
          </div>
        </div>
        <div>
          <div className="section-hd">📊 Pipeline</div>
          <div className="flex gap8 mb16">
            {[["all","All"],["hot","Hot"],["warm","Warm"],["new","New"],["due","Due"]].map(([v,l])=>(
              <button key={v} className={`btn btn-s ${filter===v?"btn-g":"btn-o"}`} onClick={()=>setFilter(v)}>{l}</button>
            ))}
          </div>
          <div className="card" style={{padding:"8px 16px"}}>
            {filtered.length===0&&<div style={{fontSize:"0.82rem",color:T.muted,padding:"20px 0",textAlign:"center"}}>No leads match this filter.</div>}
            {filtered.map(l=>(
              <div key={l.id} className="lr">
                <div className="lav">{ini(l.name)}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div className="ln">{l.name}</div>
                  <div className="lm" style={{whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{l.service} · {l.stage}</div>
                </div>
                <div className="la">
                  <span className={`badge b-${l.status||"new"}`}>{l.status||"new"}</span>
                  <button className="btn btn-o btn-s" onClick={()=>setAiLead(l)} title="AI Follow-Up">✨</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── FOLLOW-UP ────────────────────────────────────────────────────────────────
function FollowUpView({leads}){
  const [active,setActive]=useState(leads[0]||null);
  const [msgs,setMsgs]=useState({});
  const [loading,setLoading]=useState(null);
  const [toast,setToast]=useState(null);

  async function draft(step,channel){
    if(!active)return;
    setLoading(step);
    const prompts={
      SMS:`Write a ${channel} follow-up message (under 160 chars if SMS) for a home service lead. Name: ${active.name}. Service: ${active.service}. This is touch #${step+1}. Warm and not pushy.`,
      Email:`Write a follow-up email (Subject + 2-3 paragraphs). Name: ${active.name}. Service: ${active.service}. Touch #${step+1}. Professional, value-focused.`,
      Call:`Write a phone script (under 150 words). Name: ${active.name}. Service: ${active.service}. Touch #${step+1}. Opening, value, soft close.`,
    };
    const res=await fetch("/api/claude",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({prompt:prompts[channel]||prompts.SMS})}).catch(()=>null);
    if(res?.ok){const d=await res.json();setMsgs(p=>({...p,[`${active.id}-${step}`]:d.text||""}))}
    setLoading(null);
  }

  return(
    <div className="z1">
      {toast&&<Toast msg={toast.msg} type={toast.type} onDone={()=>setToast(null)}/>}
      <div className="section-hd">⚡ Follow-Up Sequences</div>
      <div className="two-col">
        <div>
          <div style={{fontSize:"0.75rem",fontWeight:600,color:T.muted,textTransform:"uppercase",letterSpacing:"0.09em",marginBottom:10}}>Select Lead</div>
          {leads.length===0&&<div style={{fontSize:"0.82rem",color:T.muted}}>No leads yet.</div>}
          {leads.map(l=>(
            <div key={l.id} className="card-sm mb8" onClick={()=>setActive(l)} style={{cursor:"pointer",borderColor:active?.id===l.id?T.gold:T.border,transition:"border-color .15s"}}>
              <div className="flex aic jcb">
                <div>
                  <div style={{fontSize:"0.85rem",fontWeight:600,marginBottom:2}}>{l.name}</div>
                  <div style={{fontSize:"0.74rem",color:T.muted}}>{l.service} · {l.stage}</div>
                </div>
                <span className={`badge b-${l.status||"new"}`}>{l.status||"new"}</span>
              </div>
            </div>
          ))}
        </div>
        <div>
          {active?(
            <>
              <div style={{fontSize:"0.75rem",fontWeight:600,color:T.muted,textTransform:"uppercase",letterSpacing:"0.09em",marginBottom:10}}>
                Sequence for <span style={{color:T.gold}}>{active.name}</span>
              </div>
              <div className="card">
                <div className="tl">
                  {SEQ.map((s,i)=>{
                    const key=`${active.id}-${i}`;
                    const msg=msgs[key];
                    const sent=i===0;
                    return(
                      <div key={i} className="tli">
                        <div className={`tld ${sent?"sent":"pend"}`}>{sent?"✓":s.icon}</div>
                        <div className="tlb">
                          <div className="flex aic jcb mb8">
                            <div>
                              <div className="tll">{s.label}</div>
                              <div className="tls">{s.delay} · {s.channel}</div>
                            </div>
                            {!sent&&(
                              <button className="btn btn-o btn-s" style={{fontSize:"0.72rem"}} onClick={()=>draft(i,s.channel)} disabled={loading===i}>
                                {loading===i?<span className="spin">◌</span>:"✨ Draft"}
                              </button>
                            )}
                          </div>
                          {loading===i&&<div className="ail"><span/><span/><span/></div>}
                          {msg&&!sent&&(
                            <div>
                              <div className="tlm">{msg}</div>
                              <div className="flex gap8" style={{marginTop:8}}>
                                <button className="btn btn-g btn-s" style={{fontSize:"0.72rem"}} onClick={()=>{navigator.clipboard?.writeText(msg);setToast({msg:"Copied!",type:"ok"})}}>📋 Copy</button>
                                <button className="btn btn-o btn-s" style={{fontSize:"0.72rem"}} onClick={()=>draft(i,s.channel)}>↻</button>
                              </div>
                            </div>
                          )}
                          {sent&&<div className="tlm" style={{color:T.green}}>✓ Auto-sent immediately when lead was captured</div>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ):(
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:200,color:T.muted,fontSize:"0.85rem"}}>Select a lead to view their sequence →</div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── SALES PIPELINE ───────────────────────────────────────────────────────────
function SalesPipelineView({leads,appts}){
  const leadsWithP=leads.map(l=>({...l,pipeline:parsePipeline(l)}));
  const totalMRR=leadsWithP.reduce((sum,l)=>sum+(Number(l.pipeline.mrr)||0),0);
  const demosBooked=leadsWithP.filter(l=>l.pipeline.pipeline_stage==="Demo Booked").length;
  const signed=leadsWithP.filter(l=>l.pipeline.pipeline_stage==="Signed").length;
  function stageLeads(stage){return leadsWithP.filter(l=>(l.pipeline.pipeline_stage||"Contacted")===stage)}

  return(
    <div className="z1">
      <div className="section-hd">📊 Sales Pipeline</div>
      <div className="stats mb20">
        {[
          {n:leads.length,       l:"Total Leads",    c:T.gold,  d:"All stages"},
          {n:demosBooked,        l:"Demos Booked",   c:T.blue,  d:"Pipeline stage"},
          {n:`$${totalMRR.toLocaleString()}`,l:"MRR Pipeline",c:T.green,d:"Projected monthly"},
          {n:`${signed}/5`,      l:"Goal: 5 Clients",c:signed>=5?T.green:T.gold,d:signed>=5?"Goal reached!":"Keep closing"},
        ].map((s,i)=>(
          <div key={i} className="stat" style={{"--c":s.c}}>
            <div className="stat-n">{s.n}</div>
            <div className="stat-l">{s.l}</div>
            <div className="stat-d">{s.d}</div>
          </div>
        ))}
      </div>
      <div style={{overflowX:"auto",paddingBottom:16}}>
        <div style={{display:"flex",gap:12,minWidth:"max-content"}}>
          {PIPELINE_STAGES.map(stage=>{
            const sl=stageLeads(stage);
            const col=STAGE_COLORS[stage]||T.muted;
            return(
              <div key={stage} style={{width:190,flexShrink:0}}>
                <div style={{background:T.card,border:`1px solid ${T.border}`,borderTop:`3px solid ${col}`,borderRadius:12,padding:"10px 12px",marginBottom:8,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <div style={{fontSize:"0.78rem",fontWeight:600,color:col}}>{stage}</div>
                  <div style={{background:`${col}22`,border:`1px solid ${col}44`,borderRadius:"50%",width:22,height:22,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.7rem",fontWeight:700,color:col}}>{sl.length}</div>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {sl.map(l=>{
                    const p=l.pipeline;
                    return(
                      <div key={l.id}
                        style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:10,padding:"12px 13px",transition:"border-color .15s"}}
                        onMouseEnter={e=>e.currentTarget.style.borderColor=T.borderHover}
                        onMouseLeave={e=>e.currentTarget.style.borderColor=T.border}
                      >
                        <div style={{fontSize:"0.82rem",fontWeight:600,marginBottom:2,color:T.text}}>{p.business_name||l.name}</div>
                        {p.owner_name&&<div style={{fontSize:"0.71rem",color:T.muted,marginBottom:4}}>{p.owner_name}</div>}
                        <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:p.mrr?6:0}}>
                          {p.tier&&<span style={{fontSize:"0.64rem",background:`${T.gold}15`,border:`1px solid ${T.gold}30`,borderRadius:20,padding:"2px 7px",color:T.gold}}>{p.tier}</span>}
                          {p.source&&<span style={{fontSize:"0.64rem",background:`${T.blue}12`,border:`1px solid ${T.blue}25`,borderRadius:20,padding:"2px 7px",color:T.blue}}>{p.source}</span>}
                        </div>
                        {p.mrr&&<div style={{fontSize:"0.74rem",fontWeight:600,color:T.green}}>${Number(p.mrr).toLocaleString()}/mo</div>}
                        {l.phone&&<div style={{fontSize:"0.69rem",color:T.muted,marginTop:2}}>{l.phone}</div>}
                      </div>
                    );
                  })}
                  {sl.length===0&&<div style={{border:`1px dashed ${T.border}`,borderRadius:10,padding:"16px 12px",textAlign:"center",fontSize:"0.71rem",color:T.muted}}>Empty</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── SCRIPT ───────────────────────────────────────────────────────────────────
function ScriptView(){
  const [expanded,setExpanded]=useState({0:true,1:true,2:true,3:true});
  function toggle(i){setExpanded(p=>({...p,[i]:!p[i]}))}

  return(
    <div className="z1">
      <div className="section-hd">📋 Demo Call Script</div>
      <div style={{maxWidth:720,margin:"0 auto"}}>
        <div className="card-sm mb16" style={{background:T.surface,borderColor:T.gold}}>
          <div style={{fontSize:"0.8rem",color:T.muted,lineHeight:1.65}}>
            <strong style={{color:T.gold}}>Total time: 20 min</strong> · This script is a guide, not a prison. Listen actively, adapt to their answers, and prioritize their words over yours.
          </div>
        </div>
        {CALL_SCRIPT.map((phase,i)=>(
          <div key={i} className="card mb12" style={{borderTop:`3px solid ${phase.color}`}}>
            <div className="flex aic jcb" style={{cursor:"pointer",userSelect:"none"}} onClick={()=>toggle(i)}>
              <div className="flex aic gap8">
                <span style={{fontSize:"1.3rem"}}>{phase.icon}</span>
                <div>
                  <div style={{fontSize:"0.7rem",fontWeight:600,color:phase.color,textTransform:"uppercase",letterSpacing:"0.1em"}}>Phase {phase.phase} · {phase.time}</div>
                  <div style={{fontFamily:"'Playfair Display',serif",fontSize:"0.95rem",fontWeight:700}}>{phase.title} — {phase.desc}</div>
                </div>
              </div>
              <div style={{color:T.muted,fontSize:"0.75rem"}}>{expanded[i]?"▲":"▼"}</div>
            </div>
            {expanded[i]&&(
              <div style={{marginTop:14,display:"flex",flexDirection:"column",gap:9}}>
                {phase.lines.map((line,j)=>(
                  <div key={j} style={{
                    background:T.surface,border:`1px solid ${T.border}`,
                    borderLeft:`3px solid ${phase.color}55`,borderRadius:"0 8px 8px 0",
                    padding:"10px 14px",fontSize:"0.83rem",lineHeight:1.65,
                    color:line.startsWith("*")?T.muted:T.text,
                    fontStyle:line.startsWith("*")?"italic":"normal",
                  }}>
                    {line.startsWith("Q")&&<strong style={{color:phase.color}}>{line.slice(0,2)}</strong>}
                    {line.startsWith("Q")?line.slice(2):line}
                  </div>
                ))}
                <button className="btn btn-o btn-s" style={{fontSize:"0.72rem",alignSelf:"flex-start",marginTop:2}} onClick={()=>navigator.clipboard?.writeText(phase.lines.join("\n\n"))}>
                  📋 Copy Phase
                </button>
              </div>
            )}
          </div>
        ))}
        <button className="btn btn-g" style={{width:"100%",marginTop:4}} onClick={()=>navigator.clipboard?.writeText(CALL_SCRIPT.map(p=>`=== ${p.title} (${p.time}) ===\n${p.lines.join("\n\n")}`).join("\n\n"))}>
          📋 Copy Full Script
        </button>
      </div>
    </div>
  );
}

// ─── SCHEDULE ─────────────────────────────────────────────────────────────────
function ScheduleView({leads,appts,setAppts}){
  const [selDay,setSelDay]=useState(null);
  const [selTime,setSelTime]=useState(null);
  const [form,setForm]=useState({lead_id:"",lead_name:"",lead_phone:"",appt_type:"estimate",notes:""});
  const [saving,setSaving]=useState(false);
  const [toast,setToast]=useState(null);

  const now=new Date();
  const year=now.getFullYear();
  const month=now.getMonth();
  const firstDay=new Date(year,month,1).getDay();
  const daysInMonth=new Date(year,month+1,0).getDate();
  const todayDate=now.getDate();
  const monthStr=`${year}-${String(month+1).padStart(2,"0")}`;

  const cells=[...Array(firstDay).fill(null),...Array.from({length:daysInMonth},(_,i)=>i+1)];

  function apptDot(d){
    const ds=`${monthStr}-${String(d).padStart(2,"0")}`;
    return appts.filter(a=>a.appt_date===ds);
  }

  async function book(){
    if(!selDay||!selTime||!form.lead_name)return;
    setSaving(true);
    const appt_date=`${monthStr}-${String(selDay).padStart(2,"0")}`;
    const payload={...form,appt_date,appt_time:selTime};
    const res=await fetch("/api/schedule",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)}).catch(()=>null);
    if(res?.ok){
      const appt=await res.json();
      setAppts(prev=>[...prev,appt]);
      setToast({msg:`Appointment booked for ${appt_date} at ${selTime}. Confirmation SMS sent!`,type:"ok"});
      setSelDay(null);setSelTime(null);setForm({lead_id:"",lead_name:"",lead_phone:"",appt_type:"estimate",notes:""});
    } else {
      setToast({msg:"Error booking appointment.",type:"err"});
    }
    setSaving(false);
  }

  function pickLead(e){
    const lead=leads.find(l=>l.id===e.target.value);
    if(lead) setForm(p=>({...p,lead_id:lead.id,lead_name:lead.name,lead_phone:lead.phone}));
    else setForm(p=>({...p,lead_id:"",lead_name:"",lead_phone:""}));
  }

  const MONTHS=["January","February","March","April","May","June","July","August","September","October","November","December"];

  return(
    <div className="z1">
      {toast&&<Toast msg={toast.msg} type={toast.type} onDone={()=>setToast(null)}/>}
      <div className="section-hd">📅 Schedule</div>
      <div className="two-col">
        <div>
          <div className="card mb16">
            <div className="flex aic jcb mb16">
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:"1rem",fontWeight:700}}>{MONTHS[month]} {year}</div>
            </div>
            <div className="cal-grid mb8">
              {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d=><div key={d} className="cal-hdr">{d}</div>)}
            </div>
            <div className="cal-grid">
              {cells.map((d,i)=>{
                if(!d) return <div key={i} className="cal-day empty"/>;
                const dots=apptDot(d);
                return(
                  <div key={i} className={`cal-day ${d===todayDate?"today":""} ${selDay===d?"sel":""}`} onClick={()=>setSelDay(d)}>
                    <div className="cdn">{d}</div>
                    {dots.slice(0,2).map((a,j)=><div key={j} className={`cap ${j===1?"bl":""}`}>{a.lead_name?.split(" ")[0]} {a.appt_time}</div>)}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div>
          {selDay?(
            <div className="card">
              <div style={{fontFamily:"'Playfair Display',serif",fontWeight:700,color:T.gold,marginBottom:16}}>{MONTHS[month]} {selDay}</div>
              <div style={{fontSize:"0.75rem",fontWeight:600,color:T.muted,textTransform:"uppercase",letterSpacing:"0.09em",marginBottom:8}}>Pick a Time</div>
              <div className="slots mb20">
                {TIMES.map(t=>(
                  <div key={t} className={`slot ${selTime===t?"on":""}`} onClick={()=>setSelTime(t)}>{t}</div>
                ))}
              </div>
              <div className="fg mb16">
                <div className="field s2">
                  <label>Customer *</label>
                  <select value={form.lead_id} onChange={pickLead} required>
                    <option value="">Select lead…</option>
                    {leads.map(l=><option key={l.id} value={l.id}>{l.name} — {l.service}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label>Type</label>
                  <select value={form.appt_type} onChange={e=>setForm(p=>({...p,appt_type:e.target.value}))}>
                    {["estimate","follow-up","service call","installation"].map(t=><option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label>Reminder</label>
                  <select>
                    <option>24 hrs before</option>
                    <option>2 hrs before</option>
                    <option>Both</option>
                    <option>None</option>
                  </select>
                </div>
                <div className="field s2"><label>Notes</label><textarea placeholder="Access info, bring tools…" value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))}/></div>
              </div>
              <button className="btn btn-g" disabled={!selTime||!form.lead_name||saving} onClick={book}>
                {saving?<><span className="spin">◌</span> Booking…</>:"✅ Confirm Appointment"}
              </button>
            </div>
          ):(
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:320,gap:12,color:T.muted}}>
              <div style={{fontSize:"2.5rem"}}>📅</div>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:"1rem",fontWeight:700}}>Select a date</div>
              <div style={{fontSize:"0.78rem",textAlign:"center",maxWidth:200}}>Click any day on the calendar to book an appointment</div>
            </div>
          )}
          <div className="card" style={{marginTop:16}}>
            <div className="card-title">📌 Upcoming</div>
            {appts.sort((a,b)=>a.appt_date.localeCompare(b.appt_date)).slice(0,6).map(a=>(
              <div key={a.id} className="lr">
                <div className="lav">{ini(a.lead_name)}</div>
                <div style={{flex:1}}>
                  <div className="ln">{a.lead_name}</div>
                  <div className="lm">{a.appt_date} · {a.appt_time} · {a.appt_type}</div>
                </div>
                <span className="badge b-done">Confirmed</span>
              </div>
            ))}
            {appts.length===0&&<div style={{fontSize:"0.82rem",color:T.muted}}>No appointments yet.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SETTINGS / INTEGRATIONS ──────────────────────────────────────────────────
function SettingsView({tenant}){
  const [calStatus,setCalStatus]=useState(null);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    fetch(`/api/calendar/status?tenant=${encodeURIComponent(tenant)}`)
      .then(r=>r.json())
      .then(d=>{setCalStatus(d);setLoading(false)})
      .catch(()=>setLoading(false));
  },[tenant]);

  const authUrl=`/api/calendar/auth?tenant=${encodeURIComponent(tenant)}`;

  async function disconnect(){
    if(!confirm("Disconnect Google Calendar? Bookings will no longer sync.")) return;
    setLoading(true);
    await fetch(`/api/calendar/status?tenant=${encodeURIComponent(tenant)}`,{method:"DELETE"});
    setCalStatus({connected:false});
    setLoading(false);
  }

  return(
    <div className="z1">
      <div className="section-hd">⚙ Settings & Integrations</div>

      {/* Google Calendar */}
      <div className="card" style={{maxWidth:600}}>
        <div className="card-title" style={{display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:"1.3rem"}}>📅</span> Google Calendar
        </div>
        <p style={{fontSize:"0.82rem",color:T.muted,lineHeight:1.7,marginBottom:16}}>
          Connect your Google Calendar so appointments booked through FlowDesk automatically appear as events on your calendar. Each client connects their own calendar.
        </p>
        {loading ? (
          <div style={{display:"flex",alignItems:"center",gap:8,color:T.muted,fontSize:"0.85rem",padding:"12px 0"}}>
            <span className="spin">◌</span> Checking status…
          </div>
        ) : calStatus?.connected ? (
          <div style={{background:"rgba(90,191,138,.06)",border:"1px solid rgba(90,191,138,.2)",borderRadius:10,padding:16}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
              <span style={{fontSize:"1.2rem"}}>✅</span>
              <div>
                <div style={{fontWeight:600,fontSize:"0.9rem",color:T.green}}>Connected</div>
                <div style={{fontSize:"0.78rem",color:T.muted}}>{calStatus.calendarEmail}</div>
              </div>
            </div>
            <button className="btn btn-o btn-s" onClick={disconnect} style={{borderColor:"rgba(224,90,90,.4)",color:T.red}}>
              ✕ Disconnect
            </button>
          </div>
        ) : (
          <div>
            <div style={{background:"rgba(240,180,41,.06)",border:"1px solid rgba(240,180,41,.2)",borderRadius:10,padding:16,marginBottom:16}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                <span style={{fontSize:"1.2rem"}}>🔌</span>
                <div>
                  <div style={{fontWeight:600,fontSize:"0.9rem"}}>Not connected</div>
                  <div style={{fontSize:"0.78rem",color:T.muted}}>Bookings won't appear on Google Calendar</div>
                </div>
              </div>
            </div>
            <a href={authUrl} className="btn btn-g" style={{textDecoration:"none",display:"inline-flex"}}>
              🔗 Connect Google Calendar
            </a>
            <p style={{fontSize:"0.72rem",color:T.muted,marginTop:12,lineHeight:1.6}}>
              You'll be redirected to Google to authorize access. Only <strong>calendar</strong> read/write permissions are requested. We store your refresh token securely and never access your personal data.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function FlowDesk(){
  const [tab,setTab]=useState("dash");
  const [leads,setLeads]=useState([]);
  const [appts,setAppts]=useState([]);
  const [aiLead,setAiLead]=useState(null);
  const [loadingData,setLoadingData]=useState(true);
  const tenant=process.env.NEXT_PUBLIC_BUSINESS_NAME||"FlowDesk";

  useEffect(()=>{
    async function load(){
      setLoadingData(true);
      const [lRes,aRes]=await Promise.all([
        fetch("/api/leads").catch(()=>null),
        fetch("/api/schedule").catch(()=>null),
      ]);
      if(lRes?.ok) setLeads(await lRes.json());
      if(aRes?.ok) setAppts(await aRes.json());
      setLoadingData(false);
    }
    load();
  },[]);

  const TABS=[
    {id:"dash",     label:"Dashboard",    icon:"◈"},
    {id:"leads",    label:"Lead Capture", icon:"📋"},
    {id:"fu",     label:"Follow-Up",    icon:"⚡"},
    {id:"sched",  label:"Schedule",     icon:"📅"},
    {id:"settings",label:"Settings",     icon:"⚙"},
  ];

  return(
    <>
      <style>{CSS}</style>
      {aiLead&&<AiModal lead={aiLead} onClose={()=>setAiLead(null)}/>}
      <div className="app">
        <div className="hdr z1">
          <div className="logo">FlowDesk<sub>Lead & Schedule System</sub></div>
          <div className="flex aic gap12">
            <a href="/outreach" className="btn btn-o btn-s" style={{fontSize:"0.7rem",textDecoration:"none"}}>📞 Outreach</a>
            <div style={{textAlign:"right"}}>
              <div className="hdr-stat-num">{leads.length}</div>
              <div className="hdr-stat-lbl">Active Leads</div>
            </div>
            <div className="pulse-dot"/>
          </div>
        </div>
        <div className="nav z1">
          {TABS.map(t=>(
            <button key={t.id} className={`nav-btn ${tab===t.id?"on":""}`} onClick={()=>setTab(t.id)}>
              <span>{t.icon}</span>{t.label}
            </button>
          ))}
        </div>
        <div className="main z1">
          {loadingData?(
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:300,gap:10,color:T.muted}}>
              <span className="spin" style={{fontSize:"1.2rem"}}>◌</span> Loading…
            </div>
          ):(
            <>
              {tab==="dash"     &&<Dashboard leads={leads} appts={appts} onTab={setTab}/>}
              {tab==="leads"    &&<LeadsView leads={leads} setLeads={setLeads} setAiLead={setAiLead}/>}
              {tab==="fu"       &&<FollowUpView leads={leads}/>}
              {tab==="sched"    &&<ScheduleView leads={leads} appts={appts} setAppts={setAppts}/>}
              {tab==="settings" &&<SettingsView tenant={tenant}/>}
            </>
          )}
        </div>
      </div>
    </>
  );
}
