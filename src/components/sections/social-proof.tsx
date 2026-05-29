import { useTranslations } from 'next-intl';
import { Star } from 'lucide-react';
import { SectionHeader } from '@/components/section-header';

interface Voice {
  quote: string;
  name: string;
  role: string;
}

export function SocialProof() {
  const t = useTranslations('proof');
  const items = t.raw('items') as Voice[];

  return (
    <section
      aria-labelledby="proof-heading"
      className="relative border-y border-ink-line/60 bg-ink-soft text-paper"
    >
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeader
            kicker={t('kicker')}
            heading={t('heading')}
            tone="dark"
            headingId="proof-heading"
          />
          <div data-reveal className="flex items-center gap-3">
            <div
              className="flex"
              role="img"
              aria-label={t('ratingLabel')}
            >
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="h-5 w-5 fill-gold text-gold drop-shadow-[0_0_8px_rgba(224,162,60,0.4)]"
                  strokeWidth={0}
                  aria-hidden="true"
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
              data-reveal
              className="group relative flex flex-col justify-between bg-ink p-8 md:p-10"
            >
              <span
                className="font-display pointer-events-none absolute right-6 top-4 text-6xl leading-none text-gold/20 select-none"
                aria-hidden="true"
              >
                &rdquo;
              </span>
              <span className="absolute inset-x-0 top-0 h-px scale-x-0 bg-linear-to-r from-transparent via-gold/60 to-transparent transition-transform duration-500 group-hover:scale-x-100" />
              <blockquote className="relative text-lg leading-relaxed text-paper/90">
                {v.quote}
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
