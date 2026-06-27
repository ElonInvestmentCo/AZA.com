/**
 * QR Server for Expo Go
 *
 * - Spawns `expo start --tunnel --port 19000` as a child process
 * - Polls the Metro bundler API (localhost:19000) for the tunnel hostUri
 * - Also scans stdout/stderr for exp:// URLs as a fallback
 * - Serves an HTML page on port 5000 with a live QR code
 * - Auto-refreshes every 5 s until the tunnel URL appears
 */

import http from "node:http";
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/* ── State ───────────────────────────────────────────────────────────────── */
let tunnelUrl = null;
let metroReady = false;
let expoLogs = [];

/* ── Fetch tunnel URL from Metro API ─────────────────────────────────────── */
async function fetchExpoUrl() {
  try {
    const res = await fetch("http://localhost:19000/", {
      headers: {
        Accept: "application/expo+json,application/json",
        "Expo-Platform": "ios",
        "Expo-Api-Version": "1",
      },
      signal: AbortSignal.timeout(2000),
    });
    if (res.ok) {
      const text = await res.text();
      if (text.trimStart().startsWith("{")) {
        const data = JSON.parse(text);
        if (data.hostUri) {
          return `exp://${data.hostUri}`;
        }
      }
    }
  } catch {}

  // Fallback: use REPLIT_EXPO_DEV_DOMAIN env var
  const domain = process.env.REPLIT_EXPO_DEV_DOMAIN;
  if (domain && metroReady) {
    return `exp://${domain}`;
  }
  return null;
}

/* ── Poll for tunnel URL every 3 s once Metro is running ─────────────────── */
async function pollForUrl() {
  while (!tunnelUrl) {
    await new Promise(r => setTimeout(r, 3000));
    const found = await fetchExpoUrl();
    if (found) {
      tunnelUrl = found;
      console.log("[qr-server] Tunnel URL resolved:", tunnelUrl);
      break;
    }
  }
}

/* ── Spawn Expo ──────────────────────────────────────────────────────────── */
const expoEnv = { ...process.env };
if (process.env.REPLIT_EXPO_DEV_DOMAIN) {
  expoEnv.EXPO_PACKAGER_PROXY_URL = `https://${process.env.REPLIT_EXPO_DEV_DOMAIN}`;
}
if (process.env.REPLIT_DEV_DOMAIN) {
  expoEnv.EXPO_PUBLIC_DOMAIN = process.env.REPLIT_DEV_DOMAIN;
  expoEnv.REACT_NATIVE_PACKAGER_HOSTNAME = process.env.REPLIT_DEV_DOMAIN;
}
if (process.env.REPL_ID) {
  expoEnv.EXPO_PUBLIC_REPL_ID = process.env.REPL_ID;
}

const expo = spawn(
  "pnpm",
  ["exec", "expo", "start", "--tunnel", "--port", "19000"],
  { cwd: __dirname, env: expoEnv, stdio: ["ignore", "pipe", "pipe"] }
);

