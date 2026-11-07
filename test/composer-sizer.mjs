/**
 * Synthetic composer sizer checks. The page loads the real dashboard.js sizer.
 * Not a live GHL capture and not an older-Safari run.
 * Send is a cancelled click. Nothing is transmitted. Enter is never dispatched.
 */
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import http from "node:http";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cssPath = path.join(root, "dashboard.css");
const jsPath = path.join(root, "dashboard.js");
const css = fs.readFileSync(cssPath, "utf8");
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
    const cap760 = css.indexOf("@media (max-width:760px){html[data-ari-no-crm-ai=v1][data-ari-msg-luxe=v2] body[data-ari-shell=v1][data-ari-messages-layout=v2][data-ari-msg7=v1] #conversations-central-panel-viewer div.relative:has(>div>#composer-textarea)");
    assert.ok(cap760 > 0);
    assert.ok(css.indexOf("#conv-composer-textarea-input{height:44px!important;min-height:44px!important;max-height:44px!important;overflow-y:auto!important;padding:10px 4px 10px 12px!important}", cap760) > cap760);
    assert.equal(css.includes("@media (min-width:761px){html[data-ari-no-crm-ai=v1][data-ari-msg-luxe=v2] body[data-ari-shell=v1][data-ari-messages-layout=v2][data-ari-msg7=v1] #conversations-central-panel-viewer #conv-composer-textarea-input{max-height:132px!important}"), true);
    assert.equal(css.includes("min-height:42px!important;max-height:132px!important"), false);
    assert.equal(css.includes(":not([data-ari-composer-sizer=v1])"), true);
    assert.equal(css.includes("height:auto!important"), true);
    assert.equal(css.includes("height:44px!important;min-height:44px!important;max-height:44px!important;overflow-y:auto!important;padding:10px 4px 10px 12px!important"), true);
    assert.equal(css.includes("min-height:24px!important;max-height:96px!important"), false);
    assert.equal(css.includes("min-height:42px!important"), true);
    assert.equal(css.includes("min-height:44px!important"), true);
    assert.equal(css.includes("min-height:84px!important"), true);
    assert.equal(css.includes("min-height:48px!important"), true);
    assert.equal(css.includes("/* BEGIN ari-chats-scroll-layer */"), true);
    assert.equal(css.includes("/* BEGIN desktop-agenda-ivory"), true);
    assert.equal(css.includes("@media (min-width:761px)"), true);
    const js = fs.readFileSync(jsPath, "utf8");
    const sizer = js.slice(js.lastIndexOf("composer content sizer"));
    assert.equal(sizer.includes("new MutationObserver("), false);
    assert.equal(sizer.includes("new ResizeObserver("), false);
    assert.equal(sizer.includes("preventDefault"), false);
    assert.equal(sizer.includes("defineProperty(w.HTMLTextAreaElement.prototype"), false);
    assert.equal(sizer.includes("live=0"), true);
    assert.equal(sizer.includes("live++"), false);
    assert.equal(sizer.includes("new H.MO"), true);
    assert.equal(sizer.includes("__ariComposerSize"), true);
    const sums = fs.readFileSync(path.join(root, "MD5SUMS"), "utf8");
    assert.equal(sums.includes(md5(jsPath)), true);
    assert.equal(sums.includes(md5(cssPath)), true);
  });
}

