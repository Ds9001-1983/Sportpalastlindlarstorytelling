import { useTranslations } from 'next-intl';
import { ArrowRight, CalendarDays, ExternalLink } from 'lucide-react';
import { SITE } from '@/lib/site';
import { Link } from '@/i18n/navigation';
import { SectionHeader } from '@/components/section-header';

interface Slot {
  time: string;
  course: string;
}

interface Day {
  day: string;
  slots: Slot[];
}

interface Category {
  title: string;
  courses: string[];
}

// Kompletter Wochenkursplan der Referenzseite (Stand: story-spec / Juni 2026).
// variant 'teaser' = kompakter Home-Block mit Link auf /kurse#plan,
// variant 'page' = Kurswelten + voller Wochenplan.
export function Schedule({ variant = 'page' }: { variant?: 'teaser' | 'page' }) {
  const t = useTranslations('schedule');
  const tKurse = useTranslations('pageKurse');

  if (variant === 'teaser') {
    return (
      <section
        id="kurse"
        aria-labelledby="schedule-teaser-heading"
        className="relative bg-ink-soft text-paper"
      >
        <hr className="gold-hairline" />
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-24">
          <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
            <div>
              <SectionHeader
                kicker={t('kicker')}
                heading={t('teaser.heading')}
                tone="dark"
                headingId="schedule-teaser-heading"
              />
              <p data-reveal className="mt-5 max-w-xl text-lg text-paper/70">
                {t('teaser.text')}
              </p>
            </div>
            <div data-reveal className="flex md:justify-end">
              <Link
                href={SITE.routes.kursplan}
                className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3.5 text-sm font-semibold text-ink transition-colors hover:bg-gold-bright"
              >
                <CalendarDays className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                {t('teaser.cta')}
                <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
        <hr className="gold-hairline" />
      </section>
    );
  }

  const days = t.raw('days') as Day[];
  const categories = t.raw('categories') as Record<string, Category>;

  return (
    <section
      aria-labelledby="schedule-heading"
      className="paper-glow on-paper text-ink"
    >
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
        <SectionHeader
          kicker={t('kicker')}
          heading={t('heading')}
          subheading={t('subheading')}
          tone="light"
          headingId="schedule-heading"
        />

        {/* Kurswelten */}
        <h3 data-reveal className="font-display mt-14 text-2xl text-ink">
          {tKurse('categoriesHeading')}
        </h3>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(categories).map(([key, cat]) => (
            <div
              key={key}
              data-reveal
              className="rounded-2xl border border-ink/8 bg-white p-6 shadow-[0_1px_2px_rgba(14,14,15,0.04),0_12px_32px_-12px_rgba(14,14,15,0.1)]"
            >
              <h4 className="font-display text-lg text-ink">{cat.title}</h4>
              <ul className="mt-3 flex flex-wrap gap-2">
                {cat.courses.map((course) => (
                  <li
                    key={course}
                    className="rounded-full bg-gold/10 px-3 py-1 text-xs font-semibold text-gold-ink ring-1 ring-gold/15"
                  >
                    {course}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Wochenplan */}
        <h3
          id="plan"
          data-reveal
          className="font-display mt-16 text-2xl text-ink"
        >
          {t('planHeading')}
        </h3>
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {days.map((day) => (
            <div
              key={day.day}
              data-reveal
              className="rounded-2xl border border-ink/8 bg-white p-6 shadow-[0_1px_2px_rgba(14,14,15,0.04),0_12px_32px_-12px_rgba(14,14,15,0.1)]"
            >
              <h4 className="font-display border-b border-ink/8 pb-3 text-lg text-ink">
                {day.day}
              </h4>
              <dl className="mt-3 flex flex-col">
                {day.slots.map((slot, i) => (
                  <div
                    key={i}
                    className="flex items-baseline justify-between gap-3 py-1.5 text-sm"
                  >
                    <dt className="whitespace-nowrap tabular-nums text-ink/55">
                      {slot.time}
                    </dt>
                    <dd className="text-right font-semibold text-ink">
                      {slot.course}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>

        <div
          data-reveal
          className="mt-8 flex flex-col gap-4 rounded-2xl bg-ink p-7 text-paper sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="font-semibold">{t('asOf')}</p>
            <p className="mt-1 text-sm text-paper/65">{t('liveNote')}</p>
          </div>
          <a
            href={SITE.kursplanPdf}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-semibold text-ink transition-colors hover:bg-gold-bright"
          >
            {t('livePdfLabel')}
            <ExternalLink className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            <span className="sr-only"> ({t('newTab')})</span>
          </a>
        </div>
      </div>
    </section>
  );
}
