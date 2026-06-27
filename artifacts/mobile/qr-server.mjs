/**
 * QR Server for Expo Go — Native Mobile Preview
 *
 * Serves a polished preview page on port 5000 with:
 *   - Phone frame mockup in the centre
 *   - "Preview on your phone" QR panel on the right
 *   - Spawns expo start --tunnel --port 19000 in the background
 *   - Polls Metro API + scans stdout for the tunnel exp:// URL
 */

import http from "node:http";
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/* ── State ───────────────────────────────────────────────────────────────── */
let tunnelUrl = null;
let metroReady = false;
let expoLogs   = [];

/* ── Poll Metro API for tunnel URL ───────────────────────────────────────── */
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
        if (data.hostUri) return `exp://${data.hostUri}`;
      }
    }
  } catch {}
  return null;
}

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
if (process.env.REPLIT_EXPO_DEV_DOMAIN)
  expoEnv.EXPO_PACKAGER_PROXY_URL = `https://${process.env.REPLIT_EXPO_DEV_DOMAIN}`;
if (process.env.REPLIT_DEV_DOMAIN) {
  expoEnv.EXPO_PUBLIC_DOMAIN = process.env.REPLIT_DEV_DOMAIN;
  expoEnv.REACT_NATIVE_PACKAGER_HOSTNAME = process.env.REPLIT_DEV_DOMAIN;
}
if (process.env.REPL_ID)
  expoEnv.EXPO_PUBLIC_REPL_ID = process.env.REPL_ID;

const expo = spawn(
  "pnpm",
  ["exec", "expo", "start", "--tunnel", "--port", "19000"],
  { cwd: __dirname, env: expoEnv, stdio: ["ignore", "pipe", "pipe"] }
);

