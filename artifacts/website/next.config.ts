import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "payvora.org" }],
        destination: "https://www.payvora.org/:path*",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    // NOTE: Next.js resolves rewrite destinations into routes-manifest.json
    // at BUILD time, not at request time. The fallback below must match the
    // actual runtime API port (see API_PORT in start.mjs), because Railway's
    // build command does not set INTERNAL_API_URL -- if the fallback here
    // ever drifts from the real API port, every /api/* request in production
    // fails with EADDRNOTAVAIL regardless of what start.mjs sets at runtime.
    const apiBase =
      process.env.INTERNAL_API_URL ?? "http://localhost:3001";
    return [
      {
        source: "/api/:path*",
        destination: `${apiBase}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
