import { spawn } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";

const chrome = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9342;
const dir = join(tmpdir(), `admin-flow-${Date.now()}`);
mkdirSync(dir, { recursive: true });
const proc = spawn(
  chrome,
  [
    "--headless=new",
    "--disable-gpu",
    "--window-size=1440,1000",
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${dir}`,
  ],
  { stdio: "ignore" },
);
await sleep(1200);

const created = await fetch(
  `http://127.0.0.1:${PORT}/json/new?${encodeURIComponent("http://localhost:8080/login")}`,
  { method: "PUT" },
).then((r) => r.json());
const ws = new WebSocket(created.webSocketDebuggerUrl);
let id = 0;
const pending = new Map();
ws.addEventListener("message", (ev) => {
  const msg = JSON.parse(ev.data);
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id)(msg);
    pending.delete(msg.id);
  }
});
const send = (method, params = {}) =>
  new Promise((resolve) => {
    const msgId = ++id;
    pending.set(msgId, resolve);
    ws.send(JSON.stringify({ id: msgId, method, params }));
  });
await new Promise((r, j) => {
  ws.addEventListener("open", r);
  ws.addEventListener("error", j);
});
await send("Runtime.enable");
await send("Page.enable");
await send("DOM.enable");
await send("Input.setIgnoreInputEvents", { ignore: false });
await sleep(3500);

async function evalExpr(expression) {
  const res = await send("Runtime.evaluate", {
    awaitPromise: true,
    returnByValue: true,
    expression,
  });
  return res.result?.result?.value ?? res;
}

async function typeInto(selector, text) {
  const box = await evalExpr(`(() => {
    const el = document.querySelector(${JSON.stringify(selector)});
    if (!el) return null;
    el.focus();
    el.select?.();
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  })()`);
  if (!box?.x) throw new Error("missing " + selector);
  await send("Input.dispatchMouseEvent", {
    type: "mousePressed",
    x: box.x,
    y: box.y,
    button: "left",
    buttons: 1,
    clickCount: 1,
  });
  await send("Input.dispatchMouseEvent", {
    type: "mouseReleased",
    x: box.x,
    y: box.y,
    button: "left",
    buttons: 0,
    clickCount: 1,
  });
  await sleep(100);
  // Clear then type
  await send("Input.dispatchKeyEvent", { type: "keyDown", windowsVirtualKeyCode: 65, modifiers: 2 });
  await send("Input.dispatchKeyEvent", { type: "keyUp", windowsVirtualKeyCode: 65, modifiers: 2 });
  await send("Input.dispatchKeyEvent", { type: "keyDown", windowsVirtualKeyCode: 8 });
  await send("Input.dispatchKeyEvent", { type: "keyUp", windowsVirtualKeyCode: 8 });
  await send("Input.insertText", { text });
}

await typeInto("#email", "admin@flycham.local");
await sleep(200);
await typeInto("#password", "FlyChamAdmin!2026");
await sleep(200);

const signIn = await evalExpr(`(() => {
  const btn = [...document.querySelectorAll('button')].find((b) =>
    /sign in/i.test(b.textContent || '')
  );
  if (!btn) return null;
  const r = btn.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2, text: btn.textContent.trim() };
})()`);
console.log("signIn btn", signIn);
if (signIn?.x) {
  await send("Input.dispatchMouseEvent", {
    type: "mousePressed",
    x: signIn.x,
    y: signIn.y,
    button: "left",
    buttons: 1,
    clickCount: 1,
  });
  await send("Input.dispatchMouseEvent", {
    type: "mouseReleased",
    x: signIn.x,
    y: signIn.y,
    button: "left",
    buttons: 0,
    clickCount: 1,
  });
}

await sleep(5000);
console.log("after login", await evalExpr(`({ href: location.href, text: (document.body.innerText||'').replace(/\\s+/g,' ').slice(0,300) })`));

await evalExpr(`location.href = 'http://localhost:8080/cms2/header'`);
await sleep(6000);

const page = await evalExpr(`(() => {
  const text = (document.body.innerText || '').replace(/\\s+/g, ' ');
  return {
    href: location.href,
    hasLogInDropdown: /Log-in dropdown/i.test(text),
    hasPromoTitle: /Promo title/i.test(text),
    hasBenefits: /Benefits \\(/i.test(text),
    hasStyle: /\\bStyle\\b/.test(text),
    hasWelcome: /Welcome to Cham Miles/i.test(text),
    hasHpRoot: Boolean(document.querySelector('.hp-root')),
    snippet: text.slice(0, 500),
  };
})()`);
console.log("header page", page);

// Open Style drawer
await evalExpr(`(() => {
  const btn = [...document.querySelectorAll('button')].find((b) =>
    /Style/i.test(b.textContent || '') && b.querySelector('svg')
  ) || [...document.querySelectorAll('button')].find((b) => /^\\s*Style\\s*$/i.test(b.textContent || ''));
  btn?.click();
  return btn ? (btn.textContent || '').trim() : null;
})()`);
await sleep(1000);

const style = await evalExpr(`(() => {
  const text = (document.body.innerText || '').replace(/\\s+/g, ' ');
  return {
    hasLoginPanelGroup: /Log-in dropdown/i.test(text),
    hasPromoGradient: /Promo gradient/i.test(text),
    hasSubmitBg: /Log-in button background/i.test(text),
  };
})()`);
console.log("style drawer", style);

// Click/hover login in preview
await evalExpr(`(() => {
  const root = document.querySelector('.hp-root');
  if (!root) return false;
  const btn = [...root.querySelectorAll('button')].find((b) =>
    /log in/i.test(b.getAttribute('aria-label') || b.getAttribute('title') || '')
  );
  if (!btn) return false;
  btn.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
  btn.click();
  return true;
})()`);
await sleep(800);

const preview = await evalExpr(`(() => {
  const root = document.querySelector('.hp-root');
  const text = (root?.innerText || '').replace(/\\s+/g, ' ');
  return {
    hasWelcome: /Welcome to Cham Miles/i.test(text),
    hasCreate: /Create account/i.test(text),
    hasEmail: /Email/i.test(text),
    hasPassword: /Password/i.test(text),
    snippet: text.slice(0, 350),
  };
})()`);
console.log("preview", preview);

const shot = await send("Page.captureScreenshot", { format: "png" });
if (shot.result?.data) {
  writeFileSync(
    join(process.cwd(), "tmp-login-assets", "admin-header.png"),
    Buffer.from(shot.result.data, "base64"),
  );
  console.log("wrote admin-header.png");
}

const pass =
  page.hasLogInDropdown &&
  (style.hasLoginPanelGroup || page.hasPromoTitle) &&
  (preview.hasWelcome || preview.hasEmail);

console.log(JSON.stringify({ pass, page, style, preview }, null, 2));

ws.close();
proc.kill();
await sleep(400);
rmSync(dir, { recursive: true, force: true });
process.exit(pass ? 0 : 1);
