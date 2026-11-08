/**
 * Composer debug overlay. Playwright WebKit, not a physical iOS keyboard.
 * The overlay must not read or show the field text.
 */
import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import http from "node:http";
import test from "node:test";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const js = fs.readFileSync(path.join(root, "dashboard.js"));
const diag = fs.readFileSync(path.join(root, "composer-debug.js"));
const css = fs.readFileSync(path.join(root, "dashboard.css"));

function loadWebkit() {
  return createRequire(import.meta.url)("playwright").webkit;
}

function pageHtml(src) {
  return `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;height:1400px">
<div id="composer-wrap" style="margin-top:240px">
  <div id="composer-textarea" style="height:72px;background:#fff;border:1px solid #ccc">
    <div id="field-parent">
      <textarea id="conv-composer-textarea-input" rows="2" style="height:44px;width:220px;display:block"></textarea>
    </div>
    <button type="button" id="send">Send</button>
  </div>
</div>
<script>
document.getElementById("conv-composer-textarea-input").addEventListener("input",function(){
  var card=document.getElementById("composer-textarea");
  var h=card.getBoundingClientRect().height;
  requestAnimationFrame(function(){
    card.style.height=(h+24)+"px";
    requestAnimationFrame(function(){card.style.height="72px"});
  });
});
</script>
<script src="${src}"></script>
</body></html>`;
}

async function open(search, src) {
  const hits = [];
  const html = pageHtml(src);
  const server = http.createServer((req, res) => {
    const url = req.url.split("?")[0];
    hits.push(url);
    if (url === "/dashboard.js") {
      res.setHeader("content-type", "text/javascript");
      res.end(js);
      return;
    }
    if (url === "/composer-debug.js") {
      res.setHeader("content-type", "text/javascript");
      res.end(diag);
      return;
    }
    if (url === "/dashboard.css") {
      res.setHeader("content-type", "text/css");
      res.end(css);
      return;
    }
    res.setHeader("content-type", "text/html; charset=utf-8");
    res.end(html);
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const browser = await loadWebkit().launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 420 } });
  const port = server.address().port;
  await page.goto(`http://127.0.0.1:${port}/v2/location/synthetic/conversations/conversations${search}`);
  await page.waitForTimeout(350);
  return {
    page,
    hits,
    async close() {
      await browser.close();
      server.close();
    },
  };
}

test("debug flag absent does not install an overlay or request the observer", async () => {
  const session = await open("", "/dashboard.js");
  try {
    const ua = await session.page.evaluate(() => navigator.userAgent);
    assert.match(ua, /WebKit/);
    assert.equal(/Chrome/.test(ua), false);
    const state = await session.page.evaluate(() => ({
      box: document.getElementById("ari-composer-debug"),
      api: typeof window.__ariComposerDebug,
    }));
    assert.equal(state.box, null);
    assert.equal(state.api, "undefined");
    assert.equal(session.hits.includes("/composer-debug.js"), false);
  } finally {
    await session.close();
  }
});

test("the skin script requests the observer only for the exact debug flag", async () => {
  const session = await open("?ari_debug=composer", "/dashboard.js");
  try {
    await session.page.waitForTimeout(500);
    assert.equal(session.hits.filter((url) => url === "/composer-debug.js").length, 1);
    const box = await session.page.evaluate(() => !!document.getElementById("ari-composer-debug"));
    assert.equal(box, true);
  } finally {
    await session.close();
  }
});

test("a duplicate or other debug flag stays off", async () => {
  const session = await open("?ari_debug=composer&ari_debug=composer", "/composer-debug.js");
  try {
    const state = await session.page.evaluate(() => document.getElementById("ari-composer-debug"));
    assert.equal(state, null);
  } finally {
    await session.close();
  }
});

test("debug flag shows four rects and a one-frame card change while the field stays put", async () => {
  const session = await open("?ari_debug=composer", "/composer-debug.js");
  try {
    const before = await session.page.evaluate(() => {
      const el = document.getElementById("conv-composer-textarea-input");
      return { h: el.style.height, rows: el.rows, scroll: el.scrollTop };
    });
    await session.page.evaluate(() => {
      const el = document.getElementById("conv-composer-textarea-input");
      el.focus();
      el.value = "ZebraNote";
      el.dispatchEvent(new InputEvent("beforeinput", { bubbles: true, inputType: "insertText", data: "ZebraNote" }));
      el.dispatchEvent(new InputEvent("input", { bubbles: true, inputType: "insertText", data: "ZebraNote" }));
    });
    await session.page.waitForTimeout(400);
    const after = await session.page.evaluate(() => {
      const el = document.getElementById("conv-composer-textarea-input");
      const ui = document.getElementById("ari-composer-debug");
      return {
        text: ui ? ui.textContent : "",
        rows: window.__ariComposerDebug.rows(),
        h: el.style.height,
        rowCount: el.rows,
        scroll: el.scrollTop,
        pe: ui ? getComputedStyle(ui).pointerEvents : "",
        pos: ui ? getComputedStyle(ui).position : "",
      };
    });
    assert.equal(after.pe, "none");
    assert.equal(after.pos, "fixed");
    assert.equal(after.text.includes("ZebraNote"), false);
    assert.equal(JSON.stringify(after.rows).includes("ZebraNote"), false);
    assert.match(after.text, /\bf /);
    assert.match(after.text, /\bp /);
    assert.match(after.text, /\bc /);
    assert.match(after.text, /\bb /);
    assert.match(after.text, /vv /);
    const inputRow = after.rows.filter((row) => row.kind === "input")[0];
    assert.ok(inputRow);
    assert.equal(inputRow.inputType, "insertText");
    assert.equal(inputRow.nodes.field.hMin, inputRow.nodes.field.hMax);
    assert.ok(inputRow.nodes.card.hMax > inputRow.nodes.card.hMin);
    assert.equal(typeof inputRow.vv.h, "number");
    assert.equal(typeof inputRow.vv.t, "number");
    assert.equal(typeof inputRow.vv.y, "number");
    assert.ok(inputRow.frames >= 2);
    assert.ok(inputRow.frames <= 10);
    assert.equal(after.h, before.h);
    assert.equal(after.rowCount, before.rows);
    assert.equal(after.scroll, before.scroll);
  } finally {
    await session.close();
  }
});

