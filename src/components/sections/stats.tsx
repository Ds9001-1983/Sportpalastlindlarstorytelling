import { useTranslations } from 'next-intl';

interface Stat {
  to: string;
  suffix: string;
  label: string;
}

const numberFmt = new Intl.NumberFormat('de-DE');

// Stat-Band als dunkle Brücke zwischen der cinematischen Story und dem hellen
// Content. Hält den Dark-Modus nach den Rooms und verankert die harten Eckdaten,
// bevor in die Angebote gewechselt wird. Zahlen zählen via Reveal-Layer hoch.
export function Stats() {
  const t = useTranslations('stats');
  const items = t.raw('items') as Stat[];

  return (
    <section
      aria-labelledby="stats-heading"
      className="relative bg-ink text-paper"
    >
      <hr className="gold-hairline" />
      <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
        <h2
          id="stats-heading"
          data-reveal
          className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-gold"
        >
          {t('kicker')}
        </h2>

        <dl className="mt-12 grid grid-cols-2 gap-y-12 md:grid-cols-5 md:gap-y-0">
          {items.map((s, i) => {
            const to = parseFloat(s.to);
            return (
              <div
                key={i}
                data-reveal
                className={`flex flex-col items-center px-4 text-center ${
                  i > 0 ? 'md:border-l md:border-gold/15' : ''
                }`}
              >
                <dd
                  data-countup
                  data-to={s.to}
                  data-suffix={s.suffix}
                  className="font-display text-[clamp(2.75rem,6vw,5rem)] leading-none text-gold tabular-nums"
                  aria-label={`${numberFmt.format(to)}${s.suffix}`}
                >
                  {numberFmt.format(to)}
                  {s.suffix}
                </dd>
                <dt className="mt-3 text-xs uppercase tracking-[0.2em] text-paper/55 md:text-sm">
                  {s.label}
                </dt>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
