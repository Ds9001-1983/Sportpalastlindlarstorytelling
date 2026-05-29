'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { X } from 'lucide-react';

const STORAGE_KEY = 'sp-promo-dismissed';

// Dismissible Top-Banner mit der 0€-Aktion — kommuniziert den stärksten Hook
// sofort (bevor die 8 Story-Rooms gescrollt sind). Setzt --promo-h, damit der
// fixierte Header korrekt darunter sitzt.
export function PromoBanner() {
  const t = useTranslations('promo');
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // localStorage ist nur clientseitig lesbar: Banner nach Mount einmalig
    // einblenden, außer es wurde bereits weggeklickt. Kein Render-Loop.
    if (localStorage.getItem(STORAGE_KEY) === '1') return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(true);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (!visible) {
      root.style.setProperty('--promo-h', '0px');
      return;
    }
    const setH = () => {
      const h = ref.current?.offsetHeight ?? 0;
      root.style.setProperty('--promo-h', `${h}px`);
    };
    setH();
    window.addEventListener('resize', setH);
    return () => {
      window.removeEventListener('resize', setH);
      root.style.setProperty('--promo-h', '0px');
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      ref={ref}
      className="fixed inset-x-0 top-0 z-70 bg-gold text-ink"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-x-3 gap-y-1 px-10 py-2 text-center text-xs font-semibold sm:text-sm">
        <span className="flex flex-wrap items-center justify-center gap-x-2">
          <span className="font-bold uppercase tracking-wide">{t('badge')}</span>
          <span className="hidden text-ink/80 sm:inline">{t('text')}</span>
          <a
            href="#mitglied"
            className="inline-flex items-center gap-1 font-bold underline underline-offset-2 hover:text-gold-ink"
          >
            {t('cta')}
            <span aria-hidden="true">→</span>
          </a>
        </span>
      </div>
      <button
        type="button"
        onClick={() => {
          localStorage.setItem(STORAGE_KEY, '1');
          setVisible(false);
        }}
        aria-label={t('dismiss')}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-ink/70 transition-colors hover:bg-ink/10 hover:text-ink"
      >
        <X className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
      </button>
    </div>
  );
}
