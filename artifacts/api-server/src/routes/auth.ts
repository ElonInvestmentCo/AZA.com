import { Router } from "express";
import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import { eq } from "drizzle-orm";
import { db, usersTable, walletsTable } from "@workspace/db";
import { signToken, verifyToken } from "../lib/jwt.js";
import { requireAuth, type AuthRequest } from "../middleware/auth.js";
import { logger } from "../lib/logger.js";

const router = Router();

/* OAuth2Client for verifying mobile idTokens */
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/** Build a fresh OAuth2Client configured for the web redirect flow */
function makeWebOAuthClient(): OAuth2Client | null {
  const id  = process.env.GOOGLE_CLIENT_ID;
  const sec = process.env.GOOGLE_CLIENT_SECRET;
  const cb  = process.env.GOOGLE_CALLBACK_URL;
  if (!id || !sec || !cb) return null;
  return new OAuth2Client(id, sec, cb);
}

/* ── helpers ──────────────────────────────────────────────────────────────── */

async function createWalletForUser(userId: string) {
  await db
    .insert(walletsTable)
    .values({ userId, balanceKobo: 0, currency: "NGN" })
    .onConflictDoNothing();
}

function safeUser(u: {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  authProvider: string;
  createdAt: Date;
}) {
  return {
    id: u.id,
    email: u.email,
    fullName: u.fullName,
    avatarUrl: u.avatarUrl,
    authProvider: u.authProvider,
    createdAt: u.createdAt,
  };
}

/* ── POST /api/auth/register ─────────────────────────────────────────────── */
router.post("/auth/register", async (req, res) => {
  const { email, password, fullName } = req.body as {
    email?: string;
    password?: string;
    fullName?: string;
  };

  if (!email || !password || !fullName) {
    res.status(400).json({ error: "email, password and fullName are required" });
    return;
  }
  if (password.length < 8) {
    res.status(400).json({ error: "Password must be at least 8 characters" });
    return;
  }

  const existing = await db
    .select({ id: usersTable.id })
    .from(usersTable)
    .where(eq(usersTable.email, email.toLowerCase()))
    .limit(1);

  if (existing.length > 0) {
    res.status(409).json({ error: "An account with this email already exists" });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const [user] = await db
    .insert(usersTable)
    .values({
      email: email.toLowerCase(),
      fullName,
      passwordHash,
      authProvider: "email",
    })
    .returning();

  if (!user) {
    res.status(500).json({ error: "Failed to create user" });
    return;
  }

  await createWalletForUser(user.id);

  const token = signToken({ userId: user.id, email: user.email });

  res.status(201).json({ token, user: safeUser(user) });
});

/* ── POST /api/auth/login ────────────────────────────────────────────────── */
router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body as {
    email?: string;
    password?: string;
  };

  if (!email || !password) {
    res.status(400).json({ error: "email and password are required" });
    return;
  }

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email.toLowerCase()))
    .limit(1);

  if (!user || !user.passwordHash) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const token = signToken({ userId: user.id, email: user.email });
  res.json({ token, user: safeUser(user) });
});

/* ── POST /api/auth/google ───────────────────────────────────────────────── */
router.post("/auth/google", async (req, res) => {
  const { accessToken, idToken } = req.body as {
    accessToken?: string;
    idToken?: string;
  };

  if (!accessToken && !idToken) {
    res.status(400).json({ error: "accessToken or idToken is required" });
    return;
  }

  let email: string;
  let name: string | undefined;
  let picture: string | undefined;
  let googleId: string | undefined;

  if (idToken && process.env.GOOGLE_CLIENT_ID) {
    let ticket;
    try {
      ticket = await googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
    } catch {
      res.status(401).json({ error: "Invalid Google ID token" });
      return;
    }
    const payload = ticket.getPayload();
    if (!payload?.email) {
      res.status(401).json({ error: "Could not extract email from Google token" });
      return;
    }
    email = payload.email;
    name = payload.name;
    picture = payload.picture;
    googleId = payload.sub;
  } else if (accessToken) {
    let info: { email?: string; name?: string; picture?: string; id?: string };
    try {
      const r = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );
      if (!r.ok) throw new Error("Google userinfo failed");
      info = await r.json() as typeof info;
    } catch {
      res.status(401).json({ error: "Invalid Google access token" });
      return;
    }
    if (!info.email) {
      res.status(401).json({ error: "Could not retrieve email from Google" });
      return;
    }
    email = info.email;
    name = info.name;
    picture = info.picture;
    googleId = info.id;
  } else {
    res.status(503).json({ error: "Google auth not configured" });
    return;
  }

  let [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email.toLowerCase()))
    .limit(1);

  if (!user) {
    const [created] = await db
      .insert(usersTable)
      .values({
        email: email.toLowerCase(),
        fullName: name ?? null,
        avatarUrl: picture ?? null,
        googleId,
        authProvider: "oauth",
      })
      .returning();
    if (!created) {
      res.status(500).json({ error: "Failed to create user" });
      return;
    }
    user = created;
    await createWalletForUser(user.id);
  } else if (!user.googleId) {
    await db
      .update(usersTable)
      .set({ googleId, avatarUrl: picture ?? user.avatarUrl })
      .where(eq(usersTable.id, user.id));
  }

  const token = signToken({ userId: user.id, email: user.email });
  res.json({ token, user: safeUser(user) });
});