function fixture({ noz = false, script = true } = {}) {
  const htmlAttrs = [
    'data-ari-soft="v1"',
    'data-ari-luxe="v1"',
    'data-ari-lx-canvas="all"',
    'data-ari-no-crm-ai="v1"',
    'data-ari-msg-luxe="v2"',
  ];
  if (noz) htmlAttrs.push("data-ari-noz");
  const js = script ? '<script src="/dashboard.js"></script>' : "";
  return `<!DOCTYPE html><html ${htmlAttrs.join(" ")}><head><meta charset="utf-8">
<link rel="stylesheet" href="/dashboard.css">
<style>
  html,body{margin:0;background:#f4f1ea}
  #banner{position:relative;z-index:8;font:600 12px/1.3 ui-sans-serif,sans-serif;color:#123f29;background:#fffdf8;padding:8px 10px}
  #app{min-height:100vh;padding:16px;box-sizing:border-box}
  #composer-textarea{position:relative;max-width:640px;background:#fffdf8;border-radius:16px}
  #conv-composer-textarea-input{box-sizing:border-box}
  #conv-composer-footer{display:flex;justify-content:flex-end;padding:6px}
  #conv-send-button-simple{position:relative;z-index:6}
  #other-note{display:block;width:200px;height:40px}
</style></head>
<body data-ari-shell="v1" data-ari-messages-layout="v2" data-ari-msg7="v1">
<div id="banner">SYNTHETIC FIXTURE — not live GHL — inline height is simulated, Send is not transmitted</div>
<div id="app">
    <div id="conversations-layout">
    <div id="conversations-list"><button type="button" data-conversation-id="synthetic-a">Sample A</button></div>
    <div id="conversations-central-panel-viewer">
      <div data-ari-composer>
        <div id="composer-textarea">
          <div><textarea id="conv-composer-textarea-input" rows="1" placeholder="Synthetic note"></textarea></div>
          <div id="conv-composer-footer"><button id="quick-reply" type="button">Quick</button><button id="template-insert" type="button">Template</button><button id="conv-send-button-simple" type="button">Send</button></div>
        </div>
      </div>
    </div>
  </div>
  <textarea id="other-note" placeholder="Not the composer"></textarea>
</div>
${js}
<script>
window.__clicks=0;
window.__enters=0;
document.getElementById("conv-send-button-simple").addEventListener("click",function(e){
  e.preventDefault();
  window.__clicks++;
});
document.getElementById("conv-composer-textarea-input").addEventListener("keydown",function(e){
  if(e.key==="Enter")window.__enters++;
});
function field(){return document.getElementById("conv-composer-textarea-input")}
window.__box=function(){
  const el=field();
  const cs=el?getComputedStyle(el):null;
  const app=getComputedStyle(document.getElementById("app"));
  const send=document.getElementById("conv-send-button-simple");
  const r=send?send.getBoundingClientRect():null;
  const hit=r?document.elementFromPoint(Math.min(innerWidth-2, Math.max(1, r.left+r.width/2)), Math.min(innerHeight-2, Math.max(1, r.top+r.height/2))):null;
  const root=document.documentElement;
  const stray=document.getElementById("other-note");
  const sizer=window.__ariComposerSize;
  return {
    vw:innerWidth,
    height:cs?cs.height:"", minH:cs?cs.minHeight:"", maxH:cs?cs.maxHeight:"",
    inline:el?el.style.height:"",
    field:cs?(cs.fieldSizing||cs.getPropertyValue("field-sizing")):"",
    overflowY:cs?cs.overflowY:"", fontSize:cs?cs.fontSize:"",
    box:cs?cs.boxSizing:"",
    appImage:app.backgroundImage, appAttach:app.backgroundAttachment,
    hit:hit?(hit.id||hit.tagName):"",
    focused:el&&document.activeElement===el,
    clicks:window.__clicks, enters:window.__enters,
    sw:root.scrollWidth, cw:root.clientWidth,
    sizer:root.getAttribute("data-ari-composer-sizer")||"",
    msg7:document.body.getAttribute("data-ari-msg7")||"",
    writes:sizer?sizer.writes():-1,
    mirror:document.querySelectorAll("[data-ari-composer-mirror]").length,
    stray:stray?stray.style.height:"",
    valueLen:el?el.value.length:0,
    gone:!el
  };
};
window.__ghl=function(px){
  const el=field();
  el.style.height=px+"px";
  return window.__box();
};
window.__type=function(text){
  const el=field();
  el.focus();
  el.value=text;
  el.dispatchEvent(new Event("input",{bubbles:true}));
  return window.__box();
};
window.__paste=function(text){
  const el=field();
  el.focus();
  el.value=text;
  el.dispatchEvent(new InputEvent("beforeinput",{bubbles:true,cancelable:true,inputType:"insertFromPaste",data:text}));
  el.dispatchEvent(new Event("input",{bubbles:true}));
  el.dispatchEvent(new Event("paste",{bubbles:true}));
  const box=window.__box();
  box.valueLen=el.value.length;
  return box;
};
window.__silentClear=function(){
  field().value="";
  return window.__box();
};
function protoSet(el,text){
  Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype,"value").set.call(el,text);
}
window.__postSend=function(){
  document.getElementById("conv-send-button-simple").click();
  protoSet(field(),"");
  return window.__box();
};
window.__remount=function(){
  const old=field();
  const neu=old.cloneNode(false);
  neu.value="";
  old.replaceWith(neu);
  return window.__box();
};
window.__leave=function(){
  const layout=document.getElementById("conversations-layout");
  if(layout)layout.remove();
  document.body.removeAttribute("data-ari-msg7");
  const stray=document.getElementById("other-note");
  stray.style.height="80px";
  stray.value="Synthetic line ".repeat(20);
  return window.__box();
};
window.__focus=function(){field().focus();return window.__box()};
window.__setValue=function(text){field().value=text;return window.__box()};
document.getElementById("quick-reply").addEventListener("click",function(){protoSet(field(),"Quick reply line\\nQuick reply line\\nQuick reply line\\nQuick reply line")});
document.getElementById("template-insert").addEventListener("click",function(){protoSet(field(),"Template line\\nTemplate line\\nTemplate line\\nTemplate line")});
document.querySelector("[data-conversation-id]").addEventListener("click",function(){protoSet(field(),"")});
window.__enterClear=function(){var el=field();var ev=new KeyboardEvent("keydown",{key:"Enter",bubbles:true,cancelable:true});el.dispatchEvent(ev);protoSet(el,"");return {prevented:ev.defaultPrevented,enters:window.__enters}};
window.__armStop=function(){
  var sizer=window.__ariComposerSize;
  sizer.stop();
  window.__fontPending=new Promise(function(r){window.__fontRelease=r});
  window.__fontsHooked=false;
  try{
    Object.defineProperty(document,"fonts",{configurable:true,get:function(){return{ready:window.__fontPending}}});
    window.__fontsHooked=true;
  }catch(e){window.__fontsHooked=String(e&&e.message||e)}
  sizer.start();
  var el=field();
  protoSet(el,"Synthetic line\\n".repeat(4));
  el.dispatchEvent(new KeyboardEvent("keydown",{key:"Enter",bubbles:true,cancelable:true}));
  el.dispatchEvent(new Event("input",{bubbles:true}));
  el.style.setProperty("outline","1px solid transparent");
  sizer.resetWrites();
  window.__capturedSync=sizer.sync;
  sizer.stop();
  return {
    fontsHooked:window.__fontsHooked,
    running:sizer.running(),
    writes:sizer.writes(),
    obs:window.__ariH.stats().observers,
    mirror:document.querySelectorAll("[data-ari-composer-mirror]").length,
    mark:el.hasAttribute("data-ari-sized"),
    inline:el.style.height,
    own:Object.getOwnPropertyDescriptor(el,"value")?1:0,
    sizer:document.documentElement.getAttribute("data-ari-composer-sizer")
  };
};
window.__releaseStop=function(){
  if(window.__fontRelease)window.__fontRelease();
  window.__capturedSync();
  var el=field();
  protoSet(el,"Late line\\nLate line\\nLate line\\nLate line");
  el.style.setProperty("letter-spacing","0.2px");
  el.dispatchEvent(new Event("input",{bubbles:true}));
  el.dispatchEvent(new KeyboardEvent("keydown",{key:"Enter",bubbles:true,cancelable:true}));
  document.querySelector("[data-conversation-id]").click();
  return 1;
};
window.__readStop=function(){
  var el=field();
  var sizer=window.__ariComposerSize;
  return {
    writes:sizer.writes(),
    running:sizer.running(),
    obs:window.__ariH.stats().observers,
    mirror:document.querySelectorAll("[data-ari-composer-mirror]").length,
    mark:el.hasAttribute("data-ari-sized"),
    inline:el.style.height,
    sizer:document.documentElement.getAttribute("data-ari-composer-sizer"),
    own:Object.getOwnPropertyDescriptor(el,"value")?1:0
  };
};
window.__restartTwice=function(){
  var sizer=window.__ariComposerSize;
  sizer.start();
  var once=window.__ariH.stats().observers;
  sizer.start();
  return {once:once,twice:window.__ariH.stats().observers,running:sizer.running(),listeners:1};
};
window.__stopTwice=function(){
  var sizer=window.__ariComposerSize;
  sizer.stop();
  sizer.stop();
  window.__capturedSync();
  return 1;
};
window.__ownedDescriptor=function(){
  var el=field();
  var sizer=window.__ariComposerSize;
  sizer.stop();
  var proto=Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype,"value");
  var n=0;
  Object.defineProperty(el,"value",{configurable:true,enumerable:false,get:function(){return proto.get.call(this)},set:function(v){n++;return proto.set.call(this,v)}});
  sizer.resetWrites();
  sizer.start();
  el.value="owned line\\nowned line\\nowned line\\nowned line";
  var mid=n;
  sizer.stop();
  sizer.resetWrites();
  el.value="again";
  return {mid:mid,after:n,writes:sizer.writes(),own:Object.getOwnPropertyDescriptor(el,"value")?1:0,running:sizer.running(),obs:window.__ariH.stats().observers,mirror:document.querySelectorAll("[data-ari-composer-mirror]").length};
};
window.__quick=function(){document.getElementById("quick-reply").click();return window.__box()};
window.__template=function(){document.getElementById("template-insert").click();return window.__box()};
window.__switch=function(){document.querySelector("[data-conversation-id]").click();return window.__box()};
</script></body></html>`;
}

