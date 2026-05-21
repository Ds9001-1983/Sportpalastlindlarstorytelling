import { useTranslations } from 'next-intl';
import { Star } from 'lucide-react';

interface Voice {
  quote: string;
  name: string;
  role: string;
}

export function SocialProof() {
  const t = useTranslations('proof');
  const items = t.raw('items') as Voice[];

  return (
    <section className="border-y border-ink-line/60 bg-ink-soft text-paper">
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
              {t('kicker')}
            </span>
            <h2 className="font-display mt-4 text-[clamp(2rem,5vw,4rem)]">
              {t('heading')}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="h-5 w-5 fill-gold text-gold"
                  strokeWidth={0}
                />
              ))}
            </div>
            <span className="text-sm text-paper/60">{t('ratingLabel')}</span>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-ink-line/60 bg-ink-line/60 md:grid-cols-3">
          {items.map((v, i) => (
            <figure
              key={i}
              className="flex flex-col justify-between bg-ink p-8 md:p-10"
            >
              <blockquote className="text-lg leading-relaxed text-paper/90">
                “{v.quote}”
              </blockquote>
              <figcaption className="mt-8">
                <div className="font-display text-lg text-paper">{v.name}</div>
                <div className="text-sm text-stone">{v.role}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
