import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Phone } from 'lucide-react';
import { SITE } from '@/lib/site';
import { subpageMetadata } from '@/lib/page-metadata';
import { SubpageShell } from '@/components/subpage-shell';
import { PageHero } from '@/components/page-hero';

interface Variant {
  name: string;
  text: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return subpageMetadata(locale, 'pageReha', '/rehasport');
}

export default async function RehasportPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('pageReha');
  const variants = t.raw('variants') as Variant[];
  const steps = t.raw('steps') as string[];
  const facts = t.raw('facts') as string[];

  return (
    <SubpageShell>
      <PageHero
        kicker={t('hero.kicker')}
        heading={t('hero.heading')}
        intro={t('hero.intro')}
      />
      <section
        aria-labelledby="reha-variants-heading"
        className="paper-glow on-paper text-ink"
      >
        <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
          <h2
            id="reha-variants-heading"
            data-sweep
            className="font-display text-3xl text-ink md:text-4xl"
          >
            {t('variantsHeading')}
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            {variants.map((variant) => (
              <article
                key={variant.name}
                data-reveal
                className="rounded-2xl border border-ink/8 bg-white p-7 shadow-[0_1px_2px_rgba(14,14,15,0.04),0_12px_32px_-12px_rgba(14,14,15,0.1)]"
              >
                <h3 className="font-display text-2xl text-ink">
                  {variant.name}
                </h3>
                <p className="mt-3 text-ink/70">{variant.text}</p>
              </article>
            ))}
          </div>

          <h2 data-sweep className="font-display mt-16 text-3xl text-ink md:text-4xl">
            {t('stepsHeading')}
          </h2>
          <ol className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            {steps.map((step, i) => (
              <li
                key={i}
                data-reveal
                className="rounded-2xl border border-ink/8 bg-white p-6 shadow-[0_1px_2px_rgba(14,14,15,0.04),0_12px_32px_-12px_rgba(14,14,15,0.1)]"
              >
                <span className="font-display text-3xl text-gold-ink">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="mt-3 text-ink/75">{step}</p>
              </li>
            ))}
          </ol>

          <div data-reveal className="mt-12 rounded-2xl bg-ink p-7 text-paper md:p-10">
            <h2 className="font-display text-2xl text-paper md:text-3xl">
              {t('factsHeading')}
            </h2>
            <ul className="mt-5 flex flex-col gap-3 text-paper/80">
              {facts.map((fact, i) => (
                <li key={i}>{fact}</li>
              ))}
            </ul>
            <a
              href={`tel:${SITE.phone}`}
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3.5 text-sm font-semibold text-ink transition-colors hover:bg-gold-bright"
            >
              <Phone className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
              {t('ctaCall')}: {SITE.phoneDisplay}
            </a>
          </div>
        </div>
      </section>
    </SubpageShell>
  );
}