function sizerBundle() {
  const js = fs.readFileSync(jsPath, "utf8");
  const hubAt = js.indexOf("/* v3.37 shared hub:");
  const hubEnd = js.indexOf("(window,document);\n/* v3.44 route our", hubAt);
  const sizerAt = js.lastIndexOf("/* composer content sizer:");
  if (hubAt < 0 || hubEnd < hubAt || sizerAt < 0) throw new Error("sizer bundle markers missing");
  return js.slice(hubAt, hubEnd + "(window,document);".length) + "\n" + js.slice(sizerAt);
}

function serve(html) {
  const server = http.createServer((req, res) => {
    const url = req.url.split("?")[0];
    if (url === "/dashboard.css") {
      res.setHeader("content-type", "text/css");
      res.end(fs.readFileSync(cssPath));
      return;
    }
    if (url === "/dashboard.js") {
      res.setHeader("content-type", "text/javascript");
      // Hub plus sizer, verbatim from dashboard.js. The rest of the skin's raw-view
      // gate strips skin attributes until a signed-in header is present, which this
      // fictional page does not have.
      res.end(sizerBundle());
      return;
    }
    res.setHeader("content-type", "text/html; charset=utf-8");
    res.end(html);
  });
  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      resolve({ server, port });
    });
  });
}

