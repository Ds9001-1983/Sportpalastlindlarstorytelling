import { useTranslations } from 'next-intl';
import { Check, Phone, ArrowRight, Sparkles } from 'lucide-react';
import { SITE } from '@/lib/site';

export function MembershipCta() {
  const t = useTranslations('membership');
  const bullets = t.raw('bullets') as string[];

  return (
    <section
      id="mitglied"
      aria-labelledby="membership-heading"
      className="relative bg-ink text-paper"
    >
      {/* Radialer Gold-Glow im Umfeld der Karte */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/4 mx-auto h-[420px] max-w-4xl bg-[radial-gradient(closest-side,rgba(224,162,60,0.22),transparent)] blur-2xl"
      />
      <div className="relative mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
        <div
          data-reveal
          className="relative overflow-hidden rounded-3xl bg-linear-to-br from-gold via-gold to-gold-bright text-ink shadow-[0_40px_120px_-30px_rgba(224,162,60,0.5)]"
        >
          {/* Diagonaler Sheen */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-x-1/2 -top-1/2 h-full rotate-12 bg-linear-to-b from-white/25 to-transparent"
          />
          <div className="relative grid grid-cols-1 gap-10 p-8 md:grid-cols-2 md:gap-16 md:p-16">
            <div>
              {/* 0€-Aktions-Pill */}
              <span className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-gold">
                <Sparkles className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                {t('promoBadge')}
              </span>

              <h2
                id="membership-heading"
                className="font-display mt-5 text-[clamp(2.25rem,5vw,4.5rem)] leading-[0.95] text-ink"
              >
                {t('heading')}
              </h2>
              <p className="mt-5 max-w-md text-lg text-ink/80">{t('text')}</p>

              <div className="mt-8 flex items-baseline gap-2">
                <span className="text-sm uppercase tracking-wide text-ink/60">
                  {t('priceAfter')}
                </span>
                <span className="font-display text-4xl text-ink md:text-5xl">
                  {t('priceValue')}
                </span>
                <span className="text-lg text-ink/70">{t('priceSuffix')}</span>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href={SITE.links.trial}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-paper transition-transform hover:scale-[1.02]"
                >
                  {t('ctaTrial')}
                  <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                  <span className="sr-only"> ({t('newTab')})</span>
                </a>
                <a
                  href={`tel:${SITE.phone}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/30 px-6 py-3.5 text-sm font-semibold text-ink transition-colors hover:bg-ink/10"
                >
                  <Phone className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                  {t('ctaCall')}
                </a>
              </div>
              <p className="mt-4 text-xs text-ink/55">{t('promoNote')}</p>
            </div>

            <div className="md:border-l md:border-ink/15 md:pl-16">
              <p className="text-sm font-semibold uppercase tracking-[0.15em] text-ink/70">
                {t('bulletsHeading')}
              </p>
              <ul className="mt-5 flex flex-col gap-4">
                {bullets.map((b, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-lg text-ink/90"
                  >
                    <Check
                      className="mt-1 h-5 w-5 shrink-0 text-ink"
                      strokeWidth={2.5}
                      aria-hidden="true"
                    />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
