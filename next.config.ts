import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Frame-Options",             value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options",      value: "nosniff" },
  { key: "Referrer-Policy",             value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy",          value: "camera=(), microphone=(), geolocation=()" },
  { key: "X-DNS-Prefetch-Control",      value: "on" },
  { key: "Cross-Origin-Opener-Policy",  value: "same-origin-allow-popups" },
];

const nextConfig: NextConfig = {
  // No auth, no middleware — fully public site
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