const stripAnsi = s => s.replace(/\x1b\[[0-9;]*[mGKHFJ]/g, "");

function onData(chunk) {
  const text = stripAnsi(chunk.toString());
  for (const line of text.split("\n").filter(l => l.trim())) {
    expoLogs.push(line.trim());
    if (expoLogs.length > 80) expoLogs.shift();
    if (
      line.includes("Metro waiting on") ||
      line.includes("Tunnel ready") ||
      line.includes("Tunnel connected") ||
      line.includes("Waiting on http://localhost")
    ) metroReady = true;
    if (!tunnelUrl) {
      const m = line.match(/exp:\/\/[^\s\]"']+/);
      if (m) { tunnelUrl = m[0]; console.log("[qr-server] URL from stdout:", tunnelUrl); }
    }
  }
  process.stdout.write(chunk);
}
expo.stdout.on("data", onData);
expo.stderr.on("data", onData);
expo.on("exit", code => console.log("[qr-server] Expo exited:", code));
pollForUrl();

/* ── HTML builder ────────────────────────────────────────────────────────── */
const esc = s => s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");

function buildPage() {
  const qrSrc = tunnelUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=10&data=${encodeURIComponent(tunnelUrl)}`
    : null;

  const statusLabel = tunnelUrl
    ? "Live"
    : metroReady ? "Tunnel connecting…" : "Starting Metro…";

  const recentLogs = expoLogs.slice(-10);

  return /* html */`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>AZA Mobile — Expo Preview</title>
  ${!tunnelUrl ? `<meta http-equiv="refresh" content="4"/>` : ""}
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      min-height: 100vh;
      background: #0f0f13;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      color: #fff;
      display: flex;
      flex-direction: column;
    }

    /* ── top bar ── */
    .topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      height: 52px;
      background: #18181f;
      border-bottom: 1px solid rgba(255,255,255,.07);
      flex-shrink: 0;
    }
    .topbar-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .app-name {
      font-size: 14px;
      font-weight: 600;
      color: rgba(255,255,255,.85);
    }
    .status-pill {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      background: ${tunnelUrl ? "#00D9A015" : "#f59e0b15"};
      border: 1px solid ${tunnelUrl ? "#00D9A030" : "#f59e0b30"};
      border-radius: 99px;
      padding: 3px 10px;
      font-size: 11px;
      font-weight: 600;
      color: ${tunnelUrl ? "#00D9A0" : "#f59e0b"};
      letter-spacing: .4px;
    }
    .pulse {
      width: 6px; height: 6px;
      border-radius: 50%;
      background: ${tunnelUrl ? "#00D9A0" : "#f59e0b"};
      animation: pulse 1.5s ease-in-out infinite;
    }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
    .sim-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      background: rgba(255,255,255,.06);
      border: 1px solid rgba(255,255,255,.1);
      border-radius: 8px;
      padding: 6px 14px;
      font-size: 12px;
      font-weight: 500;
      color: rgba(255,255,255,.65);
      cursor: default;
    }

    /* ── main layout ── */
    .main {
      display: flex;
      flex: 1;
      overflow: hidden;
    }

    /* ── phone area ── */
    .phone-area {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px 0;
      position: relative;
    }

    /* iPhone 14 Pro shell */
    .phone-shell {
      width: 290px;
      height: 590px;
      background: #1a1a1f;
      border: 2.5px solid #2e2e38;
      border-radius: 48px;
      position: relative;
      box-shadow:
        0 0 0 1px rgba(255,255,255,.06),
        0 32px 80px rgba(0,0,0,.6),
        inset 0 1px 0 rgba(255,255,255,.08);
      display: flex;
      flex-direction: column;
      align-items: center;
      overflow: hidden;
    }

    /* notch */
    .phone-notch {
      width: 110px;
      height: 30px;
      background: #1a1a1f;
      border-radius: 0 0 20px 20px;
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }
    .notch-camera {
      width: 10px; height: 10px;
      border-radius: 50%;
      background: #0f0f13;
      border: 1.5px solid #2a2a30;
    }
    .notch-speaker {
      width: 48px; height: 5px;
      border-radius: 3px;
      background: #0f0f13;
    }

    /* screen */
    .phone-screen {
      width: 100%;
      height: 100%;
      border-radius: 46px;
      background: #12121A;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;
      overflow: hidden;
    }

    /* app preview inside phone */
    .phone-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      padding: 0 20px;
      text-align: center;
    }
    .app-icon {
      width: 64px; height: 64px;
      border-radius: 18px;
      background: linear-gradient(135deg, #35C2C1, #00D9A0);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      font-weight: 900;
      color: #0A0A0F;
      letter-spacing: -1px;
      box-shadow: 0 8px 24px rgba(53,194,193,.35);
    }
    .phone-label {
      font-size: 17px;
      font-weight: 700;
      color: rgba(255,255,255,.9);
      letter-spacing: -.3px;
    }
    .phone-sub {
      font-size: 12px;
      color: rgba(255,255,255,.3);
      line-height: 1.5;
    }

    /* loading bar */
    .loading-bar-wrap {
      width: 100%;
      height: 2px;
      background: rgba(255,255,255,.06);
      border-radius: 1px;
      overflow: hidden;
      margin-top: 8px;
    }
    .loading-bar {
      height: 100%;
      background: linear-gradient(90deg, #35C2C1, #00D9A0);
      border-radius: 1px;
      animation: load 2s ease-in-out infinite;
    }
    @keyframes load {
      0%   { width: 0%;   margin-left: 0; }
      50%  { width: 60%;  margin-left: 20%; }
      100% { width: 0%;   margin-left: 100%; }
    }

    /* bottom home bar */
    .phone-home-bar {
      position: absolute;
      bottom: 10px;
      width: 100px;
      height: 4px;
      background: rgba(255,255,255,.2);
      border-radius: 2px;
    }

    /* log strip at bottom of phone */
    .phone-log {
      position: absolute;
      bottom: 22px;
      left: 12px;
      right: 12px;
      font-family: "SF Mono","Fira Code",monospace;
      font-size: 7px;
      color: rgba(255,255,255,.18);
      line-height: 1.5;
      text-align: left;
      display: none;
    }

    /* ── right panel ── */
    .right-panel {
      width: 280px;
      flex-shrink: 0;
      background: #18181f;
      border-left: 1px solid rgba(255,255,255,.07);
      display: flex;
      flex-direction: column;
      padding: 28px 22px 24px;
      gap: 20px;
      overflow-y: auto;
    }
    .panel-close {
      display: flex;
      justify-content: flex-end;
    }
    .close-x {
      width: 24px; height: 24px;
      border-radius: 50%;
      background: rgba(255,255,255,.06);
      display: flex; align-items: center; justify-content: center;
      font-size: 13px; color: rgba(255,255,255,.4);
      cursor: default;
    }

    .panel-title {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .panel-icon {
      font-size: 20px;
    }
    .panel-heading {
      font-size: 15px;
      font-weight: 700;
      color: rgba(255,255,255,.9);
      line-height: 1.3;
    }
    .panel-sub {
      font-size: 12px;
      color: rgba(255,255,255,.35);
      margin-top: 2px;
      line-height: 1.5;
    }

    .divider {
      height: 1px;
      background: rgba(255,255,255,.07);
    }

    /* download step */
    .step {
      display: flex;
      gap: 12px;
      align-items: flex-start;
    }
    .step-num {
      width: 22px; height: 22px;
      border-radius: 50%;
      background: rgba(255,255,255,.08);
      border: 1px solid rgba(255,255,255,.12);
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 700;
      color: rgba(255,255,255,.55);
      margin-top: 1px;
    }
    .step-body {
      flex: 1;
    }
    .step-title {
      font-size: 13px;
      font-weight: 600;
      color: rgba(255,255,255,.8);
      margin-bottom: 4px;
    }
    .step-desc {
      font-size: 11.5px;
      color: rgba(255,255,255,.35);
      line-height: 1.55;
    }
    .store-badges {
      display: flex;
      gap: 6px;
      margin-top: 8px;
    }
    .store-badge {
      display: flex;
      align-items: center;
      gap: 5px;
      background: rgba(255,255,255,.06);
      border: 1px solid rgba(255,255,255,.1);
      border-radius: 8px;
      padding: 5px 10px;
      font-size: 11px;
      font-weight: 600;
      color: rgba(255,255,255,.6);
      cursor: default;
      text-decoration: none;
      transition: border-color .15s;
    }
    .store-badge:hover { border-color: rgba(255,255,255,.25); }

    /* QR box */
    .qr-box {
      background: #fff;
      border-radius: 14px;
      padding: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
      aspect-ratio: 1;
      width: 100%;
    }
    .qr-box img {
      width: 100%; height: auto;
      display: block;
      border-radius: 4px;
    }
    .qr-wait {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 10px;
      width: 100%;
      height: 100%;
      min-height: 140px;
    }
    .spinner {
      width: 30px; height: 30px;
      border: 2.5px solid rgba(0,0,0,.08);
      border-top-color: #35C2C1;
      border-radius: 50%;
      animation: spin .8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .qr-wait-text {
      font-size: 11.5px;
      color: rgba(0,0,0,.4);
      text-align: center;
      line-height: 1.55;
    }

    .url-row {
      background: rgba(255,255,255,.03);
      border: 1px solid rgba(255,255,255,.07);
      border-radius: 8px;
      padding: 8px 10px;
      font-family: "SF Mono","Fira Code",monospace;
      font-size: 9px;
      word-break: break-all;
      line-height: 1.5;
      color: ${tunnelUrl ? "#35C2C1" : "rgba(255,255,255,.2)"};
    }

    .shake-hint {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      font-size: 11px;
      color: rgba(255,255,255,.28);
      line-height: 1.55;
    }
    .shake-icon { font-size: 16px; flex-shrink: 0; margin-top: -1px; }
  </style>
</head>
<body>

  <!-- top bar -->
  <div class="topbar">
    <div class="topbar-left">
      <div class="app-name">AZA Mobile App</div>
      <div class="status-pill">
        <div class="pulse"></div>
        ${esc(statusLabel)}
      </div>
    </div>
    <div class="sim-btn">
      📱 Native Preview
    </div>
  </div>

  <!-- main -->
  <div class="main">

    <!-- phone mockup -->
    <div class="phone-area">
      <div class="phone-shell">
        <div class="phone-notch">
          <div class="notch-camera"></div>
          <div class="notch-speaker"></div>
        </div>
        <div class="phone-screen">
          <div class="phone-content">
            <div class="app-icon">AZA</div>
            <div class="phone-label">AZA</div>
            <div class="phone-sub">
              ${tunnelUrl
                ? "App is running.\nScan the QR code →"
                : metroReady
                  ? "Tunnel negotiating…\nScan the QR code soon →"
                  : "Metro bundler is starting…\nThis takes about 30–60 s"}
            </div>
            ${!tunnelUrl ? `<div class="loading-bar-wrap"><div class="loading-bar"></div></div>` : ""}
          </div>
        </div>
        <div class="phone-home-bar"></div>
      </div>
    </div>

    <!-- right QR panel -->
    <div class="right-panel">
      <div class="panel-close"><div class="close-x">✕</div></div>

      <div class="panel-title">
        <div class="panel-icon">📲</div>
        <div>
          <div class="panel-heading">Preview on your phone</div>
          <div class="panel-sub">Test on a mobile device to experience touch gestures and native features.</div>
        </div>
      </div>

      <div class="divider"></div>

      <!-- step 1 -->
      <div class="step">
        <div class="step-num">1</div>
        <div class="step-body">
          <div class="step-title">Download Expo Go</div>
          <div class="step-desc">A free app that lets you run your project instantly.</div>
          <div class="store-badges">
            <a class="store-badge" href="https://apps.apple.com/app/expo-go/id982107779" target="_blank">🍎 iOS</a>
            <a class="store-badge" href="https://play.google.com/store/apps/details?id=host.exp.exponent" target="_blank">▶ Android</a>
          </div>
        </div>
      </div>

      <!-- step 2 -->
      <div class="step">
        <div class="step-num">2</div>
        <div class="step-body">
          <div class="step-title">Scan the QR code</div>
          <div class="step-desc">Use your camera to scan the code and launch Expo Go.</div>
          <br/>
          <div class="qr-box">
            ${tunnelUrl
              ? `<img src="${esc(qrSrc)}" alt="Expo QR Code"/>`
              : `<div class="qr-wait">
                  <div class="spinner"></div>
                  <div class="qr-wait-text">${metroReady ? "Tunnel connecting…" : "Metro starting…"}<br/><small style="opacity:.7">Auto-refreshes every 4 s</small></div>
                </div>`}
          </div>
        </div>
      </div>

      <!-- URL row -->
      <div class="url-row">${tunnelUrl ? esc(tunnelUrl) : "Waiting for tunnel…"}</div>

      <div class="divider"></div>

      <div class="shake-hint">
        <span class="shake-icon">📳</span>
        Shake your device to open Expo Go's menu, then tap "Reload" to refresh the app.
      </div>

      ${recentLogs.length > 0
        ? `<div style="font-family:'SF Mono','Fira Code',monospace;font-size:8px;color:rgba(255,255,255,.18);line-height:1.6;border-top:1px solid rgba(255,255,255,.06);padding-top:12px">${recentLogs.map(l=>`<div>${esc(l)}</div>`).join("")}</div>`
        : ""}
    </div>

  </div>

</body>
</html>`;
}

/* ── HTTP server on port 5000 ────────────────────────────────────────────── */
http.createServer((_req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/html; charset=utf-8",
    "Cache-Control": "no-cache, no-store, must-revalidate",
  });
  res.end(buildPage());
}).listen(5000, "0.0.0.0", () => {
  console.log("[qr-server] QR page live → http://localhost:5000");
});

process.on("SIGTERM", () => { expo.kill("SIGTERM"); process.exit(0); });
process.on("SIGINT",  () => { expo.kill("SIGTERM"); process.exit(0); });