function openChrome(html, width, height, { script = true } = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ari-comp-"));
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
      "about:blank",
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
    const served = await serve(html);
    const pageUrl = `http://127.0.0.1:${served.port}/v2/location/synthetic/conversations/conversations`;
    await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: false });
    await send("Page.navigate", { url: pageUrl });
    await new Promise((r) => setTimeout(r, 400));
    const readyExpr = script ? "window.__box&&window.__ariComposerSize?1:0" : "window.__box?1:0";
    for (let i = 0; i < 50; i++) {
      const ready = await send("Runtime.evaluate", { expression: readyExpr, returnByValue: true });
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
        served.server.close();
      },
    };
  });
}

function px(value) {
  return Math.round(parseFloat(value));
}

if (!shotMode) {
  test("empty focus GHL 120 is replaced by one line, and text grows and shrinks", async () => {
    const desktop = await openChrome(fixture({ noz: false }), 1280, 900);
    try {
      await new Promise((r) => setTimeout(r, 200));
      const empty = await desktop.evalJson("JSON.stringify(window.__box())");
      assert.equal(empty.vw, 1280);
      assert.equal(empty.sizer, "v1");
      assert.equal(empty.msg7, "v1");
      assert.equal(px(empty.minH), 42);
      assert.equal(px(empty.maxH), 132);
      assert.equal(px(empty.fontSize), 15);
      assert.notEqual(empty.field, "content");
      assert.equal(empty.box, "border-box");
      const forced = await desktop.evalJson("JSON.stringify(window.__ghl(120))");
      await new Promise((r) => setTimeout(r, 200));
      const corrected = await desktop.evalJson("JSON.stringify(window.__box())");
      assert.equal(px(forced.height), 120);
      assert.equal(px(corrected.height), 42, "empty field stayed at GHL 120");
      assert.equal(px(corrected.inline), 42);
      const late = await desktop.evalJson(
        "window.__focus();setTimeout(function(){window.__ghl(120)},80);JSON.stringify(window.__box())"
      );
      await new Promise((r) => setTimeout(r, 250));
      const afterLate = await desktop.evalJson("JSON.stringify(window.__box())");
      assert.equal(px(late.height) === 120 || px(afterLate.height) === 42, true);
      assert.equal(px(afterLate.height), 42, "later GHL 120 was not corrected");
      const typed = await desktop.evalJson(
        "JSON.stringify(window.__type(" + JSON.stringify("Synthetic line\n".repeat(4)) + "))"
      );
      await new Promise((r) => setTimeout(r, 120));
      const grown = await desktop.evalJson("JSON.stringify(window.__box())");
      assert.ok(px(grown.height) > 42, "typing did not grow the field: " + grown.height);
      assert.ok(px(grown.height) <= 132);
      assert.equal(grown.hit, "conv-send-button-simple");
      assert.equal(grown.sw <= grown.cw + 1, true);
      assert.equal(grown.appImage, "none");
      assert.equal(grown.appAttach.includes("fixed"), false);
      const pasted = await desktop.evalJson(
        "JSON.stringify(window.__paste(" + JSON.stringify("Synthetic line\n".repeat(12)) + "))"
      );
      await new Promise((r) => setTimeout(r, 120));
      const capped = await desktop.evalJson("JSON.stringify(window.__box())");
      assert.ok(pasted.valueLen > 40);
      assert.equal(px(capped.height), 132);
      assert.equal(capped.overflowY, "auto");
      const deleted = await desktop.evalJson("JSON.stringify(window.__type('Hi'))");
      await new Promise((r) => setTimeout(r, 120));
      const short = await desktop.evalJson("JSON.stringify(window.__box())");
      assert.ok(px(short.height) < 132);
      assert.ok(px(short.height) >= 42);
      assert.equal(deleted.valueLen, 2);
      await desktop.evalJson("JSON.stringify(window.__type(" + JSON.stringify("Synthetic line\n".repeat(3)) + "))");
      await new Promise((r) => setTimeout(r, 120));
      const posted = await desktop.evalJson("JSON.stringify(window.__postSend())");
      await new Promise((r) => setTimeout(r, 400));
      const shrunk = await desktop.evalJson("JSON.stringify(window.__box())");
      assert.equal(posted.clicks, 1);
      assert.equal(posted.enters, 0);
      assert.equal(shrunk.valueLen, 0);
      assert.equal(px(shrunk.height), 42, "synthetic post-send clear did not return to one line");
      await desktop.evalJson("JSON.stringify(window.__ariComposerSize.resetWrites()||0)");
      await desktop.evalJson("JSON.stringify(window.__ariComposerSize.sync()||0)");
      await new Promise((r) => setTimeout(r, 200));
      const steady = await desktop.evalJson("JSON.stringify(window.__box())");
      assert.equal(steady.writes, 0, "repeat sync wrote again: " + steady.writes);
      const observers = await desktop.evalJson("JSON.stringify(window.__ariH.stats().observers)");
      await desktop.send("Runtime.evaluate", {
        expression: "new Promise(function(resolve){var s=document.createElement('script');s.src='/dashboard.js?rerun=1';s.onload=function(){resolve(1)};document.body.appendChild(s)})",
        awaitPromise: true,
      });
      const again = await desktop.evalJson("JSON.stringify(window.__box())");
      const observersAfter = await desktop.evalJson("JSON.stringify(window.__ariH.stats().observers)");
      assert.equal(observersAfter, observers);
      assert.equal(again.sizer, "v1");
    } finally {
      desktop.close();
    }
  });

  test("phone 760 is one fixed line and desktop grows to 132, including touch 800", async () => {
    const cases = [
      [760, 900, false, 44, 44, 15],
      [761, 900, false, 132, 42, 15],
      [800, 900, true, 132, 44, 16],
      [390, 844, true, 44, 44, 16],
      [1280, 900, false, 132, 42, 15],
    ];
    for (const [width, height, noz, max, min, font] of cases) {
      const session = await openChrome(fixture({ noz }), width, height);
      try {
        if (noz && width > 480) {
          await session.evalJson("JSON.stringify((window.ontouchstart=null, document.documentElement.setAttribute('data-ari-noz',''), 1))");
        }
        await new Promise((r) => setTimeout(r, 250));
        const box = await session.evalJson("JSON.stringify(window.__box())");
        assert.equal(box.vw, width, String(width));
        assert.equal(px(box.maxH), max, `${width} noz=${noz} max ${box.maxH}`);
        assert.equal(px(box.minH), min, `${width} noz=${noz} min`);
        assert.equal(px(box.fontSize), font, `${width} font`);
        await session.evalJson("JSON.stringify(window.__ghl(120))");
        await new Promise((r) => setTimeout(r, 200));
        const empty = await session.evalJson("JSON.stringify(window.__box())");
        assert.equal(px(empty.height), min, `${width} empty focus`);
        await session.evalJson("JSON.stringify(window.__type(" + JSON.stringify("Synthetic line\n".repeat(14)) + "))");
        await new Promise((r) => setTimeout(r, 150));
        const filled = await session.evalJson("JSON.stringify(window.__box())");
        if (width <= 760) {
          assert.equal(px(filled.height), 44, `${width} stays one line`);
          const scroll = await session.evalJson("JSON.stringify({sh:document.getElementById('conv-composer-textarea-input').scrollHeight,ch:document.getElementById('conv-composer-textarea-input').clientHeight,writes:window.__ariComposerSize.writes(),mirror:document.querySelectorAll('[data-ari-composer-mirror]').length,rows:document.getElementById('conv-composer-textarea-input').rows})");
          assert.ok(scroll.sh > scroll.ch, `${width} text scrolls`);
          assert.equal(scroll.mirror, 0);
          assert.equal(scroll.writes, 0);
          assert.equal(scroll.rows, 1);
        } else {
          assert.equal(px(filled.height), max, `${width} cap`);
        }
        assert.equal(filled.overflowY, "auto");
        assert.equal(filled.hit, "conv-send-button-simple");
        assert.equal(filled.sw <= filled.cw + 1, true);
        assert.equal(filled.stray, "");
      } finally {
        session.close();
      }
    }
  });

  test("overwrite, remount, leave, and stopped sizer do not leak", async () => {
    const session = await openChrome(fixture({ noz: false }), 1280, 900);
    try {
      await session.evalJson("JSON.stringify(window.__type('Synthetic line'))");
      await new Promise((r) => setTimeout(r, 120));
      await session.evalJson("JSON.stringify((window.__ariComposerSize.resetWrites(), window.__ghl(120)))");
      await new Promise((r) => setTimeout(r, 200));
      const fixed = await session.evalJson("JSON.stringify(window.__box())");
      assert.ok(px(fixed.height) < 120);
      assert.equal(fixed.writes >= 1, true);
      const before = fixed.writes;
      await new Promise((r) => setTimeout(r, 200));
      const quiet = await session.evalJson("JSON.stringify(window.__box())");
      assert.equal(quiet.writes, before);
      await session.evalJson("JSON.stringify(window.__remount())");
      await session.evalJson("JSON.stringify(window.__type(" + JSON.stringify("Synthetic line\n".repeat(4)) + "))");
      await new Promise((r) => setTimeout(r, 200));
      const remounted = await session.evalJson("JSON.stringify(window.__box())");
      assert.ok(px(remounted.height) > 42);
      const observers = await session.evalJson("JSON.stringify(window.__ariH.stats().observers)");
      await session.evalJson("JSON.stringify((window.__ariComposerSize.stop(), 1))");
      const stopped = await session.evalJson(
        "JSON.stringify({sizer:document.documentElement.getAttribute('data-ari-composer-sizer'),mirror:document.querySelectorAll('[data-ari-composer-mirror]').length,running:window.__ariComposerSize.running(),obs:window.__ariH.stats().observers})"
      );
      assert.equal(stopped.sizer, null);
      assert.equal(stopped.mirror, 0);
      assert.equal(stopped.running, false);
      assert.ok(stopped.obs < observers);
      const left = await session.evalJson("JSON.stringify(window.__leave())");
      await new Promise((r) => setTimeout(r, 150));
      const after = await session.evalJson("JSON.stringify(window.__box())");
      assert.equal(after.gone, true);
      assert.equal(after.stray, "80px");
      assert.equal(left.stray, "80px");
    } finally {
      session.close();
    }
  });

  test("Enter after send clears the field back to one line", async () => {
    const session = await openChrome(fixture({ noz: false }), 1280, 900);
    try {
      await session.evalJson("JSON.stringify(window.__type(" + JSON.stringify("Synthetic line\n".repeat(4)) + "))");
      await new Promise((r) => setTimeout(r, 150));
      const grown = await session.evalJson("JSON.stringify(window.__box())");
      assert.ok(px(grown.height) > 42);
      const sent = await session.evalJson("JSON.stringify(window.__enterClear())");
      await new Promise((r) => setTimeout(r, 200));
      const cleared = await session.evalJson("JSON.stringify(window.__box())");
      assert.equal(sent.prevented, false);
      assert.equal(cleared.enters, 1);
      assert.equal(cleared.clicks, 0);
      assert.equal(cleared.valueLen, 0);
      assert.equal(px(cleared.height), 42);
    } finally {
      session.close();
    }
  });

  test("Send button after send clears the field back to one line", async () => {
    const session = await openChrome(fixture({ noz: false }), 1280, 900);
    try {
      await session.evalJson("JSON.stringify(window.__type(" + JSON.stringify("Synthetic line\n".repeat(4)) + "))");
      await new Promise((r) => setTimeout(r, 150));
      await session.evalJson("JSON.stringify(window.__postSend())");
      await new Promise((r) => setTimeout(r, 400));
      const cleared = await session.evalJson("JSON.stringify(window.__box())");
      assert.equal(cleared.clicks, 1);
      assert.equal(cleared.enters, 0);
      assert.equal(cleared.valueLen, 0);
      assert.equal(px(cleared.height), 42);
    } finally {
      session.close();
    }
  });

  test("quick reply insert grows the field", async () => {
    const session = await openChrome(fixture({ noz: false }), 1280, 900);
    try {
      await session.evalJson("JSON.stringify(window.__quick())");
      await new Promise((r) => setTimeout(r, 200));
      const box = await session.evalJson("JSON.stringify(window.__box())");
      assert.ok(box.valueLen > 20);
      assert.ok(px(box.height) > 42);
      assert.equal(box.clicks, 0);
      assert.equal(box.enters, 0);
    } finally {
      session.close();
    }
  });

  test("template insert grows the field", async () => {
    const session = await openChrome(fixture({ noz: false }), 1280, 900);
    try {
      const before = await session.evalJson("JSON.stringify(window.__box())");
      await session.evalJson("JSON.stringify(window.__template())");
      await new Promise((r) => setTimeout(r, 200));
      const box = await session.evalJson("JSON.stringify(window.__box())");
      assert.ok(box.valueLen > before.valueLen);
      assert.ok(px(box.height) > px(before.height));
      assert.ok(px(box.height) <= 132);
      assert.equal(box.enters, 0);
    } finally {
      session.close();
    }
  });

  test("conversation switch resets the field to one line", async () => {
    const session = await openChrome(fixture({ noz: false }), 1280, 900);
    try {
      await session.evalJson("JSON.stringify(window.__type(" + JSON.stringify("Synthetic line\n".repeat(4)) + "))");
      await new Promise((r) => setTimeout(r, 150));
      const grown = await session.evalJson("JSON.stringify(window.__box())");
      assert.ok(px(grown.height) > 42);
      await session.evalJson("JSON.stringify(window.__switch())");
      await new Promise((r) => setTimeout(r, 200));
      const cleared = await session.evalJson("JSON.stringify(window.__box())");
      assert.equal(cleared.valueLen, 0);
      assert.equal(px(cleared.height), 42);
      assert.equal(cleared.clicks, 0);
    } finally {
      session.close();
    }
  });

  test("remount keeps sizing the replacement field", async () => {
    const session = await openChrome(fixture({ noz: false }), 1280, 900);
    try {
      await session.evalJson("JSON.stringify(window.__remount())");
      await session.evalJson("JSON.stringify(window.__type(" + JSON.stringify("Synthetic line\n".repeat(4)) + "))");
      await new Promise((r) => setTimeout(r, 200));
      const box = await session.evalJson("JSON.stringify(window.__box())");
      assert.ok(px(box.height) > 42);
      assert.ok(px(box.height) <= 132);
    } finally {
      session.close();
    }
  });

  test("bare programmatic clear with no event shrinks to one line", async () => {
    const session = await openChrome(fixture({ noz: false }), 1280, 900);
    try {
      await session.evalJson("JSON.stringify(window.__type(" + JSON.stringify("Synthetic line\n".repeat(4)) + "))");
      await new Promise((r) => setTimeout(r, 150));
      const grown = await session.evalJson("JSON.stringify(window.__box())");
      assert.ok(px(grown.height) > 42);
      const cleared = await session.evalJson("JSON.stringify(window.__setValue(''))");
      await new Promise((r) => setTimeout(r, 200));
      const after = await session.evalJson("JSON.stringify(window.__box())");
      assert.equal(cleared.clicks, 0);
      assert.equal(after.enters, 0);
      assert.equal(after.valueLen, 0);
      assert.equal(px(after.height), 42);
    } finally {
      session.close();
    }
  });

  test("nothing runs after stop", async () => {
    const session = await openChrome(fixture({ noz: false }), 1280, 900);
    try {
      await session.send("Emulation.setDeviceMetricsOverride", { width: 400, height: 800, deviceScaleFactor: 1, mobile: true });
      const armed = await session.evalJson("JSON.stringify(window.__armStop())");
      assert.equal(armed.fontsHooked, true);
      assert.equal(armed.running, false);
      assert.equal(armed.writes, 0);
      assert.equal(armed.obs, 0);
      assert.equal(armed.mirror, 0);
      assert.equal(armed.mark, false);
      assert.equal(armed.own, 0);
      assert.equal(armed.sizer, null);
      await session.evalJson("JSON.stringify(window.__releaseStop())");
      await new Promise((r) => setTimeout(r, 700));
      const late = await session.evalJson("JSON.stringify(window.__readStop())");
      assert.equal(late.writes, 0);
      assert.equal(late.running, false);
      assert.equal(late.obs, 0);
      assert.equal(late.mirror, 0);
      assert.equal(late.mark, false);
      assert.equal(late.own, 0);
      assert.equal(late.sizer, null);
      assert.equal(late.inline, armed.inline);
      const restarted = await session.evalJson("JSON.stringify(window.__restartTwice())");
      assert.equal(restarted.running, true);
      assert.equal(restarted.once, 2);
      assert.equal(restarted.twice, 2);
      await session.evalJson("JSON.stringify(window.__stopTwice())");
      await new Promise((r) => setTimeout(r, 300));
      const again = await session.evalJson("JSON.stringify(window.__readStop())");
      assert.equal(again.running, false);
      assert.equal(again.writes, 0);
      assert.equal(again.obs, 0);
      assert.equal(again.mirror, 0);
      assert.equal(again.mark, false);
      assert.equal(again.sizer, null);
      const owned = await session.evalJson("JSON.stringify(window.__ownedDescriptor())");
      assert.equal(owned.mid, 1);
      assert.equal(owned.after, 2);
      assert.equal(owned.writes, 0);
      assert.equal(owned.own, 1);
      assert.equal(owned.running, false);
      assert.equal(owned.obs, 0);
      assert.equal(owned.mirror, 0);
    } finally {
      session.close();
    }
  });

  test("without the script, empty focus 120 falls back to one line", async () => {
    const session = await openChrome(fixture({ noz: false, script: false }), 1280, 900, { script: false });
    try {
      const box = await session.evalJson("JSON.stringify(window.__ghl(120))");
      assert.equal(box.sizer, "");
      assert.equal(px(box.height), 42);
      assert.equal(px(box.maxH), 132);
      assert.notEqual(box.field, "content");
    } finally {
      session.close();
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
