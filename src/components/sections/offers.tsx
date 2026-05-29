import { useTranslations } from 'next-intl';
import {
  Dumbbell,
  HeartPulse,
  Users,
  Flame,
  Waves,
  Sparkles,
  UserCheck,
  Stethoscope,
  ArrowUpRight,
  type LucideIcon,
} from 'lucide-react';
import { SITE } from '@/lib/site';
import { SectionHeader } from '@/components/section-header';

// 6-Spalten-Bento mit 8 Karten (inkl. Lady Fitness & Personal Training aus dem
// Original). Material-Karten mit Tiefe + Gold-Ring-Icon, gestaffeltes Reveal.
const ITEMS: { key: string; icon: LucideIcon; span: string; link?: string }[] = [
  { key: 'egym', icon: Dumbbell, span: 'md:col-span-3' },
  { key: 'kurse', icon: Users, span: 'md:col-span-3', link: SITE.links.kursplan },
  { key: 'ausdauer', icon: HeartPulse, span: 'md:col-span-2' },
  { key: 'functional', icon: Flame, span: 'md:col-span-2' },
  { key: 'wellness', icon: Waves, span: 'md:col-span-2' },
  { key: 'lady', icon: Sparkles, span: 'md:col-span-2' },
  { key: 'personal', icon: UserCheck, span: 'md:col-span-2' },
  { key: 'physio', icon: Stethoscope, span: 'md:col-span-2' },
];

export function Offers() {
  const t = useTranslations('offers');

  return (
    <section
      id="angebot"
      aria-labelledby="offers-heading"
      className="paper-glow on-paper text-ink"
    >
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
        <SectionHeader
          kicker={t('kicker')}
          heading={t('heading')}
          subheading={t('subheading')}
          tone="light"
          headingId="offers-heading"
        />

        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-6">
          {ITEMS.map(({ key, icon: Icon, span, link }) => {
            const inner = (
              <>
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/12 text-gold-ink ring-1 ring-gold/15 transition-transform group-hover:scale-110">
                  <Icon className="h-6 w-6" strokeWidth={1.5} aria-hidden="true" />
                </span>
                <div className="mt-10">
                  <h3 className="font-display flex items-center gap-2 text-2xl text-ink">
                    {t(`items.${key}.title`)}
                    {link && (
                      <ArrowUpRight
                        className="h-5 w-5 text-ink/30 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-gold-ink"
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                    )}
                  </h3>
                  <p className="mt-2 text-ink/65">{t(`items.${key}.text`)}</p>
                </div>
              </>
            );

            const cardClass = `group flex flex-col justify-between rounded-2xl border border-ink/8 bg-white p-7 shadow-[0_1px_2px_rgba(14,14,15,0.04),0_12px_32px_-12px_rgba(14,14,15,0.1)] transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-[0_20px_48px_-16px_rgba(224,162,60,0.35)] ${span}`;

            return link ? (
              <a
                key={key}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                data-reveal
                className={cardClass}
              >
                {inner}
                <span className="sr-only"> ({t('newTab')})</span>
              </a>
            ) : (
              <article key={key} data-reveal className={cardClass}>
                {inner}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