test("stopping the readout removes it and a route change does not leave it running", async () => {
  const session = await open("?ari_debug=composer", "/composer-debug.js");
  try {
    await session.page.evaluate(() => window.__ariComposerDebug.stop());
    const gone = await session.page.evaluate(() => ({
      box: document.getElementById("ari-composer-debug"),
      api: window.__ariComposerDebug,
    }));
    assert.equal(gone.box, null);
    assert.equal(gone.api, undefined);
    await session.page.reload();
    await session.page.waitForTimeout(200);
    await session.page.evaluate(() => {
      const old = document.getElementById("conv-composer-textarea-input");
      const neu = old.cloneNode(true);
      old.replaceWith(neu);
      neu.value = "Other";
      neu.dispatchEvent(new Event("input", { bubbles: true }));
    });
    await session.page.waitForTimeout(200);
    const remount = await session.page.evaluate(() => {
      const ui = document.getElementById("ari-composer-debug");
      return { text: ui ? ui.textContent : "", has: !!window.__ariComposerDebug };
    });
    assert.equal(remount.has, true);
    assert.equal(remount.text.includes("Other"), false);
    assert.match(remount.text, /\bf /);
    await session.page.evaluate(() => {
      history.pushState({}, "", "/v2/location/synthetic/dashboard");
      window.dispatchEvent(new PopStateEvent("popstate"));
    });
    await session.page.waitForTimeout(50);
    const left = await session.page.evaluate(() => document.getElementById("ari-composer-debug"));
    assert.equal(left, null);
  } finally {
    await session.close();
  }
});

test("the readout fits a narrow phone without clipping a full row", async () => {
  const session = await open("?ari_debug=composer", "/composer-debug.js");
  try {
    await session.page.setViewportSize({ width: 320, height: 420 });
    const fit = await session.page.evaluate(() => {
      const el = document.getElementById("ari-composer-debug");
      const block = [
        "12 compositionupdate 9999ms",
        "insertCompositionText",
        "f 9999..9999/9999..9999",
        "p 9999..9999/9999..9999",
        "c 9999..9999/9999..9999",
        "b 9999..9999/9999..9999",
        "vv 9999..9999 y 9999",
        "o 9999,9999..9999",
      ].join("\n");
      const worst = ["dbg composer", block, block].join("\n");
      el.textContent = worst;
      const r = el.getBoundingClientRect();
      return {
        sw: el.scrollWidth,
        cw: el.clientWidth,
        sh: el.scrollHeight,
        ch: el.clientHeight,
        right: Math.round(r.right),
        vw: window.innerWidth,
        wrap: getComputedStyle(el).whiteSpace,
      };
    });
    assert.equal(fit.wrap, "pre-wrap");
    assert.ok(fit.right <= fit.vw);
    assert.ok(fit.sw <= fit.cw + 1, JSON.stringify(fit));
    assert.ok(fit.sh <= fit.ch + 1, JSON.stringify(fit));
  } finally {
    await session.close();
  }
});

test("the debug script url follows the loaded dashboard.js and is not pinned", () => {
  const loader = js.toString().slice(js.toString().lastIndexOf("composer debug loader"));
  assert.equal(loader.includes("dashboard\\.js(?=($|\\?))"), true);
  assert.equal(loader.includes("unpkg"), false);
  assert.equal(loader.includes("@main/"), false);
  assert.equal(loader.includes("9c168cb"), false);
  assert.equal(loader.includes("d02b27c"), false);
  const map = (src) => src.replace(/dashboard\.js(?=($|\?))/, "composer-debug.js");
  assert.equal(map("https://cdn.jsdelivr.net/gh/zdsihq/ari-dashboard@v3.117/dashboard.js"), "https://cdn.jsdelivr.net/gh/zdsihq/ari-dashboard@v3.117/composer-debug.js");
  assert.equal(map("https://cdn.jsdelivr.net/gh/zdsihq/ari-dashboard@9c168cbe5f3d2389ba3715ff001d3a82664a177f/dashboard.js"), "https://cdn.jsdelivr.net/gh/zdsihq/ari-dashboard@9c168cbe5f3d2389ba3715ff001d3a82664a177f/composer-debug.js");
});

test("source keeps the readout off the skin stylesheet and reserves none without applying it", () => {
  const proposal = fs.readFileSync(path.join(root, "NOT-STOCK-ari-skin-none.js"), "utf8");
  assert.equal(proposal.includes("NOT STOCK"), true);
  assert.equal(proposal.includes("removeAll"), false);
  assert.equal(css.includes("ari-composer-debug"), false);
  assert.equal(js.includes('q.get("ari_debug")!=="composer"'), true);
  assert.equal(js.includes("ari_skin=none"), false);
  const sums = fs.readFileSync(path.join(root, "MD5SUMS"), "utf8");
  assert.equal(sums.includes(crypto.createHash("md5").update(js).digest("hex")), true);
  assert.equal(sums.includes(crypto.createHash("md5").update(css).digest("hex")), true);
  assert.equal(sums.includes(crypto.createHash("md5").update(diag).digest("hex")), true);
});
