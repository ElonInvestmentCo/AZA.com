/**
 * Production launcher for Railway.
 *
 * Starts two processes in the same container:
 *   • Express API server  – fixed internal port 8080
 *   • Next.js website     – Railway's dynamic PORT (visible to the internet)
 *
 * Next.js rewrites proxy /api/* → http://localhost:8080/api/* so clients
 * (web & mobile) can still reach the API through www.payvora.org/api/*.
 */

import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const API_PORT = "8080";
const WEB_PORT = process.env.PORT ?? "3000";

function run(label, cmd, args, env) {
  const child = spawn(cmd, args, {
    env: { ...process.env, ...env },
    stdio: "inherit",
    cwd: __dirname,
  });

  child.on("error", (err) => {
    console.error(`[${label}] failed to start:`, err.message);
    process.exit(1);
  });

  child.on("exit", (code, signal) => {
    console.error(`[${label}] exited with code=${code} signal=${signal}`);
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
// standalone output puts the server at .next/standalone/server.js
run(
  "web",
  "node",
  ["./artifacts/website/.next/standalone/server.js"],
  {
    PORT: WEB_PORT,
    HOSTNAME: "0.0.0.0",
    // tell Next.js rewrites where Express is
    INTERNAL_API_URL: `http://localhost:${API_PORT}`,
  },
);

console.log(
  `[launcher] API on :${API_PORT}  |  website on :${WEB_PORT}`,
);
