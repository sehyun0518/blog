import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@blog/ui", "@blog/utils", "@blog/config"],
  experimental: {
    typedRoutes: true,
  },
};

export default nextConfig;
