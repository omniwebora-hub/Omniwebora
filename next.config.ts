import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: { formats: ["image/avif", "image/webp"], qualities: [65, 72, 75] },
  /** Old routes (pre-governance IA) move permanently to their replacements. */
  async redirects() {
    return [
      { source: "/services", destination: "/solutions", permanent: true },
      { source: "/services/websites", destination: "/solutions/web-development", permanent: true },
      { source: "/services/mobile-apps", destination: "/solutions/mobile-apps", permanent: true },
      { source: "/services/business-software", destination: "/solutions/custom-software", permanent: true },
      { source: "/services/ai-automation", destination: "/solutions/business-automation", permanent: true },
      { source: "/solutions/ai-automation", destination: "/solutions/business-automation", permanent: true },
      { source: "/solutions/cloud-integrations", destination: "/solutions", permanent: true },
      { source: "/work", destination: "/solutions", permanent: false },
      { source: "/concept-lab", destination: "/solutions", permanent: false },
      { source: "/process", destination: "/approach", permanent: true },
    ];
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
