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

        <dl className="mt-12 grid grid-cols-2 gap-y-12 md:grid-cols-3 lg:grid-cols-6 lg:gap-y-0">
          {items.map((s, i) => {
            const to = parseFloat(s.to);
            return (
              <div
                key={i}
                data-reveal
                className={`flex flex-col items-center px-4 text-center ${
                  i > 0 ? 'lg:border-l lg:border-gold/15' : ''
                }`}
              >
                {/* Zahl und Suffix getrennt: „m²" bricht nie um und der
                    Count-up überschreibt den Suffix nicht mit. */}
                <dd
                  className="font-display whitespace-nowrap text-[clamp(2.5rem,4.5vw,4.25rem)] leading-none text-gold tabular-nums"
                  aria-label={`${numberFmt.format(to)}${s.suffix}`}
                >
                  <span data-countup data-to={s.to} aria-hidden="true">
                    {numberFmt.format(to)}
                  </span>
                  <span aria-hidden="true" className="text-[0.55em]">
                    {s.suffix}
                  </span>
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
