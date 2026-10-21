import { spawn } from "node:child_process";
import { mkdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";

const chrome = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9356;
const dir = join(tmpdir(), `adm-base-${Date.now()}`);
mkdirSync(dir, { recursive: true });
const proc = spawn(
  chrome,
  [
    "--headless=new",
    "--disable-gpu",
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${dir}`,
  ],
  { stdio: "ignore" },
);
await sleep(1500);

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
await send("Network.enable");

const requests = [];
ws.addEventListener("message", (ev) => {
  const msg = JSON.parse(ev.data);
  if (msg.method === "Network.requestWillBeSent") {
    const url = msg.params?.request?.url || "";
    if (/get-header|update-header/.test(url)) requests.push(url);
  }
});

for (let i = 0; i < 20; i++) {
  await sleep(1000);
  const snap = await send("Runtime.evaluate", {
    returnByValue: true,
    expression: `({
      href: location.href,
      textLen: (document.body?.innerText || '').length,
      hasSaved: /Saved/.test(document.body?.innerText || ''),
    })`,
  });
  const v = snap.result?.result?.value;
  console.log("tick", i + 1, v);
  if (v?.hasSaved || (v?.textLen || 0) > 1500) break;
}

const cfg = await send("Runtime.evaluate", {
  awaitPromise: true,
  returnByValue: true,
  expression: `(async () => {
    const mod = await import('/src/cms2/config.js');
    return { base: mod.CMS2_API_BASE_URL };
  })()`,
});
console.log("config", cfg.result?.result?.value);
console.log("headerRequests", requests);

ws.close();
proc.kill();
await sleep(400);
rmSync(dir, { recursive: true, force: true });
