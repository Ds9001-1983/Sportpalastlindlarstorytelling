import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';

const BASE = 'https://www.sportpalast-lindlar.de';

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(
    routing.locales.map((loc) => [loc, `${BASE}/${loc}`]),
  );

  return routing.locales.map((loc) => ({
    url: `${BASE}/${loc}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: loc === routing.defaultLocale ? 1 : 0.8,
    alternates: { languages },
  }));
}
