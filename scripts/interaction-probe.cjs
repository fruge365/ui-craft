'use strict';
// Development-only interaction check. Verifies the primary action of each new
// sample actually changes state, since a page that renders but does nothing is
// the failure mode a screenshot cannot catch.
const { spawn } = require('node:child_process');
const http = require('node:http');

const CHROME = process.env.UI_CRAFT_CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 9223;
const ORIGIN = process.env.UI_CRAFT_ORIGIN || 'http://127.0.0.1:4173';

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

function getJSON(path) {
  return new Promise((resolve, reject) => {
    http.get({ hostname: '127.0.0.1', port: PORT, path }, res => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(JSON.parse(Buffer.concat(chunks).toString())));
    }).on('error', reject);
  });
}

async function connect() {
  for (let i = 0; i < 40; i++) {
    try { return await getJSON('/json/version'); } catch { await wait(250); }
  }
  throw new Error('DevTools endpoint did not start');
}

class Session {
  constructor(url) {
    this.ws = new WebSocket(url);
    this.id = 0;
    this.pending = new Map();
    this.ready = new Promise((resolve, reject) => {
      this.ws.addEventListener('open', resolve);
      this.ws.addEventListener('error', reject);
    });
    this.ws.addEventListener('message', event => {
      const msg = JSON.parse(event.data);
      if (!msg.id || !this.pending.has(msg.id)) return;
      const { resolve, reject } = this.pending.get(msg.id);
      this.pending.delete(msg.id);
      msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result);
    });
  }
  send(method, params = {}) {
    const id = ++this.id;
    this.ws.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => this.pending.set(id, { resolve, reject }));
  }
  async evaluate(expression) {
    const r = await this.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.text);
    return r.result.value;
  }
  async click(selector) {
    return this.evaluate(`(() => { const el = document.querySelector(${JSON.stringify(selector)});
      if (!el) return 'missing'; el.click(); return 'ok'; })()`);
  }
  async type(selector, value) {
    return this.evaluate(`(() => {
      const el = document.querySelector(${JSON.stringify(selector)});
      if (!el) return 'missing';
      el.value = ${JSON.stringify(value)};
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      return 'ok';
    })()`);
  }
  async press(key) {
    return this.evaluate(`(() => {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: ${JSON.stringify(key)}, bubbles: true, cancelable: true }));
      window.dispatchEvent(new KeyboardEvent('keydown', { key: ${JSON.stringify(key)}, bubbles: true, cancelable: true }));
      return 'ok';
    })()`);
  }
}

