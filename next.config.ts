import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const noindex = [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }];

// Entwurf: noindex überall, bis NEXT_PUBLIC_ALLOW_INDEXING=true gesetzt ist. Danach nur noch auf Nebenadressen.
function noindexRules() {
  if (process.env.NEXT_PUBLIC_ALLOW_INDEXING !== 'true') {
    return [{ source: '/:path*', headers: noindex }];
  }
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) return [];
  // Next.js verankert den Host-Wert als Regex (^…$), deshalb Punkte escapen.
  const host = new URL(siteUrl).hostname.replace(/\./g, '\\.');
  return [
    {
      source: '/:path*',
      missing: [{ type: 'host' as const, value: host }],
      headers: noindex,
    },
  ];
}

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
      ...noindexRules(),
    ];
  },
};

export default withNextIntl(nextConfig);
