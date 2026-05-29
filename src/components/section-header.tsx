// Geteilter Sektions-Header: Kicker mit Gold-Hairline (wie der StoryRoom-Counter),
// Display-Heading mit clipPath-Sweep und optionaler Subline.
// tone steuert die Kontrast-Disziplin: gold nur auf dunklem, gold-ink auf hellem Grund.

interface SectionHeaderProps {
  kicker: string;
  heading: string;
  subheading?: string;
  tone?: 'dark' | 'light';
  /** Heading-Ebene — genau eine H1 pro Seite. */
  as?: 'h1' | 'h2';
  /** id für aria-labelledby der umschließenden <section>. */
  headingId?: string;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeader({
  kicker,
  heading,
  subheading,
  tone = 'light',
  as: Heading = 'h2',
  headingId,
  align = 'left',
  className = '',
}: SectionHeaderProps) {
  const goldText = tone === 'dark' ? 'text-gold' : 'text-gold-ink';
  const headingColor = tone === 'dark' ? 'text-paper' : 'text-ink';
  const subColor = tone === 'dark' ? 'text-paper/70' : 'text-ink/70';
  const alignment =
    align === 'center' ? 'items-center text-center mx-auto' : 'items-start';

  return (
    <div className={`flex max-w-3xl flex-col ${alignment} ${className}`}>
      <span
        data-reveal
        className={`inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] ${goldText}`}
      >
        <span className="h-px w-8 bg-current opacity-60" />
        {kicker}
      </span>
      <Heading
        id={headingId}
        data-sweep
        className={`font-display mt-4 text-[clamp(2rem,5.5vw,4.5rem)] leading-[0.95] ${headingColor}`}
      >
        {heading}
      </Heading>
      {subheading && (
        <p data-reveal className={`mt-5 text-lg ${subColor}`}>
          {subheading}
        </p>
      )}
    </div>
  );
}
