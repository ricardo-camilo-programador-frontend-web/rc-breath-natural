import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';
import { buildCsp } from "./src/lib/security-headers";
import { analyticsConfig } from "./src/lib/analytics/config";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [{ key: 'Content-Security-Policy', value: buildCsp(analyticsConfig.loadGtm) }],
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'd2seqvvyy3b8p2.cloudfront.net' },
      { protocol: 'https', hostname: 'bs.plantnet.org' },
    ],
    formats: ['image/avif', 'image/webp'],
    qualities: [60, 75],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    optimizePackageImports: ['@heroicons/react', 'lucide-react', 'sonner'],
  },
};

export default withNextIntl(nextConfig);
