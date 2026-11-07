/**
 * Synthetic composer sizing checks against dashboard.css only.
 * Not a live GHL capture and not an older-Safari run.
 * Send is a fictional button click. Nothing is transmitted.
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
const CHROME = "/opt/google/chrome/google-chrome";

function md5(file) {
  return crypto.createHash("md5").update(fs.readFileSync(file)).digest("hex");
}

const shotMode = process.argv[2] === "--shots";

if (!shotMode) {
  test("source keeps one cap per width and drops the forced field height", () => {
    assert.equal(css.includes("field-sizing"), false);
    assert.equal(css.includes("height:24px!important;min-height:24px!important;max-height:24px!important"), false);
    assert.equal(css.includes("placeholder-shown{height:44px"), false);
    assert.equal(css.includes("max-height:52px!important"), false);
    assert.equal(css.includes("max-height:132px!important"), true);
    assert.equal(css.includes("@media (width<=760px)"), true);
    assert.equal(css.includes("max-height:96px!important;padding:10px 4px 10px 12px!important"), true);
    assert.equal(css.includes("min-height:24px!important;max-height:96px!important"), true);
    assert.equal(css.includes("min-height:42px!important"), true);
    assert.equal(css.includes("min-height:44px!important"), true);
    assert.equal(css.includes("min-height:84px!important"), true);
    assert.equal(css.includes("min-height:48px!important"), true);
    assert.equal(css.includes("/* BEGIN ari-chats-scroll-layer */"), true);
    assert.equal(css.includes("/* BEGIN desktop-agenda-ivory"), true);
    assert.equal(css.includes("@media (min-width:761px)"), true);
    assert.equal(md5(jsPath), V3113_JS_MD5);
    const sums = fs.readFileSync(path.join(root, "MD5SUMS"), "utf8");
    assert.equal(sums.includes(V3113_JS_MD5), true);
    assert.equal(sums.includes(md5(cssPath)), true);
  });
}

