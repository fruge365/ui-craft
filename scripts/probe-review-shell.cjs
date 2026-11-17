const { spawn } = require('node:child_process');
const http = require('node:http');
const CHROME='C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT=9241, ORIGIN='http://127.0.0.1:4173';
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const get=p=>new Promise((res,rej)=>http.get({hostname:'127.0.0.1',port:PORT,path:p},r=>{const c=[];r.on('data',d=>c.push(d));r.on('end',()=>res(JSON.parse(Buffer.concat(c))))}).on('error',rej));
(async()=>{
  const chrome=spawn(CHROME,['--headless=new','--disable-gpu','--remote-debugging-port='+PORT,'--user-data-dir=C:/Users/zw/AppData/Local/Temp/uics-'+Date.now(),'--window-size=1440,900','about:blank'],{stdio:'ignore'});
  let v; for(let i=0;i<40&&!v;i++){try{v=await get('/json/version')}catch{await wait(250)}}
  const t=await get('/json/list'); const ws=new WebSocket(t.find(x=>x.type==='page').webSocketDebuggerUrl);
  await new Promise((r,j)=>{ws.addEventListener('open',r);ws.addEventListener('error',j)});
  let id=0; const pend=new Map(); const events=[];
  ws.addEventListener('message',e=>{const m=JSON.parse(e.data);
    if(m.id&&pend.has(m.id)){const{resolve,reject}=pend.get(m.id);pend.delete(m.id);m.error?reject(new Error(m.error.message)):resolve(m.result)}
    else if(m.method)events.push(m)});
  const send=(m,p={})=>{const i=++id;ws.send(JSON.stringify({id:i,method:m,params:p}));return new Promise((resolve,reject)=>pend.set(i,{resolve,reject}))};
  const ev=async x=>{const r=await send('Runtime.evaluate',{expression:x,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw new Error(r.exceptionDetails.text);return r.result.value};
  await send('Page.enable');await send('Runtime.enable');await send('Log.enable');
  await send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
  await send('Page.navigate',{url:ORIGIN+'/?page=cockpit'});await wait(1400);
  const out=[];const chk=(n,c,x='')=>out.push((c?'ok   ':'FAIL ')+n+(c?'':' '+x));
  // 1. shell renders, no runtime errors
  const errs=events.filter(e=>e.method==='Runtime.exceptionThrown').map(e=>e.params.exceptionDetails?.text||'');
  chk('no runtime exception',errs.length===0,errs.join('|'));
  // 2. left index lists 46 tabs and marks the active one
  chk('46 tabs',await ev("document.querySelectorAll('.page-tab').length")===46);
  chk('active tab is cockpit',await ev("document.querySelector('.page-tab[aria-pressed=true]')?.dataset.page")==='cockpit');
  chk('active tab text',/经营驾驶舱/.test(await ev("document.querySelector('.page-tab[aria-pressed=true]').textContent")));
  // 3. iframe loaded the right page and is scaled in
  const src=await ev("document.getElementById('preview').src");
  chk('iframe src cockpit',src.includes('cockpit.html'),src);
  chk('scale label present',/\d+%/.test(await ev("document.getElementById('scaleLabel').textContent")));
  chk('openPage href',(await ev("document.getElementById('openPage').getAttribute('href')")).includes('cockpit.html'));
  // 4. brief panel populated
  const brief=await ev("document.getElementById('brief').textContent");
  chk('brief filled',brief.length>20,'len '+brief.length);
  chk('palette swatches',await ev("document.querySelectorAll('#palette .swatch').length")>=4);
  chk('brief title',/43/.test(await ev("document.getElementById('briefTitle').textContent")));
  // 5. scores render 4 sliders
  chk('4 score rows',await ev("document.querySelectorAll('.score-row').length")===4);
  // 6. filter tabs + empty state
  chk('3 filters',await ev("document.querySelectorAll('[data-filter]').length")===3);
  chk('empty state shown',await ev("Boolean(document.querySelector('#annotations .empty'))"));
  // 7. switch page via tab click
  await ev("[...document.querySelectorAll('.page-tab')].find(b=>b.dataset.page==='icons').click()");await wait(900);
  chk('switch to icons',(await ev("document.getElementById('preview').src")).includes('icons.html'));
  chk('url updated',(await ev("location.search")).includes('page=icons'),await ev("location.search"));
  chk('brief updated',/图标/.test(await ev("document.getElementById('briefTitle').textContent")),await ev("document.getElementById('briefTitle').textContent"));
  // 8. search filters the index
  await ev(`(()=>{const i=document.getElementById('sampleSearch');i.value='产线';i.dispatchEvent(new Event('input',{bubbles:true}));})()`);await wait(250);
  const visible=await ev("[...document.querySelectorAll('.page-tab')].filter(b=>!b.hidden).length");
  chk('search narrows index',visible>=1&&visible<46,'visible '+visible);
  await ev("document.getElementById('clearSampleSearch').click()");await wait(250);
  chk('clear restores',await ev("[...document.querySelectorAll('.page-tab')].filter(b=>!b.hidden).length")===46);
  // 9. viewport switch re-fits iframe
  await ev(`(()=>{const s=document.getElementById('viewport');s.value='390';s.dispatchEvent(new Event('change',{bubbles:true}));})()`);await wait(500);
  chk('viewport 390 applied',(await ev("document.getElementById('preview').style.width"))==='390px',await ev("document.getElementById('preview').style.width"));
  // 10. mode switch to annotate
  await ev("document.getElementById('annotateBtn').click()");await wait(250);
  chk('annotate pressed',await ev("document.getElementById('annotateBtn').getAttribute('aria-pressed')")==='true');
  chk('mode hint changed',/标注/.test(await ev("document.getElementById('modeHint').textContent")),await ev("document.getElementById('modeHint').textContent"));
  await ev("document.getElementById('browseBtn').click()");await wait(200);
  // 11. overflow menu opens and closes
  await ev("document.getElementById('moreBtn').click()");await wait(200);
  chk('menu opens',await ev("!document.getElementById('moreMenu').hidden"));
  chk('menu aria',await ev("document.getElementById('moreBtn').getAttribute('aria-expanded')")==='true');
  chk('menu has 3 items',await ev("document.querySelectorAll('#moreMenu button').length")===3);
  await ev("document.body.dispatchEvent(new MouseEvent('click',{bubbles:true}))");await wait(200);
  chk('menu closes on outside click',await ev("document.getElementById('moreMenu').hidden"));
  // 12. guide dialog
  await ev("document.getElementById('guideBtn').click()");await wait(250);
  chk('guide opens',await ev("document.getElementById('guideDialog').open"));
  await ev("document.getElementById('closeGuide').click()");await wait(250);
  chk('guide closes',!(await ev("document.getElementById('guideDialog').open")));
  // 13. page-note dialog opens with target label
  await ev("document.getElementById('pageNote').click()");await wait(250);
  chk('note dialog opens',await ev("document.getElementById('noteDialog').open"));
  chk('target info filled',(await ev("document.getElementById('targetInfo').textContent")).length>0);
  await ev("document.getElementById('cancelNote').click()");await wait(200);
  // 14. no horizontal overflow at 1440 and 390
  const ov1=await ev("Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-document.documentElement.clientWidth");
  chk('no overflow 1440',ov1<=2,'overflow '+ov1);
  await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
  await send('Page.navigate',{url:ORIGIN+'/?page=icons'});await wait(1200);
  const ov2=await ev("Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-document.documentElement.clientWidth");
  chk('no overflow 390',ov2<=2,'overflow '+ov2);
  chk('mobile picker visible',await ev("getComputedStyle(document.querySelector('.mobile-samples')).display")!=='none');
  chk('mobile options >=46',await ev("document.querySelectorAll('#samplePicker option').length")>=46);
  console.log(out.join('\n'));
  const fails=out.filter(x=>x.startsWith('FAIL')).length;
  console.log(fails?'\n'+fails+' FAILURES':'\nall shell checks pass');
  chrome.kill();process.exit(fails?1:0);
})().catch(e=>{console.error(e);process.exit(1)});
