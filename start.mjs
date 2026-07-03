/**
 * Production launcher for Railway.
 *
 * Starts two processes in the same container:
 *   • Express API server  – fixed internal port 3001 (never conflicts with Railway's PORT)
 *   • Next.js website     – Railway's dynamic PORT (visible to the internet)
 *
 * Next.js rewrites proxy /api/* → http://localhost:3001/api/* so clients
 * (web & mobile) can still reach the API at www.payvora.org/api/*.
 */

import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Express uses a fixed internal port that will never equal Railway's PORT.
const API_PORT = "3001";
// Next.js takes Railway's dynamic PORT (what the reverse proxy forwards to).
const WEB_PORT = process.env.PORT ?? "3000";

console.log(`[launcher] starting API on :${API_PORT}  |  website on :${WEB_PORT}`);

function run(label, cmd, args, extraEnv, cwd) {
  const child = spawn(cmd, args, {
    // Strip PORT from the inherited env, then inject the correct port per process.
    env: { ...process.env, PORT: undefined, ...extraEnv },
    stdio: "inherit",
    cwd: cwd ?? __dirname,
  });

  child.on("error", (err) => {
    console.error(`[${label}] failed to start:`, err.message);
    process.exit(1);
  });

  child.on("exit", (code, signal) => {
    console.error(`[${label}] exited (code=${code} signal=${signal}) — shutting down`);
    process.exit(code ?? 1);
  });

  return child;
}

// ── Express API ──────────────────────────────────────────────────────────────
run(
  "api",
  "node",
  ["--enable-source-maps", "./artifacts/api-server/dist/index.mjs"],
  { PORT: API_PORT },
);

// ── Next.js website ──────────────────────────────────────────────────────────
// Run `next start` using the binary inside the website workspace's own
// node_modules — pnpm always puts it there regardless of hoisting config.
run(
  "web",
  "node",
  ["./node_modules/.bin/next", "start"],
  {
    PORT: WEB_PORT,
    HOSTNAME: "0.0.0.0",
    // Tells Next.js rewrites where to find the Express API.
    INTERNAL_API_URL: `http://localhost:${API_PORT}`,
  },
  path.join(__dirname, "artifacts/website"),
);
