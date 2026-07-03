import {
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

import { usersTable } from "./users";

export const txTypeEnum = pgEnum("tx_type", ["credit", "debit"]);
export const txStatusEnum = pgEnum("tx_status", [
  "pending",
  "completed",
  "failed",
]);
export const txCategoryEnum = pgEnum("tx_category", [
  "wallet_funding",
  "bill_payment",
  "gift_card",
  "airtime",
  "esim",
  "withdrawal",
  "transfer",
]);

export const transactionsTable = pgTable(
  "transactions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    type: txTypeEnum("type").notNull(),
    status: txStatusEnum("status").notNull().default("pending"),
    category: txCategoryEnum("category").notNull(),
    /** Amount in kobo (NGN) — divide by 100 to get naira */
    amountKobo: integer("amount_kobo").notNull(),
    currency: text("currency").notNull().default("NGN"),
    description: text("description").notNull(),
    /** External reference (e.g. Reloadly transaction ID) */
    externalRef: text("external_ref"),
    /** Arbitrary extra data (biller info, gift card details, etc.) */
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("transactions_user_id_idx").on(t.userId),
    index("transactions_created_at_idx").on(t.createdAt),
  ],
);

export const insertTransactionSchema = createInsertSchema(transactionsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactionsTable.$inferSelect;
