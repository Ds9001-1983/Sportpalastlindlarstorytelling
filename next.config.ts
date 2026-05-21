import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // Eindeutigen Workspace-Root setzen (es liegt ein weiteres Lockfile im Home-Verzeichnis).
  turbopack: {
    root: import.meta.dirname,
  },
  images: {
    // KI-Keyframes/Card-Bilder kommen ggf. von externen Hosts (RunPod/Higgsfield-CDN).
    remotePatterns: [
      { protocol: 'https', hostname: '**.runpod.ai' },
      { protocol: 'https', hostname: '**.higgsfield.ai' },
      { protocol: 'https', hostname: '**.cloudfront.net' },
    ],
    qualities: [60, 75, 90],
  },
  async headers() {
    return [
      {
        // Frame-Sequenzen sind content-hash-stabil -> aggressiv & unveränderlich cachen.
        source: '/frames/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/frames-mobile/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
