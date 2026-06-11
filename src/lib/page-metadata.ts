import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';

// Metadata-Helper für indexierbare Unterseiten. Wichtig: das Locale-Layout
// setzt canonical pauschal auf /{locale} — jede Unterseite muss canonical,
// hreflang-Alternates und og:url auf die eigene Route überschreiben.
export async function subpageMetadata(
  locale: string,
  namespace: string,
  path: string,
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace });
  const languages = Object.fromEntries(
    routing.locales.map((loc) => [loc, `/${loc}${path}`]),
  );

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: {
      canonical: `/${locale}${path}`,
      languages: {
        ...languages,
        'x-default': `/${routing.defaultLocale}${path}`,
      },
    },
    openGraph: {
      title: t('metaTitle'),
      description: t('metaDescription'),
      url: `/${locale}${path}`,
    },
  };
}
