import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import { SITE } from '@/lib/site';
import { Link } from '@/i18n/navigation';
import { SectionHeader } from '@/components/section-header';

interface Person {
  name: string;
  role: string;
}

// Initialen-Avatar im Gold-Ring: bewusst ohne Fotos gestartet (Bildrechte der
// Referenz ungeklärt) — Personen-Karten funktionieren auch so vertrauensbildend.
function PersonCard({ person }: { person: Person }) {
  const initials = person.name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('');

  return (
    <div
      data-reveal
      className="flex items-center gap-4 rounded-2xl border border-ink/8 bg-white p-6 shadow-[0_1px_2px_rgba(14,14,15,0.04),0_12px_32px_-12px_rgba(14,14,15,0.1)] transition-all duration-300 hover:-translate-y-1 hover:border-gold/40"
    >
      <span
        aria-hidden="true"
        className="font-display flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gold/12 text-lg text-gold-ink ring-2 ring-gold/25"
      >
        {initials}
      </span>
      <div>
        <h4 className="font-display text-lg leading-tight text-ink">
          {person.name}
        </h4>
        <p className="mt-0.5 text-sm text-ink/60">{person.role}</p>
      </div>
    </div>
  );
}

// variant 'teaser' = kompakter Home-Block mit Link auf /ueber-uns,
// variant 'page' = Geschäftsführung + komplettes Studio-Team.
export function Team({ variant = 'page' }: { variant?: 'teaser' | 'page' }) {
  const t = useTranslations('team');
  const leadership = t.raw('leadership') as Person[];
  const members = t.raw('members') as Person[];

  if (variant === 'teaser') {
    return (
      <section
        aria-labelledby="team-teaser-heading"
        className="paper-glow on-paper text-ink"
      >
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-24">
          <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
            <div>
              <SectionHeader
                kicker={t('kicker')}
                heading={t('teaser.heading')}
                tone="light"
                headingId="team-teaser-heading"
              />
              <p data-reveal className="mt-5 max-w-xl text-lg text-ink/70">
                {t('teaser.text')}
              </p>
              <Link
                href={SITE.routes.ueberUns}
                data-reveal
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-paper transition-transform hover:scale-[1.02]"
              >
                {t('teaser.cta')}
                <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {members.map((person) => (
                <PersonCard key={person.name} person={person} />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="team-heading"
      className="paper-glow on-paper text-ink"
    >
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
        <SectionHeader
          kicker={t('kicker')}
          heading={t('heading')}
          subheading={t('intro')}
          tone="light"
          headingId="team-heading"
        />

        <h3 data-reveal className="font-display mt-14 text-2xl text-ink">
          {t('leadershipHeading')}
        </h3>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {leadership.map((person) => (
            <PersonCard key={person.name} person={person} />
          ))}
        </div>

        <h3 data-reveal className="font-display mt-14 text-2xl text-ink">
          {t('membersHeading')}
        </h3>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {members.map((person) => (
            <PersonCard key={person.name} person={person} />
          ))}
        </div>
      </div>
    </section>
  );
}
