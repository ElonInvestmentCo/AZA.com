import { type NextRequest, NextResponse } from "next/server";

/**
 * GET /api/auth/google
 *
 * Initiates the Google OAuth2 redirect flow.
 *
 * Why this route exists instead of relying on Next.js rewrites:
 * Next.js rewrites() follow upstream 3xx redirects server-side, meaning
 * when Express returns `302 → accounts.google.com`, Next.js would fetch
 * Google's HTML internally and fail with a 500. This App Router handler
 * fetches the upstream with `redirect: "manual"` so the 302 is forwarded
 * directly to the browser.
 */
export async function GET(_req: NextRequest) {
  const apiBase = process.env.INTERNAL_API_URL ?? "http://localhost:3001";

  let upstream: Response;
  try {
    upstream = await fetch(`${apiBase}/api/auth/google`, {
      redirect: "manual",
    });
  } catch (err) {
    console.error("[/api/auth/google] Failed to reach internal API:", err);
    return NextResponse.json(
      { error: "Authentication service unavailable" },
      { status: 502 },
    );
  }

  // Forward the redirect (302) to the browser so it navigates to Google.
  if (upstream.status >= 300 && upstream.status < 400) {
    const location = upstream.headers.get("location");
    if (location) {
      return NextResponse.redirect(location, { status: upstream.status });
    }
  }

  // Forward any error response as-is.
  const body = await upstream.text();
  return new NextResponse(body, {
    status: upstream.status,
    headers: {
      "Content-Type":
        upstream.headers.get("content-type") ?? "application/json",
    },
  });
}
