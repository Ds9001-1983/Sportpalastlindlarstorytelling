import { useTranslations } from 'next-intl';
import { Check, Phone, MessageCircle } from 'lucide-react';
import { SITE, whatsappLink } from '@/lib/site';

export function MembershipCta() {
  const t = useTranslations('membership');
  const bullets = t.raw('bullets') as string[];

  return (
    <section id="mitglied" className="bg-ink text-paper">
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
        <div className="overflow-hidden rounded-3xl bg-linear-to-br from-gold via-gold to-gold-bright text-ink">
          <div className="grid grid-cols-1 gap-10 p-8 md:grid-cols-2 md:gap-16 md:p-16">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-ink/70">
                {t('kicker')}
              </span>
              <h2 className="font-display mt-4 text-[clamp(2.25rem,5vw,4.5rem)] text-ink">
                {t('heading')}
              </h2>
              <p className="mt-5 max-w-md text-lg text-ink/80">{t('text')}</p>

              <div className="mt-8 flex items-baseline gap-2">
                <span className="text-sm uppercase tracking-wide text-ink/60">
                  {t('priceLabel')}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-5xl text-ink md:text-6xl">
                  {t('priceValue')}
                </span>
                <span className="text-lg text-ink/70">{t('priceSuffix')}</span>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href={`tel:${SITE.phone}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-paper transition-transform hover:scale-[1.02]"
                >
                  <Phone className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                  {t('ctaPrimary')}
                </a>
                <a
                  href={whatsappLink(t('ctaPrimary'))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/30 px-6 py-3.5 text-sm font-semibold text-ink transition-colors hover:bg-ink/10"
                >
                  <MessageCircle
                    className="h-4 w-4"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  {t('ctaSecondary')}
                </a>
              </div>
            </div>

            <ul className="flex flex-col justify-center gap-4 md:border-l md:border-ink/15 md:pl-16">
              {bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-3 text-lg text-ink/90">
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
    </section>
  );
}
