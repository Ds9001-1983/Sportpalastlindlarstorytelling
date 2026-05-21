'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from './language-switcher';

export function SiteHeader() {
  const t = useTranslations('nav');
  const tHero = useTranslations('hero');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? 'border-b border-ink-line/60 bg-ink/85 backdrop-blur-md'
          : 'bg-linear-to-b from-ink/60 to-transparent'
      }`}
    >
      <a
        href="#angebot"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-gold focus:px-3 focus:py-2 focus:text-ink"
      >
        {t('skipToContent')}
      </a>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
        <a
          href="#top"
          className="font-display text-lg tracking-tight text-paper md:text-xl"
        >
          {tHero('brand')}
        </a>

        <nav className="hidden items-center gap-8 text-sm text-paper/80 md:flex">
          <a href="#angebot" className="transition-colors hover:text-paper">
            {t('offers')}
          </a>
          <a href="#kontakt" className="transition-colors hover:text-paper">
            {t('contact')}
          </a>
        </nav>

        <div className="flex items-center gap-3 md:gap-5">
          <LanguageSwitcher />
          <a
            href="#mitglied"
            className="rounded-full bg-gold px-4 py-2 text-xs font-semibold text-ink transition-colors hover:bg-gold-bright md:text-sm"
          >
            {t('membership')}
          </a>
        </div>
      </div>
    </header>
  );
}
