import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/",
        has: [
          {
            type: "host",
            value: "app.partypadi.vercel.app",
          },
        ],
        destination: "/onboarding",
      },
      {
        source: "/",
        has: [
          {
            type: "host",
            value: "app.localhost:3000",
          },
        ],
        destination: "/onboarding",
      },
    ];
  },
};

export default nextConfig;
