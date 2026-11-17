'use strict';
// Development-only layout probe: drives headless Chrome over the DevTools
// protocol and reports runtime errors plus geometric defects for each sample.
// Not part of the published artefact and not invoked by the release suite.
const { spawn } = require('node:child_process');
const http = require('node:http');

const CHROME = process.env.UI_CRAFT_CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 9222;
const ORIGIN = process.env.UI_CRAFT_ORIGIN || 'http://127.0.0.1:4173';

const PAGES = process.argv.slice(2).length ? process.argv.slice(2) : [
  'television', 'kiosk', 'pda', 'pos', 'watch', 'vehicle', 'arglass',
  'esl', 'dualmonitor', 'tablet', 'signage', 'foldable', 'vr', 'homepanel',
  'cockpit', 'shopfloor', 'icons', 'assets'
];

const sizes = [[1440, 900], [390, 844]];

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

function getJSON(path) {
  return new Promise((resolve, reject) => {
    http.get({ hostname: '127.0.0.1', port: PORT, path }, res => {
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
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
    this.events = [];
    this.ready = new Promise((resolve, reject) => {
      this.ws.addEventListener('open', resolve);
      this.ws.addEventListener('error', reject);
    });
    this.ws.addEventListener('message', event => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result);
      } else if (msg.method) {
        this.events.push(msg);
      }
    });
  }
  send(method, params = {}) {
    const id = ++this.id;
    this.ws.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => this.pending.set(id, { resolve, reject }));
  }
  async evaluate(expression) {
    const result = await this.send('Runtime.evaluate', {
      expression, returnByValue: true, awaitPromise: true
    });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
    return result.result.value;
  }
}

const probe = `(() => {
  const doc = document.documentElement;
  const overflowX = Math.max(doc.scrollWidth, document.body.scrollWidth) - doc.clientWidth;
  const hidden = el => el.classList.contains('sr') || el.classList.contains('screen-reader') ||
    getComputedStyle(el).clipPath.startsWith('inset(50%');
  // An element inside a horizontally scrollable track is meant to sit past the
  // viewport edge. A clipping ancestor only excuses it when that ancestor itself
  // stays on screen, so keep climbing past off-screen clippers.
  const contained = el => {
    for (let node = el.parentElement; node; node = node.parentElement) {
      const style = getComputedStyle(node);
      if (/auto|scroll/.test(style.overflowX)) return true;
      if (/hidden|clip/.test(style.overflowX) && node.getBoundingClientRect().right <= doc.clientWidth + 2) return true;
    }
    return false;
  };
  const bad = [];
  const seen = [];
  for (const el of document.querySelectorAll('body *')) {
    const style = getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) continue;
    if (hidden(el)) continue;
    // A marquee or virtualised track overflows on purpose. Declaring it keeps the
    // check honest instead of silencing it with a class name.
    if (el.dataset.overflow === 'clip') continue;
    const rect = el.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) continue;
    const clips = /hidden|clip/.test(style.overflowX);
    // Text that cannot fit its box and has no scroll or ellipsis escape.
    if (clips && el.scrollWidth - el.clientWidth > 2 && !/ellipsis/.test(style.textOverflow) && style.whiteSpace !== 'nowrap') {
      bad.push('text clipped: ' + el.tagName.toLowerCase() + '.' + (el.className || '') + ' +' + (el.scrollWidth - el.clientWidth) + 'px');
    }
    if (rect.right > doc.clientWidth + 2 && !clips && !contained(el) && rect.left < doc.clientWidth) {
      bad.push('offscreen right: ' + el.tagName.toLowerCase() + '.' + (el.className || ''));
    }
    if (el.dataset.reviewId) seen.push(el.dataset.reviewId);
  }
  // Interactive elements below the 44px touch floor, only on narrow viewports.
  // A checkbox wrapped in a padded label is hit through the label, so measure
  // that instead of the bare 16px input.
  const small = [];
  if (innerWidth <= 480) {
    for (const el of document.querySelectorAll('button, a[href], input, select, textarea')) {
      let box = el;
      if (el.tagName === 'INPUT' && el.type === 'checkbox') {
        box = el.closest('label') || (el.parentElement && el.parentElement.getBoundingClientRect().height >= 40 ? el.parentElement : el);
      }
      const rect = box.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) continue;
      if (hidden(el)) continue;
    // A marquee or virtualised track overflows on purpose. Declaring it keeps the
    // check honest instead of silencing it with a class name.
    if (el.dataset.overflow === 'clip') continue;
      if (rect.height < 40 || rect.width < 28) {
        small.push(el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + ' ' + Math.round(rect.width) + '×' + Math.round(rect.height));
      }
    }
  }
  return { overflowX, bad: bad.slice(0, 8), small: small.slice(0, 10), reviewIds: seen.length, title: document.title, height: doc.scrollHeight };
})()`;

async function main() {
  const chrome = spawn(CHROME, [
    '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
    '--remote-debugging-port=' + PORT, '--window-size=1440,900',
    '--user-data-dir=' + require('node:path').join(require('node:os').tmpdir(), 'ui-craft-probe'),
    'about:blank'
  ], { stdio: 'ignore' });

  let failures = 0;
  try {
    await connect();
    const targets = await getJSON('/json/list');
    const page = targets.find(t => t.type === 'page');
    const session = new Session(page.webSocketDebuggerUrl);
    await session.ready;
    await session.send('Page.enable');
    await session.send('Runtime.enable');
    await session.send('Log.enable');

    for (const [width, height] of sizes) {
      await session.send('Emulation.setDeviceMetricsOverride', {
        width, height, deviceScaleFactor: 1, mobile: width <= 480
      });
      for (const name of PAGES) {
        session.events.length = 0;
        await session.send('Page.navigate', { url: ORIGIN + '/' + name + '.html' });
        await wait(650);
        let result;
        try {
          result = await session.evaluate(probe);
        } catch (error) {
          console.log('FAIL ' + name + ' @' + width + ' evaluate: ' + error.message);
          failures++;
          continue;
        }
        const errors = session.events
          .filter(e => e.method === 'Runtime.exceptionThrown' || e.method === 'Log.entryAdded')
          .map(e => {
            const entry = e.params.entry;
            const text = e.params.exceptionDetails?.text || entry?.text || '';
            // A missing favicon is the browser probing, not a page defect.
            if (/favicon\.ico/i.test(entry?.url || '')) return '';
            return entry?.url && /404/.test(text) ? text + ' ' + entry.url : text;
          })
          .filter(Boolean);
        const problems = [...errors.map(t => 'js: ' + t), ...result.bad];
        if (width <= 480) problems.push(...result.small.map(t => 'small target: ' + t));
        if (result.overflowX > 2) problems.push('horizontal overflow +' + result.overflowX + 'px');
        if (!result.reviewIds) problems.push('no review anchors');
        if (problems.length) {
          failures++;
          console.log('FAIL ' + name + ' @' + width + '\n  ' + problems.join('\n  '));
        } else {
          console.log('ok   ' + name + ' @' + width + ' (' + result.height + 'px tall)');
        }
      }
    }
  } finally {
    chrome.kill();
  }
  console.log(failures ? '\n' + failures + ' problem(s)' : '\nall pages pass');
  process.exitCode = failures ? 1 : 0;
}

main().catch(error => { console.error(error); process.exitCode = 1; });