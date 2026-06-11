import { useTranslations } from 'next-intl';
import { Check, Sparkles, ArrowRight } from 'lucide-react';
import { SITE } from '@/lib/site';
import { Link } from '@/i18n/navigation';
import { SectionHeader } from '@/components/section-header';

interface Plan {
  id: string;
  name: string;
  term: string;
  price: string;
  promo: string;
  note: string;
  highlight: boolean;
}

interface Fee {
  label: string;
  value: string;
  note: string;
}

// Echte Tarifübersicht der Referenzseite (Summer Deal): 4 Tarif-Karten,
// Inklusivleistungen, Einmalkosten und Vertragskonditionen.
// variant 'home' = kompakte Karten + Link auf /preise; 'page' = alles.
export function Pricing({ variant = 'home' }: { variant?: 'home' | 'page' }) {
  const t = useTranslations('pricing');
  const plans = t.raw('plans') as Plan[];
  const fees = t.raw('fees') as Fee[];
  const included = t.raw('included') as string[];
  const terms = t.raw('terms') as string[];

  const cardClass =
    'relative flex flex-col rounded-2xl border bg-white p-7 shadow-[0_1px_2px_rgba(14,14,15,0.04),0_12px_32px_-12px_rgba(14,14,15,0.1)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_48px_-16px_rgba(224,162,60,0.35)]';

  return (
    <section
      id="preise"
      aria-labelledby="pricing-heading"
      className="paper-glow on-paper text-ink"
    >
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
        <SectionHeader
          kicker={t('kicker')}
          heading={t('heading')}
          subheading={t('subheading')}
          tone="light"
          headingId="pricing-heading"
        />

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan) => (
            <article
              key={plan.id}
              data-reveal
              className={`${cardClass} ${
                plan.highlight
                  ? 'border-gold/60 ring-2 ring-gold/30'
                  : 'border-ink/8 hover:border-gold/40'
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-gold px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.15em] text-ink">
                  <Sparkles className="h-3 w-3" strokeWidth={2.5} aria-hidden="true" />
                  {t('highlightLabel')}
                </span>
              )}
              <h3 className="font-display text-2xl text-ink">{plan.name}</h3>
              <p className="mt-1 text-sm text-ink/55">
                {t('termLabel')}: {plan.term}
              </p>
              <p className="mt-6 flex items-baseline gap-1.5">
                <span className="font-display text-4xl text-ink">
                  {plan.price}
                </span>
                <span className="text-sm text-ink/60">{t('perMonth')}</span>
              </p>
              <p className="mt-1 text-xs text-ink/50">{t('afterPromo')}</p>
              <p className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-gold/12 px-3 py-1.5 text-xs font-semibold text-gold-ink ring-1 ring-gold/20">
                {plan.promo}
              </p>
              {plan.note && (
                <p className="mt-3 text-sm text-ink/60">{plan.note}</p>
              )}
            </article>
          ))}
        </div>

        <p data-reveal className="mt-6 text-sm text-ink/55">
          {t('promoConditions')}
        </p>

        <div className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Inklusivleistungen */}
          <div data-reveal className="rounded-2xl bg-ink p-7 text-paper">
            <h3 className="font-display text-xl text-paper">
              {t('includedHeading')}
            </h3>
            <ul className="mt-5 flex flex-col gap-3">
              {included.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-paper/85">
                  <Check
                    className="mt-1 h-4 w-4 shrink-0 text-gold"
                    strokeWidth={2.5}
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Einmalige & weitere Kosten */}
          <div
            data-reveal
            className="rounded-2xl border border-ink/8 bg-white p-7"
          >
            <h3 className="font-display text-xl text-ink">
              {t('feesHeading')}
            </h3>
            <dl className="mt-5 divide-y divide-ink/8">
              {fees.map((fee, i) => (
                <div key={i} className="py-3">
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="font-semibold text-ink">{fee.label}</dt>
                    <dd className="whitespace-nowrap text-sm font-semibold text-gold-ink">
                      {fee.value}
                    </dd>
                  </div>
                  <p className="mt-0.5 text-sm text-ink/55">{fee.note}</p>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {variant === 'page' && (
          <div data-reveal className="mt-8 rounded-2xl border border-ink/8 bg-white p-7">
            <h3 className="font-display text-xl text-ink">{t('termsHeading')}</h3>
            <ul className="mt-4 flex flex-col gap-2 text-ink/70">
              {terms.map((term, i) => (
                <li key={i}>{term}</li>
              ))}
            </ul>
          </div>
        )}

        <div data-reveal className="mt-10 flex flex-col gap-3 sm:flex-row">
          <a
            href={SITE.links.join}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-paper transition-transform hover:scale-[1.02]"
          >
            {t('ctaJoin')}
            <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            <span className="sr-only"> ({t('newTab')})</span>
          </a>
          {variant === 'home' ? (
            <Link
              href={SITE.routes.preise}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/25 px-6 py-3.5 text-sm font-semibold text-ink transition-colors hover:bg-ink/5"
            >
              {t('ctaAll')}
            </Link>
          ) : (
            <a
              href={SITE.links.trial}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/25 px-6 py-3.5 text-sm font-semibold text-ink transition-colors hover:bg-ink/5"
            >
              {t('ctaTrial')}
              <span className="sr-only"> ({t('newTab')})</span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
