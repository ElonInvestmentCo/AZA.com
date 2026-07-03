import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@payvora/ui", "@payvora/theme", "@payvora/shared", "@payvora/icons"],
  images: {
    remotePatterns: [],
  },
  async rewrites() {
    // In production, Next.js and the Express API server run in the same
    // Railway container.  Express listens on :3001 (internal); Next.js
    // takes Railway's public PORT.  All /api/* calls are proxied server-side
    // so mobile clients continue to use www.payvora.org/api/*.
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
