const fs = require('node:fs');
const path = 'index.html';
const raw = fs.readFileSync(path, 'utf8');

// The main script is untouched; only the shell markup and styles are replaced.
const scriptAt = raw.indexOf('<script>');
const script = raw.slice(scriptAt);

// Reuse the 46 sample tabs verbatim: they are data, and the script reads them.
const groupsStart = raw.indexOf('<div class="sample-groups" id="sampleGroups">');
const groupsEnd = raw.indexOf('<label class="mobile-samples"');
const groups = raw.slice(groupsStart, groupsEnd);

const out = `<!doctype html>
<html lang="zh-CN">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="dark"><title>UI-Craft · UI/UX 设计评审台</title>
<style>
/* ── Tokens ──────────────────────────────────────────────────────────────
   A dark gallery surround: the reviewed work is the only bright thing on
   screen. Every surface here recedes so the iframe reads as the subject. */
:root{
  --void:#06070a;--base:#0a0c11;--raise:#0f1219;--raise-2:#141922;
  --line:#1b2130;--line-2:#242c3d;
  --ink:#eef2fa;--ink-2:#aab6c9;--ink-3:#6d7a90;
  --lime:#c8f24e;--cyan:#5ee0ff;--violet:#a78bfa;--amber:#ffc46b;--rose:#ff7a6b;
  --lime-dim:#1d2a12;--cyan-dim:#0d2833;
  --radius:14px;
  --font:"Inter","Segoe UI","PingFang SC","Microsoft YaHei",sans-serif;
  --mono:"IBM Plex Mono","SFMono-Regular",Consolas,monospace;
  font-family:var(--font);color:var(--ink);color-scheme:dark;
  font-synthesis:none;-webkit-font-smoothing:antialiased;
}
*{box-sizing:border-box}
html,body{margin:0;min-height:100%}
body{background:var(--void);font-size:13px;line-height:1.55;overflow-x:hidden}
/* Two soft light sources keep a near-black page from reading as flat grey. */
body::before{content:"";position:fixed;inset:-20% -10% auto;height:70vh;pointer-events:none;z-index:0;
  background:
    radial-gradient(60% 100% at 18% 0%,#25405f4d 0,transparent 62%),
    radial-gradient(50% 100% at 86% 6%,#3c2a6b44 0,transparent 60%)}
body::after{content:"";position:fixed;inset:0;pointer-events:none;z-index:0;opacity:.5;
  background-image:linear-gradient(#ffffff06 1px,transparent 1px),linear-gradient(90deg,#ffffff06 1px,transparent 1px);
  background-size:72px 72px;
  mask-image:radial-gradient(ellipse 90% 60% at 50% 0%,#000 10%,transparent 74%)}
h1,h2,h3,p,dl,dd{margin:0}
button,input,select,textarea{font:inherit;color:inherit}
button{cursor:pointer;border:0;background:none;transition:background .15s,color .15s,border-color .15s,transform .1s}
button:disabled{cursor:default}
a{color:var(--cyan)}
button:focus-visible,a:focus-visible,input:focus-visible,select:focus-visible,textarea:focus-visible{outline:2px solid var(--lime);outline-offset:2px}
.sr-only,.sr{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;border:0}

/* ── Top bar ─────────────────────────────────────────────────────────── */
.top{position:sticky;top:0;z-index:50;display:flex;align-items:center;justify-content:space-between;gap:18px;
  padding:0 clamp(14px,2vw,30px);height:62px;
  background:#070a0fd9;backdrop-filter:blur(16px) saturate(140%);
  border-bottom:1px solid var(--line)}
.top::after{content:"";position:absolute;left:0;right:0;bottom:-1px;height:1px;
  background:linear-gradient(90deg,transparent,#c8f24e4d 18%,#5ee0ff4d 52%,#a78bfa40 82%,transparent)}
.identity{display:flex;align-items:center;gap:13px;min-width:0}
.monogram{width:34px;height:34px;border-radius:10px;display:grid;place-items:center;flex:none;
  background:linear-gradient(150deg,#c8f24e,#5ee0ff 55%,#a78bfa);color:#06070a;
  font-weight:800;font-size:14px;letter-spacing:-.5px;
  box-shadow:0 0 0 1px #ffffff26,0 6px 20px #5ee0ff33}
.wordmark{font-size:15px;letter-spacing:.22em;font-weight:750;white-space:nowrap}
.identity small{color:var(--ink-3);font-size:9.5px;letter-spacing:.2em;padding-left:12px;margin-left:2px;
  border-left:1px solid var(--line-2);white-space:nowrap;font-weight:600}
.status{display:flex;align-items:center;gap:7px;font-size:10.5px;letter-spacing:.12em;color:var(--ink-3);
  padding:5px 11px;border:1px solid var(--line-2);border-radius:99px;background:#0d1118;white-space:nowrap;font-weight:600}
.dot{width:5px;height:5px;border-radius:50%;background:var(--lime);box-shadow:0 0 0 3px #c8f24e29,0 0 10px var(--lime);animation:breathe 2.8s ease-in-out infinite}
@keyframes breathe{0%,100%{opacity:1}50%{opacity:.4}}
.topacts{display:flex;align-items:center;gap:7px;flex:none}
.tbtn{display:inline-flex;align-items:center;gap:6px;height:31px;padding:0 11px;border-radius:7px;
  border:1px solid var(--line-2);color:var(--ink-2);font-size:11.5px;font-weight:600;white-space:nowrap}
.tbtn:hover{color:var(--ink);border-color:#3b475d;background:#141922}
.tbtn svg{width:13px;height:13px;flex:none}
.tbtn.accent{border-color:#c8f24e4d;color:#dcff92;background:#c8f24e14}
.tbtn.accent:hover{background:#c8f24e24;border-color:#c8f24e80}

/* overflow menu consolidates import/export so the bar carries one action */
.menu-wrap{position:relative}
.menu{position:absolute;right:0;top:calc(100% + 7px);z-index:60;min-width:196px;padding:5px;
  background:#111621f2;backdrop-filter:blur(18px);border:1px solid var(--line-2);border-radius:10px;
  box-shadow:0 20px 44px #00000080;display:grid;gap:2px}
.menu[hidden]{display:none}
.menu button{display:flex;align-items:center;gap:9px;width:100%;padding:8px 10px;border-radius:6px;
  color:var(--ink-2);font-size:12px;text-align:left;font-weight:500}
.menu button:hover{background:#1c2331;color:var(--ink)}
.menu button svg{width:13px;height:13px;flex:none;opacity:.7}
.menu .sep{height:1px;background:var(--line);margin:4px 2px}

/* ── Shell ───────────────────────────────────────────────────────────── */
.shell{position:relative;z-index:1;display:grid;grid-template-columns:232px minmax(0,1fr);min-height:calc(100vh - 62px)}
@media(min-width:1700px){.shell{grid-template-columns:262px minmax(0,1fr)}}

/* ── Sidebar index ───────────────────────────────────────────────────── */
.sidebar{border-right:1px solid var(--line);background:#080b11cc;backdrop-filter:blur(8px);
  padding:16px 12px 12px;display:grid;grid-template-rows:auto auto minmax(0,1fr) auto auto;min-height:0}
.section-label{display:block;font-size:9px;letter-spacing:.22em;color:var(--ink-3);font-weight:700;margin:0 4px 8px}
.nav-search{display:flex;gap:4px;margin-bottom:6px}
.nav-search input{flex:1;min-width:0;height:30px;padding:0 9px;border-radius:7px;
  border:1px solid var(--line-2);background:#0e131c;color:var(--ink);font-size:11.5px}
.nav-search input::placeholder{color:#59667a}
.nav-search input:focus{border-color:#c8f24e66;outline:none;box-shadow:0 0 0 3px #c8f24e1a}
.nav-search button{width:30px;height:30px;border-radius:7px;border:1px solid var(--line-2);color:var(--ink-3);flex:none;font-size:13px}
.nav-search button:hover{color:var(--ink)}
.nav-result{font-size:10.5px;line-height:1.5;color:var(--ink-3);margin:0 4px 4px;min-height:0}
.sample-groups{overflow:auto;scrollbar-width:thin;scrollbar-color:#232c3d transparent;margin:0 -4px;padding:0 4px}
.sample-groups::-webkit-scrollbar{width:5px}
.sample-groups::-webkit-scrollbar-thumb{background:#232c3d;border-radius:3px}
.sample-group{margin-bottom:11px}
.sample-group h2{margin:0 3px 3px;font-size:9px;letter-spacing:.2em;color:#5b6779;font-weight:700;
  display:flex;align-items:center;gap:6px}
.sample-group h2::after{content:"";flex:1;height:1px;background:linear-gradient(90deg,#1e2634,transparent)}
.sample-group[hidden],.page-tab[hidden]{display:none}
.page-tab{position:relative;display:flex;align-items:center;gap:8px;width:100%;padding:6px 8px 6px 10px;
  border-radius:7px;text-align:left;color:var(--ink-2);margin-bottom:1px}
.page-tab:hover{background:#131926;color:var(--ink)}
.page-tab .num{font-family:var(--mono);font-size:9px;color:#4e5a6d;width:16px;flex:none;text-align:right;letter-spacing:.02em}
.page-tab>span:not(.num){min-width:0;flex:1;display:block}
.page-tab strong{display:block;font-size:11.5px;font-weight:600;letter-spacing:.01em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.page-tab strong+span{display:block;font-size:9.5px;color:#5d6a7d;margin-top:1px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.page-tab .count{font-family:var(--mono);font-size:9px;color:#2c3546;min-width:14px;text-align:center;flex:none}
.page-tab[aria-pressed=true]{background:linear-gradient(90deg,#c8f24e1f,#141922 62%);color:var(--ink)}
.page-tab[aria-pressed=true]::before{content:"";position:absolute;left:0;top:5px;bottom:5px;width:2px;
  border-radius:1px;background:var(--lime);box-shadow:0 0 10px var(--lime)}
.page-tab[aria-pressed=true] .num{color:var(--lime)}
.page-tab[aria-pressed=true] strong{font-weight:700}
.page-tab[aria-pressed=true] strong+span{color:#8d9bb0}
.page-tab[aria-pressed=true] .count{color:var(--lime)}
.mobile-samples{display:none}
@media(max-width:700px){
  .mobile-samples{display:flex;align-items:center;gap:9px;color:var(--ink-2);font-size:11px;font-weight:600;margin-top:8px}
  .mobile-samples select{flex:1;min-width:0;height:38px;background:#0e131c;border:1px solid var(--line-2);border-radius:8px;padding:0 8px;color:var(--ink);font:inherit}
}
.sidebar-foot{margin-top:9px;padding-top:9px;border-top:1px solid var(--line);font-size:9.5px;line-height:1.7;color:#4a5668;letter-spacing:.04em}

/* ── Main column ─────────────────────────────────────────────────────── */
.main{padding:clamp(16px,2.4vw,30px) clamp(14px,2.4vw,36px) 30px;display:grid;gap:clamp(12px,1.6vw,20px);
  align-content:start;min-width:0}
.intro{display:flex;align-items:flex-end;justify-content:space-between;gap:22px;flex-wrap:wrap}
.eyebrow{font-size:9.5px;letter-spacing:.28em;color:var(--lime);font-weight:700;margin-bottom:9px}
.intro h1{font-size:clamp(24px,2.9vw,38px);line-height:1.06;letter-spacing:-.035em;font-weight:750;
  background:linear-gradient(100deg,#f4f8ff 12%,#c9d6ea 46%,#8fa3bd 96%);-webkit-background-clip:text;background-clip:text;color:transparent}
.intro p{margin-top:10px;color:var(--ink-2);font-size:12px;line-height:1.7;max-width:64ch}
.intro p a{color:#a8f0ff;text-decoration:none;border-bottom:1px solid #5ee0ff4d}
.intro p a:hover{border-bottom-color:var(--cyan)}
.intro-actions{display:flex;gap:7px;flex-wrap:wrap}
.intro-actions button{height:31px;padding:0 12px;border-radius:7px;border:1px solid var(--line-2);
  color:var(--ink-2);font-size:11.5px;font-weight:600}
.intro-actions button:hover{color:var(--ink);border-color:#3b475d;background:#141922}
.intro-actions .primary{background:linear-gradient(100deg,#d3ff66,#9be63f);border-color:#c8f24e;color:#0a1004;font-weight:700}
.intro-actions .primary:hover{filter:brightness(1.07)}

/* ── Canvas: the reviewed work is framed like a gallery piece ────────── */
.workspace{display:grid;grid-template-columns:minmax(0,1fr) 316px;gap:clamp(12px,1.6vw,20px);align-items:start;min-width:0}
@media(min-width:1700px){.workspace{grid-template-columns:minmax(0,1fr) 344px}}
.canvas-column{min-width:0;display:grid;gap:10px}
.toolbar{display:flex;align-items:center;gap:8px;flex-wrap:wrap;
  padding:7px 9px;border:1px solid var(--line);border-radius:11px;
  background:#0c1118d9;backdrop-filter:blur(10px)}
.mode-switch{display:flex;gap:2px;padding:2px;border-radius:8px;background:#141a24;border:1px solid var(--line)}
.mode-switch button{height:26px;padding:0 12px;border-radius:6px;font-size:11px;font-weight:650;color:var(--ink-3)}
.mode-switch button:hover{color:var(--ink-2)}
.mode-switch button[aria-pressed=true]{background:linear-gradient(#e8fbbe,#c8f24e);color:#0a1004;font-weight:700}
.toolbar select{height:30px;padding:0 8px;border-radius:7px;border:1px solid var(--line-2);
  background:#0e131c;color:var(--ink-2);font-size:11.5px;min-width:0}
#zoomBtn{height:30px;padding:0 10px;border-radius:7px;border:1px solid var(--line-2);color:var(--ink-3);font-size:11px}
#zoomBtn[aria-pressed=true]{background:#1c2430;color:var(--lime);border-color:#c8f24e59}
#zoomBtn:disabled{opacity:.35}
.scale-label{font-family:var(--mono);font-size:10.5px;color:var(--ink-3);min-width:34px;letter-spacing:.02em}
.external{margin-left:auto;display:inline-flex;align-items:center;gap:5px;height:30px;padding:0 11px;border-radius:7px;
  border:1px solid var(--line-2);color:var(--ink-2);font-size:11px;font-weight:600;text-decoration:none;white-space:nowrap}
.external:hover{color:var(--ink);border-color:#3b475d;background:#141922}
.canvas{position:relative;border-radius:inherit;min-height:340px;
  padding:clamp(7px,1vw,14px);
  background:
    radial-gradient(120% 90% at 50% -18%,#1b2637 0,transparent 62%),
    linear-gradient(#0b0f16,#080b11);
  border:1px solid var(--line);border-radius:var(--radius);
  box-shadow:inset 0 1px #ffffff0a,0 24px 60px #00000059}
.canvas::before{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;
  background:radial-gradient(80% 54% at 50% 0%,#c8f24e0f,transparent 64%)}
.canvas .frame-wrap{margin-inline:auto;overflow:hidden;border-radius:9px;display:block;
  box-shadow:0 0 0 1px #ffffff17,0 18px 50px #000000a6}
.canvas iframe{display:block;border:0;background:#fff;border-radius:9px}
.frame-wrap iframe.theme-aware{color-scheme:light dark}
.canvas-caption{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;
  font-size:10.5px;color:var(--ink-3);font-family:var(--mono);letter-spacing:.02em;padding:0 3px}
.canvas-caption span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.hint{padding:9px 12px;border-left:2px solid #c8f24e4d;border-radius:0 8px 8px 0;
  background:#0d121a;color:var(--ink-3);font-size:11px;line-height:1.65}

/* ── Right rail: one surface, three sections ─────────────────────────── */
.rail{display:grid;gap:10px;align-content:start;min-width:0}
.rail .panel{background:#0b1017cc;border:1px solid var(--line);border-radius:12px;padding:12px 13px;
  backdrop-filter:blur(8px)}
.panel-heading{display:flex;align-items:center;justify-content:space-between;gap:9px;margin-bottom:9px}
.panel-heading h2{font-size:9.5px;letter-spacing:.2em;color:var(--ink-3);font-weight:700;
  display:flex;align-items:center;gap:6px}
.panel-heading h2::before{content:"";width:2px;height:.9em;border-radius:1px;background:var(--lime)}
.panel-heading small{font-size:9.5px;color:#4e5a6d}
.panel-heading .tag{font-size:9px;letter-spacing:.14em;color:var(--cyan);border:1px solid #5ee0ff40;
  padding:2px 6px;border-radius:4px;text-transform:uppercase;font-weight:700}
#briefTitle{font-size:12.5px;letter-spacing:-.01em;color:var(--ink);font-weight:700;letter-spacing:.02em}
.brief{font-size:11.5px;line-height:1.72;color:var(--ink-2)}
#pairedPage{margin-top:10px;width:100%;height:30px;padding:0 10px;border-radius:7px;
  border:1px solid var(--line-2);color:var(--cyan);font-size:11px;font-weight:650;text-align:left}
#pairedPage:hover{background:#0d2833;border-color:#5ee0ff59}
.palette{display:flex;gap:5px;margin-top:11px;flex-wrap:wrap}
.swatch{width:26px;height:26px;border-radius:6px;box-shadow:inset 0 0 0 1px #ffffff26;flex:none}
.token-labels{display:flex;flex-wrap:wrap;gap:4px 9px;margin-top:8px;font-family:var(--mono);font-size:9px;color:#4e5a6d}
#pageNote{height:24px;padding:0 8px;border-radius:6px;border:1px solid var(--line-2);
  color:var(--ink-3);font-size:10px;font-weight:650}
#pageNote:hover{color:var(--lime);border-color:#c8f24e59}
.review-toolbar{display:flex;gap:2px;padding:2px;background:#141a24;border:1px solid var(--line);
  border-radius:7px;margin-bottom:9px}
.review-toolbar button{flex:1;height:24px;border-radius:5px;font-size:10.5px;font-weight:650;color:var(--ink-3)}
.review-toolbar button[aria-pressed=true]{background:#1f2733;color:var(--ink)}
.annotations{display:grid;gap:7px;max-height:min(46vh,420px);overflow:auto;scrollbar-width:thin;
  scrollbar-color:#232c3d transparent;padding-right:2px}
.annotations::-webkit-scrollbar{width:5px}
.annotations::-webkit-scrollbar-thumb{background:#232c3d;border-radius:3px}
.annotation{border:1px solid var(--line);border-left:2px solid #5ee0ff66;border-radius:8px;
  padding:8px 10px;background:#0e131b;font-size:11px;line-height:1.55;color:var(--ink-2)}
.annotation.done{border-left-color:#2f7a49;opacity:.62}
.annotation-head{display:flex;align-items:center;gap:7px;margin-bottom:4px}
.annotation-head b{font-family:var(--mono);font-size:9.5px;color:var(--lime);flex:none}
.annotation-head span{font-size:9.5px;color:var(--ink-3);letter-spacing:.04em}
.annotation-head .severity{margin-left:auto;font-size:9px;font-weight:700;letter-spacing:.06em;
  padding:1px 5px;border-radius:3px;background:#1a2130;color:var(--ink-3)}
.annotation p{color:var(--ink)}
.annotation-actions{display:flex;gap:6px;margin-top:6px}
.annotation-actions button{font-size:9.5px;color:var(--ink-3);font-weight:650;padding:2px 0}
.annotation-actions button:hover{color:var(--lime)}
.annotation .anchor,.annotation .target-info{font-family:var(--mono);font-size:9px;color:#4e5a6d;
  display:block;margin-top:4px;overflow-wrap:anywhere}
.appearance-meta{font-size:9.5px;color:#4e5a6d;line-height:1.5;margin-top:3px}
.empty{display:grid;justify-items:center;gap:7px;padding:18px 10px;text-align:center;
  color:var(--ink-3);font-size:11px;line-height:1.6}
.empty-icon{width:34px;height:34px;border-radius:10px;display:grid;place-items:center;
  border:1px dashed #2c3546;color:#4e5a6d;font-size:16px}
.score-row{display:grid;grid-template-columns:1fr 88px;gap:9px;align-items:center;margin-bottom:7px;font-size:10.5px}
.score-row label{color:var(--ink-2)}
.score-row input[type=range]{-webkit-appearance:none;appearance:none;width:100%;height:3px;border-radius:99px;
  background:linear-gradient(90deg,#c8f24e,#5ee0ff);outline:none}
.score-row input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:12px;height:12px;border-radius:50%;
  background:#0a0c11;border:2px solid var(--lime);cursor:pointer;box-shadow:0 0 8px #c8f24e80}
.score-row input[type=range]::-moz-range-thumb{width:12px;height:12px;border-radius:50%;background:#0a0c11;
  border:2px solid var(--lime);cursor:pointer}
.score-total{display:flex;align-items:baseline;justify-content:space-between;gap:10px;margin-top:10px;
  padding-top:9px;border-top:1px solid var(--line)}
.score-total span{font-size:9.5px;color:#4e5a6d}
.score-total strong{font-family:var(--mono);font-size:17px;font-weight:700;
  background:linear-gradient(100deg,#dcff92,#5ee0ff);-webkit-background-clip:text;background-clip:text;color:transparent}

/* ── Footer ──────────────────────────────────────────────────────────── */
.bottom{display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap;
  padding:11px 2px 0;border-top:1px solid var(--line);font-size:10px;color:#4a5668;letter-spacing:.04em}
.bottom span:last-child{font-family:var(--mono);letter-spacing:.16em}

/* ── Dialogs ─────────────────────────────────────────────────────────── */
dialog{border:0;padding:0;background:transparent;max-width:min(620px,94vw);width:100%;color:var(--ink)}
dialog::backdrop{background:#04060ad9;backdrop-filter:blur(6px)}
dialog[open]{animation:pop .16s ease-out}
@keyframes pop{from{opacity:0;transform:translateY(6px) scale(.99)}to{opacity:1;transform:none}}
.dialog-content{background:#0c1119;border:1px solid var(--line-2);border-radius:16px;
  padding:clamp(18px,3vw,30px);box-shadow:0 30px 70px #000000a6,inset 0 1px #ffffff0f}
.dialog-content h2{font-size:20px;letter-spacing:-.02em;font-weight:750;line-height:1.2}
.dialog-content h3{font-size:12px;letter-spacing:.06em;color:var(--lime);font-weight:700;margin-bottom:4px}
.dialog-content p{font-size:11.5px;line-height:1.7;color:var(--ink-2);margin-top:8px}
.dialog-content>label,.dialog-content .form-grid label{display:block;font-size:9.5px;letter-spacing:.12em;
  color:var(--ink-3);font-weight:700;margin:14px 0 5px}
.dialog-content select,.dialog-content textarea,.dialog-content input{width:100%;border-radius:8px;
  border:1px solid var(--line-2);background:#0a0e15;color:var(--ink);padding:8px 10px;font-size:12px}
.dialog-content textarea{min-height:96px;resize:vertical;line-height:1.65}
.dialog-content select:focus,.dialog-content textarea:focus{outline:none;border-color:#c8f24e66;
  box-shadow:0 0 0 3px #c8f24e1a}
.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:0 12px}
@media(max-width:560px){.form-grid{grid-template-columns:1fr}}
.target-info{font-family:var(--mono);font-size:10.5px;color:var(--cyan);background:#0d2833;
  border:1px solid #5ee0ff33;border-radius:7px;padding:7px 10px;margin-top:12px;overflow-wrap:anywhere}
.dialog-foot{display:flex;justify-content:flex-end;gap:8px;margin-top:20px;padding-top:14px;border-top:1px solid var(--line)}
.dialog-foot button{height:34px;padding:0 16px;border-radius:8px;border:1px solid var(--line-2);
  color:var(--ink-2);font-size:11.5px;font-weight:650}
.dialog-foot button:hover{color:var(--ink);background:#141922}
.dialog-foot .primary{background:linear-gradient(100deg,#d3ff66,#9be63f);border-color:#c8f24e;
  color:#0a1004;font-weight:750}
.guide-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px 18px;margin:16px 0}
@media(max-width:560px){.guide-grid{grid-template-columns:1fr}}
.guide-grid section{padding-left:10px;border-left:1px solid #c8f24e3d}
.source-links{display:flex;flex-wrap:wrap;gap:6px;margin:12px 0}
.source-links a{font-size:10.5px;color:var(--cyan);text-decoration:none;padding:4px 9px;border-radius:5px;
  border:1px solid #5ee0ff33;background:#0d2833}
.source-links a:hover{border-color:#5ee0ff80}

/* ── Toast ───────────────────────────────────────────────────────────── */
.toast{position:fixed;left:50%;bottom:24px;transform:translate(-50%,10px);z-index:90;
  padding:9px 15px;border-radius:9px;background:#121826f2;border:1px solid var(--line-2);
  color:var(--ink);font-size:11.5px;box-shadow:0 18px 44px #00000099;backdrop-filter:blur(12px);
  opacity:0;transition:opacity .18s,transform .18s;pointer-events:none;max-width:80vw}
.toast[hidden]{display:none}
.toast:not([hidden]){opacity:1;transform:translate(-50%,0)}

/* ── Responsive ──────────────────────────────────────────────────────── */
@media(max-width:1180px){
  .workspace{grid-template-columns:minmax(0,1fr)}
  .rail{grid-template-columns:1fr 1fr;grid-auto-flow:row}
  .rail .panel:first-child{grid-column:1/-1}
  .annotations{max-height:300px}
}
@media(max-width:980px){
  .shell{grid-template-columns:1fr}
  .sidebar{position:static;border-right:0;border-bottom:1px solid var(--line);padding:10px 12px}
  .sample-groups{max-height:184px}
  .sidebar-foot{display:none}
  .identity small{display:none}
}
@media(max-width:760px){
  .top{height:auto;min-height:56px;padding:8px 12px;flex-wrap:wrap;gap:8px}
  .status{display:none}
  .main{padding:12px 12px 22px}
  .rail{grid-template-columns:1fr}
  .toolbar{gap:6px}
  .external{margin-left:0}
  .canvasa-caption{font-size:10px}
  .tbtn{height:36px;padding:0 12px}
  .intro-actions button{height:36px}
  .mode-switch button{height:30px}
  .toolbar select,#zoomBtn{height:34px}
  .mobile-samples select{height:42px}
  .page-tab{min-height:36px}
  .review-toolbar button{height:30px}
  .dialog-foot button{height:42px}
}
@media(prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}
</style>
</head>
<body>
<header class="top">
  <div class="identity">
    <span class="monogram" aria-hidden="true">U/</span>
    <span class="wordmark">UI-CRAFT</span>
    <small>UI/UX DESIGN</small>
  </div>
  <div class="status"><i class="dot" aria-hidden="true"></i><span id="host">页面评审</span></div>
  <div class="topacts">
    <button class="tbtn accent" id="guideBtn" type="button">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 4.5h9.5L19 9v10.5H5Z"/><path d="M9 12h6M9 15.5h4"/></svg>
      设计方法
    </button>
    <div class="menu-wrap">
      <button class="tbtn" id="moreBtn" type="button" aria-expanded="false" aria-haspopup="menu">
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="5.4" cy="12" r="1.7"/><circle cx="12" cy="12" r="1.7"/><circle cx="18.6" cy="12" r="1.7"/></svg>
        更多
      </button>
      <div class="menu" id="moreMenu" role="menu" hidden>
        <button id="exportJson" type="button" role="menuitem">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 15.5V3.8M8 7.2l4-3.4 4 3.4"/><path d="M4.5 14.5v4.2A1.8 1.8 0 0 0 6.3 20.5h11.4a1.8 1.8 0 0 0 1.8-1.8v-4.2"/></svg>
          导出 JSON
        </button>
        <button id="exportMd" type="button" role="menuitem">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 3.5h9l5 5v12H5Z"/><path d="M8.5 12h7M8.5 16h4.5"/></svg>
          导出评审单
        </button>
        <div class="sep" aria-hidden="true"></div>
        <button id="importBtn" type="button" role="menuitem">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 3.8V15.5M8 11.8l4 3.7 4-3.7"/><path d="M4.5 14.5v4.2A1.8 1.8 0 0 0 6.3 20.5h11.4a1.8 1.8 0 0 0 1.8-1.8v-4.2"/></svg>
          导入反馈
        </button>
        <input type="file" id="importFile" accept="application/json,.json" hidden>
      </div>
    </div>
  </div>
</header>
<div class="shell">
  <nav class="sidebar" aria-label="评审样页">
    <div class="sample-nav">
      <label class="section-label nav-label" for="sampleSearch">样页索引</label>
      <div class="nav-search">
        <input id="sampleSearch" type="search" placeholder="名称或业务" autocomplete="off">
        <button id="clearSampleSearch" type="button" aria-label="清空样页搜索" hidden>×</button>
      </div>
      <div id="navResult" role="status" class="nav-result"></div>
      ${groups}
      <label class="mobile-samples" for="samplePicker">评审样页 <select id="samplePicker"></select></label>
    </div>
    <div class="sidebar-foot">UI-Craft · UI/UX Design<br>意见仅存于当前浏览器</div>
  </nav>

  <main class="main">
    <div class="intro">
      <div>
        <div class="eyebrow">INTERFACE REVIEW</div>
        <h1>界面评审台</h1>
        <p>选择样页体验，再点「标注」在具体元素上留意见。不熟悉从哪看起，可从 <a href="?page=cockpit">集团经营驾驶舱</a>、<a href="?page=shopfloor">产线监控墙</a> 或 <a href="?page=icons">图标与插画体系</a> 开始。</p>
      </div>
    </div>

    <div class="workspace">
      <div class="canvas-column">
        <div class="toolbar">
          <div class="mode-switch" aria-label="交互模式">
            <button id="browseBtn" type="button" aria-pressed="true">浏览</button>
            <button id="annotateBtn" type="button" aria-pressed="false">标注</button>
          </div>
          <label class="sr-only" for="viewport">预览尺寸</label>
          <select id="viewport">
            <option value="auto">自适应宽度</option>
            <option value="1440">桌面 · 1440</option>
            <option value="1024">平板 · 1024</option>
            <option value="390">手机 · 390</option>
            <option value="1920">大屏 · 1920</option>
          </select>
          <button id="zoomBtn" type="button" aria-pressed="false" title="以实际像素查看固定尺寸画布">原尺寸</button>
          <span class="scale-label" id="scaleLabel"></span>
          <a class="external" id="openPage" href="orbital.html" target="_blank" rel="noopener">独立打开 ↗</a>
        </div>
        <div class="canvas" id="canvas">
          <div class="frame-wrap" id="frameWrap">
            <iframe allowfullscreen id="preview" title="轨道测控大屏预览"></iframe>
          </div>
        </div>
        <div class="canvas-caption">
          <span id="modeHint">浏览模式 · 可以直接体验页面交互</span>
          <span id="viewportHint">画布 1440 × 900 · 等比例预览</span>
        </div>
        <div class="hint" id="reviewHint">先看整体节奏，再看字体、间距与层级，最后体验主要任务。点「标注」后，点页面中的具体元素即可留下意见。</div>
      </div>

      <aside class="rail" aria-label="评审信息">
        <section class="panel">
          <div class="panel-heading">
            <h2 id="briefTitle">23 / 轨道测控大屏</h2><span class="tag">方向</span>
          </div>
          <div class="brief" id="brief"></div>
          <button id="pairedPage" type="button" hidden></button>
          <div class="palette" id="palette"></div>
          <div class="token-labels" id="tokenLabels"></div>
        </section>

        <section class="panel">
          <div class="panel-heading">
            <h2>标注 <span id="totalCount">0</span></h2>
            <button id="pageNote" type="button">＋ 整体</button>
          </div>
          <div class="review-toolbar">
            <button data-filter="all" aria-pressed="true">全部</button>
            <button data-filter="open" aria-pressed="false">待处理</button>
            <button data-filter="done" aria-pressed="false">已处理</button>
          </div>
          <div class="annotations" id="annotations"></div>
        </section>

        <section class="panel">
          <div class="panel-heading"><h2>视觉评分</h2><small>1—5 分</small></div>
          <div id="scores"></div>
          <div class="score-total"><span id="scoreCaption">拖动滑块开始评分</span><strong id="scoreTotal">—</strong></div>
        </section>
      </aside>
    </div>

    <footer class="bottom">
      <span id="storageStatus">意见保存在当前浏览器。导出 JSON 可备份或交接评审记录。</span>
      <span>UI-CRAFT / UI/UX DESIGN</span>
    </footer>
  </main>
</div>

<dialog id="noteDialog" aria-labelledby="noteTitle"><form id="noteForm"><div class="dialog-content"><div class="eyebrow">LEAVE A NOTE</div><h2 id="noteTitle">你的设计意见</h2><p class="target-info" id="targetInfo"></p><div class="form-grid"><div><label for="category">问题类型</label><select id="category"><option>视觉风格</option><option>布局与留白</option><option>字体与层级</option><option>色彩与对比</option><option>交互体验</option><option>响应式</option><option>内容与数据</option><option>值得保留</option></select></div><div><label for="priority">优先级</label><select id="priority"><option value="normal">一般建议</option><option value="high">优先改进</option><option value="low">细节优化</option></select></div></div><label for="noteScope">这条意见适用于</label><select id="noteScope"><option value="page">仅当前页面</option><option value="scenario">同类任务的页面</option><option value="personal">我今后项目的个人偏好</option></select><label for="noteText">观察与期望 <span style="color:#ff7a6b">*</span></label><textarea id="noteText" required maxlength="2000" placeholder="例如：首屏副标题稍弱，希望增强对比，并与主标题拉开一点间距。"></textarea><p>建议写清「哪里」「为什么」「希望怎样」。也可以标注你希望保留的设计。</p></div><div class="dialog-foot"><button type="button" id="cancelNote">取消</button><button type="submit" class="primary">保存标注</button></div></form></dialog>
<dialog id="guideDialog" aria-labelledby="guideTitle"><div class="dialog-content"><div class="eyebrow">A PRACTICAL DESIGN SYSTEM</div><h2 id="guideTitle">方法统一，风格因场景而变。</h2><p>此处是 skill 的可评审示例，不是对任何品牌的复刻。所有产品、业务与数据均为虚构内容。</p><div class="guide-grid"><section><h3>先确定目的</h3><p>用户是谁、最重要的任务是什么、在哪种屏幕上使用，再决定构图与密度。</p></section><section><h3>建立视觉秩序</h3><p>排版、栅格、留白、色彩与材质使用统一规则，让主次关系清晰可见。</p></section><section><h3>让交互闭环</h3><p>按钮有结果，筛选有反馈，空状态能恢复，键盘与移动端也能完成任务。</p></section><section><h3>以评审迭代</h3><p>把反馈转为具体改动，验证相关场景，保留有效规则，避免一条意见限制所有设计。</p></section></div><p>参考品牌官方站点；可迁移的是叙事与信息组织方法，不是商标、图片或原文。</p><div class="source-links"><a href="https://www.mi.com/index.html" target="_blank" rel="noopener">小米 ↗</a><a href="https://consumer.huawei.com/cn/" target="_blank" rel="noopener">华为 ↗</a><a href="https://www.rokid.com/zh-CN" target="_blank" rel="noopener">Rokid ↗</a><a href="https://www.apple.com.cn/" target="_blank" rel="noopener">Apple ↗</a></div><p style="font-size:10.5px;color:#4e5a6d">本地标注通过元素选择器与预览尺寸定位。页面内容大幅变更后，定位可能失效，但意见文本仍会保留。JSON 支持再次导入；评审单便于直接阅读。</p></div><div class="dialog-foot"><button id="closeGuide" class="primary">开始评审</button></div></dialog>
<div class="toast" id="toast" role="status" hidden></div>

`;
fs.writeFileSync(path, out + script, 'utf8');
console.log('rewrote shell; script preserved', script.length, 'bytes');
console.log('groups block', groups.length, 'bytes, tabs', (groups.match(/data-page=/g)||[]).length);