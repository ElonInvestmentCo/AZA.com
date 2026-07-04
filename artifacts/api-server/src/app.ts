import path from "path";
import { fileURLToPath } from "url";
import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";
import { getExpoUrl, buildQrPage } from "./lib/qr-page";

const app: Express = express();
const IS_PROD = process.env.NODE_ENV === "production";

/* ── CORS ────────────────────────────────────────────────────────────────────
 * Development: allow all origins (default cors() behaviour).
 * Production:  restrict to the production domain(s) plus any additional
 *              origins listed in CORS_ALLOWED_ORIGINS (comma-separated).
 *
 * Always allow Expo Go auth proxy and localhost for native dev clients.
 * ──────────────────────────────────────────────────────────────────────────── */
const replitOrigins: string[] = [];
if (process.env.REPLIT_DEV_DOMAIN) {
  replitOrigins.push(`https://${process.env.REPLIT_DEV_DOMAIN}`);
}
if (process.env.REPLIT_DOMAINS) {
  process.env.REPLIT_DOMAINS.split(",")
    .map((d) => d.trim())
    .filter(Boolean)
    .forEach((d) => replitOrigins.push(`https://${d}`));
}

const ALWAYS_ALLOWED = [
  "https://www.payvora.org",
  "https://payvora.org",
  "https://auth.expo.io",
  ...replitOrigins,
];

const extraOrigins = (process.env.CORS_ALLOWED_ORIGINS ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const allowedOrigins = [...ALWAYS_ALLOWED, ...extraOrigins];

function corsOrigin(
  origin: string | undefined,
  callback: (err: Error | null, allow?: boolean) => void,
) {
  if (!origin) return callback(null, true);

  const allowed = allowedOrigins.some(
    (o) => origin === o || origin.startsWith(o + "/"),
  );

  if (allowed) {
    callback(null, true);
  } else {
    logger.warn({ origin }, "CORS blocked request");
    callback(new Error(`CORS: origin '${origin}' is not allowed`));
  }
}

app.use(
  cors({
    origin: IS_PROD ? corsOrigin : true,
    credentials: true,
  }),
);

/* ── Body parsing & logging ───────────────────────────────────────────────── */
app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return { id: req.id, method: req.method, url: req.url?.split("?")[0] };
      },
      res(res) {
        return { statusCode: res.statusCode };
      },
    },
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ── API Routes ───────────────────────────────────────────────────────────── */
app.use("/api", router);

app.get("/api/status", (_req: Request, res: Response) => {
  res.json({ name: "Payvora API", version: "1.0.0", status: "ok" });
});

/* ── Static site (production) / QR dev page (development) ────────────────── */
if (IS_PROD) {
  /* Serve the pre-built Vite landing site.
   * process.cwd() is the project root in Railway (/app).
   * All non-/api routes fall back to index.html for client-side routing. */
  const landingDist = path.join(process.cwd(), "artifacts", "landing", "dist");

  app.use(express.static(landingDist, { index: "index.html" }));

  app.get("*", (_req: Request, res: Response) => {
    res.sendFile(path.join(landingDist, "index.html"));
  });
} else {
  /* Dev: serve Expo QR scanner at root for easy mobile testing. */
  app.get("/", async (_req: Request, res: Response) => {
    const [mobileUrl, payvoraUrl] = await Promise.all([
      getExpoUrl(19000),
      getExpoUrl(19001),
    ]);
    const html = await buildQrPage(mobileUrl, payvoraUrl);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(html);
  });

  app.use((_req: Request, res: Response) => {
    res.status(404).json({ error: "Not found" });
  });
}

export default app;
