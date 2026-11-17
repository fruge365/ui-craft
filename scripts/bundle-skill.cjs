'use strict';
// Builds the distributable skill archive with forward-slash entry names and fixed
// timestamps, so the zip unzips correctly on macOS, Linux and Windows alike.
const fs = require('node:fs');
const path = require('node:path');
const zlib = require('node:zlib');

const root = path.resolve(__dirname, '..', 'skills', 'ui-craft');
const target = path.resolve(__dirname, '..', 'dist', 'ui-craft-v11.1.0.zip');

function walk(dir, base = '') {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const relative = base ? base + '/' + entry.name : entry.name;
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(absolute, relative));
    else if (entry.isFile()) out.push({ relative, absolute });
  }
  return out;
}

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) crc = crc >>> 1 ^ (0xedb88320 & -(crc & 1));
  }
  return (crc ^ 0xffffffff) >>> 0;
}

const DOS_TIME = 0x6000;                              // 12:00:00
const DOS_DATE = (2026 - 1980) * 512 + 11 * 32 + 17;  // year<<9 | month<<5 | day

function main() {
  const entries = walk(root).map(file => {
    const data = fs.readFileSync(file.absolute);
    const deflated = zlib.deflateRawSync(data, { level: 9 });
    const body = deflated.length < data.length ? deflated : data;
    return {
      name: 'ui-craft/' + file.relative,
      method: body === data ? 0 : 8,
      crc: crc32(data),
      compressed: body,
      size: data.length
    };
  });

  const locals = [];
  const central = [];
  let offset = 0;
  for (const entry of entries) {
    const nameBuffer = Buffer.from(entry.name, 'utf8');
    const localHeader = Buffer.alloc(30);
    localHeader.writeUInt32LE(0x04034b50, 0);
    localHeader.writeUInt16LE(20, 4);
    localHeader.writeUInt16LE(0x0800, 6); // UTF-8 names
    localHeader.writeUInt16LE(entry.method, 8);
    localHeader.writeUInt16LE(DOS_TIME, 10);
    localHeader.writeUInt16LE(DOS_DATE, 12);
    localHeader.writeUInt32LE(entry.crc, 14);
    localHeader.writeUInt32LE(entry.compressed.length, 18);
    localHeader.writeUInt32LE(entry.size, 22);
    localHeader.writeUInt16LE(nameBuffer.length, 26);
    localHeader.writeUInt16LE(0, 28);
    locals.push(localHeader, nameBuffer, entry.compressed);

    const centralHeader = Buffer.alloc(46);
    centralHeader.writeUInt32LE(0x02014b50, 0);
    centralHeader.writeUInt16LE(20, 4);
    centralHeader.writeUInt16LE(20, 6);
    centralHeader.writeUInt16LE(0x0800, 8);
    centralHeader.writeUInt16LE(entry.method, 10);
    centralHeader.writeUInt16LE(DOS_TIME, 12);
    centralHeader.writeUInt16LE(DOS_DATE, 14);
    centralHeader.writeUInt32LE(entry.crc, 16);
    centralHeader.writeUInt32LE(entry.compressed.length, 20);
    centralHeader.writeUInt32LE(entry.size, 24);
    centralHeader.writeUInt16LE(nameBuffer.length, 28);
    centralHeader.writeUInt16LE(0, 30);
    centralHeader.writeUInt16LE(0, 32);
    centralHeader.writeUInt16LE(0, 34);
    centralHeader.writeUInt16LE(0, 36);
    // External attributes: regular file, mode 0644. 0o100644 << 16 overflows
    // into a negative int32, so multiply into the unsigned range instead.
    centralHeader.writeUInt32LE(0o100644 * 65536, 38);
    centralHeader.writeUInt32LE(offset, 42);
    central.push(centralHeader, nameBuffer);
    offset += localHeader.length + nameBuffer.length + entry.compressed.length;
  }

  const centralBuffer = Buffer.concat(central);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(0, 4);
  end.writeUInt16LE(0, 6);
  end.writeUInt16LE(entries.length, 8);
  end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(centralBuffer.length, 12);
  end.writeUInt32LE(offset, 16);
  end.writeUInt16LE(0, 20);

  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, Buffer.concat([...locals, centralBuffer, end]));
  console.log(entries.map(entry => entry.name).join('\n'));
  console.log('\n' + entries.length + ' files → ' + path.basename(target) +
    ' (' + Math.round(fs.statSync(target).size / 1024) + ' KB)');
}

main();