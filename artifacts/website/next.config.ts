import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  transpilePackages: ["@payvora/ui", "@payvora/theme", "@payvora/shared", "@payvora/icons"],
  images: {
    remotePatterns: [],
  },
  async rewrites() {
    // In production, both Next.js and the Express API server run in the same
    // container. Express listens on port 8080; Next.js is on Railway's PORT.
    // All /api/* requests are proxied to Express server-side so the mobile
    // app and any client can continue to use www.payvora.org/api/*.
    const apiBase =
      process.env.INTERNAL_API_URL ?? "http://localhost:8080";
    return [
      {
        source: "/api/:path*",
        destination: `${apiBase}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