/* ── GET /api/auth/google ─────────────────────────────────────────────────
 * Initiates the web-based OAuth2 redirect flow (browser → Google → callback).
 * Used when the mobile app opens a system browser for sign-in.
 * ──────────────────────────────────────────────────────────────────────────── */
router.get("/auth/google", (req, res) => {
  const client = makeWebOAuthClient();
  if (!client) {
    res.status(503).json({ error: "Google OAuth is not configured on this server" });
    return;
  }

  const url = client.generateAuthUrl({
    access_type: "offline",
    scope: ["openid", "email", "profile"],
    prompt: "select_account",
  });

  res.redirect(url);
});

/* ── GET /api/auth/google/callback ────────────────────────────────────────
 * Google redirects here with ?code=… after user grants consent.
 * Exchanges the code for tokens, finds/creates the user, issues a JWT,
 * then redirects to the mobile app via deep-link: mobile://auth?token=…
 * ──────────────────────────────────────────────────────────────────────────── */
router.get("/auth/google/callback", async (req, res) => {
  const { code, error } = req.query as { code?: string; error?: string };

  if (error || !code) {
    const msg = encodeURIComponent(error ?? "Google sign-in was cancelled");
    res.redirect(`mobile://auth?error=${msg}`);
    return;
  }

  const client = makeWebOAuthClient();
  if (!client) {
    res.status(503).json({ error: "Google OAuth is not configured on this server" });
    return;
  }

  try {
    const { tokens } = await client.getToken(code);

    const userInfoRes = await fetch("https://www.googleapis.com/userinfo/v2/me", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    if (!userInfoRes.ok) throw new Error("Failed to fetch user info from Google");

    const info = (await userInfoRes.json()) as {
      email?: string;
      name?: string;
      picture?: string;
      id?: string;
    };
    if (!info.email) throw new Error("Google did not return an email address");

    let [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, info.email.toLowerCase()))
      .limit(1);

    if (!user) {
      const [created] = await db
        .insert(usersTable)
        .values({
          email: info.email.toLowerCase(),
          fullName: info.name ?? null,
          avatarUrl: info.picture ?? null,
          googleId: info.id,
          authProvider: "oauth",
        })
        .returning();
      if (!created) throw new Error("Failed to create user account");
      user = created;
      await createWalletForUser(user.id);
    } else if (!user.googleId) {
      await db
        .update(usersTable)
        .set({ googleId: info.id, avatarUrl: info.picture ?? user.avatarUrl })
        .where(eq(usersTable.id, user.id));
    }

    const token = signToken({ userId: user.id, email: user.email });
    res.redirect(`mobile://auth?token=${encodeURIComponent(token)}`);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Authentication failed";
    try { logger.error({ err }, "[Google OAuth callback] error"); } catch { console.error("[Google OAuth callback] error", err); }
    res.redirect(`mobile://auth?error=${encodeURIComponent(msg)}`);
  }
});

