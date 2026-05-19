"use client";
import { useState, useEffect } from "react";

const T = {
  bg:"#0A0A07", surface:"#14130E", card:"#1A1812", border:"#2A271D",
  gold:"#F0B429", goldDim:"#C49020", goldGlow:"rgba(240,180,41,0.12)",
  text:"#F0EAD6", muted:"#8A8470", green:"#5ABF8A", red:"#E05A5A", blue:"#5A9FE0",
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%;background:${T.bg};color:${T.text};font-family:'IBM Plex Sans',sans-serif}
.app{min-height:100vh;display:flex;flex-direction:column}
.hdr{padding:14px 28px;border-bottom:1px solid ${T.border};display:flex;align-items:center;justify-content:space-between;background:${T.surface}}
.logo{font-family:'Playfair Display',serif;font-size:1.1rem;font-weight:700;color:${T.gold}}
.logo sub{font-size:0.6rem;color:${T.muted};text-transform:uppercase;display:block;margin-top:-2px}
.main{flex:1;padding:20px 28px;overflow-y:auto}
.stats{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin-bottom:20px}
@media(max-width:700px){.stats{grid-template-columns:repeat(3,1fr)}}
.stat{background:${T.card};border:1px solid ${T.border};border-radius:10px;padding:14px}
.stat-n{font-family:'Playfair Display',serif;font-size:1.4rem;font-weight:700;color:${T.gold}}
.stat-l{font-size:0.7rem;color:${T.muted};text-transform:uppercase;letter-spacing:0.08em;margin-top:2px}
.toolbar{display:flex;gap:10px;margin-bottom:16px;flex-wrap:wrap;align-items:center}
.filter-btn{padding:6px 14px;border-radius:8px;font-size:0.78rem;font-weight:500;border:1px solid ${T.border};background:transparent;color:${T.muted};cursor:pointer;font-family:inherit;transition:all .15s}
.filter-btn:hover{border-color:${T.gold};color:${T.text}}
.filter-btn.on{background:${T.goldGlow};border-color:${T.gold};color:${T.gold}}
.search-box{background:${T.surface};border:1px solid ${T.border};border-radius:8px;padding:8px 12px;color:${T.text};font-size:0.82rem;font-family:inherit;outline:none;width:200px}
.search-box:focus{border-color:${T.gold}}
.biz-grid{display:grid;grid-template-columns:1fr;gap:6px}
.biz-row{display:grid;grid-template-columns:2fr 1fr 1.2fr 1fr 0.8fr 1fr;gap:8px;align-items:center;padding:10px 14px;background:${T.card};border:1px solid ${T.border};border-radius:10px;font-size:0.82rem;transition:all .15s;cursor:pointer}
.biz-row:hover{border-color:${T.gold}}
.biz-row.done{opacity:.7}
.biz-name{font-weight:600}
.biz-city{color:${T.muted};font-size:0.78rem}
.biz-phone{color:${T.blue};font-family:monospace;font-size:0.8rem}
.biz-status{padding:3px 8px;border-radius:50px;font-size:0.7rem;font-weight:600;text-align:center}
.s-new{background:rgba(138,132,112,.1);color:${T.muted}}
.s-contacted{background:rgba(90,159,224,.12);color:${T.blue}}
.s-vm{background:rgba(240,180,41,.12);color:${T.gold}}
.s-booked{background:rgba(90,191,138,.12);color:${T.green}}
.s-no{background:rgba(224,90,90,.1);color:${T.red}}
.s-callback{background:rgba(240,180,41,.08);color:${T.goldDim}}
.s-noanswer{background:rgba(138,132,112,.05);color:#666}
.btn{display:inline-flex;align-items:center;gap:6px;padding:7px 14px;border-radius:8px;font-size:0.78rem;font-weight:600;font-family:inherit;cursor:pointer;border:none;transition:all .15s}
.btn-g{background:${T.gold};color:#0A0A07}
.btn-o{background:transparent;color:${T.text};border:1px solid ${T.border}}
.btn-s{padding:5px 10px;font-size:0.72rem}
.card{background:${T.card};border:1px solid ${T.border};border-radius:12px;padding:16px}
.modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.75);backdrop-filter:blur(4px);z-index:100;display:flex;align-items:center;justify-content:center;padding:20px}
.modal{background:${T.card};border:1px solid ${T.border};border-radius:16px;padding:24px;width:100%;max-width:440px}
.modal h3{font-family:'Playfair Display',serif;font-size:1rem;font-weight:700;color:${T.gold};margin-bottom:12px}
.field{display:flex;flex-direction:column;gap:4px;margin-bottom:10px}
.field label{font-size:0.7rem;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:${T.muted}}
.field input,.field select,.field textarea{background:${T.surface};border:1px solid ${T.border};border-radius:8px;padding:8px 12px;color:${T.text};font-size:0.82rem;font-family:inherit;outline:none}
.field textarea{resize:vertical;min-height:60px}
.outcome-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:12px}
.outcome-btn{padding:10px;border-radius:8px;font-size:0.8rem;font-weight:500;text-align:center;border:1px solid ${T.border};background:${T.surface};color:${T.muted};cursor:pointer;transition:all .15s;font-family:inherit}
.outcome-btn:hover{border-color:${T.gold}}
.outcome-btn.sel{background:${T.goldGlow};border-color:${T.gold};color:${T.gold}}
.actions{display:flex;gap:8px;justify-content:flex-end;margin-top:14px}
.tip-box{background:${T.surface};border:1px solid ${T.goldDim};border-radius:10px;padding:12px 16px;font-size:0.8rem;color:${T.muted};line-height:1.6;margin-bottom:20px}
.tip-box strong{color:${T.gold}}
.section-hd{font-family:'Playfair Display',serif;font-size:1rem;font-weight:700;color:${T.gold};margin-bottom:12px;display:flex;align-items:center;gap:8px}
.script-box{background:${T.surface};border:1px solid ${T.border};border-radius:10px;padding:14px;font-size:0.82rem;line-height:1.7;color:${T.text};margin-bottom:20px;white-space:pre-wrap}
`;

const CITIES = ["Denham Springs","Walker","Livingston","Springfield","Hammond","Ponchatoula","Prairieville","Gonzales"];

const BUSINESSES = [
  ["A-Cool Air Conditioning & Heating","HVAC","Denham Springs","(225) 791-9292","www.acoolac.com"],
  ["Apex Roofing & Construction","Roofing","Denham Springs","(225) 910-7480","www.apexroofingds.com"],
  ["Bella Plumbing","Plumbing","Denham Springs","(225) 751-4287",""],
  ["Dixie Electric Plumbing & Air","Electrical / HVAC","Denham Springs","(225) 664-4164","www.dixieepa.com"],
  ["Foster Plumbing & Repair","Plumbing","Denham Springs","(225) 316-2036",""],
  ["Gautreaux Air Conditioning","HVAC","Denham Springs","(225) 664-2739","www.gautreauxac.com"],
  ["Hebert's Pest Control","Pest Control","Denham Springs","(225) 664-8733","www.hebertspestcontrol.com"],
  ["Keller's Landscape Management","Landscaping","Denham Springs","(225) 664-4289","www.kellerslandscape.com"],
  ["Landry's Tree Service","Tree Service","Denham Springs","(225) 664-5538",""],
  ["LeBlanc Electrical Contractors","Electrical","Denham Springs","(225) 664-2345","www.leblancelectric.com"],
  ["M&L Pressure Washing","Pressure Washing","Denham Springs","(225) 772-8225",""],
  ["Morrison Roofing","Roofing","Denham Springs","(225) 664-4711",""],
  ["Pelican Plumbing","Plumbing","Denham Springs","(225) 664-7020","www.pelicanplumbing.com"],
  ["Precision Air & Heat","HVAC","Denham Springs","(225) 664-1999","www.precisionacds.com"],
  ["Red Stick Roofing & Restoration","Roofing","Denham Springs","(225) 963-8288","www.redstickroofing.com"],
  ["River City Pest Control","Pest Control","Denham Springs","(225) 665-1136",""],
  ["Scott's Lawn Care & Landscaping","Landscaping","Denham Springs","(225) 664-6455",""],
  ["Simmons Tree Service","Tree Service","Denham Springs","(225) 664-7850",""],
  ["Smith Brothers Electric","Electrical","Denham Springs","(225) 751-9119",""],
  ["Southern Pressure Washing","Pressure Washing","Denham Springs","(225) 772-3940",""],
  ["Total Home Solutions","General Contractor","Denham Springs","(225) 664-2000","www.totalhome-solutions.com"],
  ["Walker Roofing","Roofing","Walker","(225) 665-1300",""],
  ["Advanced Air Conditioning","HVAC","Walker","(225) 665-2500","www.advancedacwalker.com"],
  ["C&C Plumbing","Plumbing","Walker","(225) 665-3711",""],
  ["Precision Landscaping","Landscaping","Walker","(225) 665-5880",""],
  ["Griffin Electric","Electrical","Walker","(225) 665-4414",""],
  ["Pro-Tech Pest Control","Pest Control","Walker","(225) 665-2266",""],
  ["Boudreaux Pressure Washing","Pressure Washing","Walker","(225) 665-7799",""],
  ["All Seasons Tree Service","Tree Service","Walker","(225) 665-4233",""],
  ["Livingston Parish Roofing","Roofing","Livingston","(225) 686-7400",""],
  ["Dependable Plumbing","Plumbing","Livingston","(225) 686-1300",""],
  ["Gulf South HVAC","HVAC","Livingston","(225) 686-8800",""],
  ["Bayou Pest Control","Pest Control","Livingston","(225) 686-2400",""],
  ["Capital City Electric","Electrical","Livingston","(225) 686-5505",""],
  ["Green Leaf Landscaping","Landscaping","Livingston","(225) 686-3322",""],
  ["Acadian Tree Service","Tree Service","Springfield","(225) 294-2221",""],
  ["Reliable Roofing","Roofing","Springfield","(225) 294-4000",""],
  ["Bayou Pressure Washing","Pressure Washing","Springfield","(225) 294-8888",""],
  ["Hammond Heating & Cooling","HVAC","Hammond","(985) 345-6000","www.hammondheatingcooling.com"],
  ["Hammond Roofing","Roofing","Hammond","(985) 345-2424",""],
  ["Hammond Plumbing","Plumbing","Hammond","(985) 345-1818",""],
  ["Hammond Electric","Electrical","Hammond","(985) 345-3333",""],
  ["Southeastern Pest Control","Pest Control","Hammond","(985) 345-5050",""],
  ["All Seasons Landscaping","Landscaping","Hammond","(985) 345-7777",""],
  ["Southern Tree Experts","Tree Service","Hammond","(985) 345-9000",""],
  ["Pelican Pressure Washing","Pressure Washing","Hammond","(985) 345-1122",""],
  ["Ponchatoula Plumbing","Plumbing","Ponchatoula","(985) 386-8888",""],
  ["Tiger Roofing","Roofing","Ponchatoula","(985) 386-1212",""],
  ["Acadian Air","HVAC","Prairieville","(225) 673-4444","www.acadianair.com"],
  ["Prairieville Pest Control","Pest Control","Prairieville","(225) 673-2222",""],
  ["Gonzales Electrical","Electrical","Gonzales","(225) 647-8000",""],
  ["Ascension Tree Service","Tree Service","Gonzales","(225) 647-3000",""],
];

const OUTCOMES = [
  { id:"contacted", label:"✅ Contacted", color:T.blue },
  { id:"voicemail", label:"📞 Left VM", color:T.gold },
  { id:"booked", label:"📅 Demo Booked", color:T.green },
  { id:"callback", label:"⏰ Call Back", color:T.goldDim },
  { id:"noanswer", label:"📴 No Answer", color:"#666" },
  { id:"not_interested", label:"❌ Not Interested", color:T.red },
];

const SCRIPT = `Hey [Name], this is Joel.

