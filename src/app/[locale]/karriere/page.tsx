import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { BriefcaseBusiness, Mail } from 'lucide-react';
import { SITE } from '@/lib/site';
import { subpageMetadata } from '@/lib/page-metadata';
import { SubpageShell } from '@/components/subpage-shell';
import { PageHero } from '@/components/page-hero';

interface Job {
  title: string;
  type: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return subpageMetadata(locale, 'pageKarriere', '/karriere');
}

export default async function KarrierePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('pageKarriere');
  const jobs = t.raw('jobs') as Job[];

  return (
    <SubpageShell>
      <PageHero
        kicker={t('hero.kicker')}
        heading={t('hero.heading')}
        intro={t('hero.intro')}
      />
      <section
        aria-labelledby="jobs-heading"
        className="paper-glow on-paper text-ink"
      >
        <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
          <h2
            id="jobs-heading"
            data-sweep
            className="font-display text-3xl text-ink md:text-4xl"
          >
            {t('jobsHeading')}
          </h2>
          <ul className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            {jobs.map((job) => (
              <li
                key={job.title}
                data-reveal
                className="flex items-start gap-4 rounded-2xl border border-ink/8 bg-white p-6 shadow-[0_1px_2px_rgba(14,14,15,0.04),0_12px_32px_-12px_rgba(14,14,15,0.1)]"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold/12 text-gold-ink ring-1 ring-gold/15">
                  <BriefcaseBusiness className="h-6 w-6" strokeWidth={1.5} aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-display text-xl leading-tight text-ink">
                    {job.title}
                  </h3>
                  <p className="mt-1 text-sm text-ink/60">{job.type}</p>
                </div>
              </li>
            ))}
          </ul>

          <div data-reveal className="mt-12 rounded-2xl bg-ink p-7 text-paper md:p-10">
            <h2 className="font-display text-2xl text-paper md:text-3xl">
              {t('applyHeading')}
            </h2>
            <p className="mt-3 max-w-2xl text-paper/75">{t('applyText')}</p>
            <p className="mt-2 text-sm text-paper/55">{t('applyAddress')}</p>
            <a
              href={`mailto:${SITE.emailCareer}`}
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3.5 text-sm font-semibold text-ink transition-colors hover:bg-gold-bright"
            >
              <Mail className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
              {t('applyCta')}: {SITE.emailCareer}
            </a>
          </div>
        </div>
      </section>
    </SubpageShell>
  );
}
