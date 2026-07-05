import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const usersTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  fullName: text("full_name"),
  passwordHash: text("password_hash"),
  /** oauth | email */
  authProvider: text("auth_provider").notNull().default("email"),
  googleId: text("google_id"),
  appleId: text("apple_id"),
  avatarUrl: text("avatar_url"),
  /** none | pending | verified | rejected */
  kycStatus: text("kyc_status").notNull().default("none"),
  kycFullName: text("kyc_full_name"),
  kycDob: text("kyc_dob"),
  kycIdType: text("kyc_id_type"),
  kycIdNumber: text("kyc_id_number"),
  kycRejectionReason: text("kyc_rejection_reason"),
  kycSubmittedAt: timestamp("kyc_submitted_at", { withTimezone: true }),
  kycReviewedAt: timestamp("kyc_reviewed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(usersTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const selectUserSchema = createSelectSchema(usersTable);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof usersTable.$inferSelect;
