import { defineRouting } from 'next-intl/routing';

// DE = Default (Hauptpublikum Lindlar/Oberberg), zusätzlich EN/TR/RU.
// localePrefix 'always' => jede Seite liegt unter /{locale}, sauber für hreflang.
export const routing = defineRouting({
  locales: ['de', 'en', 'tr', 'ru'],
  defaultLocale: 'de',
  localePrefix: 'always',
});

export type Locale = (typeof routing.locales)[number];
