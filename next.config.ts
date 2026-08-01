import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel Node lambdas (Next 16.2.x) can resolve @swc/helpers via the ESM
  // path even when NFT only traces the CJS build — include both so /api/*
  // functions do not crash with FUNCTION_INVOCATION_FAILED.
  outputFileTracingIncludes: {
    "/api/*": ["./node_modules/@swc/helpers/**/*"],
  },
  experimental: {
    viewTransition: true,
  },
  async redirects() {
    return [
      {
        source: "/link-bio",
        destination: "/hub",
        permanent: true,
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/vi/**",
      },
    ],
  },

};

export default nextConfig;
