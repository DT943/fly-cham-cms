/**
 * E2E smoke: public site login dropdown + admin header preview.
 * Uses Chrome CDP (no playwright install required).
 */
import { spawn } from "node:child_process";
import { mkdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";

const chrome =
  process.env.CHROME_PATH ||
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9340;
const dir = join(tmpdir(), `login-e2e-${Date.now()}`);
mkdirSync(dir, { recursive: true });

const proc = spawn(
  chrome,
  [
    "--headless=new",
    "--disable-gpu",
    "--window-size=1400,900",
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${dir}`,
  ],
  { stdio: "ignore" },
);

await sleep(1500);

async function connect(url) {
  // Navigate via new tab
  const created = await fetch(`http://127.0.0.1:${PORT}/json/new?${encodeURIComponent(url)}`, {
    method: "PUT",
  }).then((r) => r.json());
  await sleep(500);
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
  return { ws, send, id: created.id };
}

async function evaluate(send, expression) {
  const res = await send("Runtime.evaluate", {
    awaitPromise: true,
    returnByValue: true,
    expression,
  });
  if (res.result?.exceptionDetails) {
    return { error: res.result.exceptionDetails.text || "eval error" };
  }
  return res.result?.result?.value;
}

async function mouseClick(send, x, y) {
  await send("Input.dispatchMouseEvent", {
    type: "mouseMoved",
    x,
    y,
    button: "none",
  });
  await sleep(40);
  for (const type of ["mousePressed", "mouseReleased"]) {
    await send("Input.dispatchMouseEvent", {
      type,
      x,
      y,
      button: "left",
      buttons: type === "mousePressed" ? 1 : 0,
      clickCount: 1,
    });
    await sleep(40);
  }
}

const results = { site: {}, admin: {}, ok: true };

// ---------- Public site ----------
{
  const { ws, send } = await connect("http://localhost:5173/sy/en/");
  await sleep(3500);

  // Dismiss cookie banner if present (Accept)
  await evaluate(
    send,
    `(() => {
      const btn = [...document.querySelectorAll('button')].find((b) =>
        /accept/i.test(b.textContent || '')
      );
      if (btn) btn.click();
      return Boolean(btn);
    })()`,
  );
  await sleep(500);

  const prep = await evaluate(
    send,
    `(() => {
      const btn = document.querySelector('header button[aria-controls="login-mega-menu"]');
      if (!btn) {
        return {
          fail: 'no-login-button',
          buttons: [...document.querySelectorAll('header button')].slice(0, 12).map((n) => ({
            label: n.getAttribute('aria-label'),
            controls: n.getAttribute('aria-controls'),
          })),
        };
      }
      const r = btn.getBoundingClientRect();
      const x = r.left + r.width / 2;
      const y = r.top + r.height / 2;
      const hit = document.elementFromPoint(x, y);
      return {
        x, y,
        hitTag: hit?.tagName,
        hitControls: hit?.closest?.('button')?.getAttribute('aria-controls'),
        blockedByCookie: Boolean(hit?.closest?.('[class*="z-1100"]')),
      };
    })()`,
  );
  results.site.prep = prep;

  if (prep?.x) {
    await mouseClick(send, prep.x, prep.y);
    await sleep(900);
  }

  results.site.afterClick = await evaluate(
    send,
    `(() => {
      const btn = document.querySelector('header button[aria-controls="login-mega-menu"]');
      const panel = document.querySelector('#login-mega-menu');
      const h2 = panel?.querySelector('h2');
      const text = panel ? (panel.innerText || '').replace(/\\s+/g, ' ').trim() : '';
      return {
        expanded: btn?.getAttribute('aria-expanded'),
        panel: Boolean(panel),
        title: h2?.textContent?.trim() || null,
        hasEmail: /email/i.test(text),
        hasPassword: /password/i.test(text),
        hasCreate: /create account/i.test(text),
        hasBenefits: /exclusive offers|check-in/i.test(text),
        snippet: text.slice(0, 220),
      };
    })()`,
  );

  // Style tokens applied (promo gradient uses CSS vars / inline)
  results.site.styles = await evaluate(
    send,
    `(() => {
      const panel = document.querySelector('#login-mega-menu');
      if (!panel) return null;
      const promo = panel.querySelector('[style*="linear-gradient"]');
      const bg = promo?.style?.backgroundImage || '';
      return {
        hasPromoGradient: /linear-gradient/i.test(bg),
        gradient: bg.slice(0, 120),
      };
    })()`,
  );

  results.site.pass =
    results.site.afterClick?.expanded === 'true' &&
    results.site.afterClick?.panel === true &&
    Boolean(results.site.afterClick?.title) &&
    results.site.afterClick?.hasEmail &&
    results.site.afterClick?.hasPassword;
  if (!results.site.pass) results.ok = false;

  ws.close();
}

