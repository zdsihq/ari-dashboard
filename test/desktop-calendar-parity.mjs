/**
 * Synthetic desktop-agenda checks against dashboard.css only.
 * This is not a live Template proof: no auth, no tenant, no network, no real events.
 * Phone widths assert the pre-existing v3.113 rules still win.
 * Desktop widths assert the new side-by-side ivory theme.
 */
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import zlib from "node:zlib";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cssPath = path.join(root, "dashboard.css");
const jsPath = path.join(root, "dashboard.js");
const css = fs.readFileSync(cssPath, "utf8");

function md5(file) {
  return crypto.createHash("md5").update(fs.readFileSync(file)).digest("hex");
}

function contrast(a, b) {
  const lum = (hex) => {
    const n = hex.replace("#", "");
    const ch = [0, 2, 4].map((i) => {
      const v = parseInt(n.slice(i, i + 2), 16) / 255;
      return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
  };
  const L1 = lum(a);
  const L2 = lum(b);
  const hi = Math.max(L1, L2);
  const lo = Math.min(L1, L2);
  return (hi + 0.05) / (lo + 0.05);
}

function rgbClose(actual, hex, slack = 1) {
  const m = String(actual).match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  assert.ok(m, `not a color: ${actual}`);
  const want = [0, 2, 4].map((i) => parseInt(hex.replace("#", "").slice(i, i + 2), 16));
  for (let i = 0; i < 3; i++) {
    assert.ok(Math.abs(Number(m[i + 1]) - want[i]) <= slack, `${actual} !~ ${hex}`);
  }
}

test("css block is desktop-only and brace-balanced", () => {
  const start = css.indexOf("/* BEGIN desktop-agenda-ivory");
  const end = css.indexOf("/* END desktop-agenda-ivory */");
  assert.ok(start > 0 && end > start);
  const block = css.slice(start, end);
  assert.equal(block.includes("@media (min-width:761px){"), true);
  assert.equal(block.indexOf("@media (min-width:761px)"), block.lastIndexOf("@media (min-width:761px)"));
  assert.equal(block.includes("@media (width>=761px)"), false);
  assert.equal(block.includes("@media (width<=760px)"), false);
  assert.equal(block.includes("@media (max-width:760px)"), false);
  let depth = 0;
  for (const ch of block) {
    if (ch === "{") depth++;
    else if (ch === "}") depth--;
    assert.ok(depth >= 0);
  }
  assert.equal(depth, 0);
  const whole = css + "\n";
  let all = 0;
  let quote = null;
  for (let i = 0; i < whole.length; i++) {
    const ch = whole[i];
    if (quote) {
      if (ch === "\\") {
        i++;
        continue;
      }
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
      continue;
    }
    if (ch === "{") all++;
    else if (ch === "}") all--;
  }
  assert.equal(all, 0, "dashboard.css braces balance");
  assert.match(block, /--ari-desk-ivory:linear-gradient\(160deg,#FFFDF8,#FAF6EE\)/);
  assert.match(block, /--ari-desk-foil:linear-gradient\(135deg,#C09C56,#D8BD7E 30%,#EEE2AF 50%,#D8BD7E 70%,#C09C56\)/);
  assert.match(block, /--ari-desk-shadow:0 0 0 3px rgba\(201,165,90,\.10\),0 6px 18px rgba\(18,63,41,\.08\)/);
  assert.equal(/\.ari-c3-eyebrow\s*\{/.test(block), false);
  assert.equal(/\.ari-c3-next\s*\{/.test(block), false);
  assert.match(css, /#ari-ag \.ari-c3-eyebrow\{[^}]*color:#86661f/);
  assert.match(css, /#ari-ag \.ari-c3-next\{[^}]*color:#56615b;border-top:1px solid #17231d17/);
});

test("dashboard.js hash matches MD5SUMS", () => {
  const sums = fs.readFileSync(path.join(root, "MD5SUMS"), "utf8");
  assert.equal(sums.includes(md5(jsPath)), true);
});

test("measured text pairs meet WCAG AA on ivory", () => {
  for (const [fg, bg] of [
    ["#123F29", "#FFFDF8"],
    ["#123F29", "#FAF6EE"],
    ["#8B6B2E", "#FFFDF8"],
    ["#8B6B2E", "#FAF6EE"],
    ["#1F5E43", "#FFFDF8"],
    ["#56615B", "#FFFDF8"],
    ["#86661F", "#FFFDF8"],
  ]) {
    assert.ok(contrast(fg, bg) >= 4.5, `${fg} on ${bg} = ${contrast(fg, bg).toFixed(2)}`);
  }
});

function fixture({ view = "agenda", withAppt = false, sidebar = false } = {}) {
  const days = [];
  for (let n = 1; n <= 35; n++) {
    const dom = ((n - 1) % 30) + 1;
    const cls = ["ari-ag-day"];
    if (n <= 2) cls.push("is-other");
    if (n === 8) cls.push("is-today");
    if (n === 15) cls.push("is-sel");
    const star = n === 10 ? '<i class="ari-ag-star">★</i>' : "";
    const dot = n === 12 ? '<i class="ari-ag-dot"></i>' : "";
    const tab = n <= 2 ? ' tabindex="-1"' : "";
    days.push(
      `<button class="${cls.join(" ")}" type="button"${tab} aria-label="Synthetic day ${dom}"><span class="ari-ag-num">${dom}</span><span class="ari-ag-marks">${dot}${star}</span></button>`
    );
  }
  const appt = withAppt
    ? `<div class="ari-ag-dayblock" data-date="2026-11-20"><button class="ari-ag-card" type="button"><span class="ari-ag-name">North Star Reading</span></button></div>`
    : "";
  const coming = withAppt ? '<div class="ari-c3-x ari-c3-next">Coming up</div>' : "";
  return `<!DOCTYPE html><html data-ari-no-crm-ai="v1"><head><meta charset="utf-8">
<link rel="stylesheet" href="file://${cssPath}">
<style>html,body{margin:0;background:#fbf7ee}#banner{font:600 13px/1.3 ui-sans-serif,sans-serif;color:#123F29;padding:8px 12px}</style>
</head><body data-ari-calendar="view" data-ari-cal8="v1" data-ari-cal-view="${view}">
<div id="banner">SYNTHETIC FIXTURE — dashboard.css only — not a Template capture</div>
<div id="shell" style="display:flex;width:100%">
${sidebar ? '<div id="side" style="width:260px;flex:none"></div>' : ""}
<div id="main" style="width:${sidebar ? "calc(100% - 260px)" : "100%"};min-width:0;box-sizing:border-box;padding:${sidebar ? "12px" : "0"}">
<div id="ari-ag" data-sig="synthetic">
  <section class="ari-ag-mini" aria-label="Month">
    <div class="ari-ag-mini-hd">
      <button class="ari-ag-arrow" type="button" aria-label="Previous month">‹</button>
      <h3>September<em> 2026</em></h3>
      <button class="ari-ag-arrow" type="button" aria-label="Next month">›</button>
    </div>
    <div class="ari-ag-grid">
      <span class="ari-ag-wd">S</span><span class="ari-ag-wd">M</span><span class="ari-ag-wd">T</span><span class="ari-ag-wd">W</span><span class="ari-ag-wd">T</span><span class="ari-ag-wd">F</span><span class="ari-ag-wd">S</span>
      ${days.join("")}
    </div>
    <div class="ari-ag-legend"><span class="ari-ag-lg-dot">Reading appointments</span><span class="ari-ag-lg-star">Spiritual events</span></div>
  </section>
  <section class="ari-ag-list" aria-label="Agenda">
    <div class="ari-c3-x ari-c3-head"><span class="ari-c3-eyebrow">Today</span><h3 class="ari-c3-title">Friday, November 6</h3></div>
    <p class="ari-c3-x ari-c3-none">No readings booked for this day.</p>
    ${coming}
    ${appt}
  </section>
</div>
</div>
</div>
<script>
function grab(sel){
  const el = document.querySelector(sel);
  if(!el) return null;
  const cs = getComputedStyle(el);
  const r = el.getBoundingClientRect();
  return {
    display: cs.display, color: cs.color, fill: cs.webkitTextFillColor,
    bg: cs.backgroundImage, bgColor: cs.backgroundColor, radius: cs.borderRadius, shadow: cs.boxShadow,
    borderTopWidth: cs.borderTopWidth, borderTopStyle: cs.borderTopStyle, borderTopColor: cs.borderTopColor,
    borderWidth: cs.borderTopWidth, borderStyle: cs.borderTopStyle,
    fontSize: cs.fontSize, fontFamily: cs.fontFamily, fontWeight: cs.fontWeight,
    fontStyle: cs.fontStyle, width: r.width, height: r.height, left: r.left, right: r.right, top: r.top,
    outlineStyle: cs.outlineStyle, outlineColor: cs.outlineColor, outlineWidth: cs.outlineWidth,
    pointer: cs.pointerEvents, opacity: cs.opacity
  };
}
window.__measure = function(){
  const today = document.querySelector(".is-today");
  try { today.focus({focusVisible:true}); } catch(e) { today.focus(); }
  const root = document.documentElement;
  const ag = document.getElementById("ari-ag");
  return {
    innerWidth: window.innerWidth,
    scrollWidth: root.scrollWidth,
    clientWidth: root.clientWidth,
    agScroll: ag.scrollWidth,
    agClient: ag.clientWidth,
    ivory: getComputedStyle(document.body).getPropertyValue("--ari-desk-ivory").trim(),
    foil: getComputedStyle(document.body).getPropertyValue("--ari-desk-foil").trim(),
    shadowToken: getComputedStyle(document.body).getPropertyValue("--ari-desk-shadow").trim(),
    ag: grab("#ari-ag"),
    mini: grab(".ari-ag-mini"),
    list: grab(".ari-ag-list"),
    h3: grab(".ari-ag-mini-hd h3"),
    em: grab(".ari-ag-mini-hd em"),
    arrow: grab(".ari-ag-arrow"),
    wd: grab(".ari-ag-wd"),
    num: grab(".ari-ag-day:not(.is-other):not(.is-sel):not(.is-today) .ari-ag-num"),
    todayNum: grab(".is-today .ari-ag-num"),
    selNum: grab(".is-sel .ari-ag-num"),
    otherNum: grab(".is-other .ari-ag-num"),
    star: grab(".ari-ag-star"),
    legend: grab(".ari-ag-legend"),
    legendStar: grab(".ari-ag-lg-star"),
    eye: grab(".ari-c3-eyebrow"),
    title: grab(".ari-c3-title"),
    none: grab(".ari-c3-none"),
    next: grab(".ari-c3-next"),
    card: grab(".ari-ag-card"),
    focus: { matches: today.matches(":focus-visible"), outline: getComputedStyle(today).outline, outlineColor: getComputedStyle(today).outlineColor, outlineStyle: getComputedStyle(today).outlineStyle },
    otherTab: document.querySelector(".is-other").tabIndex,
    todayTab: today.tabIndex,
    arrowLabels: Array.from(document.querySelectorAll(".ari-ag-arrow")).map(b => b.getAttribute("aria-label"))
  };
};
</script></body></html>`;
}

const CHROME = "/opt/google/chrome/google-chrome";

function runChrome(html, width, height = 1000) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ari-cal-"));
  const file = path.join(dir, "fixture.html");
  fs.writeFileSync(file, html);
  return new Promise((resolve, reject) => {
    const chrome = spawn(
      CHROME,
      [
        "--headless=new",
        "--no-sandbox",
        "--disable-gpu",
        "--disable-dev-shm-usage",
        "--remote-debugging-port=0",
        `--user-data-dir=${path.join(dir, "profile")}`,
        `file://${file}`,
      ],
      { stdio: ["ignore", "ignore", "pipe"] }
    );
    let err = "";
    let settled = false;
    const fail = (error) => {
      if (settled) return;
      settled = true;
      chrome.kill();
      reject(error);
    };
    const timer = setTimeout(() => fail(new Error(`chrome timeout\n${err.slice(-300)}`)), 20000);
    chrome.stderr.on("data", (buf) => {
      err += buf;
      const found = err.match(/DevTools listening on ws:\/\/127\.0\.0\.1:(\d+)\//);
      if (!found || settled) return;
      settled = true;
      clearTimeout(timer);
      cdp(Number(found[1]), width, height).then(
        (data) => {
          chrome.kill();
          resolve(data);
        },
        (error) => {
          chrome.kill();
          reject(error);
        }
      );
    });
    chrome.on("exit", (code) => {
      if (!settled) fail(new Error(`chrome exited ${code}`));
    });
  });
}

async function cdp(port, width, height) {
  const list = await fetch(`http://127.0.0.1:${port}/json/list`).then((r) => r.json());
  const page = list.find((t) => t.type === "page");
  if (!page) throw new Error("no page");
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.addEventListener("open", resolve);
    ws.addEventListener("error", reject);
  });
  let seq = 0;
  const pending = new Map();
  ws.addEventListener("message", (ev) => {
    const msg = JSON.parse(ev.data);
    if (!msg.id || !pending.has(msg.id)) return;
    const { resolve, reject } = pending.get(msg.id);
    pending.delete(msg.id);
    if (msg.error) reject(new Error(JSON.stringify(msg.error)));
    else resolve(msg.result);
  });
  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const id = ++seq;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  await send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: false,
  });
  let raw = "";
  for (let i = 0; i < 40 && !raw; i++) {
    const evaluated = await send("Runtime.evaluate", {
      expression: "window.__measure ? JSON.stringify(window.__measure()) : ''",
      returnByValue: true,
    });
    raw = (evaluated.result && evaluated.result.value) || "";
    if (!raw) await new Promise((r) => setTimeout(r, 50));
  }
  ws.close();
  if (!raw) throw new Error("measure missing");
  return JSON.parse(raw);
}

function noOverflow(data) {
  assert.ok(data.scrollWidth <= data.clientWidth + 1, `page overflow ${data.scrollWidth} > ${data.clientWidth}`);
  assert.ok(data.agScroll <= data.agClient + 1, `agenda overflow ${data.agScroll} > ${data.agClient}`);
}

test("phone widths keep the v3.113 stack and green mini", async () => {
  for (const width of [386, 390, 760]) {
    const data = await runChrome(fixture(), width, 900);
    assert.ok(Math.abs(data.innerWidth - width) <= 20, `viewport ${data.innerWidth} != ${width}`);
    assert.equal(data.ivory, "");
    assert.equal(data.ag.display, "block");
    assert.equal(data.list.display, "none");
    assert.match(data.mini.bg, /rgb\(27,\s*94,\s*59\)/);
    assert.equal(data.mini.bg.includes("192, 156, 86") || data.mini.bg.includes("192,156,86"), false);
    assert.equal(data.title.fontSize, "28px");
    assert.equal(data.num.fontSize, "22px");
    assert.match(data.none.borderTopStyle, /dashed|none|solid/);
    assert.equal(data.none.borderTopStyle, "dashed");
    rgbClose(data.eye.color, "#86661f");
    noOverflow(data);
    assert.deepEqual(data.arrowLabels, ["Previous month", "Next month"]);
    assert.equal(data.otherTab, -1);
    assert.equal(data.todayTab, 0);
    assert.equal(data.num.pointer, "auto");
    rgbClose(data.selNum.color, "#fffdf8");
    rgbClose(data.otherNum.color, "#d7e6da");
    rgbClose(data.focus.outlineColor, "#e3c98e");
  }
});

test("desktop agenda is ivory, side by side, and does not overflow", async () => {
  for (const width of [761, 1024, 1280, 1440, 1920]) {
    const data = await runChrome(fixture({ withAppt: true, sidebar: true }), width, 1100);
    assert.ok(Math.abs(data.innerWidth - width) <= 20, `viewport ${data.innerWidth} for ${width}`);
    assert.match(data.ivory, /160deg/);
    assert.match(data.ivory, /#FFFDF8|255,\s*253,\s*248/);
    assert.match(data.ivory, /#FAF6EE|250,\s*246,\s*238/);
    assert.match(data.foil, /#C09C56|192,\s*156,\s*86/);
    assert.match(data.foil, /#D8BD7E|216,\s*189,\s*126/);
    assert.match(data.foil, /#EEE2AF|238,\s*226,\s*175/);
    assert.equal(data.ag.display, "grid");
    assert.equal(data.list.display, "block");
    assert.ok(data.mini.right <= data.list.left + 1, `not side by side mini ${data.mini.right} list ${data.list.left}`);
    assert.ok(Math.abs(data.mini.top - data.list.top) < 4, "cards not top-aligned");
    assert.ok(data.mini.width <= 420 + 1, `mini width ${data.mini.width} at ${width}`);
    if (data.ag.width >= 340 + 24 + 140) {
      assert.ok(data.mini.width >= 340 - 1, `mini width ${data.mini.width} at ${width} content ${data.ag.width}`);
    } else {
      assert.ok(data.mini.width >= 240, `mini width ${data.mini.width} at ${width} content ${data.ag.width}`);
    }
    assert.ok(data.list.width >= 140 - 1, `today column ${data.list.width}`);
    assert.match(data.mini.bg, /255,\s*253,\s*248/);
    assert.match(data.mini.bg, /192,\s*156,\s*86/);
    assert.equal(data.mini.bg.includes("27, 94, 59") || data.mini.bg.includes("27,94,59"), false);
    assert.equal(data.mini.radius, "18px");
    assert.equal(data.list.radius, "16px");
    assert.match(data.mini.shadow, /201,\s*165,\s*90/);
    assert.match(data.list.shadow, /18,\s*63,\s*41/);
    rgbClose(data.h3.color, "#123F29");
    assert.equal(data.h3.fontSize, "28px");
    assert.match(data.h3.fontFamily, /Cormorant Garamond/);
    rgbClose(data.em.color, "#123F29");
    assert.equal(data.em.fontStyle, "italic");
    rgbClose(data.num.color, "#123F29");
    assert.equal(data.num.fontSize, "15px");
    assert.match(data.num.fontFamily, /Jost/);
    assert.equal(data.num.radius, "12px");
    rgbClose(data.arrow.color, "#8B6B2E");
    rgbClose(data.arrow.fill, "#8B6B2E");
    rgbClose(data.arrow.bgColor, "#FFFDF8");
    assert.ok(data.arrow.radius === "50%" || data.arrow.radius === "18px", data.arrow.radius);
    assert.ok(Math.abs(data.arrow.width - 36) < 1, `arrow width ${data.arrow.width}`);
    rgbClose(data.wd.color, "#123F29");
    rgbClose(data.star.color, "#8B6B2E");
    assert.equal(data.star.fontSize, "13px");
    rgbClose(data.legend.color, "#123F29");
    assert.equal(data.legend.fontSize, "14px");
    assert.equal(data.legend.fontWeight, "600");
    assert.match(data.legend.fontFamily, /Jost/);
    assert.equal(data.legend.borderTopWidth, "1px");
    assert.equal(data.legend.borderTopStyle, "solid");
    rgbClose(data.title.color, "#1F5E43");
    rgbClose(data.eye.color, "#86661f");
    rgbClose(data.none.color, "#123F29");
    assert.equal(data.none.borderTopStyle, "solid");
    assert.equal(data.none.borderTopWidth, "1px");
    rgbClose(data.none.borderTopColor, "#C9A55A", 2);
    rgbClose(data.next.color, "#56615B");
    assert.equal(data.next.borderTopWidth, "1px");
    rgbClose(data.card.color, "#17231d");
    rgbClose(data.card.bgColor, "#ffffff");
    noOverflow(data);
    assert.equal(data.otherTab, -1);
    assert.equal(data.arrow.pointer, "auto");
    assert.equal(data.num.pointer, "auto");
  }
});

test("761 is the boundary and grid view is not forced into the agenda grid", async () => {
  const phone = await runChrome(fixture(), 760, 900);
  const desk = await runChrome(fixture(), 761, 1000);
  assert.equal(phone.ag.display, "block");
  assert.equal(phone.ivory, "");
  assert.equal(desk.ag.display, "grid");
  assert.ok(desk.ivory.length > 0);
  const grid = await runChrome(fixture({ view: "grid" }), 1280, 900);
  assert.equal(grid.ivory, "");
  assert.notEqual(grid.ag.display, "grid");
  assert.match(grid.mini.bg, /rgb\(27,\s*94,\s*59\)/);
});

test("keyboard focus keeps the existing day outline", async () => {
  const phone = await runChrome(fixture(), 390, 900);
  assert.equal(phone.focus.matches, true, "today day did not match :focus-visible");
  assert.equal(phone.focus.outlineStyle, "solid");
  rgbClose(phone.focus.outlineColor, "#e3c98e");
  const desk = await runChrome(fixture({ sidebar: true }), 1280, 1000);
  assert.equal(desk.focus.matches, true);
  assert.equal(desk.focus.outlineStyle, "solid");
  rgbClose(desk.focus.outlineColor, "#1f5e43");
  assert.match(css, /\.ari-ag-day:focus-visible\{outline-offset:-2px;outline:2px solid #e3c98e\}/);
  assert.match(css, /#ari-ag \.ari-ag-card:focus-visible\{outline-offset:2px!important;outline:2px solid #1f5e43!important\}/);
});

function decodePng(buf) {
  let o = 8;
  const idat = [];
  let w = 0;
  let h = 0;
  let color = 2;
  while (o < buf.length) {
    const n = buf.readUInt32BE(o);
    const typ = buf.toString("ascii", o + 4, o + 8);
    if (typ === "IHDR") {
      w = buf.readUInt32BE(o + 8);
      h = buf.readUInt32BE(o + 12);
      color = buf[o + 17];
    } else if (typ === "IDAT") idat.push(buf.subarray(o + 8, o + 8 + n));
    else if (typ === "IEND") break;
    o += 12 + n;
  }
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const bpp = color === 6 ? 4 : 3;
  const stride = w * bpp + 1;
  const out = new Uint8Array(w * h * 3);
  let prev = new Uint8Array(w * bpp);
  const paeth = (a, b, c) => {
    const p = a + b - c;
    const pa = Math.abs(p - a);
    const pb = Math.abs(p - b);
    const pc = Math.abs(p - c);
    return pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
  };
  for (let y = 0; y < h; y++) {
    const row = raw.subarray(y * stride, (y + 1) * stride);
    const f = row[0];
    const cur = new Uint8Array(w * bpp);
    for (let x = 0; x < w * bpp; x++) {
      const left = x >= bpp ? cur[x - bpp] : 0;
      const up = prev[x];
      const ul = x >= bpp ? prev[x - bpp] : 0;
      const v = row[x + 1];
      cur[x] =
        f === 0 ? v : f === 1 ? (v + left) & 255 : f === 2 ? (v + up) & 255 : f === 3 ? (v + ((left + up) >> 1)) & 255 : (v + paeth(left, up, ul)) & 255;
    }
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 3;
      const j = x * bpp;
      out[i] = cur[j];
      out[i + 1] = cur[j + 1];
      out[i + 2] = cur[j + 2];
    }
    prev = cur;
  }
  return { w, h, out };
}

function pix(img, x, y) {
  x = Math.max(0, Math.min(img.w - 1, x | 0));
  y = Math.max(0, Math.min(img.h - 1, y | 0));
  const i = (y * img.w + x) * 3;
  return [img.out[i], img.out[i + 1], img.out[i + 2]];
}

function relLum(rgb) {
  const c = rgb.map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}

function rgbContrast(a, b) {
  const A = relLum(a);
  const B = relLum(b);
  return (Math.max(A, B) + 0.05) / (Math.min(A, B) + 0.05);
}

function parseRgb(s) {
  const m = String(s).match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  assert.ok(m, `not rgb: ${s}`);
  return [Number(m[1]), Number(m[2]), Number(m[3])];
}

function stateFixture() {
  const spec = [
    ["other", 1],
    ["normal", 4],
    ["today", 8],
    ["hover", 10],
    ["selected", 15],
    ["both", 22],
    ["focus", 29],
  ];
  const days = [];
  for (let n = 1; n <= 35; n++) {
    const hit = spec.find((s) => s[1] === n);
    const state = hit ? hit[0] : "plain";
    const cls = ["ari-ag-day"];
    if (state === "other") cls.push("is-other");
    if (state === "today" || state === "both") cls.push("is-today");
    if (state === "selected" || state === "both") cls.push("is-sel");
    days.push(
      `<button id="d-${state}-${n}" class="${cls.join(" ")}" type="button" data-state="${state}"><span class="ari-ag-num">${n}</span></button>`
    );
  }
  const wds = ["S", "M", "T", "W", "T", "F", "S"].map((d) => `<span class="ari-ag-wd">${d}</span>`).join("");
  return `<!DOCTYPE html><html data-ari-no-crm-ai="v1"><head><link rel="stylesheet" href="file://${cssPath}"></head>
<body data-ari-calendar="view" data-ari-cal8="v1" data-ari-cal-view="agenda" style="margin:0;background:#fbf7ee">
<div style="display:flex;width:100%"><div style="width:260px;flex:none"></div>
<div style="width:calc(100% - 260px);min-width:0;box-sizing:border-box;padding:12px">
<div id="ari-ag"><section class="ari-ag-mini"><div class="ari-ag-grid">${wds}${days.join("")}</div></section>
<section class="ari-ag-list"></section></div></div></div>
<script>window.__rects=function(){const o={}; for (const el of document.querySelectorAll("[data-state]:not([data-state=plain])")){const num=el.querySelector(".ari-ag-num"); const r=el.getBoundingClientRect(); const n=num.getBoundingClientRect(); const cs=getComputedStyle(num); const ds=getComputedStyle(el); o[el.dataset.state]={color:cs.color,fill:cs.webkitTextFillColor,day:[r.x,r.y,r.width,r.height],num:[n.x,n.y,n.width,n.height],os:ds.outlineStyle,oc:ds.outlineColor};} return o;};</script>
</body></html>`;
}

async function paintStates(width) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ari-paint-"));
  const file = path.join(dir, "fixture.html");
  fs.writeFileSync(file, stateFixture());
  const chrome = spawn(
    CHROME,
    [
      "--headless=new",
      "--no-sandbox",
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--remote-debugging-port=0",
      `--user-data-dir=${path.join(dir, "p")}`,
      `file://${file}`,
    ],
    { stdio: ["ignore", "ignore", "pipe"] }
  );
  let err = "";
  const port = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("no port")), 15000);
    chrome.stderr.on("data", (buf) => {
      err += buf;
      const m = err.match(/127\.0\.0\.1:(\d+)\//);
      if (m) {
        clearTimeout(timer);
        resolve(Number(m[1]));
      }
    });
  });
  const list = await fetch(`http://127.0.0.1:${port}/json/list`).then((r) => r.json());
  const page = list.find((t) => t.type === "page");
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolve) => ws.addEventListener("open", resolve));
  let seq = 0;
  const pending = new Map();
  ws.addEventListener("message", (ev) => {
    const msg = JSON.parse(ev.data);
    if (!msg.id || !pending.has(msg.id)) return;
    const waiter = pending.get(msg.id);
    pending.delete(msg.id);
    if (msg.error) waiter.reject(new Error(JSON.stringify(msg.error)));
    else waiter.resolve(msg.result);
  });
  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const id = ++seq;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  await send("Emulation.setDeviceMetricsOverride", { width, height: 900, deviceScaleFactor: 1, mobile: false });
  await send("DOM.enable");
  await send("CSS.enable");
  for (let i = 0; i < 30; i++) {
    const ready = await send("Runtime.evaluate", { expression: "window.__rects?1:0", returnByValue: true });
    if (ready.result.value) break;
    await new Promise((r) => setTimeout(r, 40));
  }
  const doc = await send("DOM.getDocument");
  const hover = await send("DOM.querySelector", { nodeId: doc.root.nodeId, selector: "#d-hover-10" });
  await send("CSS.forcePseudoState", { nodeId: hover.nodeId, forcedPseudoClasses: ["hover"] });
  const focus = await send("DOM.querySelector", { nodeId: doc.root.nodeId, selector: "#d-focus-29" });
  await send("CSS.forcePseudoState", { nodeId: focus.nodeId, forcedPseudoClasses: ["focus", "focus-visible"] });
  await new Promise((r) => setTimeout(r, 40));
  const evaluated = await send("Runtime.evaluate", { expression: "JSON.stringify(window.__rects())", returnByValue: true });
  const shot = await send("Page.captureScreenshot", { format: "png" });
  ws.close();
  chrome.kill();
  return { rects: JSON.parse(evaluated.result.value), img: decodePng(Buffer.from(shot.data, "base64")) };
}

test("desktop day states pass on the painted background and the old slab colors fail", async () => {
  for (const width of [761, 1280]) {
    const { rects, img } = await paintStates(width);
    const interior = (name) => {
      const d = rects[name].day;
      return pix(img, Math.round(d[0] + d[2] / 2), Math.round(d[1] + d[3] - 4));
    };
    const textOf = (name) => parseRgb(rects[name].fill || rects[name].color);
    const textContrast = (name) => rgbContrast(textOf(name), interior(name));
    for (const name of ["normal", "other", "today", "hover", "selected", "both", "focus"]) {
      assert.ok(textContrast(name) >= 4.5, `${width} ${name} text ${textContrast(name).toFixed(2)} on ${interior(name)}`);
    }
    const ringContrast = (name) => {
      const n = rects[name].num;
      const bg = interior(name);
      const x = Math.round(n[0]);
      const y = Math.round(n[1]);
      const w = Math.max(1, Math.round(n[2]));
      const h = Math.max(1, Math.round(n[3]));
      const target = [139, 107, 46];
      let best = null;
      const consider = (p) => {
        const d = Math.abs(p[0] - target[0]) + Math.abs(p[1] - target[1]) + Math.abs(p[2] - target[2]);
        const c = rgbContrast(p, bg);
        if (!best || d < best.d) best = { d, c, p };
      };
      for (let i = 0; i < w; i++) {
        consider(pix(img, x + i, y));
        consider(pix(img, x + i, y + h - 1));
      }
      for (let i = 0; i < h; i++) {
        consider(pix(img, x, y + i));
        consider(pix(img, x + w - 1, y + i));
      }
      return best;
    };
    for (const name of ["today", "both"]) {
      const ring = ringContrast(name);
      assert.ok(ring.d < 80, `${width} ${name} ring pixel ${ring.p} is not the gold ink`);
      assert.ok(ring.c >= 3, `${width} ${name} ring contrast ${ring.c.toFixed(2)}`);
    }
    for (const name of ["selected", "both"]) {
      const d = rects[name].day;
      const cx = Math.round(d[0] + d[2] / 2);
      const top = Math.round(d[1]);
      let edge = 0;
      for (let dy = 0; dy <= 2; dy++) edge = Math.max(edge, rgbContrast(pix(img, cx, top + dy), pix(img, cx, top - 4)));
      assert.ok(edge >= 3, `${name} edge ${edge.toFixed(2)}`);
    }
    const focusDay = rects.focus.day;
    const focusX = Math.round(focusDay[0] + focusDay[2] / 2);
    const focusTop = Math.round(focusDay[1]);
    const outlinePx = pix(img, focusX, focusTop - 3);
    const beyond = pix(img, focusX, focusTop - 7);
    assert.equal(rects.focus.os, "solid");
    assert.ok(rgbContrast(outlinePx, beyond) >= 3, `focus ${rgbContrast(outlinePx, beyond).toFixed(2)}`);
    const hoverBg = interior("hover");
    const normalBg = interior("normal");
    const channelDelta = hoverBg.reduce((sum, v, i) => sum + Math.abs(v - normalBg[i]), 0);
    assert.ok(channelDelta >= 40, `hover fill is not distinct from the card (${channelDelta})`);
    const ivory = interior("normal");
    assert.ok(rgbContrast([255, 253, 248], ivory) < 4.5, "old selected ivory text would still fail on this card");
    assert.ok(rgbContrast([215, 230, 218], ivory) < 4.5, "old other-month text would still fail on this card");
    assert.ok(rgbContrast([227, 201, 142], ivory) < 3, "old gold focus would still fail on this card");
  }
});
