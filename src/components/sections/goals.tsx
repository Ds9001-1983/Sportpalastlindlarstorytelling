import { useTranslations } from 'next-intl';
import {
  Dumbbell,
  Gauge,
  PersonStanding,
  Leaf,
  Heart,
  Brain,
  Scale,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react';

// Gesundheitsziele der Ursprungsseite als Einstiegsmotiv: Nutzer:innen wählen ihr
// Ziel und werden in den Funnel (#mitglied) geführt. Reihenfolge wie im Original.
const GOALS: { key: string; icon: LucideIcon }[] = [
  { key: 'muskelaufbau', icon: Dumbbell },
  { key: 'kondition', icon: Gauge },
  { key: 'ruecken', icon: PersonStanding },
  { key: 'alter', icon: Leaf },
  { key: 'gesundheit', icon: Heart },
  { key: 'stress', icon: Brain },
  { key: 'abnehmen', icon: Scale },
];

export function Goals() {
  const t = useTranslations('goals');

  return (
    <section
      id="ziele"
      aria-labelledby="goals-heading"
      className="paper-glow on-paper text-ink"
    >
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
        <div className="max-w-3xl">
          <span
            data-reveal
            className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-gold-ink"
          >
            <span className="h-px w-8 bg-current opacity-60" />
            {t('kicker')}
          </span>
          <h2
            id="goals-heading"
            data-sweep
            className="font-display mt-4 text-[clamp(2rem,5.5vw,4.5rem)] leading-[0.95] text-ink"
          >
            {t('heading')}
          </h2>
          <p data-reveal className="mt-5 text-lg text-ink/70">
            {t('subheading')}
          </p>
        </div>

        <ul className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GOALS.map(({ key, icon: Icon }) => (
            <li key={key} data-reveal>
              <a
                href="#mitglied"
                className="group flex h-full items-center gap-4 rounded-2xl border border-ink/8 bg-white p-6 shadow-[0_1px_2px_rgba(14,14,15,0.04),0_12px_32px_-12px_rgba(14,14,15,0.1)] transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-[0_20px_48px_-16px_rgba(224,162,60,0.35)]"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold/12 text-gold-ink ring-1 ring-gold/15 transition-transform group-hover:scale-110">
                  <Icon className="h-6 w-6" strokeWidth={1.5} aria-hidden="true" />
                </span>
                <span className="font-display text-xl text-ink">
                  {t(`items.${key}`)}
                </span>
                <ArrowRight
                  className="ml-auto h-5 w-5 shrink-0 text-ink/30 transition-all group-hover:translate-x-1 group-hover:text-gold-ink"
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
