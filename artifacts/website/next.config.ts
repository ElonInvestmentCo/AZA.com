import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  transpilePackages: ["@payvora/ui", "@payvora/theme", "@payvora/shared", "@payvora/icons"],
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
