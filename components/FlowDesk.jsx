"use client";
import React, { useState, useEffect, useRef } from "react";

// ─── THEME ────────────────────────────────────────────────────────────────────
const T = {
  bg:"#F8FAFC", surface:"#FFFFFF", card:"#FFFFFF", border:"#E2E8F0",
  borderHover:"#CBD5E1", primary:"#2563EB", primaryDim:"#1D4ED8", primaryGlow:"#EFF6FF",
  text:"#0F172A", muted:"#64748B", red:"#DC2626", green:"#16A34A", blue:"#7C3AED",
};

const CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%;background:${T.bg};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:${T.text};font-size:14px}
.app{display:flex;min-height:100vh;background:${T.bg}}
.z1{position:relative}

/* ─── SIDEBAR ────────────────────────────────────────────────────────────── */
.sidebar{width:220px;background:${T.surface};border-right:1px solid ${T.border};display:flex;flex-direction:column;position:fixed;top:0;left:0;height:100vh;z-index:20}
.sb-logo{padding:18px 16px;border-bottom:1px solid ${T.border};display:flex;align-items:center;gap:10px}
.sb-logo-icon{width:34px;height:34px;background:${T.primary};border-radius:8px;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:15px;flex-shrink:0}
.sb-logo-name{font-weight:700;font-size:15px;color:${T.text}}
.sb-logo-tag{font-size:10px;color:${T.muted};font-weight:400}
.sb-nav{padding:10px 8px;flex:1;overflow-y:auto}
.sb-section{font-size:10px;font-weight:700;color:${T.muted};text-transform:uppercase;letter-spacing:0.8px;padding:12px 8px 4px}
.nav-btn{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:6px;cursor:pointer;color:${T.muted};margin-bottom:1px;transition:all 0.12s;background:none;border:none;font-family:inherit;font-size:13px;width:100%;text-align:left}
.nav-btn:hover{background:${T.bg};color:${T.text}}
.nav-btn.on{background:${T.primaryGlow};color:${T.primary};font-weight:600}
.nav-icon{font-size:15px;width:18px;text-align:center;flex-shrink:0}
.nav-badge{margin-left:auto;background:${T.primary};color:#fff;border-radius:20px;padding:1px 6px;font-size:10px;font-weight:700}
.sb-footer{border-top:1px solid ${T.border};padding:12px}
.biz-card{background:${T.bg};border-radius:6px;padding:10px 12px}
.biz-name{font-weight:600;font-size:13px}
.biz-sub{font-size:11px;color:${T.muted};margin-top:2px}
.biz-dot{display:inline-block;width:7px;height:7px;border-radius:50%;background:${T.green};margin-right:4px}

/* ─── MAIN AREA ──────────────────────────────────────────────────────────── */
.app-main{margin-left:220px;flex:1;display:flex;flex-direction:column;min-height:100vh}
.topbar{background:${T.surface};border-bottom:1px solid ${T.border};padding:14px 24px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:10}
.topbar-left h1{font-size:17px;font-weight:700;color:${T.text}}
.topbar-left p{font-size:12px;color:${T.muted};margin-top:1px}
.topbar-right{display:flex;gap:8px;align-items:center}
.main{flex:1;padding:24px;overflow-y:auto}
.main::-webkit-scrollbar{width:4px}
.main::-webkit-scrollbar-thumb{background:${T.border};border-radius:4px}

/* ─── CARDS ──────────────────────────────────────────────────────────────── */
.card{background:${T.card};border:1px solid ${T.border};border-radius:8px;padding:20px}
.card-sm{background:${T.card};border:1px solid ${T.border};border-radius:8px;padding:14px 16px}
.card-title{font-size:14px;font-weight:700;margin-bottom:14px;color:${T.text}}
.section-hd{font-size:16px;font-weight:700;color:${T.text};margin-bottom:18px;display:flex;align-items:center;gap:8px}

/* ─── STATS ──────────────────────────────────────────────────────────────── */
.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:22px}
@media(max-width:640px){.stats{grid-template-columns:repeat(2,1fr)}}
.stat{background:${T.card};border:1px solid ${T.border};border-radius:8px;padding:16px 18px;position:relative;overflow:hidden}
.stat::after{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:var(--c,${T.primary})}
.stat-n{font-size:28px;font-weight:800;color:var(--c,${T.primary});margin:6px 0 2px;line-height:1}
.stat-l{font-size:11px;color:${T.muted};text-transform:uppercase;letter-spacing:0.5px}
.stat-d{font-size:11px;color:${T.green};margin-top:6px}

/* ─── LAYOUT HELPERS ─────────────────────────────────────────────────────── */
.two-col{display:grid;grid-template-columns:1fr 1fr;gap:16px}
@media(max-width:700px){.two-col{grid-template-columns:1fr}}
.flex{display:flex}.aic{align-items:center}.jcb{justify-content:space-between}.gap8{gap:8px}.gap12{gap:12px}
.mb8{margin-bottom:8px}.mb12{margin-bottom:12px}.mb16{margin-bottom:16px}.mb20{margin-bottom:20px}.mb24{margin-bottom:24px}
.divider{border:none;border-top:1px solid ${T.border};margin:20px 0}

/* ─── FIELDS ─────────────────────────────────────────────────────────────── */
.field{display:flex;flex-direction:column;gap:5px}
.field label{font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.09em;color:${T.muted}}
.field input,.field select,.field textarea{background:${T.surface};border:1px solid ${T.border};border-radius:6px;padding:8px 11px;color:${T.text};font-size:13px;font-family:inherit;outline:none;transition:border-color .15s,box-shadow .15s;width:100%}
.field input:focus,.field select:focus,.field textarea:focus{border-color:${T.primary};box-shadow:0 0 0 3px rgba(37,99,235,0.08)}
.field textarea{resize:vertical;min-height:76px;line-height:1.55}
.field input::placeholder,.field textarea::placeholder{color:${T.borderHover}}
.fg{display:grid;grid-template-columns:1fr 1fr;gap:13px}
.fg .s2{grid-column:1/-1}
@media(max-width:560px){.fg{grid-template-columns:1fr}}