function fixture({ noz = false, grown = true, cssFile = cssPath } = {}) {
  const htmlAttrs = [
    'data-ari-soft="v1"',
    'data-ari-luxe="v1"',
    'data-ari-lx-canvas="all"',
    'data-ari-no-crm-ai="v1"',
    'data-ari-msg-luxe="v2"',
  ];
  if (noz) htmlAttrs.push("data-ari-noz");
  const inline = grown ? ' style="height:88px"' : "";
  return `<!DOCTYPE html><html ${htmlAttrs.join(" ")}><head><meta charset="utf-8">
<link rel="stylesheet" href="file://${cssFile}">
<style>
  html,body{margin:0;background:#f4f1ea}
  #banner{position:relative;z-index:8;font:600 12px/1.3 ui-sans-serif,sans-serif;color:#123f29;background:#fffdf8;padding:8px 10px}
  #app{min-height:100vh;padding:16px;box-sizing:border-box}
  #composer-textarea{position:relative;max-width:640px;background:#fffdf8;border-radius:16px}
  #conv-composer-footer{display:flex;justify-content:flex-end;padding:6px}
  #conv-send-button-simple{position:relative;z-index:6}
</style></head>
<body data-ari-shell="v1" data-ari-messages-layout="v2" data-ari-msg7="v1">
<div id="banner">SYNTHETIC FIXTURE — not live GHL — inline height is simulated, Send is not transmitted</div>
<div id="app">
  <div id="conversations-layout">
    <div id="conversations-central-panel-viewer">
      <div data-ari-composer>
        <div id="composer-textarea">
          <div><textarea id="conv-composer-textarea-input" placeholder="Synthetic note"${inline}></textarea></div>
          <div id="conv-composer-footer"><button id="conv-send-button-simple" type="button">Send</button></div>
        </div>
      </div>
    </div>
  </div>
</div>
<script>
window.__clicks=0;
document.getElementById("conv-send-button-simple").addEventListener("click",function(e){e.preventDefault();window.__clicks++});
window.__box=function(){
  const el=document.getElementById("conv-composer-textarea-input");
  const cs=getComputedStyle(el);
  const app=getComputedStyle(document.getElementById("app"));
  const send=document.getElementById("conv-send-button-simple");
  const r=send.getBoundingClientRect();
  const hit=document.elementFromPoint(Math.min(innerWidth-2, Math.max(1, r.left+r.width/2)), Math.min(innerHeight-2, Math.max(1, r.top+r.height/2)));
  el.focus();
  const root=document.documentElement;
  return {
    vw:innerWidth,
    height:cs.height, minH:cs.minHeight, maxH:cs.maxHeight,
    field:cs.fieldSizing||cs.getPropertyValue("field-sizing"),
    overflowY:cs.overflowY, whiteSpace:cs.whiteSpace, fontSize:cs.fontSize,
    lineHeight:cs.lineHeight, resize:cs.resize,
    appImage:app.backgroundImage, appAttach:app.backgroundAttachment,
    hit:hit?(hit.id||hit.tagName):"",
    focused:document.activeElement===el,
    clicks:window.__clicks,
    sw:root.scrollWidth, cw:root.clientWidth,
    reduced:matchMedia("(prefers-reduced-motion: reduce)").matches
  };
};
window.__setH=function(px){
  const el=document.getElementById("conv-composer-textarea-input");
  if(px==null) el.style.removeProperty("height");
  else el.style.height=px+"px";
  return window.__box();
};
window.__value=function(text){
  const el=document.getElementById("conv-composer-textarea-input");
  el.value=text;
  return window.__box();
};
window.__paste=function(text){
  const el=document.getElementById("conv-composer-textarea-input");
  el.style.removeProperty("height");
  const before=getComputedStyle(el).height;
  el.focus();
  el.value=text;
  el.dispatchEvent(new InputEvent("beforeinput",{bubbles:true,cancelable:true,inputType:"insertFromPaste",data:text}));
  el.dispatchEvent(new Event("input",{bubbles:true}));
  el.dispatchEvent(new Event("paste",{bubbles:true}));
  const box=window.__box();
  box.pasteBefore=before;
  box.pasteAfter=getComputedStyle(el).height;
  box.valueLen=el.value.length;
  return box;
};
window.__route=function(on){
  const root=document.documentElement;
  if(on){
    root.setAttribute("data-ari-noz","");
    document.body.setAttribute("data-ari-msg7","v1");
  }else{
    root.removeAttribute("data-ari-noz");
    document.body.removeAttribute("data-ari-msg7");
  }
  return window.__box();
};
window.__click=function(){document.getElementById("conv-send-button-simple").click();return window.__clicks};
</script></body></html>`;
}

function openChrome(html, width, height) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ari-comp-"));
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
    const timer = setTimeout(() => reject(new Error(`chrome timeout\n${err.slice(-240)}`)), 15000);
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
    await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: false });
    await send("Page.reload", { ignoreCache: true });
    await new Promise((r) => setTimeout(r, 300));
    for (let i = 0; i < 40; i++) {
      const ready = await send("Runtime.evaluate", { expression: "window.__box?1:0", returnByValue: true });
      if (ready.result && ready.result.value) break;
      await new Promise((r) => setTimeout(r, 40));
    }
    async function evalJson(expression) {
      const out = await send("Runtime.evaluate", { expression, returnByValue: true });
      if (!out.result || typeof out.result.value !== "string") throw new Error("eval failed " + JSON.stringify(out).slice(0, 300));
      return JSON.parse(out.result.value);
    }
    return {
      send,
      evalJson,
      async shot() {
        const png = await send("Page.captureScreenshot", { format: "png" });
        return Buffer.from(png.data, "base64");
      },
      close() {
        ws.close();
        chrome.kill();
      },
    };
  });
}

function px(value) {
  return Math.round(parseFloat(value));
}

