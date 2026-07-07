import { type NextFunction, type Request, type Response } from "express";
import { cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { type DecodedIdToken, getAuth } from "firebase-admin/auth";

/**
 * Lazily initialise the Firebase Admin SDK on first use.
 *
 * Expects FIREBASE_SERVICE_ACCOUNT to be the full service-account JSON as a
 * string (set it as a secret environment variable in Railway / Replit Secrets):
 *
 *   FIREBASE_SERVICE_ACCOUNT='{"type":"service_account","project_id":"payvora-2026",...}'
 */
function getAdminAuth(): ReturnType<typeof getAuth> {
  const app =
    getApps().length > 0
      ? getApp()
      : (() => {
          const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
          if (!raw) {
            throw new Error(
              "FIREBASE_SERVICE_ACCOUNT environment variable is not set. " +
                "Add the full Firebase service-account JSON as a secret.",
            );
          }
          let parsed: object;
          try {
            parsed = JSON.parse(raw) as object;
          } catch {
            throw new Error(
              "FIREBASE_SERVICE_ACCOUNT is not valid JSON. " +
                "Ensure the full service-account JSON object is stored as the secret value.",
            );
          }
          return initializeApp({ credential: cert(parsed as Parameters<typeof cert>[0]) });
        })();

  return getAuth(app);
}

/** Extends Express Request with the decoded Firebase user payload. */
export interface FirebaseAuthRequest extends Request {
  firebaseUser?: DecodedIdToken;
}

/**
 * requireFirebaseAuth
 *
 * Express middleware that validates an incoming Firebase ID token.
 *
 * Reads `Authorization: Bearer <Firebase_ID_Token>` from the request header,
 * verifies it with the Firebase Admin SDK, and attaches the decoded token to
 * `req.firebaseUser`. Returns a 401 JSON error on any failure.
 *
 * Usage:
 *   router.get("/protected", requireFirebaseAuth, handler);
 *
 * The decoded token exposes `req.firebaseUser.uid`, `.email`, `.name`, etc.
 */
export async function requireFirebaseAuth(
  req: FirebaseAuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({
      error: "Unauthorized",
      message: "Authorization header must be: Bearer <Firebase ID Token>",
    });
    return;
  }

  const idToken = authHeader.slice(7).trim();

  try {
    const decoded = await getAdminAuth().verifyIdToken(idToken, true);
    req.firebaseUser = decoded;
    next();
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Token verification failed";
    res.status(401).json({
      error: "Unauthorized",
      message: `Invalid Firebase ID token: ${message}`,
    });
  }
}