/* ─── BUTTONS ────────────────────────────────────────────────────────────── */
.btn{display:inline-flex;align-items:center;gap:6px;padding:8px 14px;border-radius:6px;font-size:13px;font-weight:500;font-family:inherit;cursor:pointer;border:none;transition:all .12s;line-height:1}
.btn-g{background:${T.primary};color:#fff}
.btn-g:hover{background:${T.primaryDim}}
.btn-o{background:transparent;color:${T.text};border:1px solid ${T.border}}
.btn-o:hover{background:${T.bg}}
.btn-s{padding:5px 10px;font-size:12px}
.btn:disabled{opacity:.4;cursor:not-allowed}

/* ─── BADGES ─────────────────────────────────────────────────────────────── */
.badge{display:inline-flex;align-items:center;gap:4px;padding:2px 8px;border-radius:20px;font-size:11px;font-weight:600;white-space:nowrap}
.b-hot{background:#FEF2F2;color:${T.red};border:1px solid #FECACA}
.b-warm{background:#FFFBEB;color:#D97706;border:1px solid #FDE68A}
.b-cold{background:${T.bg};color:${T.muted};border:1px solid ${T.border}}
.b-new{background:${T.primaryGlow};color:${T.primary};border:1px solid #BFDBFE}
.b-done{background:#F0FDF4;color:${T.green};border:1px solid #BBF7D0}

/* ─── LEAD ROWS ──────────────────────────────────────────────────────────── */
.lr{display:flex;align-items:center;gap:14px;padding:13px 0;border-bottom:1px solid ${T.border};animation:fu .3s ease both}
.lr:last-child{border-bottom:none}
@keyframes fu{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
.lav{width:36px;height:36px;border-radius:50%;background:${T.primaryGlow};border:1px solid #BFDBFE;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.82rem;color:${T.primary};flex-shrink:0}
.ln{font-size:0.88rem;font-weight:600}
.lm{font-size:0.75rem;color:${T.muted};margin-top:1px}
.la{margin-left:auto;display:flex;gap:6px}

/* ─── TIMELINE ───────────────────────────────────────────────────────────── */
.tl{display:flex;flex-direction:column;gap:0}
.tli{display:flex;gap:14px;padding-bottom:20px;position:relative}
.tli::before{content:'';position:absolute;left:15px;top:28px;bottom:0;width:1px;background:${T.border}}
.tli:last-child::before{display:none}
.tld{width:30px;height:30px;border-radius:50%;background:${T.surface};border:2px solid ${T.border};display:flex;align-items:center;justify-content:center;font-size:0.75rem;flex-shrink:0;z-index:1;transition:border-color .2s}
.tld.sent{border-color:${T.green};background:#F0FDF4}
.tld.pend{border-color:${T.primary};background:${T.primaryGlow}}
.tlb{flex:1;padding-top:4px}
.tll{font-size:0.82rem;font-weight:600;margin-bottom:2px}
.tls{font-size:0.74rem;color:${T.muted}}
.tlm{margin-top:8px;background:${T.bg};border:1px solid ${T.border};border-radius:8px;padding:10px 12px;font-size:0.8rem;color:${T.muted};line-height:1.55;font-style:italic}

/* ─── CALENDAR ───────────────────────────────────────────────────────────── */
.cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:4px}
.cal-hdr{text-align:center;font-size:0.68rem;font-weight:600;text-transform:uppercase;letter-spacing:0.07em;color:${T.muted};padding:6px 0}
.cal-day{min-height:58px;background:${T.surface};border:1px solid ${T.border};border-radius:6px;padding:6px;cursor:pointer;transition:all .15s}
.cal-day:hover{border-color:${T.borderHover}}
.cal-day.today{border-color:${T.primary}}
.cal-day.sel{background:${T.primaryGlow};border-color:${T.primary}}
.cal-day.empty{background:transparent;border-color:transparent;cursor:default}
.cdn{font-size:0.72rem;font-weight:600;color:${T.muted}}
.cal-day.today .cdn{color:${T.primary}}
.cap{background:${T.primaryGlow};border-left:2px solid ${T.primary};border-radius:3px;padding:2px 5px;font-size:0.6rem;color:${T.primary};margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cap.bl{background:#F5F3FF;border-left-color:${T.blue};color:${T.blue}}
.cap.gr{background:#F0FDF4;border-left-color:${T.green};color:${T.green}}
.slots{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:10px}
@media(max-width:480px){.slots{grid-template-columns:repeat(3,1fr)}}
.slot{padding:9px 8px;border-radius:6px;font-size:0.78rem;font-weight:500;text-align:center;border:1px solid ${T.border};background:${T.surface};color:${T.muted};cursor:pointer;transition:all .15s}
.slot:hover{border-color:${T.borderHover};color:${T.text}}
.slot.on{background:${T.primaryGlow};border-color:${T.primary};color:${T.primary}}
.slot.bkd{opacity:.35;cursor:not-allowed;text-decoration:line-through}

/* ─── MODAL ──────────────────────────────────────────────────────────────── */
.modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.45);backdrop-filter:blur(4px);z-index:100;display:flex;align-items:center;justify-content:center;padding:20px;animation:fi .2s ease}
@keyframes fi{from{opacity:0}to{opacity:1}}
.modal{background:${T.surface};border:1px solid ${T.border};border-radius:12px;padding:26px;width:100%;max-width:520px;max-height:90vh;overflow-y:auto;animation:su .25s ease;box-shadow:0 20px 60px rgba(0,0,0,.12)}
@keyframes su{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
.mod-t{font-size:16px;font-weight:700;color:${T.text};margin-bottom:18px;display:flex;align-items:center;gap:10px}

/* ─── TOAST ──────────────────────────────────────────────────────────────── */
.toast{position:fixed;bottom:22px;right:22px;background:#1E293B;color:#fff;border-radius:8px;padding:11px 16px;font-size:13px;z-index:200;animation:su .25s ease;display:flex;align-items:center;gap:8px;box-shadow:0 8px 32px rgba(0,0,0,.2)}
.toast.err{background:#FEF2F2;color:${T.red};border:1px solid #FECACA}

/* ─── AI ─────────────────────────────────────────────────────────────────── */
.ail{display:flex;gap:5px;align-items:center;padding:14px 0}
.ail span{width:6px;height:6px;background:${T.primary};border-radius:50%;animation:bo 1.2s infinite}
.ail span:nth-child(2){animation-delay:.2s}
.ail span:nth-child(3){animation-delay:.4s}
@keyframes bo{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-7px)}}
.ai-box{background:${T.bg};border:1px solid ${T.border};border-radius:8px;padding:14px;font-size:0.84rem;line-height:1.65;color:${T.text};white-space:pre-wrap}
.err-banner{background:#FEF2F2;border:1px solid #FECACA;border-radius:8px;padding:12px 16px;font-size:0.82rem;color:${T.red};margin-bottom:16px}
.spin{animation:spin 1s linear infinite;display:inline-block}
@keyframes spin{to{transform:rotate(360deg)}}

/* ─── INBOX ──────────────────────────────────────────────────────────────── */
.inbox{display:grid;grid-template-columns:280px 1fr;gap:16px;height:calc(100vh - 130px);min-height:420px}
@media(max-width:700px){.inbox{grid-template-columns:1fr;height:auto}}
.thread-list{display:flex;flex-direction:column;overflow-y:auto;background:${T.card};border:1px solid ${T.border};border-radius:8px}
.thread-item{padding:13px 15px;border-bottom:1px solid ${T.border};cursor:pointer;transition:background .15s;position:relative}
.thread-item:last-child{border-bottom:none}
.thread-item:hover{background:${T.bg}}
.thread-item.active{background:${T.primaryGlow};border-left:3px solid ${T.primary}}
.thread-name{font-size:0.85rem;font-weight:600;margin-bottom:2px}
.thread-preview{font-size:0.74rem;color:${T.muted};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:210px}
.thread-time{font-size:0.66rem;color:${T.muted};position:absolute;top:13px;right:14px}
.unread-dot{display:inline-block;width:7px;height:7px;background:${T.primary};border-radius:50%;margin-left:6px;vertical-align:middle}
.msg-panel{display:flex;flex-direction:column;background:${T.card};border:1px solid ${T.border};border-radius:8px;overflow:hidden}
.msg-hdr{padding:13px 18px;border-bottom:1px solid ${T.border};font-weight:600;font-size:0.88rem;background:${T.bg};display:flex;align-items:center;gap:10px}
.msg-body{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px;min-height:200px}
.bubble{max-width:72%;padding:10px 14px;border-radius:12px;font-size:0.83rem;line-height:1.55}
.bubble.in{background:${T.bg};border:1px solid ${T.border};align-self:flex-start;border-radius:4px 12px 12px 12px}
.bubble.out{background:${T.primaryGlow};border:1px solid #BFDBFE;color:${T.primary};align-self:flex-end;border-radius:12px 4px 12px 12px}
.bubble-time{font-size:0.64rem;color:${T.muted};margin-top:3px}
.msg-reply{display:flex;gap:10px;padding:14px 18px;border-top:1px solid ${T.border};background:${T.bg}}
.msg-reply textarea{flex:1;background:${T.surface};border:1px solid ${T.border};border-radius:6px;padding:9px 12px;color:${T.text};font-size:0.84rem;font-family:inherit;outline:none;resize:none;height:60px;transition:border-color .15s}
.msg-reply textarea:focus{border-color:${T.primary}}
.msg-reply textarea::placeholder{color:${T.borderHover}}

/* ─── BROADCAST ──────────────────────────────────────────────────────────── */
.char-count{font-size:0.72rem;text-align:right;margin-top:4px;color:${T.muted}}
.char-count.warn{color:#D97706}
.char-count.over{color:${T.red}}
.bc-hist{width:100%;border-collapse:collapse;font-size:0.82rem}
.bc-hist th{text-align:left;padding:8px 12px;color:${T.muted};font-size:0.69rem;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;border-bottom:1px solid ${T.border};background:${T.bg}}
.bc-hist td{padding:10px 12px;border-bottom:1px solid ${T.border}}
.bc-hist tr:last-child td{border-bottom:none}

/* ─── REVIEWS ────────────────────────────────────────────────────────────── */
.rv-row{display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid ${T.border}}
.rv-row:last-child{border-bottom:none}

/* ─── ONBOARDING WIZARD ──────────────────────────────────────────────────── */
.ow{min-height:100vh;display:flex;flex-direction:column;background:${T.bg}}
.ow-hdr{padding:18px 28px;border-bottom:1px solid ${T.border};display:flex;align-items:center;justify-content:space-between;background:${T.surface}}
.ow-hdr-right{font-size:0.75rem;color:${T.muted}}
.ow-body{flex:1;display:flex;align-items:center;justify-content:center;padding:32px 20px}
.ow-card{background:${T.surface};border:1px solid ${T.border};border-radius:12px;padding:36px;width:100%;max-width:520px;animation:su .3s ease;box-shadow:0 4px 24px rgba(0,0,0,.06)}
.ow-welcome{text-align:center;padding:8px 0 4px}
.ow-welcome-icon{font-size:3rem;margin-bottom:16px;display:block}
.ow-welcome-title{font-size:1.5rem;font-weight:700;color:${T.text};margin-bottom:8px}
.ow-welcome-sub{font-size:0.88rem;color:${T.muted};line-height:1.65;margin-bottom:28px;max-width:380px;margin-left:auto;margin-right:auto}
.ow-welcome-perks{display:flex;flex-direction:column;gap:10px;margin-bottom:28px;text-align:left}
.ow-perk{display:flex;align-items:flex-start;gap:10px;font-size:0.83rem;color:${T.text};line-height:1.5}
.ow-perk-icon{width:24px;height:24px;border-radius:6px;background:${T.primaryGlow};border:1px solid #BFDBFE;display:flex;align-items:center;justify-content:center;font-size:0.78rem;flex-shrink:0;margin-top:1px}
.ow-step-indicator{display:flex;align-items:center;justify-content:center;gap:0;margin-bottom:28px}
.ow-step-circle{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.74rem;font-weight:700;transition:all .3s}
.ow-step-filled{background:${T.primary};color:#fff;border:2px solid ${T.primary}}
.ow-step-current{background:${T.primaryGlow};color:${T.primary};border:2px solid ${T.primary}}
.ow-step-upcoming{background:${T.surface};color:${T.muted};border:2px solid ${T.border}}
.ow-step-line{width:40px;height:2px;transition:background .3s}
.ow-step-line-filled{background:${T.primary}}
.ow-step-line-upcoming{background:${T.border}}
.ow-label{font-size:0.68rem;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:${T.primary};margin-bottom:4px}
.ow-title{font-size:1.25rem;font-weight:700;color:${T.text};margin-bottom:4px}
.ow-desc{font-size:0.82rem;color:${T.muted};margin-bottom:24px;line-height:1.55}
.ow-field-lg input{padding:13px 16px;font-size:1rem;border-radius:8px}
.ow-preset-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:4px}
.ow-preset{padding:10px 12px;border-radius:6px;border:1px solid ${T.border};background:${T.surface};cursor:pointer;transition:all .15s;text-align:left}
.ow-preset:hover{border-color:${T.primary}}
.ow-preset.sel,.ow-preset-active{border-color:${T.primary};background:${T.primaryGlow}}
.ow-preset-name{font-size:0.8rem;font-weight:600;color:${T.text};margin-bottom:1px}
.ow-preset-desc{font-size:0.68rem;color:${T.muted}}
.ow-sms-preview{background:${T.bg};border:1px solid ${T.border};border-radius:8px;padding:14px 16px;margin-top:16px}
.ow-sms-label{font-size:0.66rem;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:${T.muted};margin-bottom:8px;display:flex;align-items:center;gap:6px}
.ow-sms-bubble{background:${T.primaryGlow};border:1px solid #BFDBFE;border-radius:10px 10px 10px 2px;padding:10px 13px;font-size:0.8rem;line-height:1.55;color:${T.text};display:inline-block;max-width:100%}
.ow-summary{display:flex;flex-direction:column;gap:8px;margin-bottom:20px}
.ow-summary-row{display:flex;justify-content:space-between;align-items:center;padding:10px 14px;background:${T.bg};border:1px solid ${T.border};border-radius:6px;font-size:0.83rem}
.ow-summary-key{color:${T.muted};font-size:0.74rem;font-weight:600;text-transform:uppercase;letter-spacing:0.07em}
.ow-summary-val{color:${T.text};font-weight:500}
.ow-nav{display:flex;align-items:center;justify-content:space-between;margin-top:24px;gap:12px}
.ow-success{text-align:center;padding:8px 0}
.ow-success-icon{font-size:3rem;margin-bottom:16px;display:block;animation:bo 1s ease}
.ow-success-title{font-size:1.4rem;font-weight:700;color:${T.primary};margin-bottom:8px}
.ow-success-desc{font-size:0.86rem;color:${T.muted};line-height:1.65;margin-bottom:24px}
.ow-action-cards{display:flex;flex-direction:column;gap:8px;text-align:left;margin-bottom:20px}
.ow-action-card{display:flex;align-items:center;gap:12px;padding:12px 14px;background:${T.bg};border:1px solid ${T.border};border-radius:8px;cursor:pointer;transition:border-color .15s}
.ow-action-card:hover{border-color:${T.primary}}
.ow-action-icon{font-size:1.2rem;width:36px;height:36px;background:${T.primaryGlow};border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.ow-action-title{font-size:0.84rem;font-weight:600;margin-bottom:1px}
.ow-action-desc{font-size:0.72rem;color:${T.muted}}
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
  useEffect(()=>{const t=setTimeout(onDone,3500);return()=>clearTimeout(t)},[onDone]);
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
          <div className="card-title">📅 Today&apos;s Appointments</div>
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

// ─── TIMEZONES ─────────────────────────────────────────────────────────────────
const US_TIMEZONES = [
  { value: "America/New_York",    label: "Eastern (ET)" },
  { value: "America/Chicago",     label: "Central (CT)" },
  { value: "America/Denver",      label: "Mountain (MT)" },
  { value: "America/Phoenix",     label: "Arizona (MST)" },
  { value: "America/Los_Angeles", label: "Pacific (PT)" },
  { value: "America/Anchorage",   label: "Alaska (AKT)" },
  { value: "Pacific/Honolulu",    label: "Hawaii (HT)" },
];

// ─── SETTINGS / INTEGRATIONS ──────────────────────────────────────────────────
function SettingsView({tenant}){
  const [calStatus,setCalStatus]=useState(null);
  const [loadingCal,setLoadingCal]=useState(true);
  const [saving,setSaving]=useState(false);
  const [loading,setLoading]=useState(true);
  const [toast,setToast]=useState(null);

  const EMPTY = {
    business_name:"", business_phone:"", business_address:"",
    open_hour:8, close_hour:18, timezone:"America/Chicago",
    hours_text:"Monday through Friday, 8 AM to 6 PM",
    emergency_phone:"", booking_url:"",
  };
  const [form,setForm]=useState(EMPTY);

  // Load settings on mount
  useEffect(()=>{
    async function load(){
      setLoading(true);
      const res=await fetch("/api/settings").catch(()=>null);
      if(res?.ok){
        const data=await res.json();
        if(data && data.id){
          setForm({
            business_name:  data.business_name  || "",
            business_phone: data.business_phone || "",
            business_address: data.business_address || "",
            open_hour:      data.open_hour      ?? 8,
            close_hour:     data.close_hour     ?? 18,
            timezone:       data.timezone       || "America/Chicago",
            hours_text:     data.hours_text     || "Monday through Friday, 8 AM to 6 PM",
            emergency_phone: data.emergency_phone || "",
            booking_url:    data.booking_url    || "",
          });
        }
      }
      setLoading(false);
    }
    load();
  },[]);

  // Google Calendar status
  useEffect(()=>{
    fetch(`/api/calendar/status?tenant=${encodeURIComponent(tenant)}`)
      .then(r=>r.json())
      .then(d=>{setCalStatus(d);setLoadingCal(false)})
      .catch(()=>setLoadingCal(false));
  },[tenant]);

  const authUrl=`/api/calendar/auth?tenant=${encodeURIComponent(tenant)}`;

  async function disconnect(){
    if(!confirm("Disconnect Google Calendar? Bookings will no longer sync.")) return;
    setLoadingCal(true);
    await fetch(`/api/calendar/status?tenant=${encodeURIComponent(tenant)}`,{method:"DELETE"});
    setCalStatus({connected:false});
    setLoadingCal(false);
  }

  async function saveSettings(e){
    e.preventDefault();
    setSaving(true);
    const res=await fetch("/api/settings",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        business_name:    form.business_name,
        business_phone:   form.business_phone,
        business_address: form.business_address,
        open_hour:        Number(form.open_hour),
        close_hour:       Number(form.close_hour),
        timezone:         form.timezone,
        hours_text:       form.hours_text,
        emergency_phone:  form.emergency_phone,
        booking_url:      form.booking_url,
      }),
    }).catch(()=>null);
    if(res?.ok){
      setToast({msg:"Settings saved successfully!",type:"ok"});
    } else {
      setToast({msg:"Error saving settings.",type:"err"});
    }
    setSaving(false);
  }

  function set(field,value){
    setForm(prev=>({...prev,[field]:value}));
  }

  return(
    <div className="z1">
      {toast&&<Toast msg={toast.msg} type={toast.type} onDone={()=>setToast(null)}/>}
      <div className="section-hd">⚙ Settings & Integrations</div>

      {loading ? (
        <div style={{display:"flex",alignItems:"center",gap:8,color:T.muted,fontSize:"0.85rem",padding:"40px 0"}}>
          <span className="spin">◌</span> Loading settings…
        </div>
      ) : (
        <>
          {/* Business Settings Form */}
          <div className="card mb20" style={{maxWidth:700}}>
            <div className="card-title" style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:"1.3rem"}}>🏢</span> Business Information
            </div>
            <form onSubmit={saveSettings}>
              <div className="fg">
                <div className="field s2">
                  <label>Business Name</label>
                  <input placeholder="FlowDesk Home Services" value={form.business_name} onChange={e=>set("business_name",e.target.value)}/>
                </div>
                <div className="field">
                  <label>Business Phone</label>
                  <input placeholder="+15551234567" value={form.business_phone} onChange={e=>set("business_phone",e.target.value)}/>
                </div>
                <div className="field">
                  <label>Emergency Phone</label>
                  <input placeholder="+15551234567" value={form.emergency_phone} onChange={e=>set("emergency_phone",e.target.value)}/>
                </div>
                <div className="field s2">
                  <label>Business Address</label>
                  <input placeholder="123 Main St, Suite 100, City, ST 12345" value={form.business_address} onChange={e=>set("business_address",e.target.value)}/>
                </div>
                <div className="field">
                  <label>Open Hour</label>
                  <select value={form.open_hour} onChange={e=>set("open_hour",e.target.value)}>
                    {Array.from({length:24},(_,i)=>(
                      <option key={i} value={i}>{i===0?"12 AM":i<12?`${i} AM`:i===12?"12 PM":`${i-12} PM`}</option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label>Close Hour</label>
                  <select value={form.close_hour} onChange={e=>set("close_hour",e.target.value)}>
                    {Array.from({length:24},(_,i)=>(
                      <option key={i} value={i}>{i===0?"12 AM":i<12?`${i} AM`:i===12?"12 PM":`${i-12} PM`}</option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label>Timezone</label>
                  <select value={form.timezone} onChange={e=>set("timezone",e.target.value)}>
                    {US_TIMEZONES.map(tz=>(
                      <option key={tz.value} value={tz.value}>{tz.label}</option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label>Business Hours Text</label>
                  <input placeholder="Monday through Friday, 8 AM to 6 PM" value={form.hours_text} onChange={e=>set("hours_text",e.target.value)}/>
                </div>
                <div className="field s2">
                  <label>Booking URL</label>
                  <input placeholder="https://yourdomain.com/book" value={form.booking_url} onChange={e=>set("booking_url",e.target.value)}/>
                </div>
              </div>
              <div style={{marginTop:20}}>
                <button type="submit" className="btn btn-g" disabled={saving}>
                  {saving?<><span className="spin">◌</span> Saving…</>:"💾 Save Settings"}
                </button>
              </div>
            </form>
          </div>

          {/* Google Calendar Integration */}
          <div className="card" style={{maxWidth:700}}>
            <div className="card-title" style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:"1.3rem"}}>📅</span> Google Calendar
            </div>
            <p style={{fontSize:"0.82rem",color:T.muted,lineHeight:1.7,marginBottom:16}}>
              Connect your Google Calendar so appointments booked through FlowDesk automatically appear as events on your calendar. Each client connects their own calendar.
            </p>
            {loadingCal ? (
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
                      <div style={{fontSize:"0.78rem",color:T.muted}}>Bookings won&apos;t appear on Google Calendar</div>
                    </div>
                  </div>
                </div>
                <a href={authUrl} className="btn btn-g" style={{textDecoration:"none",display:"inline-flex"}}>
                  🔗 Connect Google Calendar
                </a>
                <p style={{fontSize:"0.72rem",color:T.muted,marginTop:12,lineHeight:1.6}}>
                  You&apos;ll be redirected to Google to authorize access. Only <strong>calendar</strong> read/write permissions are requested. We store your refresh token securely and never access your personal data.
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ─── ONBOARDING WIZARD ─────────────────────────────────────────────────────────
function OnboardingWizard({onComplete,setActiveTab}){
  const LS_KEY="fd_onboarding_form";
  const EMPTY={
    business_name:"", business_phone:"", business_address:"",
    open_hour:8, close_hour:18, timezone:"",
    hours_text:"Monday through Friday, 8 AM to 6 PM",
    emergency_phone:"", booking_url:"",
  };

  // Restore from localStorage if available
  function loadSaved(){
    try{
      const raw=typeof window!=="undefined"&&window.localStorage.getItem(LS_KEY);
      return raw?{...EMPTY,...JSON.parse(raw)}:EMPTY;
    }catch{return EMPTY;}
  }

  const [screen,setScreen]=useState("welcome"); // welcome|step1|step2|launch|done
  const [saving,setSaving]=useState(false);
  const [form,setForm]=useState(loadSaved);

  // Auto-detect timezone on mount
  useEffect(()=>{
    if(!form.timezone){
      try{
        const tz=Intl.DateTimeFormat().resolvedOptions().timeZone;
        if(tz) set("timezone",tz);
      }catch{}
    }
  },[]);

  function set(field,value){
    setForm(p=>{
      const next={...p,[field]:value};
      try{window.localStorage.setItem(LS_KEY,JSON.stringify(next));}catch{}
      return next;
    });
  }

  function clearSaved(){try{window.localStorage.removeItem(LS_KEY);}catch{}}

  const PERKS=[
    {icon:"⚡",text:"Instant SMS reply to every new lead"},
    {icon:"📅",text:"Auto appointment booking + Google Calendar sync"},
    {icon:"🔁",text:"14-day automated follow-up sequence"},
    {icon:"📞",text:"AI phone system with after-hours IVR"},
  ];

  const HOUR_PRESETS=[
    {name:"Mon – Fri",desc:"8 AM – 6 PM",open:8,close:18,text:"Monday through Friday, 8 AM to 6 PM"},
    {name:"Mon – Sat",desc:"8 AM – 5 PM",open:8,close:17,text:"Monday through Saturday, 8 AM to 5 PM"},
    {name:"Mon – Sat",desc:"7 AM – 7 PM",open:7,close:19,text:"Monday through Saturday, 7 AM to 7 PM"},
    {name:"7 Days",desc:"9 AM – 5 PM",open:9,close:17,text:"Seven days a week, 9 AM to 5 PM"},
  ];

  const HOUR_OPTS=Array.from({length:24},(_,i)=>({
    value:i,
    label:i===0?"12 AM":i<12?`${i} AM`:i===12?"12 PM":`${i-12} PM`,
  }));

  function fmtHour(h){return h===0?"12 AM":h<12?`${h} AM`:h===12?"12 PM":`${h-12} PM`;}

  const smsPreview=`Hi [Name]! Thanks for reaching out to ${form.business_name||"your business"}. We got your request and will call you back shortly. – ${form.business_name||"FlowDesk"}`;

  const step1Valid=form.business_name.trim()&&form.business_phone.trim();

  async function handleLaunch(){
    setSaving(true);
    const res=await fetch("/api/settings",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        business_name:    form.business_name,
        business_phone:   form.business_phone,
        business_address: form.business_address,
        open_hour:        Number(form.open_hour),
        close_hour:       Number(form.close_hour),
        timezone:         form.timezone,
        hours_text:       form.hours_text,
        emergency_phone:  form.emergency_phone,
        booking_url:      form.booking_url,
      }),
    }).catch(()=>null);
    setSaving(false);
    if(res?.ok){
      clearSaved();
      setScreen("done");
    }
  }

  const Logo=()=>(
    <svg width="110" height="32" viewBox="0 0 400 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{verticalAlign:"middle"}}>
      <defs><linearGradient id="owgd" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#F0B429"/><stop offset="100%" stopColor="#C49020"/></linearGradient></defs>
      <rect x="0" y="0" width="60" height="10" rx="3" fill="url(#owgd)"/>
      <rect x="8" y="18" width="44" height="10" rx="3" fill="url(#owgd)" opacity="0.85"/>
      <rect x="16" y="36" width="28" height="10" rx="3" fill="url(#owgd)" opacity="0.7"/>
      <polygon points="22,52 38,52 46,70 14,70" fill="url(#owgd)" opacity="0.6"/>
      <rect x="14" y="64" width="32" height="10" rx="8" fill="url(#owgd)" opacity="0.5"/>
      <text x="115" y="58" fontFamily="Georgia,serif" fontSize="44" fontWeight="700" fill="#F0EAD6" letterSpacing="-0.5">Flow</text>
      <text x="115" y="90" fontFamily="Arial,sans-serif" fontSize="20" fontWeight="500" fill="#8A8470" letterSpacing="3.5">DESK</text>
      <circle cx="225" cy="50" r="3" fill="#F0B429"/>
    </svg>
  );

  return(
    <div className="ow">
      <style>{CSS}</style>
      <div className="ow-hdr">
        <div className="logo"><Logo/><sub>Lead Engine</sub></div>
        {screen!=="welcome"&&screen!=="done"&&(
          <div className="ow-hdr-right">
            {screen==="step1"&&<span style={{fontSize:"0.78rem",color:T.muted}}>Step 1 of 2</span>}
            {screen==="step2"&&<span style={{fontSize:"0.78rem",color:T.muted}}>Step 2 of 2</span>}
            {screen==="launch"&&<span style={{fontSize:"0.78rem",color:T.gold}}>Almost there</span>}
          </div>
        )}
      </div>

      <div className="ow-body">
        <div className="ow-card">

          {/* ── WELCOME ── */}
          {screen==="welcome"&&(
            <div className="ow-welcome">
              <div className="ow-welcome-icon">🚀</div>
              <div className="ow-welcome-title">Welcome to FlowDesk</div>
              <div className="ow-welcome-sub">Your all-in-one lead engine for local service businesses. Let&apos;s get you set up in under 2 minutes.</div>
              <div className="ow-welcome-perks">
                {PERKS.map((p,i)=>(
                  <div className="ow-perk" key={i}>
                    <span className="ow-perk-icon">{p.icon}</span>
                    <span>{p.text}</span>
                  </div>
                ))}
              </div>
              <button className="btn btn-g" style={{width:"100%",padding:"14px",fontSize:"1rem",marginTop:8}} onClick={()=>setScreen("step1")}>
                Get started →
              </button>
            </div>
          )}

          {/* ── STEP 1: Business Info ── */}
          {screen==="step1"&&(
            <>
              <div className="ow-title">Tell us about your business</div>
              <div className="ow-desc">This is what your customers will see and what powers your AI phone system.</div>
              <div className="fg" style={{marginTop:20}}>
                <div className="field s2">
                  <label className="ow-label">Business Name <span style={{color:T.red}}>*</span></label>
                  <input className="ow-field-lg" placeholder="Premier HVAC Services" value={form.business_name} onChange={e=>set("business_name",e.target.value)} autoFocus/>
                </div>
                <div className="field">
                  <label className="ow-label">Business Phone <span style={{color:T.red}}>*</span></label>
                  <input className="ow-field-lg" placeholder="+1 (555) 234-5678" value={form.business_phone} onChange={e=>set("business_phone",e.target.value)}/>
                </div>
                <div className="field">
                  <label className="ow-label">Business Address <span style={{color:T.muted,fontWeight:400}}>optional</span></label>
                  <input placeholder="123 Main St, Los Angeles, CA 90001" value={form.business_address} onChange={e=>set("business_address",e.target.value)}/>
                </div>
              </div>
              <div className="ow-nav">
                <button className="btn btn-o" onClick={()=>setScreen("welcome")}>← Back</button>
                <button className="btn btn-g" disabled={!step1Valid} onClick={()=>setScreen("step2")}>
                  Next →
                </button>
              </div>
            </>
          )}

          {/* ── STEP 2: Hours ── */}
          {screen==="step2"&&(
            <>
              <div className="ow-title">Set your business hours</div>
              <div className="ow-desc">Used by the AI phone system to detect after-hours calls and route them correctly.</div>
              <div style={{marginTop:20}}>
                <div style={{fontSize:"0.78rem",color:T.muted,marginBottom:10,fontWeight:500,letterSpacing:"0.04em",textTransform:"uppercase"}}>Quick presets</div>
                <div className="ow-preset-grid">
                  {HOUR_PRESETS.map((p,i)=>{
                    const active=form.open_hour===p.open&&form.close_hour===p.close&&form.text===p.text;
                    return(
                      <div key={i} className={`ow-preset${active?" ow-preset-active":""}`} onClick={()=>{set("open_hour",p.open);set("close_hour",p.close);set("hours_text",p.text);}}>
                        <div className="ow-preset-name">{p.name}</div>
                        <div className="ow-preset-desc">{p.desc}</div>
                      </div>
                    );
                  })}
                </div>
                <div className="fg" style={{marginTop:16}}>
                  <div className="field">
                    <label className="ow-label">Opens</label>
                    <select value={form.open_hour} onChange={e=>set("open_hour",Number(e.target.value))}>
                      {HOUR_OPTS.map(h=><option key={h.value} value={h.value}>{h.label}</option>)}
                    </select>
                  </div>
                  <div className="field">
                    <label className="ow-label">Closes</label>
                    <select value={form.close_hour} onChange={e=>set("close_hour",Number(e.target.value))}>
                      {HOUR_OPTS.map(h=><option key={h.value} value={h.value}>{h.label}</option>)}
                    </select>
                  </div>
                  <div className="field s2">
                    <label className="ow-label">Timezone</label>
                    <select value={form.timezone} onChange={e=>set("timezone",e.target.value)}>
                      {US_TIMEZONES.map(tz=><option key={tz.value} value={tz.value}>{tz.label}</option>)}
                    </select>
                  </div>
                </div>
                <div className="ow-sms-preview">
                  <div className="ow-sms-label">📱 Lead will receive this SMS instantly</div>
                  <div className="ow-sms-bubble">{smsPreview}</div>
                </div>
              </div>
              <div className="ow-nav">
                <button className="btn btn-o" onClick={()=>setScreen("step1")}>← Back</button>
                <button className="btn btn-g" onClick={()=>setScreen("launch")}>Review →</button>
              </div>
            </>
          )}

          {/* ── LAUNCH: Summary + Optional Fields ── */}
          {screen==="launch"&&(
            <>
              <div className="ow-title">🎯 Ready to launch</div>
              <div className="ow-desc">Here&apos;s your setup. Add optional details or hit Launch to go live.</div>
              <div className="ow-summary">
                <div className="ow-summary-row">
                  <span className="ow-summary-key">Business</span>
                  <span className="ow-summary-val">{form.business_name}</span>
                </div>
                <div className="ow-summary-row">
                  <span className="ow-summary-key">Phone</span>
                  <span className="ow-summary-val">{form.business_phone}</span>
                </div>
                {form.business_address&&(
                  <div className="ow-summary-row">
                    <span className="ow-summary-key">Address</span>
                    <span className="ow-summary-val">{form.business_address}</span>
                  </div>
                )}
                <div className="ow-summary-row">
                  <span className="ow-summary-key">Hours</span>
                  <span className="ow-summary-val">{fmtHour(form.open_hour)} – {fmtHour(form.close_hour)}</span>
                </div>
                <div className="ow-summary-row">
                  <span className="ow-summary-key">Timezone</span>
                  <span className="ow-summary-val">{form.timezone||"—"}</span>
                </div>
              </div>
              <div className="fg" style={{marginTop:16}}>
                <div className="field s2">
                  <label className="ow-label">Emergency Phone <span style={{color:T.muted,fontWeight:400}}>optional</span></label>
                  <input placeholder="+1 (555) 999-0000" value={form.emergency_phone} onChange={e=>set("emergency_phone",e.target.value)}/>
                  <span style={{fontSize:"0.7rem",color:T.muted}}>Callers pressing 1 for emergencies will be connected here</span>
                </div>
                <div className="field s2">
                  <label className="ow-label">Booking URL <span style={{color:T.muted,fontWeight:400}}>optional</span></label>
                  <input placeholder="https://yourdomain.com/book" value={form.booking_url} onChange={e=>set("booking_url",e.target.value)}/>
                  <span style={{fontSize:"0.7rem",color:T.muted}}>Sent to leads via SMS when they request a booking</span>
                </div>
              </div>
              <div className="ow-nav">
                <button className="btn btn-o" onClick={()=>setScreen("step2")}>← Back</button>
                <button className="btn btn-g" disabled={saving} onClick={handleLaunch} style={{padding:"12px 28px",fontSize:"1rem"}}>
                  {saving?<><span className="spin">◌</span> Saving…</>:"🚀 Launch FlowDesk"}
                </button>
              </div>
            </>
          )}

          {/* ── DONE ── */}
          {screen==="done"&&(
            <div className="ow-success">
              <div className="ow-success-icon">🎉</div>
              <div className="ow-success-title">You&apos;re live!</div>
              <div className="ow-success-desc">{form.business_name} is now powered by FlowDesk.<br/>What would you like to do first?</div>
              <div className="ow-action-cards">
                <div className="ow-action-card" onClick={()=>{onComplete();setTimeout(()=>setActiveTab&&setActiveTab("leads"),100);}}>
                  <div className="ow-action-icon">➕</div>
                  <div className="ow-action-title">Capture First Lead</div>
                  <div className="ow-action-desc">Add a lead manually to test the SMS sequence</div>
                </div>
                <div className="ow-action-card" onClick={()=>{onComplete();setTimeout(()=>setActiveTab&&setActiveTab("settings"),100);}}>
                  <div className="ow-action-icon">⚙️</div>
                  <div className="ow-action-title">Configure Phone</div>
                  <div className="ow-action-desc">Connect Twilio and set up your AI voice IVR</div>
                </div>
                <div className="ow-action-card" onClick={()=>onComplete()}>
                  <div className="ow-action-icon">🏠</div>
                  <div className="ow-action-title">Go to Dashboard</div>
                  <div className="ow-action-desc">Explore your new lead engine</div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// ─── CONVERSATIONS (SMS INBOX) ────────────────────────────────────────────────
function ConversationsView(){
  const [threads,setThreads]=useState([]);
  const [activePhone,setActivePhone]=useState(null);
  const [messages,setMessages]=useState([]);
  const [replyText,setReplyText]=useState("");
  const [sending,setSending]=useState(false);
  const [loadingThreads,setLoadingThreads]=useState(true);
  const [loadingMsgs,setLoadingMsgs]=useState(false);
  const [toast,setToast]=useState(null);
  const bodyRef=useRef(null);

  useEffect(()=>{
    async function load(){
      setLoadingThreads(true);
      const res=await fetch("/api/conversations").catch(()=>null);
      if(res?.ok) setThreads(await res.json());
      setLoadingThreads(false);
    }
    load();
  },[]);

  useEffect(()=>{
    if(bodyRef.current) bodyRef.current.scrollTop=bodyRef.current.scrollHeight;
  },[messages]);

  async function openThread(phone){
    setActivePhone(phone);
    setMessages([]);
    setLoadingMsgs(true);
    const res=await fetch("/api/conversations?phone="+encodeURIComponent(phone)).catch(()=>null);
    if(res?.ok){
      const data=await res.json();
      setMessages(data);
      setThreads(prev=>prev.map(t=>t.phone===phone?{...t,unread:0}:t));
    }
    setLoadingMsgs(false);
  }

  async function sendReply(){
    if(!replyText.trim()||!activePhone) return;
    setSending(true);
    const body=replyText.trim();
    setReplyText("");
    const res=await fetch("/api/conversations",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({to:activePhone,body}),
    }).catch(()=>null);
    if(res?.ok){
      const msg=await res.json();
      setMessages(prev=>[...prev,msg]);
      setThreads(prev=>{
        const exists=prev.find(t=>t.phone===activePhone);
        if(exists) return prev.map(t=>t.phone===activePhone?{...t,lastMessage:body,direction:"outbound",time:new Date().toISOString()}:t);
        return [{phone:activePhone,lastMessage:body,direction:"outbound",time:new Date().toISOString(),unread:0},...prev];
      });
    } else {
      setToast({msg:"Failed to send. Check Twilio config.",type:"err"});
      setReplyText(body);
    }
    setSending(false);
  }

  function fmt(ts){
    if(!ts) return "";
    const d=new Date(ts);
    const now=new Date();
    if(d.toDateString()===now.toDateString()) return d.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
    return d.toLocaleDateString([],{month:"short",day:"numeric"})+" "+d.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
  }

  const activeThread=threads.find(t=>t.phone===activePhone);

  return(
    <div className="z1">
      {toast&&<Toast msg={toast.msg} type={toast.type} onDone={()=>setToast(null)}/>}
      <div className="section-hd">💬 SMS Inbox</div>
      <div className="inbox">
        <div className="thread-list">
          {loadingThreads&&<div style={{padding:"20px",textAlign:"center",color:"#8A8470",fontSize:"0.82rem"}}><span className="spin">◌</span> Loading…</div>}
          {!loadingThreads&&threads.length===0&&(
            <div style={{padding:"32px 16px",textAlign:"center",display:"flex",flexDirection:"column",gap:8,alignItems:"center"}}>
              <div style={{fontSize:"1.8rem"}}>📱</div>
              <div style={{fontWeight:600,color:"#F0EAD6",fontSize:"0.86rem"}}>No conversations yet</div>
              <div style={{fontSize:"0.78rem",color:"#8A8470",lineHeight:1.6,maxWidth:200}}>When a lead texts your Twilio number, their message will appear here automatically.</div>
            </div>
          )}
          {threads.map(t=>(
            <div key={t.phone} className={"thread-item"+(activePhone===t.phone?" active":"")} onClick={()=>openThread(t.phone)}>
              <div className="thread-name">
                {t.phone}
                {t.unread>0&&<span className="unread-dot"/>}
              </div>
              <div className="thread-preview">
                {t.direction==="outbound"&&<span style={{color:"#8A8470"}}>You: </span>}
                {t.lastMessage}
              </div>
              <div className="thread-time">{fmt(t.time)}</div>
            </div>
          ))}
        </div>
        <div className="msg-panel">
          {!activePhone&&(
            <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",color:"#8A8470",fontSize:"0.85rem",flexDirection:"column",gap:8,padding:40}}>
              <div style={{fontSize:"2rem"}}>💬</div>
              Select a conversation to read and reply
            </div>
          )}
          {activePhone&&(
            <>
              <div className="msg-hdr">
                <div className="lav" style={{width:30,height:30,fontSize:"0.72rem"}}>{activePhone.slice(-4)}</div>
                <div>
                  <div style={{fontWeight:600}}>{activePhone}</div>
                  {activeThread&&activeThread.lead_id&&<div style={{fontSize:"0.7rem",color:"#8A8470"}}>Lead linked</div>}
                </div>
              </div>
              <div className="msg-body" ref={bodyRef}>
                {loadingMsgs&&<div style={{textAlign:"center",color:"#8A8470",fontSize:"0.82rem",padding:"20px 0"}}><span className="spin">◌</span> Loading thread…</div>}
                {!loadingMsgs&&messages.length===0&&<div style={{textAlign:"center",color:"#8A8470",fontSize:"0.82rem",padding:"20px 0"}}>No messages in this thread.</div>}
                {messages.map((m,i)=>(
                  <div key={m.id||i} style={{display:"flex",flexDirection:"column",alignItems:m.direction==="outbound"?"flex-end":"flex-start"}}>
                    <div className={"bubble "+(m.direction==="inbound"?"in":"out")}>{m.body}</div>
                    <div className="bubble-time" style={{textAlign:m.direction==="outbound"?"right":"left"}}>{fmt(m.created_at)}</div>
                  </div>
                ))}
              </div>
              <div className="msg-reply">
                <textarea
                  placeholder="Type a reply… (Enter to send)"
                  value={replyText}
                  onChange={e=>setReplyText(e.target.value)}
                  onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendReply()}}}
                  disabled={sending}
                />
                <button className="btn btn-g" style={{alignSelf:"flex-end",padding:"9px 16px",fontSize:"0.82rem"}} onClick={sendReply} disabled={sending||!replyText.trim()}>
                  {sending?<span className="spin">◌</span>:"Send →"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── BROADCAST ────────────────────────────────────────────────────────────────
function BroadcastView({leads}){
  const EMPTY={name:"",message:"",segment:"all",send_now:true};
  const [form,setForm]=useState(EMPTY);
  const [broadcasts,setBroadcasts]=useState([]);
  const [sending,setSending]=useState(false);
  const [toast,setToast]=useState(null);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    async function load(){
      setLoading(true);
      const res=await fetch("/api/broadcast").catch(()=>null);
      if(res?.ok) setBroadcasts(await res.json());
      setLoading(false);
    }
    load();
  },[]);

  const charCount=form.message.length;
  const charClass=charCount>160?"over":charCount>130?"warn":"";

  async function submit(e){
    e.preventDefault();
    if(charCount>160){setToast({msg:"Message must be 160 chars or fewer.",type:"err"});return;}
    setSending(true);
    const res=await fetch("/api/broadcast",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(form),
    }).catch(()=>null);
    if(res?.ok){
      const data=await res.json();
      setBroadcasts(prev=>[data,...prev]);
      setForm(EMPTY);
      setToast({msg:"Broadcast "+(form.send_now?"sent":"scheduled")+"! "+(data.sent_count||0)+" messages dispatched.",type:"ok"});
    } else {
      const err=res?await res.json().catch(()=>({error:"Unknown error"})):{error:"Connection error"};
      setToast({msg:err.error||"Failed to send broadcast.",type:"err"});
    }
    setSending(false);
  }

  const SEGMENTS=[
    {value:"all",  label:"All Leads"},
    {value:"new",  label:"New"},
    {value:"hot",  label:"Hot"},
    {value:"warm", label:"Warm"},
    {value:"won",  label:"Won"},
    {value:"lost", label:"Lost"},
  ];

  function fmtDate(ts){
    if(!ts) return "—";
    return new Date(ts).toLocaleString([],{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"});
  }

  const recipientEstimate=form.segment==="all"?leads.length:leads.filter(l=>l.status===form.segment||l.stage===form.segment).length;

  return(
    <div className="z1">
      {toast&&<Toast msg={toast.msg} type={toast.type} onDone={()=>setToast(null)}/>}
      <div className="section-hd">📢 SMS Broadcast</div>
      <div className="two-col">
        <div>
          <div className="card">
            <div className="card-title">✉ Compose Broadcast</div>
            <form onSubmit={submit}>
              <div style={{display:"flex",flexDirection:"column",gap:14}}>
                <div className="field">
                  <label>Campaign Name</label>
                  <input required placeholder="e.g. Summer Promo 2025" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))}/>
                </div>
                <div className="field">
                  <label>Segment</label>
                  <select value={form.segment} onChange={e=>setForm(p=>({...p,segment:e.target.value}))}>
                    {SEGMENTS.map(s=><option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                  <div style={{fontSize:"0.72rem",color:"#8A8470",marginTop:4}}>
                    ~{recipientEstimate} recipient{recipientEstimate!==1?"s":""}
                  </div>
                </div>
                <div className="field">
                  <label>Message</label>
                  <textarea
                    required
                    placeholder="Hi {name}, we have a special offer for you…"
                    style={{minHeight:96}}
                    value={form.message}
                    onChange={e=>setForm(p=>({...p,message:e.target.value}))}
                  />
                  <div className={"char-count "+charClass}>{charCount}/160{charCount>160&&" — too long!"}</div>
                </div>
                <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontSize:"0.84rem"}}>
                  <input type="checkbox" checked={form.send_now} onChange={e=>setForm(p=>({...p,send_now:e.target.checked}))} style={{accentColor:"#F0B429",width:16,height:16}}/>
                  Send immediately
                </label>
                <button type="submit" className="btn btn-g" disabled={sending||charCount>160}>
                  {sending?<><span className="spin">◌</span> Sending…</>:"📢 "+(form.send_now?"Send Now":"Schedule")}
                </button>
              </div>
            </form>
          </div>
        </div>
        <div>
          <div className="card" style={{padding:"16px 0"}}>
            <div className="card-title" style={{padding:"0 18px",marginBottom:12}}>📊 Broadcast History</div>
            {loading&&<div style={{padding:"20px",textAlign:"center",color:"#8A8470",fontSize:"0.82rem"}}><span className="spin">◌</span> Loading…</div>}
            {!loading&&broadcasts.length===0&&(
              <div style={{padding:"32px 20px",textAlign:"center",display:"flex",flexDirection:"column",gap:8,alignItems:"center"}}>
                <div style={{fontSize:"1.8rem"}}>📊</div>
                <div style={{fontWeight:600,color:"#F0EAD6",fontSize:"0.86rem"}}>No broadcasts yet</div>
                <div style={{fontSize:"0.78rem",color:"#8A8470",lineHeight:1.6,maxWidth:220}}>Send your first campaign using the composer on the left — history and delivery stats will appear here.</div>
              </div>
            )}
            {!loading&&broadcasts.length>0&&(
              <div style={{overflowX:"auto"}}>
                <table className="bc-hist">
                  <thead>
                    <tr>
                      <th>Campaign</th>
                      <th>Segment</th>
                      <th>Sent</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {broadcasts.map(b=>(
                      <tr key={b.id}>
                        <td style={{fontWeight:600}}>{b.name}</td>
                        <td style={{color:"#8A8470",textTransform:"capitalize"}}>{b.segment}</td>
                        <td>{b.sent_count||0}/{b.recipient_count||0}</td>
                        <td>
                          <span className={"badge "+(b.status==="sent"?"b-done":b.status==="sending"?"b-warm":"b-cold")}>
                            {b.status}
                          </span>
                        </td>
                        <td style={{color:"#8A8470",fontSize:"0.76rem"}}>{fmtDate(b.sent_at||b.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── REVIEWS ──────────────────────────────────────────────────────────────────
function ReviewsView({leads}){
  const [requests,setRequests]=useState([]);
  const [loading,setLoading]=useState(true);
  const [sending,setSending]=useState(null);
  const [toast,setToast]=useState(null);

  const wonLeads=leads.filter(l=>l.stage==="Won"||l.stage==="Review Requested"||l.status==="won");

  useEffect(()=>{
    async function load(){
      setLoading(true);
      const res=await fetch("/api/reviews").catch(()=>null);
      if(res?.ok) setRequests(await res.json());
      setLoading(false);
    }
    load();
  },[]);

  async function send(leadIds,label){
    setSending(label);
    const body=leadIds==="all"?{send_to_all_won:true}:{lead_ids:leadIds};
    const res=await fetch("/api/reviews",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(body),
    }).catch(()=>null);
    if(res?.ok){
      const data=await res.json();
      setToast({msg:"Sent "+data.sent+" review request"+(data.sent!==1?"s":"")+"!",type:"ok"});
      const r2=await fetch("/api/reviews").catch(()=>null);
      if(r2?.ok) setRequests(await r2.json());
    } else {
      const err=res?await res.json().catch(()=>({error:"Error"})):{error:"Connection error"};
      setToast({msg:err.error||"Failed to send.",type:"err"});
    }
    setSending(null);
  }

  function fmtDate(ts){
    if(!ts) return "—";
    return new Date(ts).toLocaleDateString([],{month:"short",day:"numeric",year:"numeric"});
  }

  function ini(n){return(n||"?").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()}

  const sentIds=new Set(requests.map(r=>r.lead_id));
  const pendingWon=wonLeads.filter(l=>!sentIds.has(l.id));

  return(
    <div className="z1">
      {toast&&<Toast msg={toast.msg} type={toast.type} onDone={()=>setToast(null)}/>}
      <div className="section-hd">⭐ Review Requests</div>
      <div className="stats mb20">
        {[
          {n:wonLeads.length,   l:"Won Clients",     c:"#5ABF8A"},
          {n:requests.length,   l:"Requests Sent",   c:"#F0B429"},
          {n:pendingWon.length, l:"Pending",          c:"#5A9FE0"},
        ].map((s,i)=>(
          <div key={i} className="stat" style={{"--c":s.c}}>
            <div className="stat-n">{s.n}</div>
            <div className="stat-l">{s.l}</div>
          </div>
        ))}
        <div className="stat" style={{"--c":"#F0B429"}}>
          <button className="btn btn-g" style={{width:"100%",fontSize:"0.8rem"}} disabled={!!sending||pendingWon.length===0} onClick={()=>send("all","all")}>
            {sending==="all"?<><span className="spin">◌</span> Sending…</>:"⭐ Send to All Won ("+pendingWon.length+")"}
          </button>
          <div className="stat-l" style={{marginTop:8}}>Not yet requested</div>
        </div>
      </div>
      <div className="two-col">
        <div className="card" style={{padding:"16px 0"}}>
          <div className="card-title" style={{padding:"0 18px"}}>🏆 Won Clients</div>
          {wonLeads.length===0&&(
            <div style={{padding:"32px 20px",textAlign:"center",display:"flex",flexDirection:"column",gap:8,alignItems:"center"}}>
              <div style={{fontSize:"1.8rem"}}>🏆</div>
              <div style={{fontWeight:600,color:"#F0EAD6",fontSize:"0.86rem"}}>No won clients yet</div>
              <div style={{fontSize:"0.78rem",color:"#8A8470",lineHeight:1.6,maxWidth:220}}>Move a lead to <strong style={{color:"#5ABF8A"}}>Won</strong> in the Sales Pipeline tab and they'll appear here, ready for a review request.</div>
            </div>
          )}
          {wonLeads.map(l=>{
            const alreadySent=sentIds.has(l.id);
            return(
              <div key={l.id} className="rv-row" style={{padding:"12px 18px"}}>
                <div className="lav">{ini(l.name)}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:"0.85rem",fontWeight:600}}>{l.name}</div>
                  <div style={{fontSize:"0.74rem",color:"#8A8470"}}>{l.phone||"No phone"} · {l.service}</div>
                </div>
                {alreadySent?(
                  <span className="badge b-done">✓ Sent</span>
                ):(
                  <button
                    className="btn btn-o btn-s"
                    style={{fontSize:"0.74rem",whiteSpace:"nowrap"}}
                    disabled={!!sending}
                    onClick={()=>send([l.id],l.id)}
                  >
                    {sending===l.id?<span className="spin">◌</span>:"⭐ Request"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
        <div className="card" style={{padding:"16px 0"}}>
          <div className="card-title" style={{padding:"0 18px"}}>📬 Sent Requests</div>
          {loading&&<div style={{padding:"20px",textAlign:"center",color:"#8A8470",fontSize:"0.82rem"}}><span className="spin">◌</span> Loading…</div>}
          {!loading&&requests.length===0&&(
            <div style={{padding:"32px 20px",textAlign:"center",display:"flex",flexDirection:"column",gap:8,alignItems:"center"}}>
              <div style={{fontSize:"1.8rem"}}>📬</div>
              <div style={{fontWeight:600,color:"#F0EAD6",fontSize:"0.86rem"}}>No requests sent yet</div>
              <div style={{fontSize:"0.78rem",color:"#8A8470",lineHeight:1.6,maxWidth:220}}>Once you send a review request, it'll appear here with a timestamp and the lead's info.</div>
            </div>
          )}
          {requests.map(r=>(
            <div key={r.id} className="rv-row" style={{padding:"12px 18px"}}>
              <div className="lav" style={{width:30,height:30,fontSize:"0.7rem"}}>{ini(r.leads?.name||r.phone||"?")}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:"0.84rem",fontWeight:600}}>{r.leads?.name||r.phone}</div>
                <div style={{fontSize:"0.74rem",color:"#8A8470"}}>{r.phone} · {r.leads?.service||""}</div>
              </div>
              <div style={{textAlign:"right",fontSize:"0.74rem",color:"#8A8470",flexShrink:0}}>
                <span className="badge b-done">Sent</span>
                <div style={{marginTop:4}}>{fmtDate(r.sent_at||r.created_at)}</div>
              </div>
            </div>
          ))}
        </div>
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
  const [showOnboarding,setShowOnboarding]=useState(null);
  const tenant=process.env.NEXT_PUBLIC_BUSINESS_NAME||"FlowDesk";

  useEffect(()=>{
    async function checkOnboarding(){
      const res=await fetch("/api/settings").catch(()=>null);
      if(res?.ok){
        const data=await res.json();
        if(data && data.business_name && data.business_name.trim()){
          setShowOnboarding(false);
        } else {
          setShowOnboarding(true);
        }
      } else {
        setShowOnboarding(false);
      }
    }
    checkOnboarding();
  },[]);

  useEffect(()=>{
    if(showOnboarding===false){
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
    }
  },[showOnboarding]);

  const NAV_SECTIONS=[
    {label:"Core",items:[
      {id:"dash",      label:"Dashboard",   icon:"◈"},
      {id:"leads",     label:"Lead Capture",icon:"📋"},
      {id:"fu",        label:"Follow-Up",   icon:"⚡"},
      {id:"sched",     label:"Schedule",    icon:"📅"},
    ]},
    {label:"Communicate",items:[
      {id:"inbox",     label:"Inbox",       icon:"💬"},
      {id:"broadcast", label:"Broadcast",   icon:"📢"},
      {id:"reviews",   label:"Reviews",     icon:"⭐"},
    ]},
    {label:"System",items:[
      {id:"settings",  label:"Settings",    icon:"⚙"},
    ]},
  ];

  const PAGE_META={
    dash:      {title:"Dashboard",    sub:"Your business at a glance"},
    leads:     {title:"Lead Capture", sub:"Capture and manage incoming service requests"},
    fu:        {title:"Follow-Up",    sub:"Automated SMS and email sequences"},
    inbox:     {title:"SMS Inbox",    sub:"Read and reply to customer messages"},
    broadcast: {title:"Broadcast",    sub:"Send SMS campaigns to your lead list"},
    reviews:   {title:"Reviews",      sub:"Request Google reviews from won clients"},
    sched:     {title:"Schedule",     sub:"Appointments and calendar"},
    settings:  {title:"Settings",     sub:"Business configuration"},
  };

  const meta = PAGE_META[tab] || PAGE_META.dash;
  const newLeadsCount = leads.filter(l=>l.status==="new"||l.stage==="new").length;
  const bizName = tenant?.business_name || "My Business";

  return(
    <>
      <style>{CSS}</style>
      {showOnboarding===null&&(
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh",background:T.bg,flexDirection:"column",gap:14}}>
          <div style={{width:34,height:34,background:T.primary,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:16}}>FD</div>
          <div style={{fontSize:13,color:T.muted}}>Loading…</div>
        </div>
      )}
      {showOnboarding===true&&(
        <OnboardingWizard onComplete={()=>setShowOnboarding(false)} setActiveTab={setTab}/>
      )}
      {showOnboarding===false&&(
        <>
          {aiLead&&<AiModal lead={aiLead} onClose={()=>setAiLead(null)}/>}
          <div className="app">

            {/* ── SIDEBAR ── */}
            <div className="sidebar">
              <div className="sb-logo">
                <div className="sb-logo-icon">FD</div>
                <div>
                  <div className="sb-logo-name">FlowDesk</div>
                  <div className="sb-logo-tag">Lead Engine</div>
                </div>
              </div>
              <div className="sb-nav">
                {NAV_SECTIONS.map(section=>(
                  <div key={section.label}>
                    <div className="sb-section">{section.label}</div>
                    {section.items.map(t=>(
                      <button key={t.id} className={"nav-btn"+(tab===t.id?" on":"")} onClick={()=>setTab(t.id)}>
                        <span className="nav-icon">{t.icon}</span>
                        {t.label}
                        {t.id==="leads"&&newLeadsCount>0&&<span className="nav-badge">{newLeadsCount}</span>}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
              <div className="sb-footer">
                <div className="biz-card">
                  <div className="biz-name"><span className="biz-dot"/>  {bizName}</div>
                  <div className="biz-sub">{leads.length} leads · Active</div>
                </div>
                <div style={{display:"flex",gap:6,marginTop:8}}>
                  <a href="/outreach" className="btn btn-o btn-s" style={{textDecoration:"none",flex:1,justifyContent:"center"}}>Outreach</a>
                  <button className="btn btn-o btn-s" style={{flex:1}} onClick={async()=>{await fetch("/api/auth/logout");window.location.href="/login";}}>Logout</button>
                </div>
              </div>
            </div>

            {/* ── MAIN ── */}
            <div className="app-main">
              <div className="topbar">
                <div className="topbar-left">
                  <h1>{meta.title}</h1>
                  <p>{meta.sub}</p>
                </div>
                <div className="topbar-right">
                  {tab==="leads"&&<button className="btn btn-g btn-s" onClick={()=>document.dispatchEvent(new CustomEvent("fd:open-lead-modal"))}>+ Capture Lead</button>}
                  {tab==="sched"&&<button className="btn btn-g btn-s" onClick={()=>document.dispatchEvent(new CustomEvent("fd:open-appt-modal"))}>+ Book Appointment</button>}
                </div>
              </div>
              <div className="main">
                {loadingData?(
                  <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:300,gap:10,color:T.muted}}>
                    <span className="spin" style={{fontSize:"1.2rem"}}>◌</span> Loading…
                  </div>
                ):(
                  <>
                    {tab==="dash"      &&<Dashboard leads={leads} appts={appts} onTab={setTab}/>}
                    {tab==="leads"     &&<LeadsView leads={leads} setLeads={setLeads} setAiLead={setAiLead}/>}
                    {tab==="fu"        &&<FollowUpView leads={leads}/>}
                    {tab==="inbox"     &&<ConversationsView/>}
                    {tab==="broadcast" &&<BroadcastView leads={leads}/>}
                    {tab==="reviews"   &&<ReviewsView leads={leads}/>}
                    {tab==="sched"     &&<ScheduleView leads={leads} appts={appts} setAppts={setAppts}/>}
                    {tab==="settings"  &&<SettingsView tenant={tenant}/>}
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