function stripAnsi(str) {
  return str.replace(/\x1b\[[0-9;]*[mGKHFJ]/g, "");
}

function onData(chunk) {
  const text = stripAnsi(chunk.toString());
  const lines = text.split("\n").filter(l => l.trim());

  for (const line of lines) {
    expoLogs.push(line.trim());
    if (expoLogs.length > 80) expoLogs.shift();

    // Detect metro ready / tunnel ready
    if (
      line.includes("Metro waiting on") ||
      line.includes("Tunnel ready") ||
      line.includes("Tunnel connected") ||
      line.includes("Waiting on http://localhost")
    ) {
      metroReady = true;
    }

    // Regex scan for exp:// in case it appears directly
    if (!tunnelUrl) {
      const match = line.match(/exp:\/\/[^\s\]"']+/);
      if (match) {
        tunnelUrl = match[0];
        console.log("[qr-server] Tunnel URL from stdout:", tunnelUrl);
      }
    }
  }

  process.stdout.write(chunk);
}

expo.stdout.on("data", onData);
expo.stderr.on("data", onData);
expo.on("exit", code => console.log("[qr-server] Expo exited:", code));

// Start polling
pollForUrl();

/* ── HTML page builder ───────────────────────────────────────────────────── */
function escHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildPage() {
  const qrImgSrc = tunnelUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=12&data=${encodeURIComponent(tunnelUrl)}`
    : null;

  const recentLogs = expoLogs.slice(-14);

  return /* html */`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>AZA — Expo Go</title>
  ${!tunnelUrl ? `<meta http-equiv="refresh" content="5"/>` : ""}
  <style>
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    body{
      min-height:100vh;background:#0A0A0F;color:#fff;
      font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
      display:flex;flex-direction:column;align-items:center;
      justify-content:center;padding:32px 16px 48px;gap:0;
    }
    header{text-align:center;margin-bottom:32px}
    .badge{
      display:inline-flex;align-items:center;gap:6px;
      background:#35C2C115;border:1px solid #35C2C130;
      border-radius:99px;padding:4px 14px;font-size:11px;
      font-weight:600;color:#35C2C1;letter-spacing:.8px;
      text-transform:uppercase;margin-bottom:14px;
    }
    .pulse{
      width:7px;height:7px;border-radius:50%;background:#35C2C1;
      display:inline-block;animation:pulse 1.4s ease-in-out infinite;
    }
    @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.85)}}
    h1{font-size:26px;font-weight:700;letter-spacing:-.5px}
    h1 span{color:#35C2C1}
    .subtitle{margin-top:8px;font-size:14px;color:rgba(255,255,255,.45);line-height:1.55}
    .card{
      background:#12121A;border:1px solid rgba(255,255,255,.08);
      border-radius:24px;padding:28px;
      display:flex;flex-direction:column;align-items:center;gap:18px;
      width:100%;max-width:360px;
    }
    .card-title{
      font-size:15px;font-weight:700;color:rgba(255,255,255,.9);
      display:flex;align-items:center;gap:8px;align-self:flex-start;
    }
    .dot{width:9px;height:9px;border-radius:50%;background:#35C2C1;flex-shrink:0;}
    .port{font-size:11px;color:rgba(255,255,255,.3);font-weight:500;margin-left:2px}
    .qr-box{
      background:#fff;border-radius:16px;padding:14px;
      display:flex;align-items:center;justify-content:center;
      width:100%;aspect-ratio:1;position:relative;overflow:hidden;
    }
    .qr-box img{width:100%;height:100%;display:block;border-radius:6px}
    .waiting{display:flex;flex-direction:column;align-items:center;gap:14px;width:100%}
    .spinner{
      width:36px;height:36px;border:3px solid rgba(11,10,10,.12);
      border-top-color:#35C2C1;border-radius:50%;
      animation:spin .8s linear infinite;
    }
    @keyframes spin{to{transform:rotate(360deg)}}
    .wait-text{font-size:13px;color:rgba(0,0,0,.4);text-align:center;line-height:1.65}
    .url-label{
      font-size:10px;font-weight:600;color:rgba(255,255,255,.3);
      letter-spacing:.5px;text-transform:uppercase;align-self:flex-start;
    }
    .url-chip{
      width:100%;background:rgba(255,255,255,.03);
      border:1px solid rgba(255,255,255,.07);border-radius:10px;
      padding:9px 12px;font-size:10.5px;word-break:break-all;
      line-height:1.5;font-family:"SF Mono","Fira Code",monospace;
      color:rgba(255,255,255,.3);
    }
    .url-chip.active{color:#35C2C1;background:#35C2C108;border-color:#35C2C125}
    .steps{
      margin-top:24px;text-align:center;max-width:360px;
      font-size:13px;color:rgba(255,255,255,.35);line-height:2;
    }
    .steps strong{color:rgba(255,255,255,.6)}
    .logs{
      margin-top:20px;width:100%;max-width:360px;
      background:#0D0D14;border:1px solid rgba(255,255,255,.06);
      border-radius:12px;padding:12px;
      font-family:"SF Mono","Fira Code",monospace;
      font-size:9px;color:rgba(255,255,255,.25);
      line-height:1.7;max-height:110px;overflow-y:auto;
    }
    .log-line{white-space:pre-wrap;word-break:break-all}
    .reload-btn{
      margin-top:20px;background:none;
      border:1px solid rgba(255,255,255,.1);border-radius:99px;
      color:rgba(255,255,255,.4);font-size:12px;font-weight:500;
      padding:8px 22px;cursor:pointer;transition:all .15s;
    }
    .reload-btn:hover{border-color:#35C2C140;color:#35C2C1}
  </style>
</head>
<body>
  <header>
    <div class="badge"><span class="pulse"></span> Live Dev Server</div>
    <h1>Open in <span>Expo Go</span></h1>
    <p class="subtitle">
      ${tunnelUrl
        ? "Scan the QR code below with <strong>Expo Go</strong> on your phone."
        : "Tunnel is starting&hellip; this usually takes 30&ndash;60&nbsp;s."}
    </p>
  </header>

  <div class="card">
    <div class="card-title">
      <div class="dot"></div>
      AZA Mobile <span class="port">:19000</span>
    </div>

    <div class="qr-box">
      ${tunnelUrl
        ? `<img src="${escHtml(qrImgSrc)}" alt="Expo Go QR Code"/>`
        : `<div class="waiting">
            <div class="spinner"></div>
            <div class="wait-text">
              ${metroReady ? "Tunnel negotiating…" : "Metro bundling…"}<br/>
              <small style="font-size:11px;opacity:.7">Auto-refreshing every 5&nbsp;s</small>
            </div>
          </div>`}
    </div>

    <div class="url-label">Expo URL</div>
    <div class="url-chip ${tunnelUrl ? "active" : ""}">
      ${tunnelUrl ? escHtml(tunnelUrl) : "Waiting for tunnel URL…"}
    </div>
  </div>

  <div class="steps">
    <strong>1.</strong> Install <strong>Expo Go</strong> on iOS or Android.<br/>
    <strong>2.</strong> Tap <strong>"Scan QR Code"</strong> in Expo Go.<br/>
    <strong>3.</strong> Point your camera at the QR code above.
  </div>

  ${recentLogs.length > 0
    ? `<div class="logs">${recentLogs.map(l => `<div class="log-line">${escHtml(l)}</div>`).join("")}</div>`
    : ""}

  <button class="reload-btn" onclick="location.reload()">↺ &nbsp;Refresh</button>
</body>
</html>`;
}

/* ── HTTP Server on port 5000 ────────────────────────────────────────────── */
http.createServer((_req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "no-cache, no-store, must-revalidate",
  });
  res.end(buildPage());
}).listen(5000, "0.0.0.0", () => {
  console.log("[qr-server] Serving QR page → http://localhost:5000");
});

/* ── Graceful shutdown ───────────────────────────────────────────────────── */
process.on("SIGTERM", () => { expo.kill("SIGTERM"); process.exit(0); });
process.on("SIGINT",  () => { expo.kill("SIGTERM"); process.exit(0); });
