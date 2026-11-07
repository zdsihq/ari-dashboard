/**
 * Synthetic Ari Chats scroll-layer checks against dashboard.css only.
 * Not a live GHL or Template capture: no auth, no tenant, no network account, no real contacts.
 *
 * Source fact this file locks in:
 *   canvas=all paints #app with two radials plus a cover photo and background-attachment:fixed
 *   (the shorthand keyword "fixed"). The messages wrapper paints a second cover photo with one
 *   radial and attachment scroll, and that wrapper covers #app. The chats fix turns the fixed
 *   under-layer off. It does not restyle the wrapper and does not add an ::before.
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
const V3113_JS_MD5 = "180d5480bae68c5eadd7dc05e0e250a7";
const CHROME = "/opt/google/chrome/google-chrome";
const CHATS_MARK_START = "/* BEGIN ari-chats-scroll-layer */";
const CHATS_MARK_END = "/* END ari-chats-scroll-layer */";

function md5(file) {
  return crypto.createHash("md5").update(fs.readFileSync(file)).digest("hex");
}

function declarationsEnding(selectorEnd) {
  const out = [];
  let from = 0;
  while (from < css.length) {
    const i = css.indexOf(selectorEnd, from);
    if (i < 0) break;
    const open = i + selectorEnd.length;
    if (css[open] === "{") {
      const close = css.indexOf("}", open);
      assert.ok(close > open, selectorEnd);
      out.push(css.slice(open + 1, close));
    }
    from = open + 1;
  }
  return out;
}

