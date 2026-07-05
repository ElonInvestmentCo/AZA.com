import { Router } from "express";
import { eq } from "drizzle-orm";
import { db, usersTable } from "@workspace/db";
import { requireAuth, type AuthRequest } from "../middleware/auth.js";

const router = Router();

const ID_TYPES = ["nin", "bvn", "passport", "drivers_license", "voters_card"] as const;
type IdType = (typeof ID_TYPES)[number];

/* ── GET /api/kyc/status ─────────────────────────────────────────────────── */
router.get("/kyc/status", requireAuth, async (req: AuthRequest, res) => {
  const [user] = await db
    .select({
      kycStatus:          usersTable.kycStatus,
      kycFullName:        usersTable.kycFullName,
      kycDob:             usersTable.kycDob,
      kycIdType:          usersTable.kycIdType,
      kycIdNumber:        usersTable.kycIdNumber,
      kycRejectionReason: usersTable.kycRejectionReason,
      kycSubmittedAt:     usersTable.kycSubmittedAt,
      kycReviewedAt:      usersTable.kycReviewedAt,
    })
    .from(usersTable)
    .where(eq(usersTable.id, req.userId!))
    .limit(1);

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.json(user);
});

/* ── POST /api/kyc/submit ────────────────────────────────────────────────── */
router.post("/kyc/submit", requireAuth, async (req: AuthRequest, res) => {
  const { fullName, dob, idType, idNumber } = req.body as {
    fullName?: string;
    dob?:      string;
    idType?:   string;
    idNumber?: string;
  };

  if (!fullName || !dob || !idType || !idNumber) {
    res.status(400).json({ error: "fullName, dob, idType, and idNumber are required" });
    return;
  }

  if (!ID_TYPES.includes(idType as IdType)) {
    res.status(400).json({ error: `idType must be one of: ${ID_TYPES.join(", ")}` });
    return;
  }

  if (idType === "bvn" && !/^\d{11}$/.test(idNumber)) {
    res.status(400).json({ error: "BVN must be 11 digits" });
    return;
  }
  if (idType === "nin" && !/^\d{11}$/.test(idNumber)) {
    res.status(400).json({ error: "NIN must be 11 digits" });
    return;
  }

  const [user] = await db
    .select({ kycStatus: usersTable.kycStatus })
    .from(usersTable)
    .where(eq(usersTable.id, req.userId!))
    .limit(1);

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  if (user.kycStatus === "verified") {
    res.status(409).json({ error: "Identity already verified" });
    return;
  }

  /* Auto-approve in this environment (no third-party BVN/NIN verification
   * provider is wired up yet) — records the submission and marks it
   * verified immediately so downstream features can rely on kycStatus. */
  const now = new Date();
  const [updated] = await db
    .update(usersTable)
    .set({
      kycFullName:        fullName,
      kycDob:              dob,
      kycIdType:           idType,
      kycIdNumber:         idNumber,
      kycStatus:           "verified",
      kycRejectionReason:  null,
      kycSubmittedAt:      now,
      kycReviewedAt:       now,
      updatedAt:           now,
    })
    .where(eq(usersTable.id, req.userId!))
    .returning({ kycStatus: usersTable.kycStatus });

  res.json({
    status:  updated!.kycStatus,
    message: "Identity verification submitted and approved.",
  });
});

export default router;
