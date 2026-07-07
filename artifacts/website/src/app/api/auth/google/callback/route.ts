import { type NextRequest, NextResponse } from "next/server";

/**
 * GET /api/auth/google/callback
 *
 * Receives Google's OAuth2 redirect after user consent, then forwards it to
 * the Express API which exchanges the code for a token and redirects to the
 * mobile deep-link: mobile://auth?token=…
 *
 * Same reasoning as /api/auth/google/route.ts — `redirect: "manual"` is
 * required so the deep-link redirect is forwarded to the browser rather than
 * followed server-side by Next.js.
 */
export async function GET(req: NextRequest) {
  const apiBase = process.env.INTERNAL_API_URL ?? "http://localhost:3001";
  const search = req.nextUrl.search; // ?code=...&state=...

  let upstream: Response;
  try {
    upstream = await fetch(`${apiBase}/api/auth/google/callback${search}`, {
      redirect: "manual",
    });
  } catch (err) {
    console.error("[/api/auth/google/callback] Failed to reach internal API:", err);
    return NextResponse.redirect(
      `mobile://auth?error=${encodeURIComponent("Authentication service unavailable")}`,
    );
  }

  // Forward the deep-link redirect (mobile://auth?token=…) to the browser.
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
