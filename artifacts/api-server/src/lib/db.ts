/**
 * Database initialisation for the API server.
 *
 * Exports a single `initDb()` function that must be called once at startup.
 * It verifies connectivity and logs the result. All route handlers that need
 * the DB should import `{ db }` from `@workspace/db` directly — this file
 * only owns the startup health check.
 */
import { pool } from "@workspace/db";
import { logger } from "./logger";

export async function initDb(): Promise<void> {
  try {
    const client = await pool.connect();
    await client.query("SELECT 1");
    client.release();
    logger.info("[DB] Database connection verified");
  } catch (err) {
    logger.error({ err }, "[DB] Failed to connect to database");
    throw err;
  }
}