Two quick things — first, I noticed you all don't have a website yet, and I know you're probably losing calls after hours.

I've been building websites for service businesses in Denham Springs that also include an AI phone system — answers every call, captures the lead info, books appointments. No work on your end.

You free for a quick 5-minute look? I'll show you exactly how it works.`;

const TIP = `⚡ TIP: Don't pitch on the first call. Just qualify. Listen for pain: "How many calls do you miss a week? What happens when someone calls at 9pm?" Then say "That's exactly what we fix."`;

function OutreachTracker() {
  const [logs, setLogs] = useState({});
  const [filterCity, setFilterCity] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [active, setActive] = useState(null);
  const [outcome, setOutcome] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("flowdesk_outreach");
      if (saved) setLogs(JSON.parse(saved));
    } catch {}
  }, []);

  function saveLogs(newLogs) {
    setLogs(newLogs);
    localStorage.setItem("flowdesk_outreach", JSON.stringify(newLogs));
  }

  function getStatus(name) {
    return logs[name]?.outcome || "new";
  }

  function getLastCall(name) {
    return logs[name]?.timestamp || null;
  }

  function logCall(name) {
    if (!outcome) return;
    const entry = { outcome, notes, timestamp: new Date().toISOString() };
    saveLogs({ ...logs, [name]: entry });
    setActive(null);
    setOutcome("");
    setNotes("");
  }

  const filtered = BUSINESSES.filter(b => {
    if (filterCity !== "all" && b[2] !== filterCity) return false;
    if (filterStatus === "called" && getStatus(b[0]) === "new") return false;
    if (filterStatus === "pending" && (getStatus(b[0]) !== "new" && getStatus(b[0]) !== "noanswer" && getStatus(b[0]) !== "callback")) return false;
    if (filterStatus === "booked" && getStatus(b[0]) !== "booked") return false;
    if (filterStatus === "new" && getStatus(b[0]) !== "new") return false;
    if (search && !b[0].toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const called = Object.keys(logs).length;
  const booked = Object.values(logs).filter(l => l.outcome === "booked").length;
  const contacted = Object.values(logs).filter(l => ["contacted","voicemail","booked"].includes(l.outcome)).length;

  return (
    <div className="app">
      <style>{CSS}</style>
      <div className="hdr">
        <div className="logo">📞 Outreach<sub>52 Businesses · Denham Springs → Gonzales</sub></div>
        <a href="/dashboard" className="btn btn-o btn-s">← Dashboard</a>
      </div>
      <div className="main">
        <div className="stats">
          <div className="stat"><div className="stat-n">{BUSINESSES.length}</div><div className="stat-l">Total Targets</div></div>
          <div className="stat"><div className="stat-n">{called}</div><div className="stat-l">Calls Made</div></div>
          <div className="stat"><div className="stat-n">{contacted}</div><div className="stat-l">Reached</div></div>
          <div className="stat"><div className="stat-n">{booked}</div><div className="stat-l">Demos Booked</div></div>
          <div className="stat"><div className="stat-n">{Math.round(called / BUSINESSES.length * 100)||0}%</div><div className="stat-l">Progress</div></div>
        </div>

        <div className="tip-box"><strong>🎯 Today&apos;s Target:</strong> Call 8 businesses — start with Denham Springs. {SCRIPT}</div>

        <div className="toolbar">
          <input className="search-box" placeholder="Search business..." value={search} onChange={e => setSearch(e.target.value)} />
          <button className={`filter-btn ${filterCity==="all"?"on":""}`} onClick={() => setFilterCity("all")}>All Cities</button>
          {CITIES.map(c => (
            <button key={c} className={`filter-btn ${filterCity===c?"on":""}`} onClick={() => setFilterCity(c)}>{c}</button>
          ))}
        </div>
        <div className="toolbar">
          <button className={`filter-btn ${filterStatus==="all"?"on":""}`} onClick={() => setFilterStatus("all")}>All</button>
          <button className={`filter-btn ${filterStatus==="new"?"on":""}`} onClick={() => setFilterStatus("new")}>📴 Not Called</button>
          <button className={`filter-btn ${filterStatus==="called"?"on":""}`} onClick={() => setFilterStatus("called")}>✅ Called</button>
          <button className={`filter-btn ${filterStatus==="booked"?"on":""}`} onClick={() => setFilterStatus("booked")}>📅 Booked</button>
          <button className={`filter-btn ${filterStatus==="pending"?"on":""}`} onClick={() => setFilterStatus("pending")}>⏰ Pending Follow-Up</button>
        </div>

        <div className="biz-grid">
          {filtered.map((b,i) => {
            const status = getStatus(b[0]);
            const last = getLastCall(b[0]);
            const statusClass = status === "new" ? "s-new" : status === "contacted" ? "s-contacted" : status === "voicemail" ? "s-vm" : status === "booked" ? "s-booked" : status === "not_interested" ? "s-no" : status === "callback" ? "s-callback" : "s-noanswer";
            const label = status === "new" ? "Not Called" : OUTCOMES.find(o=>o.id===status)?.label || status;
            return (
              <div key={i} className={`biz-row ${status!=="new"?"done":""}`} onClick={() => setActive(b)}>
                <div className="biz-name">{b[0]}</div>
                <div style={{fontSize:"0.78rem",color:T.muted}}>{b[1]}</div>
                <div className="biz-city">{b[2]}</div>
                <div className="biz-phone">{b[3]}</div>
                <div><span className={`biz-status ${statusClass}`}>{label}</span></div>
                <div style={{fontSize:"0.7rem",color:T.muted}}>{last ? new Date(last).toLocaleDateString() : "—"}</div>
              </div>
            );
          })}
        </div>
        {filtered.length === 0 && <div style={{textAlign:"center",padding:40,color:T.muted}}>No businesses match this filter.</div>}

        {/* CALL LOG MODAL */}
        {active && (
          <div className="modal-bg" onClick={e => e.target===e.currentTarget && setActive(null)}>
            <div className="modal">
              <h3>📞 {active[0]}</h3>
              <div style={{fontSize:"0.82rem",color:T.muted,marginBottom:4}}>{active[1]} · {active[2]}</div>
              <div style={{fontSize:"0.85rem",color:T.blue,fontFamily:"monospace",marginBottom:14}}>{active[3]}</div>
              {logs[active[0]] && (
                <div style={{fontSize:"0.75rem",color:T.muted,marginBottom:10,background:T.surface,padding:"8px 10px",borderRadius:8}}>
                  Last call: {new Date(logs[active[0]].timestamp).toLocaleString()} — {OUTCOMES.find(o=>o.id===logs[active[0]].outcome)?.label||logs[active[0]].outcome}
                  {logs[active[0]].notes && <div style={{marginTop:4,fontStyle:"italic"}}>&quot;{logs[active[0]].notes}&quot;</div>}
                </div>
              )}
              <div className="field"><label>Outcome</label></div>
              <div className="outcome-grid">
                {OUTCOMES.map(o => (
                  <div key={o.id} className={`outcome-btn ${outcome===o.id?"sel":""}`} onClick={() => setOutcome(o.id)} style={{borderColor:outcome===o.id?o.color:""}}>
                    {o.label}
                  </div>
                ))}
              </div>
              <div className="field"><label>Notes</label><textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="What did they say? When to follow up?" /></div>
              <div className="actions">
                <button className="btn btn-o btn-s" onClick={() => setActive(null)}>Cancel</button>
                <button className="btn btn-g btn-s" disabled={!outcome} onClick={() => logCall(active[0])}>
                  {outcome==="booked"?"📅 Log & Add to Pipeline":"✅ Log Call"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default OutreachTracker;
