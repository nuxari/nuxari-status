import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // No auth, no middleware — fully public site
  reactStrictMode: true,
};

export default nextConfig;
