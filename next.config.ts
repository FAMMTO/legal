import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ["10.1.10.130"],
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
