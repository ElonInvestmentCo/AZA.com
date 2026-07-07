import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
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
