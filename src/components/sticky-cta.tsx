'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Phone, ArrowRight } from 'lucide-react';
import { SITE } from '@/lib/site';

// Sticky Mobile-CTA: holt Mobile-/Paid-Traffic in den Funnel, statt den einzigen
// Kauf-CTA ganz unten nach allen Panels zu verstecken. Erscheint nach der Hero.
export function StickyCta() {
  const t = useTranslations('membership');
  const tNav = useTranslations('nav');
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > window.innerHeight * 0.9);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-50 md:hidden ${
        shown ? 'translate-y-0' : 'pointer-events-none translate-y-full'
      } transition-transform duration-300`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-hidden={!shown}
    >
      <div className="flex items-center gap-2 border-t border-ink-line/60 bg-ink/95 px-4 py-3 backdrop-blur-md">
        <a
          href={SITE.links.trial}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={shown ? 0 : -1}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-semibold text-ink"
        >
          {t('ctaTrial')}
          <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
        </a>
        <a
          href={`tel:${SITE.phone}`}
          tabIndex={shown ? 0 : -1}
          aria-label={`${tNav('membership')} – ${t('ctaCall')}`}
          className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-paper/25 text-paper"
        >
          <Phone className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