if (!shotMode) {
  test("inline height is the sizer, with the 96px and 132px caps kept", async () => {
    const desktop = await openChrome(fixture({ noz: false, grown: false }), 1280, 900);
    try {
      const empty = await desktop.evalJson("JSON.stringify(window.__setH(null))");
      assert.equal(empty.vw, 1280);
      assert.equal(px(empty.minH), 42);
      assert.equal(px(empty.maxH), 132);
      assert.notEqual(empty.field, "content");
      assert.equal(empty.overflowY, "auto");
      assert.equal(px(empty.fontSize), 15);
      const grown = await desktop.evalJson("JSON.stringify(window.__setH(88))");
      assert.equal(px(grown.height), 88);
      const capped = await desktop.evalJson("JSON.stringify(window.__setH(400))");
      assert.equal(px(capped.height), 132);
      const shrunk = await desktop.evalJson("JSON.stringify(window.__setH(8))");
      assert.equal(px(shrunk.height), 42);
      const pasted = await desktop.evalJson(
        "JSON.stringify(window.__paste(" + JSON.stringify("Synthetic line\n".repeat(12)) + "))"
      );
      assert.ok(pasted.valueLen > 40, "paste text did not land in the fictional field");
      assert.equal(px(pasted.pasteBefore), px(pasted.pasteAfter), "paste/input events are not a grower");
      assert.ok(px(pasted.pasteAfter) < 132);
      assert.equal(pasted.overflowY, "auto");
      assert.equal(px(pasted.maxH), 132);
      assert.equal(pasted.focused, true);
      assert.equal(pasted.hit, "conv-send-button-simple");
      const clicks = await desktop.evalJson("JSON.stringify(window.__click())");
      assert.equal(clicks, 1);
      assert.equal(pasted.sw <= pasted.cw + 1, true);
      assert.equal(pasted.appImage, "none");
      assert.equal(pasted.appAttach.includes("fixed"), false);
      await desktop.send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
      const reduced = await desktop.evalJson("JSON.stringify(window.__setH(88))");
      assert.equal(reduced.reduced, true);
      assert.equal(px(reduced.height), 88);
      assert.equal(px(reduced.maxH), 132);
      const off = await desktop.evalJson("JSON.stringify(window.__route(false))");
      assert.notEqual(px(off.maxH), 132);
      assert.notEqual(px(off.maxH), 96);
    } finally {
      desktop.close();
    }
  });

  test("760 keeps 96, 761 keeps 132, and noz keeps 96 above 760", async () => {
    const cases = [
      [760, 900, false, 96, 42],
      [761, 900, false, 132, 42],
      [800, 900, true, 96, 44],
      [390, 844, true, 96, 44],
    ];
    for (const [width, height, noz, max, min] of cases) {
      const session = await openChrome(fixture({ noz, grown: false }), width, height);
      try {
        const box = await session.evalJson("JSON.stringify(window.__setH(88))");
        assert.equal(box.vw, width, String(width));
        assert.equal(px(box.maxH), max, `${width} noz=${noz} max`);
        assert.equal(px(box.minH), min, `${width} noz=${noz} min`);
        assert.equal(px(box.height), 88, `${width} inline 88`);
        assert.notEqual(box.field, "content");
        const filled = await session.evalJson(
          'JSON.stringify(window.__value(' + JSON.stringify("Synthetic line ".repeat(40)) + '))'
        );
        assert.equal(filled.overflowY, "auto", `${width} noz=${noz} overflow`);
        assert.equal(px(filled.maxH), max);
        const cap = await session.evalJson("JSON.stringify(window.__setH(400))");
        assert.equal(px(cap.height), max);
        const empty = await session.evalJson("JSON.stringify(window.__setH(null))");
        assert.ok(px(empty.height) <= max);
        assert.ok(px(empty.height) >= min - 1);
        if (noz) assert.equal(px(box.fontSize), 16);
        assert.equal(empty.hit, "conv-send-button-simple");
        assert.equal(empty.sw <= empty.cw + 1, true);
      } finally {
        session.close();
      }
    }
  });
}

if (shotMode) {
  const alt = process.argv[5];
  async function shotsWith(dir, label, cssFile) {
    fs.mkdirSync(dir, { recursive: true });
    const jobs = [
      [390, 844, true, "390x844"],
      [760, 900, false, "760x900"],
      [761, 900, false, "761x900"],
      [800, 900, true, "800x900_noz"],
      [1280, 900, false, "1280x900"],
    ];
    for (const [width, height, noz, name] of jobs) {
      const session = await openChrome(fixture({ noz, grown: true, cssFile }), width, height);
      try {
        const buf = await session.shot();
        const file = path.join(dir, `synthetic_not_live_ghl_composer_${label}_${name}.png`);
        fs.writeFileSync(file, buf);
        console.log(file);
      } finally {
        session.close();
      }
    }
  }
  await shotsWith(process.argv[3], process.argv[4] || "after", alt || cssPath);
}
