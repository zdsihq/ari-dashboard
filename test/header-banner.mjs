/**
 * Native conversation header. WebKit (Playwright's WebKit engine), not Chrome.
 * A synthetic scroll is not a physical iOS keyboard. Nothing is sent.
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
const jsPath = path.join(root, "dashboard.js");
const cssPath = path.join(root, "dashboard.css");
const js = fs.readFileSync(jsPath, "utf8");
const css = fs.readFileSync(cssPath, "utf8");

function stampOf(source) {
  const marker = 'r.setAttribute("data-ari-build","';
  const at = source.indexOf(marker);
  assert.ok(at > 0);
  const end = source.indexOf('");', at);
  const value = source.slice(at + marker.length, end);
  const blank = source.slice(0, at + marker.length) + source.slice(end);
  const hex = crypto.createHash("md5").update(blank).digest("hex").slice(0, 12);
  return { value, expect: "s-" + hex };
}

function sliceScripts() {
  function grab(start, end) {
    const a = js.indexOf(start);
    const b = js.indexOf(end, a + start.length);
    if (a < 0 || b < 0) throw new Error("missing " + start);
    return js.slice(a, b + end.length);
  }
  return [
    grab("/* v3.24 phone: size the chat box", "}(window,document);\n"),
    js.slice(js.indexOf("!function(w,d){if(w.__ariPT)"), js.indexOf("\n", js.indexOf("!function(w,d){if(w.__ariPT)"))),
    grab('try{!function(t,e){"use strict";var a="__ariChatsRedesignV1"', 'console.warn("ari block crd2",t)}'),
    grab("/* v3.32 phone keyboard", "}(window,document);\n"),
    grab("/* v3.45 phone Ari Chats: lock zoom", "}(window,document);\n"),
    grab(";/* v3.68 phone:", "}(window,document);\n"),
    grab(";/* v3.80 phone:", "}(window,document);\n"),
    grab(";/* v3.84/85 phone:", "}(window,document);\n"),
  ].join("\n");
}

function pageHtml() {
  return `<!doctype html><html><head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="/dashboard.css">
</head>
<body style="margin:0;height:2400px">
<div id="app" style="height:1800px;overflow:auto">
  <div id="conversations-layout" style="height:900px">
    <div id="conversations-central-panel-viewer">
      <div id="native-head" class="justify-between border-b" style="display:flex;height:56px;align-items:center">
        <span data-testid="CENTRALPANEL_NAME">Sample Guest</span>
        <button id="head-bell" type="button">Bell</button>
        <a id="all-chats" href="#all">All chats</a>
      </div>
      <div class="conversation-panel" data-ari-msg-scroll style="height:240px;overflow:auto"><div id="msgs" style="height:900px">thread</div></div>
      <div id="composer-textarea"><textarea id="conv-composer-textarea-input" style="height:42px"></textarea></div>
    </div>
  </div>
</div>
<script>${sliceScripts()}<\/script>
</body></html>`;
}

function loadWebkit() {
  const require = createRequire(import.meta.url);
  return require("playwright").webkit;
}

async function serve() {
  const html = pageHtml();
  const server = http.createServer((req, res) => {
    if (req.url.split("?")[0] === "/dashboard.css") {
      res.setHeader("content-type", "text/css");
      res.end(css);
      return;
    }
    res.setHeader("content-type", "text/html; charset=utf-8");
    res.end(html);
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  return server;
}

async function openWebkit(width, height) {
  const webkit = loadWebkit();
  const server = await serve();
  const browser = await webkit.launch();
  const page = await browser.newPage({ viewport: { width, height } });
  const port = server.address().port;
  await page.goto(`http://127.0.0.1:${port}/v2/location/synthetic/conversations/conversations`);
  await page.waitForTimeout(500);
  return {
    page,
    async close() {
      await browser.close();
      server.close();
    },
  };
}

test("source drops the fixed twin and stamps the file instead of a release tag", () => {
  assert.equal(js.includes("ari-crd-bext"), false);
  assert.equal(css.includes("ari-crd-bext"), false);
  assert.equal(css.includes("#ari-crd-banner{"), true);
  assert.equal(js.includes('setAttribute("data-ari-build","v3.'), false);
  assert.equal(js.includes("file stamp, not a release tag"), true);
  const stamp = stampOf(js);
  assert.equal(stamp.value, stamp.expect);
  assert.equal(/^s-[0-9a-f]{12}$/.test(stamp.value), true);
  assert.equal(js.includes("V.scrollTop=V.scrollHeight"), true);
  assert.equal(js.includes("if(!composing()"), true);
  const sums = fs.readFileSync(path.join(root, "MD5SUMS"), "utf8");
  assert.equal(sums.includes(crypto.createHash("md5").update(js).digest("hex")), true);
  assert.equal(sums.includes(crypto.createHash("md5").update(css).digest("hex")), true);
});

test("single banner and no JS position writer", async () => {
  const session = await openWebkit(390, 700);
  try {
    const box = await session.page.evaluate(() => {
      const head = document.getElementById("native-head");
      const cs = getComputedStyle(head);
      return {
        ua: navigator.userAgent,
        bext: document.getElementById("ari-crd-bext"),
        heads: document.querySelectorAll("#native-head").length,
        inlineLeft: head.style.left,
        inlineTop: head.style.top,
        inlineBg: head.style.backgroundColor,
        bg: cs.backgroundColor,
        clicks: 0,
      };
    });
    assert.match(box.ua, /WebKit/);
    assert.equal(/Chrome/.test(box.ua), false);
    assert.equal(box.bext, null);
    assert.equal(box.heads, 1);
    assert.equal(box.inlineLeft, "");
    assert.equal(box.inlineTop, "");
    assert.equal(box.inlineBg, "");
    assert.equal(box.bg, "rgb(18, 63, 41)");
  } finally {
    await session.close();
  }
});

async function arm(page, value) {
  return page.evaluate((text) => {
    const field = document.getElementById("conv-composer-textarea-input");
    const app = document.getElementById("app");
    field.focus();
    field.value = text;
    field.dispatchEvent(new Event("input", { bubbles: true }));
    app.style.setProperty("height", "1800px", "important");
    app.style.setProperty("max-height", "none", "important");
    app.style.setProperty("overflow", "auto", "important");
    if (!document.getElementById("pad")) {
      const pad = document.createElement("div");
      pad.id = "pad";
      pad.style.height = "2400px";
      app.insertBefore(pad, app.firstChild);
    }
    let zeros = 0;
    const orig = window.scrollTo.bind(window);
    window.scrollTo = function (x, y) {
      const top = typeof x === "object" ? x.top : y;
      if (top === 0) zeros += 1;
      return orig(x, y);
    };
    app.scrollTop = 140;
    app.dispatchEvent(new Event("scroll"));
    window.__zeros = () => zeros;
    return {
      top: app.scrollTop,
      max: app.scrollHeight - app.clientHeight,
      active: document.activeElement && document.activeElement.id,
      zeros,
    };
  }, value);
}

test("typing does not yank a synthetic caret scroll", async () => {
  const session = await openWebkit(390, 700);
  try {
    const moved = await arm(session.page, "Sample line");
    assert.equal(moved.active, "conv-composer-textarea-input");
    assert.ok(moved.max > 140);
    assert.equal(moved.top, 140);
    assert.equal(moved.zeros, 0);
    await session.page.waitForTimeout(600);
    const after = await session.page.evaluate(() => ({
      top: document.getElementById("app").scrollTop,
      zeros: window.__zeros(),
      active: document.activeElement && document.activeElement.id,
    }));
    assert.equal(after.top, 140);
    assert.equal(after.zeros, 0);
    assert.equal(after.active, "conv-composer-textarea-input");
  } finally {
    await session.close();
  }
});

test("clear keeps the synthetic scroll while the field stays focused", async () => {
  const session = await openWebkit(390, 700);
  try {
    await arm(session.page, "Sample line");
    await session.page.evaluate(() => {
      const field = document.getElementById("conv-composer-textarea-input");
      field.value = "";
      field.dispatchEvent(new Event("input", { bubbles: true }));
      document.getElementById("app").dispatchEvent(new Event("scroll"));
    });
    await session.page.waitForTimeout(400);
    const after = await session.page.evaluate(() => ({
      len: document.getElementById("conv-composer-textarea-input").value.length,
      top: document.getElementById("app").scrollTop,
      zeros: window.__zeros(),
    }));
    assert.equal(after.len, 0);
    assert.equal(after.top, 140);
    assert.equal(after.zeros, 0);
  } finally {
    await session.close();
  }
});

test("simulated keyboard viewport does not reset scroll while composing", async () => {
  const session = await openWebkit(390, 700);
  try {
    await arm(session.page, "Sample line");
    await session.page.setViewportSize({ width: 390, height: 420 });
    await session.page.waitForTimeout(400);
    const after = await session.page.evaluate(() => ({
      top: document.getElementById("app").scrollTop,
      zeros: window.__zeros(),
      vvh: document.documentElement.style.getPropertyValue("--ari-vvh"),
      active: document.activeElement && document.activeElement.id,
    }));
    assert.equal(after.active, "conv-composer-textarea-input");
    assert.equal(after.zeros, 0);
    assert.equal(after.top, 140);
    assert.match(after.vvh, /^\d+px$/);
  } finally {
    await session.close();
  }
});

test("route cleanup removes the list banner and leaves no twin", async () => {
  const session = await openWebkit(390, 700);
  try {
    const started = await session.page.evaluate(() => ({
      banner: !!document.getElementById("ari-crd-banner"),
      bext: !!document.getElementById("ari-crd-bext"),
    }));
    assert.equal(started.banner, true);
    assert.equal(started.bext, false);
    await session.page.evaluate(() => {
      history.pushState({}, "", "/v2/location/synthetic/dashboard");
      window.dispatchEvent(new PopStateEvent("popstate"));
    });
    await session.page.waitForTimeout(500);
    const left = await session.page.evaluate(() => ({
      banner: !!document.getElementById("ari-crd-banner"),
      bext: !!document.getElementById("ari-crd-bext"),
      crd: document.documentElement.getAttribute("data-ari-crd"),
    }));
    assert.equal(left.banner, false);
    assert.equal(left.bext, false);
    assert.equal(left.crd, null);
  } finally {
    await session.close();
  }
});

test("remount keeps one native header and no twin", async () => {
  const session = await openWebkit(390, 700);
  try {
    await session.page.evaluate(() => {
      const old = document.getElementById("native-head");
      const neu = old.cloneNode(true);
      neu.id = "native-head";
      old.replaceWith(neu);
    });
    await session.page.waitForTimeout(700);
    const box = await session.page.evaluate(() => ({
      heads: document.querySelectorAll("[data-testid=CENTRALPANEL_NAME]").length,
      bext: document.getElementById("ari-crd-bext"),
      inlineBg: document.getElementById("native-head").style.backgroundColor,
    }));
    assert.equal(box.heads, 1);
    assert.equal(box.bext, null);
    assert.equal(box.inlineBg, "");
  } finally {
    await session.close();
  }
});

test("cleanup stop removes the list banner and no twin", async () => {
  const session = await openWebkit(390, 700);
  try {
    const stopped = await session.page.evaluate(() => {
      window.__ariChatsRedesignV1.stop();
      return {
        banner: !!document.getElementById("ari-crd-banner"),
        bext: !!document.getElementById("ari-crd-bext"),
        running: !!window.__ariChatsRedesignV1,
      };
    });
    assert.equal(stopped.banner, false);
    assert.equal(stopped.bext, false);
    assert.equal(stopped.running, false);
  } finally {
    await session.close();
  }
});

test("desktop does not create a fixed twin", async () => {
  const session = await openWebkit(1280, 800);
  try {
    await session.page.waitForTimeout(400);
    const box = await session.page.evaluate(() => ({
      bext: document.getElementById("ari-crd-bext"),
      banner: !!document.getElementById("ari-crd-banner"),
      fixed: [...document.querySelectorAll("body *")].filter((el) => getComputedStyle(el).position === "fixed" && el.id !== "conv-composer-textarea-input").map((el) => el.id),
    }));
    assert.equal(box.bext, null);
    assert.equal(box.banner, true);
    assert.equal(box.fixed.includes("ari-crd-bext"), false);
  } finally {
    await session.close();
  }
});

test("native header actions still receive the tap", async () => {
  const session = await openWebkit(390, 700);
  try {
    const hit = await session.page.evaluate(() => {
      const button = document.getElementById("head-bell");
      let taps = 0;
      button.addEventListener("click", () => { taps += 1; });
      const r = button.getBoundingClientRect();
      const top = document.elementFromPoint(r.left + 4, r.top + 4);
      button.click();
      const link = document.getElementById("all-chats");
      return { taps, topId: top && (top.id || top.tagName), href: link.getAttribute("href") };
    });
    assert.equal(hit.taps, 1);
    assert.equal(hit.topId, "head-bell");
    assert.equal(hit.href, "#all");
  } finally {
    await session.close();
  }
});

test("build marker matches the file stamp", async () => {
  const session = await openWebkit(390, 700);
  try {
    const stamp = stampOf(js);
    const seen = await session.page.evaluate(() => document.documentElement.getAttribute("data-ari-build"));
    assert.equal(seen, stamp.expect);
    assert.equal(seen, "s-9090cfb4bfa7");
  } finally {
    await session.close();
  }
});

test("message list still pins to the bottom when the composer is not focused", async () => {
  const session = await openWebkit(390, 700);
  try {
    await session.page.evaluate(() => {
      document.getElementById("conv-composer-textarea-input").blur();
      document.body.style.height = "2400px";
      const panel = document.querySelector(".conversation-panel");
      panel.scrollTop = 0;
      window.scrollTo(0, 180);
      window.dispatchEvent(new Event("scroll"));
    });
    await session.page.waitForTimeout(800);
    const idle = await session.page.evaluate(() => {
      const panel = document.querySelector(".conversation-panel");
      return {
        y: window.scrollY,
        top: panel.scrollTop,
        max: panel.scrollHeight - panel.clientHeight,
      };
    });
    assert.equal(idle.y, 0);
    assert.equal(idle.top, idle.max);
    assert.ok(idle.max > 0);
  } finally {
    await session.close();
  }
});

function sizerBundle() {
  const hubAt = js.indexOf("/* v3.37 shared hub:");
  const hubEnd = js.indexOf("(window,document);\n/* v3.44 route our", hubAt);
  const sizerAt = js.lastIndexOf("/* composer content sizer:");
  if (hubAt < 0 || hubEnd < hubAt || sizerAt < 0) throw new Error("sizer bundle markers missing");
  return js.slice(hubAt, hubEnd + "(window,document);".length) + "\n" + js.slice(sizerAt);
}

function composerHtml() {
  return `<!doctype html><html data-ari-no-crm-ai="v1" data-ari-msg-luxe="v2" data-ari-noz>
<head><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/dashboard.css"></head>
<body data-ari-shell="v1" data-ari-messages-layout="v2" data-ari-msg7="v1" style="margin:0;height:100vh;display:flex;flex-direction:column;justify-content:flex-end">
<div id="conversations-central-panel-viewer" style="width:100%">
<div id="composer-textarea" style="width:100%">
<textarea id="conv-composer-textarea-input" rows="2" style="width:100%"></textarea>
</div></div>
<script>
document.getElementById("conv-composer-textarea-input").addEventListener("input",function(){
  var el=this;
  requestAnimationFrame(function(){
    el.style.height="auto";
    el.style.height=el.scrollHeight+"px";
  });
});
<\/script>
<script>${sizerBundle()}<\/script>
</body></html>`;
}

async function openComposer() {
  const webkit = loadWebkit();
  const html = composerHtml();
  const server = http.createServer((req, res) => {
    if (req.url.split("?")[0] === "/dashboard.css") {
      res.setHeader("content-type", "text/css");
      res.end(css);
      return;
    }
    res.setHeader("content-type", "text/html; charset=utf-8");
    res.end(html);
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const browser = await webkit.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 420 } });
  await page.goto(`http://127.0.0.1:${server.address().port}/v2/location/synthetic/conversations/conversations`);
  await page.waitForTimeout(300);
  return {
    page,
    async close() {
      await browser.close();
      server.close();
    },
  };
}

test("empty phone box stays one line across frames", async () => {
  const session = await openComposer();
  try {
    const frames = await session.page.evaluate(() => new Promise((resolve) => {
      const el = document.getElementById("conv-composer-textarea-input");
      el.focus();
      const out = [];
      let i = 0;
      const step = () => {
        const r = el.getBoundingClientRect();
        out.push({ h: Math.round(r.height), top: Math.round(r.top), bot: Math.round(r.bottom), inline: el.style.height, rows: el.rows });
        if (++i < 6) requestAnimationFrame(step);
        else resolve(out);
      };
      requestAnimationFrame(step);
    }));
    assert.equal(frames[0].rows, 2);
    for (const frame of frames) {
      assert.equal(frame.h, frames[0].h);
      assert.equal(frame.top, frames[0].top);
      assert.equal(frame.bot, frames[0].bot);
    }
    assert.ok(frames[0].h <= 48);
    assert.ok(frames[0].h >= 40);
  } finally {
    await session.close();
  }
});

test("single line typing keeps height and on-screen position", async () => {
  const session = await openComposer();
  try {
    const frames = await session.page.evaluate(() => new Promise((resolve) => {
      const el = document.getElementById("conv-composer-textarea-input");
      el.focus();
      const out = [];
      const text = "Sample";
      let n = 0;
      function watch(left) {
        const r = el.getBoundingClientRect();
        out.push({ h: Math.round(r.height), top: Math.round(r.top), bot: Math.round(r.bottom), inline: el.style.height, val: el.value });
        if (left > 1) requestAnimationFrame(() => watch(left - 1));
        else next();
      }
      function next() {
        if (n >= text.length) return resolve(out);
        el.value += text[n++];
        el.dispatchEvent(new Event("input", { bubbles: true }));
        requestAnimationFrame(() => watch(6));
      }
      next();
    }));
    assert.ok(frames.length >= 6);
    const base = frames[0];
    for (const frame of frames) {
      assert.equal(frame.h, base.h);
      assert.equal(frame.top, base.top);
      assert.equal(frame.bot, base.bot);
    }
    assert.equal(frames.at(-1).val, "Sample");
    assert.ok(base.h <= 48);
    const selected = await session.page.evaluate(() => new Promise((resolve) => {
      const el = document.getElementById("conv-composer-textarea-input");
      el.setSelectionRange(1, 4);
      const out = [];
      let i = 0;
      const step = () => {
        const r = el.getBoundingClientRect();
        out.push({ h: Math.round(r.height), top: Math.round(r.top), bot: Math.round(r.bottom) });
        if (++i < 4) requestAnimationFrame(step);
        else resolve(out);
      };
      requestAnimationFrame(step);
    }));
    for (const frame of selected) {
      assert.equal(frame.h, base.h);
      assert.equal(frame.top, base.top);
      assert.equal(frame.bot, base.bot);
    }
  } finally {
    await session.close();
  }
});

test("many lines scroll inside the phone box and do not grow it", async () => {
  const session = await openComposer();
  try {
    const grown = await session.page.evaluate(() => new Promise((resolve) => {
      const el = document.getElementById("conv-composer-textarea-input");
      const before = Math.round(el.getBoundingClientRect().height);
      el.focus();
      el.value = "One\nTwo\nThree\nFour\nFive\nSix";
      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.style.height = "120px";
      setTimeout(() => {
        const r = el.getBoundingClientRect();
        el.scrollTop = el.scrollHeight;
        resolve({
          before,
          h: Math.round(r.height),
          top: Math.round(r.top),
          bot: Math.round(r.bottom),
          sh: el.scrollHeight,
          ch: el.clientHeight,
          scroll: el.scrollTop,
          writes: window.__ariComposerSize.writes(),
          mirror: document.querySelectorAll("[data-ari-composer-mirror]").length,
          rows: el.rows,
          inline: el.style.height,
        });
      }, 180);
    }));
    assert.equal(grown.h, grown.before);
    assert.ok(grown.h <= 48);
    assert.ok(grown.sh > grown.ch);
    assert.ok(grown.scroll > 0);
    assert.equal(grown.writes, 0);
    assert.equal(grown.mirror, 0);
    assert.equal(grown.rows, 2);
  } finally {
    await session.close();
  }
});

test("760 stays one line and 761 grows, then the phone lock returns", async () => {
  const session = await openComposer();
  try {
    await session.page.setViewportSize({ width: 760, height: 700 });
    await session.page.waitForTimeout(200);
    const phone = await session.page.evaluate(() => {
      const el = document.getElementById("conv-composer-textarea-input");
      el.focus();
      el.value = "One\nTwo\nThree\nFour";
      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.style.height = "120px";
      const r = el.getBoundingClientRect();
      return { h: Math.round(r.height), w: window.innerWidth, mirror: document.querySelectorAll("[data-ari-composer-mirror]").length };
    });
    await session.page.waitForTimeout(120);
    const phoneAfter = await session.page.evaluate(() => Math.round(document.getElementById("conv-composer-textarea-input").getBoundingClientRect().height));
    assert.equal(phone.w, 760);
    assert.equal(phone.h, 44);
    assert.equal(phoneAfter, 44);
    assert.equal(phone.mirror, 0);
    await session.page.setViewportSize({ width: 761, height: 700 });
    await session.page.waitForTimeout(250);
    const desktop = await session.page.evaluate(() => {
      const el = document.getElementById("conv-composer-textarea-input");
      const r = el.getBoundingClientRect();
      return { h: Math.round(r.height), max: Math.round(parseFloat(getComputedStyle(el).maxHeight)) };
    });
    assert.ok(desktop.h > 44);
    assert.ok(desktop.h <= 132);
    assert.equal(desktop.max, 132);
    await session.page.setViewportSize({ width: 390, height: 420 });
    await session.page.waitForTimeout(250);
    const back = await session.page.evaluate(() => {
      const el = document.getElementById("conv-composer-textarea-input");
      const r = el.getBoundingClientRect();
      return {
        h: Math.round(r.height),
        mirror: document.querySelectorAll("[data-ari-composer-mirror]").length,
        mark: el.hasAttribute("data-ari-sized"),
        rows: el.rows,
      };
    });
    assert.equal(back.h, 44);
    assert.equal(back.mirror, 0);
    assert.equal(back.mark, false);
    assert.equal(back.rows, 2);
  } finally {
    await session.close();
  }
});
