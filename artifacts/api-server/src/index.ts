import app from "./app";
import { logger } from "./lib/logger";
import { initDb } from "./lib/db";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

async function start() {
  try {
    await initDb();
    logger.info("[Startup] Database initialized");
  } catch {
    logger.error("[Startup] Aborting: could not connect to database");
    process.exit(1);
  }

  app.listen(port, (err) => {
    if (err) {
      logger.error({ err }, "Error listening on port");
      process.exit(1);
    }
    logger.info({ port }, "PayVora API server listening");
  });
}

start();
