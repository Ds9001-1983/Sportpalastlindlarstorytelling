import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';

const BASE = 'https://www.sportpalast-lindlar.de';

// Indexierbare Routen (Legal-Seiten sind noindex und bleiben draußen).
const PATHS = [
  '',
  '/preise',
  '/kurse',
  '/ueber-uns',
  '/physiotherapie',
  '/rehasport',
  '/firmenfitness',
  '/karriere',
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.flatMap((path) => {
    const languages = Object.fromEntries(
      routing.locales.map((loc) => [loc, `${BASE}/${loc}${path}`]),
    );

    return routing.locales.map((loc) => ({
      url: `${BASE}/${loc}${path}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority:
        path === ''
          ? loc === routing.defaultLocale
            ? 1
            : 0.8
          : loc === routing.defaultLocale
            ? 0.7
            : 0.5,
      alternates: { languages },
    }));
  });
}
