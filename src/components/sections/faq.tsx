import { useTranslations } from 'next-intl';
import { ChevronDown } from 'lucide-react';
import { SectionHeader } from '@/components/section-header';

interface FaqItem {
  q: string;
  a: string;
}

// Einwandbehandlung direkt vor dem Kontakt: native <details>/<summary> —
// kein JS, von Haus aus tastatur- und screenreader-tauglich.
export function Faq() {
  const t = useTranslations('faq');
  const items = t.raw('items') as FaqItem[];

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="relative bg-ink-soft text-paper"
    >
      <hr className="gold-hairline" />
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
        <SectionHeader
          kicker={t('kicker')}
          heading={t('heading')}
          tone="dark"
          headingId="faq-heading"
        />

        <div className="mt-12 grid grid-cols-1 gap-3 lg:grid-cols-2">
          {items.map((item, i) => (
            <details
              key={i}
              data-reveal
              className="group h-fit rounded-2xl border border-ink-line/60 bg-ink p-6 open:border-gold/40"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-paper [&::-webkit-details-marker]:hidden">
                {item.q}
                <ChevronDown
                  className="h-5 w-5 shrink-0 text-gold transition-transform group-open:rotate-180"
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </summary>
              <p className="mt-4 leading-relaxed text-paper/70">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
