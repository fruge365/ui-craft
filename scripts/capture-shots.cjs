'use strict';
// Development-only screenshot helper. Each sample is captured at the viewport its
// device actually implies, so a wrist display is not photographed as a desktop.
const { spawn } = require('node:child_process');
const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');

const CHROME = process.env.UI_CRAFT_CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 9224;
const ORIGIN = process.env.UI_CRAFT_ORIGIN || 'http://127.0.0.1:4173';
const OUT = path.resolve(__dirname, '..', 'docs', 'images');

const shots = [
  ['television', 'television.png', 1440, 900],
  ['kiosk', 'kiosk.png', 1280, 1000],
  ['pda', 'pda.png', 480, 900],
  ['pos', 'pos.png', 1440, 900],
  ['watch', 'watch.png', 900, 760],
  ['vehicle', 'vehicle.png', 1440, 900],
  ['arglass', 'arglass.png', 1440, 940],
  ['esl', 'esl.png', 1280, 980],
  ['dualmonitor', 'dualmonitor.png', 1560, 940],
  ['tablet', 'tablet.png', 1200, 880],
  ['signage', 'signage.png', 700, 1180],
  ['foldable', 'foldable.png', 1300, 900],
  ['vr', 'vr.png', 1440, 940],
  ['homepanel', 'homepanel.png', 1160, 880],
  ['cockpit', 'cockpit.png', 1920, 1080],
  ['shopfloor', 'shopfloor.png', 1920, 1080],
  ['governance', 'governance.png', 1440, 900],
  ['icons', 'icons.png', 1440, 1100],
  ['assets', 'assets-console.png', 1440, 1050]
];

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

function getJSON(target) {
  return new Promise((resolve, reject) => {
    http.get({ hostname: '127.0.0.1', port: PORT, path: target }, res => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(JSON.parse(Buffer.concat(chunks).toString())));
    }).on('error', reject);
  });
}

async function main() {
  await fs.mkdir(OUT, { recursive: true });
  const chrome = spawn(CHROME, [
    '--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1',
    '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=' + PORT,
    '--user-data-dir=' + path.join(require('node:os').tmpdir(), 'ui-craft-shots'),
    'about:blank'
  ], { stdio: 'ignore' });

  try {
    let version;
    for (let i = 0; i < 40 && !version; i++) {
      try { version = await getJSON('/json/version'); } catch { await wait(250); }
    }
    if (!version) throw new Error('DevTools endpoint did not start');

    const targets = await getJSON('/json/list');
    const ws = new WebSocket(targets.find(t => t.type === 'page').webSocketDebuggerUrl);
    await new Promise((resolve, reject) => {
      ws.addEventListener('open', resolve);
      ws.addEventListener('error', reject);
    });
    let id = 0;
    const pending = new Map();
    ws.addEventListener('message', event => {
      const msg = JSON.parse(event.data);
      if (!msg.id || !pending.has(msg.id)) return;
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result);
    });
    const send = (method, params = {}) => {
      const current = ++id;
      ws.send(JSON.stringify({ id: current, method, params }));
      return new Promise((resolve, reject) => pending.set(current, { resolve, reject }));
    };

    await send('Page.enable');
    for (const [page, file, width, height] of shots) {
      await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width <= 500 });
      await send('Page.navigate', { url: ORIGIN + '/' + page + '.html' });
      await wait(900);
      const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
      const buffer = Buffer.from(shot.data, 'base64');
      await fs.writeFile(path.join(OUT, file), buffer);
      console.log(file.padEnd(20) + Math.round(buffer.length / 1024) + ' KB  ' + width + '×' + height);
    }
  } finally {
    chrome.kill();
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });