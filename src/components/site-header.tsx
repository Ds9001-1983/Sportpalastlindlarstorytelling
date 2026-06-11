'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Menu, X } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { SITE } from '@/lib/site';
import { LanguageSwitcher } from './language-switcher';

// Navigation als "/#anker"- bzw. Routen-Links, damit der Header auch auf den
// Unterseiten (Preise, Kurse, …) funktioniert — nicht nur auf der Home.
const NAV: { key: string; href: string }[] = [
  { key: 'goals', href: '/#ziele' },
  { key: 'offers', href: '/#angebot' },
  { key: 'courses', href: SITE.routes.kurse },
  { key: 'prices', href: SITE.routes.preise },
  { key: 'about', href: SITE.routes.ueberUns },
  { key: 'contact', href: '/#kontakt' },
];

export function SiteHeader() {
  const t = useTranslations('nav');
  const tHero = useTranslations('hero');
  const [scrolled, setScrolled] = useState(false);
  // Jeder Menü-Link schließt das Menü per onClick — ein pathname-Effekt ist
  // nicht nötig (Anker-Sprünge ändern den Pfad ohnehin nicht).
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-[var(--promo-h,0px)] z-50 transition-colors duration-300 ${
        scrolled || open
          ? 'border-b border-ink-line/60 bg-ink/85 backdrop-blur-md'
          : 'bg-linear-to-b from-ink/60 to-transparent'
      }`}
    >
      <a
        href="#inhalt"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-gold focus:px-3 focus:py-2 focus:text-ink"
      >
        {t('skipToContent')}
      </a>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
        <Link
          href="/"
          className="font-display text-lg tracking-tight text-paper md:text-xl"
        >
          {tHero('brand')}
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-paper/80 lg:flex">
          {NAV.map(({ key, href }) => (
            <Link
              key={key}
              href={href}
              className="transition-colors hover:text-paper"
            >
              {t(key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 md:gap-5">
          <LanguageSwitcher />
          <Link
            href="/#mitglied"
            className="hidden rounded-full bg-gold px-4 py-2 text-xs font-semibold text-ink transition-colors hover:bg-gold-bright sm:inline-block md:text-sm"
          >
            {t('membership')}
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? t('menuClose') : t('menuOpen')}
            className="rounded-full p-2 text-paper/85 transition-colors hover:bg-paper/10 hover:text-paper lg:hidden"
          >
            {open ? (
              <X className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile-/Tablet-Menü: erweitert den fixierten Header nach unten */}
      {open && (
        <nav
          id="mobile-nav"
          aria-label={t('menuOpen')}
          className="border-t border-ink-line/60 bg-ink/95 backdrop-blur-md lg:hidden"
        >
          <ul className="mx-auto flex max-w-7xl flex-col px-6 py-4 md:px-10">
            {NAV.map(({ key, href }) => (
              <li key={key}>
                <Link
                  href={href}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-base text-paper/85 transition-colors hover:text-paper"
                >
                  {t(key)}
                </Link>
              </li>
            ))}
            <li className="pt-3">
              <Link
                href="/#mitglied"
                onClick={() => setOpen(false)}
                className="inline-block rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-gold-bright"
              >
                {t('membership')}
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