function urlToken(decl) {
  const m = String(decl).match(/url\(([^)]+)\)/);
  assert.ok(m, "missing background url");
  return m[1].replace(/^["']|["']$/g, "");
}

const appDecls = declarationsEnding("html[data-ari-soft=v1][data-ari-luxe=v1][data-ari-lx-canvas=all] body #app");
assert.equal(appDecls.length, 1, "canvas=all #app rule count");
const fixedAppDecl = appDecls[0];
const fixedAppUrl = urlToken(fixedAppDecl);
const wrapperDecls = declarationsEnding("section.hl_wrapper:has(#conversations-layout)").filter((decl) => decl.includes("url("));
assert.equal(wrapperDecls.length, 1, "messages wrapper photo rule count");
const wrapperDecl = wrapperDecls[0];
const wrapperUrl = urlToken(wrapperDecl);

function chatsBlock() {
  const start = css.indexOf(CHATS_MARK_START);
  const end = css.indexOf(CHATS_MARK_END);
  assert.ok(start > 0 && end > start, "chats scroll-layer block markers");
  return css.slice(start, end);
}

const shotMode = process.argv[2] === "--shots";

if (!shotMode) test("source keeps the old fixed #app paint and overrides it only on Ari Chats", () => {
  assert.match(
    fixedAppDecl,
    /^background:radial-gradient\(70% 40% at 100% 0,#f4dcd58c,#0000 70%\),radial-gradient\(60% 40% at 0 100%,#cee2d080,#0000 70%\),#fbf6ec url\([^)]+\) 50%\/cover no-repeat fixed!important$/
  );
  assert.equal((fixedAppDecl.match(/radial-gradient\(/g) || []).length, 2);
  assert.match(wrapperDecl, /^background:radial-gradient\(70% 40% at 100% 0,#f4dcd573,#0000 70%\),#fbf6ec url\([^)]+\) 50%\/cover no-repeat!important$/);
  assert.equal((wrapperDecl.match(/radial-gradient\(/g) || []).length, 1);
  assert.equal(/fixed/.test(wrapperDecl), false, "visible wrapper photo uses the fixed attachment");
  assert.equal(wrapperUrl, fixedAppUrl, "wrapper photo diverged from the canvas photo");
  assert.match(fixedAppUrl, /^https:\/\/[^/]+\/[^/]+\/media\/[^/]+\.jpe?g$/);
  const block = chatsBlock();
  assert.equal(block.includes("@media"), false);
  assert.equal(block.includes("::before"), false);
  assert.equal(block.includes(":before"), false);
  assert.equal(block.includes("url("), false);
  assert.equal(block.includes(fixedAppUrl), false);
  assert.equal(block.includes("fixed"), false);
  assert.match(block, /#app\{background:transparent!important;background-image:none!important;background-attachment:scroll!important\}/);
  assert.match(
    block,
    /html\[data-ari-soft=v1\]\[data-ari-luxe=v1\]\[data-ari-lx-canvas=all\]\[data-ari-no-crm-ai=v1\]\[data-ari-msg-luxe=v2\] body\[data-ari-shell=v1\]\[data-ari-messages-layout=v2\] #app\{/
  );
  assert.equal(md5(jsPath), V3113_JS_MD5);
});

function fixture({ messages = true, phone = false } = {}) {
  const rows = Array.from({ length: 8 }, (_, i) => {
    return `<a class="row" href="#sample-${i}"><span class="av">S${i + 1}</span><span><b>Sample ${i + 1}</b><small>Synthetic preview line</small></span></a>`;
  }).join("");
  const bubbles = Array.from({ length: 14 }, (_, i) => {
    return `<p class="${i % 3 === 0 ? "mine" : "theirs"}">Synthetic message ${i + 1}. No real contact.</p>`;
  }).join("");
  const htmlAttrs = [
    'data-ari-soft="v1"',
    'data-ari-luxe="v1"',
    'data-ari-lx-canvas="all"',
    'data-ari-no-crm-ai="v1"',
  ];
  if (messages) htmlAttrs.push('data-ari-msg-luxe="v2"');
  if (phone) htmlAttrs.push("data-ari-noz");
  const bodyAttrs = ['data-ari-shell="v1"'];
  if (messages) bodyAttrs.push('data-ari-messages-layout="v2"');
  if (phone) bodyAttrs.push('data-ari-conv-open');
  return `<!DOCTYPE html><html ${htmlAttrs.join(" ")}><head><meta charset="utf-8">
<link rel="stylesheet" href="file://${cssPath}">
<style>
  html,body{margin:0;height:100%;overflow:hidden}
  #banner{position:relative;z-index:6;height:28px;box-sizing:border-box;font:600 12px/28px ui-sans-serif,sans-serif;color:#123f29;background:#fffdf8;padding:0 10px}
  #app{height:calc(100% - 28px)}
  .sidebar-v2-location,section.w-full,section.hl_wrapper{height:100%}
  #conversations-layout{display:flex;height:100%;min-height:0;box-sizing:border-box}
  #conversations-list{flex:0 0 240px;max-width:46%;overflow:auto;position:relative;z-index:1}
  #conversations-central-panel-viewer{flex:1;min-width:0;display:flex;flex-direction:column;min-height:0;position:relative;z-index:1}
  #transcript{flex:none!important;height:280px!important;max-height:46vh!important;overflow:auto!important;padding:12px!important}
  #composer{position:relative!important;z-index:3!important}
  .row{display:flex;gap:8px;align-items:center;padding:10px 12px;color:inherit;text-decoration:none}
  .row small{display:block;font-weight:400}
  .av{width:32px;height:32px;border-radius:50%;display:grid;place-items:center;background:#e9d08f;color:#123f29;flex:none}
  .mine,.theirs{max-width:78%;margin:6px 0;padding:8px 12px;border-radius:14px}
  .mine{margin-left:auto;background:#1b5e3b;color:#fbf6ec}
  .theirs{background:#fffdf8;color:#1f2a24}
  #composer{display:flex;gap:8px;padding:8px;position:relative;z-index:2}
  #probe-input{flex:1;min-width:0;font:16px/1.3 ui-sans-serif,sans-serif;padding:8px}
  #probe-send,#probe-nav{font:600 14px/1 ui-sans-serif,sans-serif;padding:8px 12px}
  #side-label{padding:12px;color:#fbf6ec;font:600 13px/1.3 ui-sans-serif,sans-serif}
</style></head><body ${bodyAttrs.join(" ")}>
<div id="banner">SYNTHETIC FIXTURE — dashboard.css only — not live GHL</div>
<div id="app">
  <aside id="sidebar-v2"><div id="side-label">Menu</div><button type="button" id="probe-nav">Customers</button></aside>
  <div class="sidebar-v2-location"><section class="w-full"><section class="hl_wrapper">
    <div id="conversations-layout">
      <div id="conversations-list">${rows}</div>
      <div id="conversations-central-panel-viewer">
        <div id="transcript" data-ari-msg-scroll>${bubbles}</div>
        <div id="composer"><input id="probe-input" aria-label="Message"><button type="button" id="probe-send">Send</button></div>
      </div>
    </div>
  </section></section></div>
</div>
<script>
window.__clicks=0;
document.getElementById("probe-send").addEventListener("click",function(){window.__clicks++});
window.__read=function(){
  const app=document.getElementById("app");
  const before=getComputedStyle(app,"::before");
  const wrap=document.querySelector("section.hl_wrapper");
  const wcs=getComputedStyle(wrap);
  const acs=getComputedStyle(app);
  const send=document.getElementById("probe-send");
  const input=document.getElementById("probe-input");
  const nav=document.getElementById("probe-nav");
  const sr=send.getBoundingClientRect();
  const hit=document.elementFromPoint(Math.max(1, Math.min(innerWidth-2, sr.left+sr.width/2)), Math.max(1, Math.min(innerHeight-2, sr.top+sr.height/2)));
  input.focus();
  const inputActive=document.activeElement===input;
  send.focus();
  const scroller=document.getElementById("transcript");
  scroller.scrollTop=0;
  const top0=scroller.scrollTop;
  scroller.scrollTop=180;
  const root=document.documentElement;
  const photo=function(s){return (s||"").indexOf(${JSON.stringify(fixedAppUrl)})!==-1};
  return {
    vw:innerWidth, vh:innerHeight,
    app:{image:acs.backgroundImage, attachment:acs.backgroundAttachment, size:acs.backgroundSize, position:acs.backgroundPosition, color:acs.backgroundColor, isolation:acs.isolation},
    before:{content:before.content, image:before.backgroundImage, position:before.position, z:before.zIndex, pe:before.pointerEvents},
    wrap:{image:wcs.backgroundImage, attachment:wcs.backgroundAttachment, size:wcs.backgroundSize, position:wcs.backgroundPosition, color:wcs.backgroundColor},
    listPhoto:photo(getComputedStyle(document.getElementById("conversations-list")).backgroundImage),
    threadPhoto:photo(getComputedStyle(document.getElementById("conversations-central-panel-viewer")).backgroundImage),
    appPhoto:photo(acs.backgroundImage),
    wrapPhoto:photo(wcs.backgroundImage),
    beforePhoto:photo(before.backgroundImage),
    overflow:{sw:root.scrollWidth, cw:root.clientWidth, sh:root.scrollHeight, ch:root.clientHeight, body:getComputedStyle(document.body).overflowX},
    hit:hit ? (hit.id || hit.tagName) : "",
    sendRect:[Math.round(sr.x),Math.round(sr.y),Math.round(sr.width),Math.round(sr.height)],
    listDisplay:getComputedStyle(document.getElementById("conversations-list")).display,
    inputActive:inputActive,
    sendActive:document.activeElement===send,
    scrolled:scroller.scrollTop>top0,
    scrollTop:scroller.scrollTop,
    clicks:window.__clicks,
    navDisplay:getComputedStyle(nav).display,
    sendPe:getComputedStyle(send).pointerEvents,
    reduced:matchMedia("(prefers-reduced-motion: reduce)").matches
  };
};
window.__route=function(on){
  const root=document.documentElement;
  if(on){root.setAttribute("data-ari-msg-luxe","v2"); document.body.setAttribute("data-ari-messages-layout","v2");}
  else {root.removeAttribute("data-ari-msg-luxe"); document.body.removeAttribute("data-ari-messages-layout");}
  return window.__read();
};
window.__clickSend=function(){
  document.getElementById("probe-send").click();
  return window.__clicks;
};
</script></body></html>`;
}

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

function pixelDiff(a, b) {
  const w = Math.min(a.w, b.w);
  const h = Math.min(a.h, b.h);
  let sum = 0;
  let max = 0;
  let changed = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * a.w + x) * 3;
      const j = (y * b.w + x) * 3;
      const d =
        Math.abs(a.out[i] - b.out[j]) + Math.abs(a.out[i + 1] - b.out[j + 1]) + Math.abs(a.out[i + 2] - b.out[j + 2]);
      sum += d;
      if (d > max) max = d;
      if (d > 0) changed++;
    }
  }
  return { mean: sum / (w * h), max, changed, w, h };
}

function openChrome(html, width, height) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ari-chats-"));
  const file = path.join(dir, "fixture.html");
  fs.writeFileSync(file, html);
  const chrome = spawn(
    CHROME,
    [
      "--headless=new",
      "--no-sandbox",
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--hide-scrollbars",
      `--window-size=${width},${height}`,
      "--remote-debugging-port=0",
      `--user-data-dir=${path.join(dir, "p")}`,
      `file://${file}`,
    ],
    { stdio: ["ignore", "ignore", "pipe"] }
  );
  let err = "";
  const portPromise = new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`chrome timeout\n${err.slice(-300)}`)), 15000);
    chrome.stderr.on("data", (buf) => {
      err += buf;
      const found = err.match(/127\.0\.0\.1:(\d+)\//);
      if (found) {
        clearTimeout(timer);
        resolve(Number(found[1]));
      }
    });
  });
  return portPromise.then(async (port) => {
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
    await send("Emulation.setDeviceMetricsOverride", {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await send("Page.reload", { ignoreCache: true });
    await new Promise((r) => setTimeout(r, 350));
    for (let i = 0; i < 40; i++) {
      const ready = await send("Runtime.evaluate", { expression: "window.__read?1:0", returnByValue: true });
      if (ready.result && ready.result.value) break;
      await new Promise((r) => setTimeout(r, 40));
    }
    async function read() {
      const evaluated = await send("Runtime.evaluate", {
        expression: "JSON.stringify(window.__read())",
        returnByValue: true,
      });
      if (!evaluated.result || typeof evaluated.result.value !== "string") {
        throw new Error("read failed " + JSON.stringify(evaluated).slice(0, 400));
      }
      return JSON.parse(evaluated.result.value);
    }
    async function shot() {
      const png = await send("Page.captureScreenshot", { format: "png" });
      return Buffer.from(png.data, "base64");
    }
    return {
      send,
      read,
      shot,
      close() {
        ws.close();
        chrome.kill();
      },
    };
  });
}

function assertChatsPaint(data, width) {
  assert.equal(data.vw, width, `layout width ${data.vw}`);
  assert.equal(data.appPhoto, false, "#app still owns the photo");
  assert.equal(data.app.image, "none");
  assert.equal(data.app.attachment.includes("fixed"), false);
  assert.equal(data.app.attachment, "scroll");
  assert.match(data.app.color, /rgba?\(0,\s*0,\s*0,\s*0\)/);
  assert.equal(data.before.content, "none");
  assert.equal(data.beforePhoto, false);
  assert.equal(data.wrapPhoto, true, "wrapper dropped the visible photo");
  assert.equal(data.wrap.attachment.includes("fixed"), false);
  assert.match(data.wrap.size, /cover/);
  assert.match(data.wrap.position, /50%/);
  assert.match(data.wrap.image, /radial-gradient/);
  assert.equal(data.overflow.sw <= data.overflow.cw + 1, true, `horizontal overflow ${data.overflow.sw}>${data.overflow.cw}`);
  assert.equal(data.hit, "probe-send", `send hit ${data.hit}`);
  assert.equal(data.sendPe, "auto");
  assert.equal(data.inputActive, true);
  assert.equal(data.sendActive, true);
  assert.equal(data.scrolled, true, "transcript did not scroll");
}

if (!shotMode) {
  test("computed chats layer, route switch, pointer, and 760/761 boundary", async () => {
    const session = await openChrome(fixture({ messages: true, phone: false }), 1280, 900);
    try {
      const desk = await session.read();
      assertChatsPaint(desk, 1280);
      const off = JSON.parse(
        (
          await session.send("Runtime.evaluate", {
            expression: "JSON.stringify(window.__route(false))",
            returnByValue: true,
          })
        ).result.value
      );
      assert.equal(off.appPhoto, true, "leaving Messages should restore the canvas photo");
      assert.equal(off.app.attachment.includes("fixed"), true, "non-messages surface should keep the pre-existing fixed attachment");
      assert.equal(off.wrapPhoto, false, "wrapper photo is chats-only");
      const back = JSON.parse(
        (
          await session.send("Runtime.evaluate", {
            expression: "JSON.stringify(window.__route(true))",
            returnByValue: true,
          })
        ).result.value
      );
      assertChatsPaint(back, 1280);
      const clicks = (
        await session.send("Runtime.evaluate", {
          expression: "window.__clickSend()",
          returnByValue: true,
        })
      ).result.value;
      assert.equal(clicks, 1);

      await session.send("Emulation.setEmulatedMedia", {
        features: [{ name: "prefers-reduced-motion", value: "reduce" }],
      });
      const reduced = await session.read();
      assert.equal(reduced.reduced, true);
      assert.equal(reduced.appPhoto, false);
      assert.equal(reduced.app.attachment.includes("fixed"), false);
      assert.equal(reduced.wrapPhoto, true);
      assert.equal(reduced.before.content, "none");
    } finally {
      session.close();
    }
  });

  test("phone, 760, and 761 share the one-layer chats paint without a new breakpoint", async () => {
    const sizes = [
      [390, 844, true],
      [760, 900, false],
      [761, 900, false],
      [1440, 900, false],
    ];
    const paints = [];
    for (const [width, height, phone] of sizes) {
      const session = await openChrome(fixture({ messages: true, phone }), width, height);
      try {
        const data = await session.read();
        assertChatsPaint(data, width);
        paints.push(data);
      } finally {
        session.close();
      }
    }
    assert.equal(paints[1].app.image, paints[2].app.image);
    assert.equal(paints[1].app.attachment, paints[2].app.attachment);
    assert.equal(paints[1].wrap.image, paints[2].wrap.image);
    assert.equal(paints[1].wrap.attachment, paints[2].wrap.attachment);
    assert.equal(paints[1].wrap.size, paints[2].wrap.size);
    assert.equal(paints[1].wrap.position, paints[2].wrap.position);
    assert.equal(paints[0].navDisplay === "none" || paints[0].hit === "probe-send", true);
  });

  test("restoring the fixed #app under-layer does not change a single pixel", async () => {
    const session = await openChrome(fixture({ messages: true, phone: false }), 1280, 900);
    try {
      const cleared = decodePng(await session.shot());
      const restore = `html[data-ari-soft=v1][data-ari-luxe=v1][data-ari-lx-canvas=all][data-ari-no-crm-ai=v1][data-ari-msg-luxe=v2] body[data-ari-shell=v1][data-ari-messages-layout=v2] #app{${fixedAppDecl}}`;
      const restored = JSON.parse(
        (
          await session.send("Runtime.evaluate", {
            expression: `(()=>{const s=document.createElement("style"); s.textContent=${JSON.stringify(restore)}; document.head.appendChild(s); const cs=getComputedStyle(document.getElementById("app")); return JSON.stringify({attachment:cs.backgroundAttachment, image:cs.backgroundImage});})()`,
            returnByValue: true,
          })
        ).result.value
      );
      assert.equal(restored.attachment.includes("fixed"), true, "restore did not put the fixed attachment back");
      assert.equal(restored.image.includes(fixedAppUrl), true, "restore did not put the canvas photo back");
      await new Promise((r) => setTimeout(r, 80));
      const covered = decodePng(await session.shot());
      const delta = pixelDiff(cleared, covered);
      assert.equal(delta.max, 0, `fixed under-layer is visible (${delta.changed} px)`);
    } finally {
      session.close();
    }
  });
}

async function writeShots(outDir, label) {
  fs.mkdirSync(outDir, { recursive: true });
  const sizes = [
    [390, 844, true],
    [760, 900, false],
    [761, 900, false],
    [1280, 900, false],
    [1440, 900, false],
  ];
  for (const [width, height, phone] of sizes) {
    const session = await openChrome(fixture({ messages: true, phone }), width, height);
    try {
      const buf = await session.shot();
      const data = await session.read();
      const name = `synthetic_not_live_ghl_chats_${label}_${width}x${height}.png`;
      fs.writeFileSync(path.join(outDir, name), buf);
      fs.writeFileSync(
        path.join(outDir, `synthetic_not_live_ghl_chats_${label}_${width}x${height}.json`),
        JSON.stringify(
          {
            label,
            width,
            height,
            phone,
            note: "synthetic fixture, not live GHL",
            paint: JSON.parse(JSON.stringify(data).replace(/https:\/\/[^"\\)\s]+/g, "https://redacted")),
          },
          null,
          2
        )
      );
      console.log(name, data.app.attachment, data.wrapPhoto, data.hit, data.overflow);
    } finally {
      session.close();
    }
  }
}

if (shotMode) {
  await writeShots(process.argv[3], process.argv[4] || "after");
}
