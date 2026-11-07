/**
 * Writes labeled synthetic screenshots. Not a Template capture.
 * Usage: node test/synthetic-preview.mjs /path/to/outdir
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cssPath = path.join(root, "dashboard.css");
const outDir = process.argv[2] || path.join(os.tmpdir(), "ari-cal-shots");
fs.mkdirSync(outDir, { recursive: true });

function html(note) {
  const days = [];
  for (let n = 1; n <= 35; n++) {
    const dom = ((n - 1) % 30) + 1;
    const cls = ["ari-ag-day"];
    if (n <= 2) cls.push("is-other");
    if (n === 8) cls.push("is-today");
    if (n === 15) cls.push("is-sel");
    if (n === 22) cls.push("is-today", "is-sel");
    const star = n === 10 ? '<i class="ari-ag-star">★</i>' : "";
    const dot = n === 12 ? '<i class="ari-ag-dot"></i>' : "";
    days.push(
      `<button class="${cls.join(" ")}" type="button"><span class="ari-ag-num">${dom}</span><span class="ari-ag-marks">${dot}${star}</span></button>`
    );
  }
  return `<!DOCTYPE html><html data-ari-no-crm-ai="v1"><head><meta charset="utf-8">
<link rel="stylesheet" href="file://${cssPath}">
<style>html,body{margin:0;background:#fbf7ee}#banner{font:600 14px/1.35 ui-sans-serif,sans-serif;color:#123F29;background:#fffdf8;padding:10px 14px;border-bottom:1px solid #eadfcb}</style>
</head><body data-ari-calendar="view" data-ari-cal8="v1" data-ari-cal-view="agenda">
<div id="banner">SYNTHETIC FIXTURE — dashboard.css only — not a Template capture. ${note}</div>
<div style="display:flex;width:100%">${note.includes("desktop") ? '<div style="width:260px;flex:none"></div>' : ""}
<div style="width:${note.includes("desktop") ? "calc(100% - 260px)" : "100%"};min-width:0;box-sizing:border-box;padding:${note.includes("desktop") ? "12px" : "0"}">
<div id="ari-ag">
  <section class="ari-ag-mini" aria-label="Month">
    <div class="ari-ag-mini-hd">
      <button class="ari-ag-arrow" type="button" aria-label="Previous month">‹</button>
      <h3>November<em> 2026</em></h3>
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
  </section>
</div>
</div>
</div>
<div id="pad" style="height:24px"></div>
</body></html>`;
}

function shot(width, height, name, note) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ari-shot-"));
  const file = path.join(dir, "fixture.html");
  fs.writeFileSync(file, html(note));
  const dest = path.join(outDir, name);
  return new Promise((resolve, reject) => {
    const chrome = spawn(
      "/opt/google/chrome/google-chrome",
      [
        "--headless=new",
        "--no-sandbox",
        "--disable-gpu",
        "--disable-dev-shm-usage",
        "--hide-scrollbars",
        "--remote-debugging-port=0",
        `--user-data-dir=${path.join(dir, "p")}`,
        `file://${file}`,
      ],
      { stdio: ["ignore", "ignore", "pipe"] }
    );
    let err = "";
    let started = false;
    const timer = setTimeout(() => {
      chrome.kill();
      reject(new Error("timeout " + name));
    }, 20000);
    chrome.stderr.on("data", async (buf) => {
      err += buf;
      const found = err.match(/DevTools listening on ws:\/\/127\.0\.0\.1:(\d+)\//);
      if (!found || started) return;
      started = true;
      try {
        const list = await fetch(`http://127.0.0.1:${found[1]}/json/list`).then((r) => r.json());
        const page = list.find((t) => t.type === "page");
        const ws = new WebSocket(page.webSocketDebuggerUrl);
        await new Promise((res, rej) => {
          ws.addEventListener("open", res);
          ws.addEventListener("error", rej);
        });
        let seq = 0;
        const pending = new Map();
        ws.addEventListener("message", (ev) => {
          const msg = JSON.parse(ev.data);
          if (!msg.id || !pending.has(msg.id)) return;
          const p = pending.get(msg.id);
          pending.delete(msg.id);
          if (msg.error) p.reject(new Error(JSON.stringify(msg.error)));
          else p.resolve(msg.result);
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
        await new Promise((r) => setTimeout(r, 80));
        const clip = await send("Runtime.evaluate", {
          expression:
            "JSON.stringify({w:Math.min(document.documentElement.scrollWidth, window.innerWidth),h:Math.min(document.documentElement.scrollHeight, 1400)})",
          returnByValue: true,
        });
        const box = JSON.parse(clip.result.value);
        const png = await send("Page.captureScreenshot", {
          format: "png",
          clip: { x: 0, y: 0, width: box.w, height: box.h, scale: 1 },
          captureBeyondViewport: true,
        });
        fs.writeFileSync(dest, Buffer.from(png.data, "base64"));
        ws.close();
        clearTimeout(timer);
        chrome.kill();
        resolve(dest);
      } catch (error) {
        clearTimeout(timer);
        chrome.kill();
        reject(error);
      }
    });
  });
}

const jobs = [
  [390, 900, "synthetic-phone-390.png", "390px — phone rules preserved. This is the source green stack, not the owner ivory capture."],
  [760, 1100, "synthetic-phone-760.png", "760px — still the phone stack."],
  [761, 1100, "synthetic-desktop-761.png", "761px desktop — 260px sidebar, content is the remainder."],
  [1280, 1000, "synthetic-desktop-1280.png", "1280px desktop — ivory month left, Today card right, 260px sidebar."],
];
for (const job of jobs) {
  const dest = await shot(...job);
  console.log(dest);
}
