// Dunkler Kopfbereich für Unterseiten: sichtbare H1 (auf der Home ist die H1
// sr-only), Kicker im Stil des SectionHeaders und genug Top-Padding, damit der
// fixierte Header den Inhalt nicht überdeckt.
export function PageHero({
  kicker,
  heading,
  intro,
}: {
  kicker: string;
  heading: string;
  intro?: string;
}) {
  return (
    <section className="relative bg-ink text-paper">
      <div className="mx-auto max-w-7xl px-6 pb-16 pt-36 md:px-10 md:pb-24 md:pt-44">
        <span
          data-reveal
          className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-gold"
        >
          <span className="h-px w-8 bg-current opacity-60" />
          {kicker}
        </span>
        <h1
          data-sweep
          className="font-display mt-4 max-w-4xl text-[clamp(2.5rem,6.5vw,5.5rem)] leading-[0.95] text-paper"
        >
          {heading}
        </h1>
        {intro && (
          <p data-reveal className="mt-6 max-w-2xl text-lg text-paper/75">
            {intro}
          </p>
        )}
      </div>
      <hr className="gold-hairline" />
    </section>
  );
}
