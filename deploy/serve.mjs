// Production static server for the built site (dist/), run by PM2 on the VPS.
// Zero dependencies — Node's http + fs only.
//
//   - Single-page app: any path that is not a real file gets index.html, so
//     React Router handles /en/help, /ar/our-destinations, … on reload.
//   - /assets/* are content-hashed by Vite → cached for a year (immutable);
//     index.html is never cached, so a deploy is visible on the next load.
//   - Text files are gzipped when the browser accepts it.
//   - GET /healthz → 200 "ok" (used by deploy/update-flycham.sh).
//
// Env: PORT (default 4000), HOST (default 0.0.0.0), ROOT (default ../dist).

import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { createGzip } from "node:zlib";

const PORT = Number(process.env.PORT) || 4000;
const HOST = process.env.HOST || "0.0.0.0";
const ROOT = resolve(process.env.ROOT || fileURLToPath(new URL("../dist", import.meta.url)));

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".pdf": "application/pdf",
  ".webmanifest": "application/manifest+json",
};
const COMPRESSIBLE = /^(text\/|application\/(json|xml|manifest\+json)|image\/svg\+xml)/;

/** Resolve a URL path inside ROOT; null if it escapes ROOT or is not a file. */
async function findFile(urlPath) {
  let decoded;
  try {
    decoded = decodeURIComponent(urlPath);
  } catch {
    return null;
  }
  const full = normalize(join(ROOT, decoded));
  if (full !== ROOT && !full.startsWith(ROOT + sep)) return null;
  try {
    const info = await stat(full);
    if (info.isFile()) return { path: full, size: info.size, mtime: info.mtime };
    if (info.isDirectory()) return findFile(join(decoded, "index.html"));
  } catch {
    // not found
  }
  return null;
}

function send(req, res, file, status = 200) {
  const type = MIME[extname(file.path).toLowerCase()] || "application/octet-stream";
  const immutable = file.path.startsWith(join(ROOT, "assets") + sep);
  const headers = {
    "Content-Type": type,
    "Cache-Control": type.startsWith("text/html")
      ? "no-cache"
      : immutable
        ? "public, max-age=31536000, immutable"
        : "public, max-age=3600",
    "Last-Modified": file.mtime.toUTCString(),
    "X-Content-Type-Options": "nosniff",
    Vary: "Accept-Encoding",
  };
  const gzip = COMPRESSIBLE.test(type) && /\bgzip\b/.test(req.headers["accept-encoding"] || "");
  if (gzip) headers["Content-Encoding"] = "gzip";
  else headers["Content-Length"] = file.size;

  res.writeHead(status, headers);
  if (req.method === "HEAD") return res.end();
  const stream = createReadStream(file.path);
  stream.on("error", () => res.destroy());
  (gzip ? stream.pipe(createGzip()) : stream).pipe(res);
}

const server = createServer(async (req, res) => {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.writeHead(405, { Allow: "GET, HEAD" }).end();
    return;
  }
  const { pathname } = new URL(req.url || "/", "http://localhost");
  if (pathname === "/healthz") {
    res.writeHead(200, { "Content-Type": "text/plain", "Cache-Control": "no-store" }).end("ok");
    return;
  }

  const file = await findFile(pathname);
  if (file) return send(req, res, file);

  // Missing asset files are real 404s; every other path is an app route.
  if (pathname.startsWith("/assets/") || extname(pathname)) {
    res.writeHead(404, { "Content-Type": "text/plain" }).end("Not found");
    return;
  }
  const index = await findFile("/index.html");
  if (index) return send(req, res, index);
  res.writeHead(503, { "Content-Type": "text/plain" }).end("Site is not built yet");
});

server.listen(PORT, HOST, () => {
  console.log(`new_fly_cham serving ${ROOT} on http://${HOST}:${PORT}/`);
});
