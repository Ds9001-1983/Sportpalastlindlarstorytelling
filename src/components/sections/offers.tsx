import { useTranslations } from 'next-intl';
import {
  Dumbbell,
  HeartPulse,
  Users,
  Flame,
  Waves,
  Stethoscope,
  type LucideIcon,
} from 'lucide-react';

const ITEMS: { key: string; icon: LucideIcon; span: string }[] = [
  { key: 'egym', icon: Dumbbell, span: 'md:col-span-3' },
  { key: 'kurse', icon: Users, span: 'md:col-span-3' },
  { key: 'ausdauer', icon: HeartPulse, span: 'md:col-span-2' },
  { key: 'functional', icon: Flame, span: 'md:col-span-2' },
  { key: 'wellness', icon: Waves, span: 'md:col-span-2' },
  { key: 'physio', icon: Stethoscope, span: 'md:col-span-6' },
];

export function Offers() {
  const t = useTranslations('offers');

  return (
    <section id="angebot" className="bg-paper text-ink">
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
        <div className="max-w-3xl">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-ink">
            {t('kicker')}
          </span>
          <h2 className="font-display mt-4 text-[clamp(2rem,5vw,4rem)] text-ink">
            {t('heading')}
          </h2>
          <p className="mt-5 text-lg text-ink/70">{t('subheading')}</p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-6">
          {ITEMS.map(({ key, icon: Icon, span }) => (
            <article
              key={key}
              className={`group flex flex-col justify-between rounded-2xl border border-ink/10 bg-white/60 p-7 transition-colors hover:border-gold/60 ${span}`}
            >
              <Icon
                className="h-7 w-7 text-gold-ink transition-transform group-hover:scale-110"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <div className="mt-10">
                <h3 className="font-display text-2xl text-ink">
                  {t(`items.${key}.title`)}
                </h3>
                <p className="mt-2 text-ink/65">{t(`items.${key}.text`)}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
