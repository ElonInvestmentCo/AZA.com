import { Router, type IRouter } from "express";
import { reloadlyUtilityGet, reloadlyUtilityPost, UTILITY_CONFIG } from "../lib/reloadly.js";
import { logger } from "../lib/logger.js";

const router: IRouter = Router();

const BILLER_TYPES = [
  "ELECTRICITY_BILL_PAYMENT",
  "CABLE_TV_BILL_PAYMENT",
  "INTERNET_BILL_PAYMENT",
  "BETTING_BILL_PAYMENT",
] as const;

type BillerType = (typeof BILLER_TYPES)[number];

interface ReloadlyBiller {
  id: number;
  name: string;
  countryCode?: string;
  countryName?: string;
  type?: string;
  serviceType?: string;
  localTransactionCurrencyCode?: string;
  minLocalTransactionAmount?: number;
  maxLocalTransactionAmount?: number;
  localTransactionFee?: number;
}

router.get("/bills/billers", async (req, res) => {
  const type = String(req.query["type"] ?? "");
  const countryISOCode = String(req.query["countryISOCode"] ?? "NG");

  if (!BILLER_TYPES.includes(type as BillerType)) {
    res.status(400).json({
      error: `Invalid or missing "type" query param. Must be one of: ${BILLER_TYPES.join(", ")}`,
    });
    return;
  }

  try {
    const path = `/billers?type=${encodeURIComponent(type)}&countryISOCode=${encodeURIComponent(countryISOCode)}&size=200`;
    const data = (await reloadlyUtilityGet(path)) as
      | { content?: ReloadlyBiller[] }
      | ReloadlyBiller[];

    const billers: ReloadlyBiller[] = Array.isArray(data)
      ? data
      : (data as { content?: ReloadlyBiller[] }).content ?? [];

    res.json({ billers, env: UTILITY_CONFIG.audience });
  } catch (err) {
    logger.error({ err, type, countryISOCode }, "Reloadly billers fetch failed");
    res.status(502).json({ error: String(err), billers: [] });
  }
});

interface PayBody {
  billerId?: number;
  subscriberAccountNumber?: string;
  amount?: number;
  referenceId?: string;
}

router.post("/bills/pay", async (req, res) => {
  const { billerId, subscriberAccountNumber, amount, referenceId } = (req.body ?? {}) as PayBody;

  if (!billerId || typeof billerId !== "number") {
    res.status(400).json({ error: "billerId (number) is required" });
    return;
  }
  if (!subscriberAccountNumber || typeof subscriberAccountNumber !== "string") {
    res.status(400).json({ error: "subscriberAccountNumber (string) is required" });
    return;
  }
  if (!amount || typeof amount !== "number" || amount <= 0) {
    res.status(400).json({ error: "amount (positive number) is required" });
    return;
  }

  try {
    const result = (await reloadlyUtilityPost("/pay", {
      subscriberAccountNumber,
      amount,
      billerId,
      useLocalAmount: true,
      referenceId: referenceId ?? `payvora-${Date.now()}`,
    })) as {
      id: number;
      status: string;
      referenceId: string;
      code: string;
      message: string;
    };

    logger.info({ billerId, result }, "Reloadly utility payment submitted");
    res.json(result);
  } catch (err) {
    logger.error({ err, billerId, subscriberAccountNumber, amount }, "Reloadly utility payment failed");
    res.status(502).json({ error: String(err) });
  }
});

router.get("/bills/transactions/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const data = await reloadlyUtilityGet(`/transactions/${encodeURIComponent(id)}`);
    res.json(data);
  } catch (err) {
    logger.error({ err, id }, "Reloadly transaction status fetch failed");
    res.status(502).json({ error: String(err) });
  }
});

export default router;
