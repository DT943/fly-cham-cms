import { spawn } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";

const chrome = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9343;
const dir = join(tmpdir(), `cms2-hdr-${Date.now()}`);
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
  `http://127.0.0.1:${PORT}/json/new?${encodeURIComponent("http://localhost:8080/cms2/header")}`,
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

// Wait for auto cms2 sign-in + header load
for (let i = 0; i < 20; i++) {
  await sleep(1000);
  const snap = await send("Runtime.evaluate", {
    returnByValue: true,
    expression: `({
      href: location.href,
      textLen: (document.body?.innerText || '').length,
      hasLoginDropdown: /Log-in dropdown/i.test(document.body?.innerText || ''),
      hasHpRoot: Boolean(document.querySelector('.hp-root')),
    })`,
  });
  const v = snap.result?.result?.value;
  console.log("tick", i + 1, v);
  if (v?.hasLoginDropdown || v?.hasHpRoot) break;
}

const page = await send("Runtime.evaluate", {
  returnByValue: true,
  expression: `(() => {
    const text = (document.body.innerText || '').replace(/\\s+/g, ' ');
    return {
      href: location.href,
      hasLogInDropdown: /Log-in dropdown/i.test(text),
      hasPromoTitle: /Promo title/i.test(text),
      hasBenefits: /Benefits/i.test(text),
      hasStyle: /\\bStyle\\b/.test(text),
      hasWelcomeInFields: /Welcome to Cham Miles/i.test(text),
      hasHpRoot: Boolean(document.querySelector('.hp-root')),
      snippet: text.slice(0, 600),
    };
  })()`,
});
const pageV = page.result?.result?.value;
console.log("page", pageV);

await send("Runtime.evaluate", {
  expression: `(() => {
    const btn = [...document.querySelectorAll('button')].find((b) =>
      /^\\s*Style\\s*$/i.test(b.textContent || '')
    );
    btn?.click();
    return Boolean(btn);
  })()`,
});
await sleep(1000);

const style = await send("Runtime.evaluate", {
  returnByValue: true,
  expression: `(() => {
    const text = (document.body.innerText || '').replace(/\\s+/g, ' ');
    return {
      hasLoginPanelGroup: /Log-in dropdown/i.test(text),
      hasPromoGradient: /Promo gradient/i.test(text),
      hasSubmitBg: /Log-in button background/i.test(text),
      hasCreateBorder: /Create-account border/i.test(text),
    };
  })()`,
});
console.log("style", style.result?.result?.value);

// Close Style drawer so it does not cover the preview
await send("Runtime.evaluate", {
  expression: `(() => {
    const close =
      [...document.querySelectorAll('button')].find((b) =>
        /close|done|cancel/i.test(b.getAttribute('aria-label') || b.textContent || '')
      ) ||
      document.querySelector('[data-drawer] button, .drawer button[aria-label]');
    // Escape key usually closes drawers in this admin
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    close?.click();
    return true;
  })()`,
});
await sleep(600);

const clickLogin = await send("Runtime.evaluate", {
  returnByValue: true,
  expression: `(() => {
    const root = document.querySelector('.hp-root');
    const btn = root && [...root.querySelectorAll('button')].find((b) =>
      /log\\s*in/i.test(b.getAttribute('aria-label') || b.getAttribute('title') || '')
    );
    if (!btn) {
      return {
        ok: false,
        buttons: [...(root?.querySelectorAll('button') || [])].slice(0, 8).map((b) => ({
          label: b.getAttribute('aria-label'),
          title: b.getAttribute('title'),
        })),
      };
    }
    btn.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    btn.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
    btn.focus();
    btn.click();
    return {
      ok: true,
      label: btn.getAttribute('aria-label'),
      active: btn.getAttribute('data-active'),
    };
  })()`,
});
console.log("clickLogin", clickLogin.result?.result?.value);
await sleep(900);

const preview = await send("Runtime.evaluate", {
  returnByValue: true,
  expression: `(() => {
    const root = document.querySelector('.hp-root');
    const text = (root?.innerText || '').replace(/\\s+/g, ' ');
    return {
      hasWelcome: /Welcome to Cham Miles/i.test(text),
      hasCreate: /Create account/i.test(text),
      hasEmail: /\\bEmail\\b/i.test(text),
      hasPassword: /Password/i.test(text),
      hasOr: /\\bOR\\b/.test(text),
      snippet: text.slice(0, 400),
    };
  })()`,
});
console.log("preview", preview.result?.result?.value);

// Edit a field and confirm preview updates
const edit = await send("Runtime.evaluate", {
  awaitPromise: true,
  returnByValue: true,
  expression: `(() => {
    const input = document.querySelector('#header-login-panel-title');
    if (!input) return { ok: false, reason: 'no title field' };
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    setter.call(input, 'TEST Welcome Title');
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    return { ok: true, value: input.value };
  })()`,
});
console.log("edit", edit.result?.result?.value);
await sleep(500);

const afterEdit = await send("Runtime.evaluate", {
  returnByValue: true,
  expression: `(() => {
    const root = document.querySelector('.hp-root');
    const text = root?.innerText || '';
    return {
      previewHasTestTitle: /TEST Welcome Title/i.test(text),
      fieldValue: document.querySelector('#header-login-panel-title')?.value || null,
    };
  })()`,
});
console.log("afterEdit", afterEdit.result?.result?.value);

const shot = await send("Page.captureScreenshot", { format: "png" });
if (shot.result?.data) {
  writeFileSync(
    join(process.cwd(), "tmp-login-assets", "admin-header.png"),
    Buffer.from(shot.result.data, "base64"),
  );
}

const pv = preview.result?.result?.value;
const st = style.result?.result?.value;
const pass =
  pageV?.hasLogInDropdown &&
  pageV?.hasPromoTitle &&
  (st?.hasPromoGradient || st?.hasLoginPanelGroup) &&
  (pv?.hasWelcome || pv?.hasEmail);

console.log(JSON.stringify({ pass }, null, 2));

ws.close();
proc.kill();
await sleep(400);
rmSync(dir, { recursive: true, force: true });
process.exit(pass ? 0 : 1);