// ---------- Admin header page ----------
{
  // Try cms2 header; may redirect to login
  const { ws, send } = await connect("http://localhost:8080/cms2/header");
  await sleep(4000);

  results.admin.location = await evaluate(send, `location.href`);
  results.admin.title = await evaluate(send, `document.title`);

  // If login form present, try admin credentials used in cms scripts
  const loggedIn = await evaluate(
    send,
    `(() => new Promise(async (resolve) => {
      const email =
        document.querySelector('input[type="email"], input[name="email"], #email') ||
        document.querySelector('input[autocomplete="username"]');
      const pass =
        document.querySelector('input[type="password"], input[name="password"], #password');
      if (!email || !pass) {
        resolve({ needed: false, hasHeader: /header/i.test(document.body.innerText || '') });
        return;
      }
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      setter.call(email, 'admin@flycham.local');
      email.dispatchEvent(new Event('input', { bubbles: true }));
      setter.call(pass, 'FlyChamAdmin!2026');
      pass.dispatchEvent(new Event('input', { bubbles: true }));
      const submit =
        document.querySelector('button[type="submit"]') ||
        [...document.querySelectorAll('button')].find((b) => /sign in|log in|login/i.test(b.textContent || ''));
      submit?.click();
      await new Promise((r) => setTimeout(r, 3500));
      resolve({ needed: true, href: location.href, body: (document.body.innerText || '').slice(0, 200) });
    }))()`,
  );
  results.admin.auth = loggedIn;

  if (loggedIn?.needed) {
    await evaluate(send, `location.href = 'http://localhost:8080/cms2/header'`);
    await sleep(4000);
  }

  results.admin.page = await evaluate(
    send,
    `(() => {
      const text = document.body.innerText || '';
      return {
        href: location.href,
        hasLogInDropdown: /log-in dropdown/i.test(text),
        hasPromoTitle: /promo title/i.test(text),
        hasBenefits: /benefits/i.test(text),
        hasStyleBtn: /\\bStyle\\b/.test(text),
        hasWelcomeDefault: /Welcome to Cham Miles/i.test(text),
        snippet: text.replace(/\\s+/g, ' ').slice(0, 400),
      };
    })()`,
  );

  // Open style drawer if possible and check login style group
  await evaluate(
    send,
    `(() => {
      const btn = [...document.querySelectorAll('button')].find((b) =>
        /^\\s*Style\\s*$/i.test(b.textContent || '')
      );
      btn?.click();
      return Boolean(btn);
    })()`,
  );
  await sleep(800);

  results.admin.styleDrawer = await evaluate(
    send,
    `(() => {
      const text = document.body.innerText || '';
      return {
        hasLoginPanelGroup: /Log-in dropdown/i.test(text),
        hasPromoGradient: /Promo gradient/i.test(text),
        hasSubmitBg: /Log-in button background/i.test(text),
      };
    })()`,
  );

  // Hover login icon in preview
  const previewHit = await evaluate(
    send,
    `(() => {
      const btn = [...document.querySelectorAll('button, span')].find((n) =>
        n.getAttribute('aria-label') === 'Log in' ||
        (n.getAttribute('title') === 'Log in')
      );
      // Prefer hp-root user icon button
      const root = document.querySelector('.hp-root');
      const icons = root ? [...root.querySelectorAll('button, span')] : [];
      const login = icons.find((n) => /log in/i.test(n.getAttribute('aria-label') || n.getAttribute('title') || ''));
      const el = login || btn;
      if (!el) return { fail: 'no-preview-login' };
      el.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      el.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
      if (typeof el.click === 'function') el.click();
      return { ok: true, tag: el.tagName };
    })()`,
  );
  await sleep(700);

  results.admin.preview = await evaluate(
    send,
    `(() => {
      const root = document.querySelector('.hp-root');
      const text = root ? root.innerText : '';
      return {
        hasPreviewRoot: Boolean(root),
        hasWelcome: /Welcome to Cham Miles/i.test(text),
        hasCreateAccount: /Create account/i.test(text),
        hasEmailField: /Email/i.test(text),
        snippet: text.replace(/\\s+/g, ' ').slice(0, 280),
      };
    })()`,
  );

  results.admin.pass =
    results.admin.page?.hasLogInDropdown === true &&
    (results.admin.styleDrawer?.hasLoginPanelGroup === true ||
      results.admin.page?.hasPromoTitle === true) &&
    (results.admin.preview?.hasWelcome === true ||
      results.admin.preview?.hasEmailField === true);
  if (!results.admin.pass) results.ok = false;

  ws.close();
}

console.log(JSON.stringify(results, null, 2));

proc.kill();
await sleep(400);
rmSync(dir, { recursive: true, force: true });
process.exit(results.ok ? 0 : 1);
