import { Router } from "express";
import { eq, desc } from "drizzle-orm";
import { db, walletsTable, transactionsTable } from "@workspace/db";
import { requireAuth, type AuthRequest } from "../middleware/auth.js";
import { randomUUID } from "crypto";

const router = Router();

/* ── GET /api/wallet/balance ─────────────────────────────────────────────── */
router.get("/wallet/balance", requireAuth, async (req: AuthRequest, res) => {
  const [wallet] = await db
    .select()
    .from(walletsTable)
    .where(eq(walletsTable.userId, req.userId!))
    .limit(1);

  if (!wallet) {
    res.status(404).json({ error: "Wallet not found" });
    return;
  }

  res.json({
    balanceKobo: wallet.balanceKobo,
    currency: wallet.currency,
    balanceNaira: wallet.balanceKobo / 100,
  });
});

/* ── GET /api/wallet/transactions ────────────────────────────────────────── */
router.get("/wallet/transactions", requireAuth, async (req: AuthRequest, res) => {
  const limit  = Math.min(Number(req.query.limit)  || 50, 100);
  const offset = Math.max(Number(req.query.offset) || 0,  0);

  const rows = await db
    .select()
    .from(transactionsTable)
    .where(eq(transactionsTable.userId, req.userId!))
    .orderBy(desc(transactionsTable.createdAt))
    .limit(limit)
    .offset(offset);

  res.json({
    transactions: rows.map((t) => ({
      id:          t.id,
      type:        t.type,
      status:      t.status,
      category:    t.category,
      amountKobo:  t.amountKobo,
      amountNaira: t.amountKobo / 100,
      currency:    t.currency,
      description: t.description,
      externalRef: t.externalRef,
      metadata:    t.metadata,
      createdAt:   t.createdAt,
    })),
    limit,
    offset,
  });
});

/* ── POST /api/wallet/withdraw ───────────────────────────────────────────── */
router.post("/wallet/withdraw", requireAuth, async (req: AuthRequest, res) => {
  const { amountNaira, bank, accountNumber } = req.body as {
    amountNaira?:    number;
    bank?:           string;
    accountNumber?:  string;
  };

  if (!amountNaira || !bank || !accountNumber) {
    res.status(400).json({ error: "amountNaira, bank, and accountNumber are required" });
    return;
  }

  const amountKobo = Math.round(Number(amountNaira) * 100);

  if (amountKobo < 10000) {
    res.status(400).json({ error: "Minimum withdrawal is ₦100" });
    return;
  }

  const [wallet] = await db
    .select()
    .from(walletsTable)
    .where(eq(walletsTable.userId, req.userId!))
    .limit(1);

  if (!wallet) {
    res.status(404).json({ error: "Wallet not found" });
    return;
  }

  if (wallet.balanceKobo < amountKobo) {
    res.status(400).json({ error: "Insufficient balance" });
    return;
  }

  const ref = `WD-${randomUUID().slice(0, 8).toUpperCase()}`;

  /* Deduct from wallet */
  await db
    .update(walletsTable)
    .set({ balanceKobo: wallet.balanceKobo - amountKobo, updatedAt: new Date() })
    .where(eq(walletsTable.id, wallet.id));

  /* Record transaction */
  const [tx] = await db
    .insert(transactionsTable)
    .values({
      userId:      req.userId!,
      type:        "debit",
      status:      "pending",
      category:    "withdrawal",
      amountKobo,
      currency:    "NGN",
      description: `Withdrawal to ${bank} ••••${accountNumber.slice(-4)}`,
      externalRef: ref,
      metadata:    { bank, accountLast4: accountNumber.slice(-4) },
    })
    .returning();

  res.json({
    transactionId: tx!.id,
    reference:     ref,
    status:        "pending",
    amountNaira,
    newBalanceKobo: wallet.balanceKobo - amountKobo,
    message:        "Withdrawal initiated. Funds will be credited within 24 hours.",
  });
});

export default router;
