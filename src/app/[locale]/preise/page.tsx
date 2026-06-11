import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { subpageMetadata } from '@/lib/page-metadata';
import { SubpageShell } from '@/components/subpage-shell';
import { PageHero } from '@/components/page-hero';
import { Pricing } from '@/components/sections/pricing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return subpageMetadata(locale, 'pagePreise', '/preise');
}

export default async function PreisePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('pagePreise');
  const steps = t.raw('registerSteps') as string[];

  return (
    <SubpageShell>
      <PageHero
        kicker={t('hero.kicker')}
        heading={t('hero.heading')}
        intro={t('hero.intro')}
      />
      <Pricing variant="page" />
      <section
        aria-labelledby="register-heading"
        className="relative bg-ink text-paper"
      >
        <hr className="gold-hairline" />
        <div className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-24">
          <h2
            id="register-heading"
            data-sweep
            className="font-display text-3xl text-paper md:text-4xl"
          >
            {t('registerHeading')}
          </h2>
          <ol className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            {steps.map((step, i) => (
              <li
                key={i}
                data-reveal
                className="rounded-2xl border border-ink-line/60 bg-ink-soft p-6"
              >
                <span className="font-display text-3xl text-gold">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="mt-3 text-paper/75">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </SubpageShell>
  );
}
