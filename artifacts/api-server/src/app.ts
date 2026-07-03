import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";
import { getExpoUrl, buildQrPage } from "./lib/qr-page";

const app: Express = express();

/* ── CORS ────────────────────────────────────────────────────────────────────
 * Development: allow all origins (default cors() behaviour).
 * Production:  restrict to the production domain(s) plus any additional
 *              origins listed in CORS_ALLOWED_ORIGINS (comma-separated).
 *
 * Always allow Expo Go auth proxy and localhost for native dev clients.
 * ──────────────────────────────────────────────────────────────────────────── */
const replitDomain = process.env.REPLIT_DEV_DOMAIN
  ? [`https://${process.env.REPLIT_DEV_DOMAIN}`]
  : [];

const ALWAYS_ALLOWED = [
  "https://www.payvora.org",
  "https://payvora.org",
  "https://auth.expo.io",
  ...replitDomain,
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
  /* Allow requests with no Origin header (native apps, curl, server-to-server) */
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
    origin: process.env.NODE_ENV === "production" ? corsOrigin : true,
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

/* ── Routes ──────────────────────────────────────────────────────────────── */
app.use("/api", router);

app.get("/", async (_req: Request, res: Response) => {
  const [mobileUrl, payvoraUrl] = await Promise.all([
    getExpoUrl(19000),
    getExpoUrl(19001),
  ]);
  const html = await buildQrPage(mobileUrl, payvoraUrl);
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(html);
});

app.get("/api/status", (_req: Request, res: Response) => {
  res.json({ name: "Payvora API", version: "1.0.0", status: "ok" });
});

app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Not found" });
});

export default app;
