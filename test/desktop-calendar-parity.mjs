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

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cssPath = path.join(root, "dashboard.css");
const jsPath = path.join(root, "dashboard.js");
const css = fs.readFileSync(cssPath, "utf8");

const V3113_JS_MD5 = "180d5480bae68c5eadd7dc05e0e250a7";

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
  assert.equal(block.indexOf("@media (width>=761px)"), block.lastIndexOf("@media (width>=761px)"));
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

test("dashboard.js is unchanged from v3.113", () => {
  assert.equal(md5(jsPath), V3113_JS_MD5);
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

function fixture({ view = "agenda", withAppt = false } = {}) {
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
  }
});

test("desktop agenda is ivory, side by side, and does not overflow", async () => {
  for (const width of [761, 1024, 1280, 1440, 1920]) {
    const data = await runChrome(fixture({ withAppt: true }), width, 1100);
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
    assert.ok(data.mini.width >= 340 - 1 && data.mini.width <= 420 + 1, `mini width ${data.mini.width} at ${width}`);
    assert.ok(data.list.width > 80, `today column ${data.list.width}`);
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
    rgbClose(data.selNum.color, "#fffdf8");
    rgbClose(data.otherNum.color, "#d7e6da");
    assert.match(data.todayNum.shadow, /227,\s*201,\s*142|e3c98e/i);
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
  const data = await runChrome(fixture(), 1280, 1000);
  assert.equal(data.focus.matches, true, "today day did not match :focus-visible");
  assert.equal(data.focus.outlineStyle, "solid");
  rgbClose(data.focus.outlineColor, "#e3c98e");
  assert.match(css, /\.ari-ag-day:focus-visible\{outline-offset:-2px;outline:2px solid #e3c98e\}/);
  assert.match(css, /#ari-ag \.ari-ag-card:focus-visible\{outline-offset:2px!important;outline:2px solid #1f5e43!important\}/);
});
