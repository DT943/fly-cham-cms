import { spawn } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";

const chrome = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9341;
const dir = join(tmpdir(), `admin-hdr-${Date.now()}`);
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
await sleep(1200);

const created = await fetch(
  `http://127.0.0.1:${PORT}/json/new?${encodeURIComponent("http://localhost:8080/")}`,
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
await sleep(5000);

const dump = await send("Runtime.evaluate", {
  awaitPromise: true,
  returnByValue: true,
  expression: `(() => ({
    href: location.href,
    title: document.title,
    ready: document.readyState,
    rootHtml: (document.getElementById('root')?.innerHTML || '').slice(0, 500),
    bodyText: (document.body?.innerText || '').replace(/\\s+/g, ' ').slice(0, 800),
    inputs: [...document.querySelectorAll('input')].map((i) => ({
      type: i.type, name: i.name, id: i.id, placeholder: i.placeholder,
    })),
    buttons: [...document.querySelectorAll('button')].slice(0, 15).map((b) =>
      (b.textContent || '').trim().slice(0, 40)
    ),
  }))()`,
});
console.log(JSON.stringify(dump.result?.result?.value ?? dump, null, 2));

// Screenshot via CDP
const shot = await send("Page.captureScreenshot", { format: "png" });
if (shot.result?.data) {
  const out = join(process.cwd(), "tmp-login-assets", "admin-home.png");
  writeFileSync(out, Buffer.from(shot.result.data, "base64"));
  console.log("screenshot", out);
}

ws.close();
proc.kill();
await sleep(400);
rmSync(dir, { recursive: true, force: true });
