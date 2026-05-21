'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { useTransition } from 'react';

const LABELS: Record<string, string> = {
  de: 'DE',
  en: 'EN',
  tr: 'TR',
  ru: 'RU',
};

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <div
      className="flex items-center gap-1 text-xs font-semibold tracking-wide"
      role="group"
      aria-label="Language"
    >
      {routing.locales.map((loc) => {
        const active = loc === locale;
        return (
          <button
            key={loc}
            type="button"
            disabled={active || isPending}
            onClick={() =>
              startTransition(() => router.replace(pathname, { locale: loc }))
            }
            aria-current={active ? 'true' : undefined}
            className={
              active
                ? 'rounded-full bg-gold px-2.5 py-1 text-ink'
                : 'rounded-full px-2.5 py-1 text-paper/60 transition-colors hover:text-paper'
            }
          >
            {LABELS[loc] ?? loc.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