/* ── POST /api/auth/apple ────────────────────────────────────────────────── */
router.post("/auth/apple", async (req, res) => {
  const { identityToken, email, name } = req.body as {
    identityToken?: string;
    email?: string;
    name?: string;
  };

  if (!email) {
    res.status(400).json({ error: "email is required for Apple sign-in" });
    return;
  }

  let [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email.toLowerCase()))
    .limit(1);

  if (!user) {
    const [created] = await db
      .insert(usersTable)
      .values({
        email: email.toLowerCase(),
        fullName: name ?? null,
        authProvider: "oauth",
      })
      .returning();
    if (!created) {
      res.status(500).json({ error: "Failed to create user" });
      return;
    }
    user = created;
    await createWalletForUser(user.id);
  }

  const token = signToken({ userId: user.id, email: user.email });
  res.json({ token, user: safeUser(user) });
});

/* ── GET /api/auth/me ────────────────────────────────────────────────────── */
router.get("/auth/me", requireAuth, async (req: AuthRequest, res) => {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, req.userId!))
    .limit(1);

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const [wallet] = await db
    .select()
    .from(walletsTable)
    .where(eq(walletsTable.userId, user.id))
    .limit(1);

  res.json({
    user: safeUser(user),
    wallet: wallet
      ? { balanceKobo: wallet.balanceKobo, currency: wallet.currency }
      : null,
  });
});

/* ── POST /api/auth/logout ───────────────────────────────────────────────── */
router.post("/auth/logout", requireAuth, (_req, res) => {
  res.json({ ok: true });
});

/* ── In-memory OTP store (keyed by lowercase email) ─────────────────────── */
const otpStore = new Map<string, { code: string; expiresAt: number }>();

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/* ── POST /api/auth/forgot-password ──────────────────────────────────────── */
router.post("/auth/forgot-password", async (req, res) => {
  const { email } = req.body as { email?: string };
  if (!email) {
    res.status(400).json({ error: "email is required" });
    return;
  }

  const key = email.toLowerCase().trim();

  const [user] = await db
    .select({ id: usersTable.id })
    .from(usersTable)
    .where(eq(usersTable.email, key))
    .limit(1);

  /* Always respond with 200 to prevent email enumeration */
  if (!user) {
    res.json({ ok: true, message: "If that email exists, a reset code has been sent." });
    return;
  }

  const code = generateOtp();
  otpStore.set(key, { code, expiresAt: Date.now() + 10 * 60 * 1000 });

  /* In production: send via email (SendGrid / Mailgun / Resend).
   * For now, log to console so developers can complete the reset flow. */
  console.log(`[PAYVORA OTP] Reset code for ${key}: ${code}`);

  res.json({ ok: true, message: "If that email exists, a reset code has been sent." });
});

/* ── POST /api/auth/verify-otp ───────────────────────────────────────────── */
router.post("/auth/verify-otp", async (req, res) => {
  const { email, code } = req.body as { email?: string; code?: string };
  if (!email || !code) {
    res.status(400).json({ error: "email and code are required" });
    return;
  }

  const key = email.toLowerCase().trim();
  const entry = otpStore.get(key);

  if (!entry || Date.now() > entry.expiresAt) {
    res.status(400).json({ error: "Code has expired. Please request a new one." });
    return;
  }

  if (entry.code !== code.trim()) {
    res.status(400).json({ error: "Invalid verification code." });
    return;
  }

  otpStore.delete(key);

  /* Issue a short-lived reset token (reuses JWT infra with placeholder userId) */
  const resetToken = signToken({ userId: "__reset__", email: key });

  res.json({ ok: true, resetToken });
});

/* ── POST /api/auth/reset-password ───────────────────────────────────────── */
router.post("/auth/reset-password", async (req, res) => {
  const { resetToken, newPassword } = req.body as {
    resetToken?: string;
    newPassword?: string;
  };

  if (!resetToken || !newPassword) {
    res.status(400).json({ error: "resetToken and newPassword are required" });
    return;
  }

  if (newPassword.length < 8) {
    res.status(400).json({ error: "Password must be at least 8 characters" });
    return;
  }

  const payload = verifyToken(resetToken);
  if (!payload || payload.userId !== "__reset__") {
    res.status(400).json({ error: "Invalid or expired reset token." });
    return;
  }

  const [user] = await db
    .select({ id: usersTable.id })
    .from(usersTable)
    .where(eq(usersTable.email, payload.email))
    .limit(1);

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);

  await db
    .update(usersTable)
    .set({ passwordHash, updatedAt: new Date() })
    .where(eq(usersTable.id, user.id));

  res.json({ ok: true, message: "Password has been reset successfully." });
});

export default router;