const cases = [
  { page: 'television', name: 'remote focus moves, then opens a detail sheet', run: async s => {
      const before = await s.evaluate(`document.querySelector('.tile').dataset.focus`);
      await s.press('ArrowRight');
      const moved = await s.evaluate(`[...document.querySelectorAll('.tile')].filter(t => t.dataset.focus === 'true').length`);
      await s.press('Enter');
      const open = await s.evaluate(`!document.getElementById('detail').hidden`);
      return before === 'true' && moved === 1 && open ? '' : 'focus=' + before + ' selected=' + moved + ' detail=' + open;
    } },
  { page: 'kiosk', name: 'slot selection updates the summary', run: async s => {
      await s.click('[data-slot="15:30"]');
      const slot = await s.evaluate(`document.getElementById('sum-slot').textContent`);
      return slot.includes('15:30') ? '' : 'summary still ' + slot;
    } },
  { page: 'pda', name: 'a real code is accepted and a bogus one is refused', run: async s => {
      await s.click('#code');
      await s.type('#code', 'B-02');
      const ok = await s.evaluate(`document.getElementById('done').textContent`);
      await s.type('#code', 'ZZ-99');
      const msg = await s.evaluate(`document.getElementById('msg').textContent`);
      return ok === '2' && /未在本单/.test(msg) ? '' : 'done=' + ok + ' msg=' + msg;
    } },
  { page: 'pos', name: 'adding an item updates both screens', run: async s => {
      await s.type('#code', '2432050003007');
      const grand = await s.evaluate(`document.getElementById('grand').textContent`);
      const cust = await s.evaluate(`document.getElementById('cust-total').textContent`);
      return grand.includes('111.50') && cust === '111.50' ? '' : 'grand=' + grand + ' cust=' + cust;
    } },
  { page: 'watch', name: 'pause stops the clock and relabels the button', run: async s => {
      const t0 = await s.evaluate(`document.getElementById('time').textContent`);
      await wait(1200);
      const t1 = await s.evaluate(`document.getElementById('time').textContent`);
      await s.click('#pause');
      await wait(1200);
      const t2 = await s.evaluate(`document.getElementById('time').textContent`);
      const label = await s.evaluate(`document.getElementById('pause').textContent`);
      return t1 !== t0 && t2 === t1 && label === '继续' ? '' : 't0=' + t0 + ' t1=' + t1 + ' t2=' + t2 + ' label=' + label;
    } },
  { page: 'vehicle', name: 'driving mode disables the media controls', run: async s => {
      await s.click('[data-state="driving"]');
      const locked = await s.evaluate(`document.getElementById('play').disabled`);
      return locked ? '' : 'play control still enabled while driving';
    } },
  { page: 'arglass', name: 'focus mode dims the competing card', run: async s => {
      await s.click('[data-act="focus"]');
      const opacity = await s.evaluate(`getComputedStyle(document.querySelector('[data-target="doorway"]')).opacity`);
      return Number(opacity) < 0.6 ? '' : 'door card opacity ' + opacity;
    } },
  { page: 'esl', name: 'display mode swaps the priority rows', run: async s => {
      await s.click('[data-mode="stock"]');
      const text = await s.evaluate(`document.getElementById('mode-rows').textContent`);
      return /可用数量/.test(text) ? '' : 'rows unchanged: ' + text.slice(0, 40);
    } },
  { page: 'dualmonitor', name: 'selecting a bar updates the detail panel', run: async s => {
      await s.click('.lane .bar');
      const text = await s.evaluate(`document.getElementById('detail').textContent`);
      return /WO-1107-01/.test(text) ? '' : 'detail did not update';
    } },
  { page: 'tablet', name: 'adding a note grows the annotation list', run: async s => {
      await s.evaluate(`(() => {
        const p = document.querySelector('#reader p mark');
        const range = document.createRange(); range.selectNodeContents(p);
        const sel = getSelection(); sel.removeAllRanges(); sel.addRange(range);
        p.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
      })()`);
      await s.evaluate(`(() => { const t = document.getElementById('memo'); t.value = '补一张新旧交界近景。'; })()`);
      await s.click('#add');
      const count = await s.evaluate(`document.querySelectorAll('#notes .note').length`);
      return count === 4 ? '' : 'note count ' + count;
    } },
  { page: 'signage', name: 'the next item is computed from the clock', run: async s => {
      const next = await s.evaluate(`document.getElementById('next-at').textContent`);
      return /^\d{2}:\d{2}$/.test(next) ? '' : 'next time ' + next;
    } },
  { page: 'foldable', name: 'collapsing keeps the selected exhibit', run: async s => {
      await s.click('[data-id="05"]');
      const title = await s.evaluate(`document.getElementById('d-title').textContent`);
      await s.click('[data-form="closed"]');
      await s.click('[data-id="02"]');
      const reopened = await s.evaluate(`document.getElementById('d-title').textContent`);
      return /排水口模型/.test(title) && /测绘手簿/.test(reopened) ? '' : 'title=' + title + ' reopened=' + reopened;
    } },
  { page: 'vr', name: 'passthrough mode reveals the safety notice', run: async s => {
      await s.click('[data-mode="passthrough"]');
      const shown = await s.evaluate(`!document.getElementById('pt').hidden`);
      return shown ? '' : 'notice still hidden';
    } },
  { page: 'cockpit', run: async s => {
      const first = await s.evaluate(`document.querySelector('.metric .m-val').textContent`);
      await s.click('[data-scope="north"]');
      const second = await s.evaluate(`document.querySelector('.metric .m-val').textContent`);
      const alerts = await s.evaluate(`document.querySelectorAll('#alerts .alert').length`);
      return first.startsWith('418.6') && second.startsWith('82.6') && alerts === 3
        ? '' : 'first=' + first + ' second=' + second + ' alerts=' + alerts;
    } },
  { page: 'shopfloor', run: async s => {
      const nodes = await s.evaluate(`document.querySelectorAll('#conveyor svg > g').length`);
      const texts = await s.evaluate(`document.querySelectorAll('#conveyor text').length`);
      const oee = await s.evaluate(`document.querySelectorAll('#oee .oee-cell').length`);
      const spc = await s.evaluate(`document.querySelectorAll('#spc circle').length`);
      return nodes === 7 && texts > 14 && oee === 4 && spc === 18
        ? '' : 'nodes=' + nodes + ' texts=' + texts + ' oee=' + oee + ' spc=' + spc;
    } },
  { page: 'icons', run: async s => {
      const cells = await s.evaluate(`document.querySelectorAll('#iconSet .icon-cell').length`);
      const uses = await s.evaluate(`document.querySelectorAll('#iconSet use').length`);
      return cells === 29 && uses === 29 ? '' : 'cells=' + cells + ' uses=' + uses;
    } },
  { page: 'assets', run: async s => {
      await s.click('#page-select');
      const picked = await s.evaluate(`document.getElementById('selected-count').textContent`);
      await s.click('#preview-batch');
      await wait(200);
      await s.click('#confirm-batch');
      await wait(450);
      const queue = await s.evaluate(`document.getElementById('queue-count').textContent`);
      await s.click('#undo-batch');
      await wait(450);
      const after = await s.evaluate(`document.getElementById('queue-count').textContent`);
      return /5 台/.test(picked) && queue === '3' && after === '0'
        ? '' : 'picked=' + picked + ' queue=' + queue + ' after=' + after;
    } },
  { page: 'governance', run: async s => {
      // Restricted rows must expose read-only and refuse the bulk write path.
      await s.click('[data-scope="restricted"]');
      const denied = await s.evaluate(`document.querySelectorAll('#body tr').length`);
      await s.click('#body tr[data-id]');
      await wait(250);
      const hasDeny = await s.evaluate(`Boolean(document.querySelector('#dBody .deny'))`);
      await s.click('#closeDrawer');
      await wait(250);
      // Command palette must open on the shortcut and filter live.
      await s.evaluate(`document.dispatchEvent(new KeyboardEvent('keydown',{key:'k',metaKey:true,bubbles:true}))`);
      await wait(200);
      const palOpen = await s.evaluate(`!document.getElementById('palette').hidden`);
      await s.evaluate(`(() => { const i = document.getElementById('palInput'); i.value = '工资'; i.dispatchEvent(new Event('input',{bubbles:true})); })()`);
      const filtered = await s.evaluate(`document.querySelectorAll('#palList .palitem').length`);
      return denied > 0 && hasDeny && palOpen && filtered >= 1
        ? '' : 'rows=' + denied + ' deny=' + hasDeny + ' palette=' + palOpen + ' matches=' + filtered;
    } },
  { page: 'homepanel', name: 'temperature steps stay inside the allowed range', run: async s => {
      for (let i = 0; i < 8; i++) await s.click('[data-step="-1"][data-room="living"]');
      const value = await s.evaluate(`document.getElementById('living-set').textContent`);
      return value === '16' ? '' : 'clamped at ' + value;
    } }
];

async function main() {
  const chrome = spawn(CHROME, [
    '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
    '--remote-debugging-port=' + PORT, '--window-size=1440,900',
    '--user-data-dir=' + require('node:path').join(require('node:os').tmpdir(), 'ui-craft-interact'),
    'about:blank'
  ], { stdio: 'ignore' });

  let failures = 0;
  try {
    await connect();
    const targets = await getJSON('/json/list');
    const session = new Session(targets.find(t => t.type === 'page').webSocketDebuggerUrl);
    await session.ready;
    await session.send('Page.enable');
    await session.send('Runtime.enable');
    await session.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });

    for (const item of cases) {
      await session.send('Page.navigate', { url: ORIGIN + '/' + item.page + '.html' });
      await wait(650);
      let problem;
      try { problem = await item.run(session); }
      catch (error) { problem = error.message; }
      if (problem) { failures++; console.log('FAIL ' + item.page + ' · ' + problem); }
      else console.log('ok   ' + item.page);
    }
  } finally {
    chrome.kill();
  }
  console.log(failures ? '\n' + failures + ' interaction failure(s)' : '\nall interactions behave');
  process.exitCode = failures ? 1 : 0;
}

main().catch(error => { console.error(error); process.exitCode = 1; });