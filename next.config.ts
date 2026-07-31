import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF first (~20% smaller than WebP), WebP for everything else.
    formats: ["image/avif", "image/webp"],
    // 50 is for stills that sit under a heavy colour wash — the extra
    // fidelity is invisible there. 75 stays the default for real photography.
    qualities: [30, 50, 60, 75],
  },
  experimental: {
    // Tailwind output is small; inlining it removes the render-blocking
    // stylesheet request from the critical path.
    inlineCss: false,
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.otronivelbarbershop.com" }],
        destination: "https://otronivelbarbershop.com/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      // Fingerprinted media/images: long-cache. Rename files when content changes.
      {
        source: "/media/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
