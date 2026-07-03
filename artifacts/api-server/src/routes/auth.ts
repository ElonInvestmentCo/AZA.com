import { Router } from "express";
import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import { eq } from "drizzle-orm";
import { db, usersTable, walletsTable } from "@workspace/db";
import { signToken } from "../lib/jwt.js";
import { requireAuth, type AuthRequest } from "../middleware/auth.js";

const router = Router();

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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

export default router;
