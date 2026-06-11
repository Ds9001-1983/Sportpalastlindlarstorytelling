import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Check, Phone } from 'lucide-react';
import { SITE } from '@/lib/site';
import { subpageMetadata } from '@/lib/page-metadata';
import { SubpageShell } from '@/components/subpage-shell';
import { PageHero } from '@/components/page-hero';

interface Model {
  name: string;
  text: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return subpageMetadata(locale, 'pageFirmenfitness', '/firmenfitness');
}

export default async function FirmenfitnessPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('pageFirmenfitness');
  const models = t.raw('models') as Model[];
  const benefits = t.raw('benefits') as string[];

  return (
    <SubpageShell>
      <PageHero
        kicker={t('hero.kicker')}
        heading={t('hero.heading')}
        intro={t('hero.intro')}
      />
      <section
        aria-labelledby="corporate-models-heading"
        className="paper-glow on-paper text-ink"
      >
        <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
          <h2
            id="corporate-models-heading"
            data-sweep
            className="font-display text-3xl text-ink md:text-4xl"
          >
            {t('modelsHeading')}
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            {models.map((model) => (
              <article
                key={model.name}
                data-reveal
                className="rounded-2xl border border-ink/8 bg-white p-7 shadow-[0_1px_2px_rgba(14,14,15,0.04),0_12px_32px_-12px_rgba(14,14,15,0.1)]"
              >
                <h3 className="font-display text-2xl text-ink">{model.name}</h3>
                <p className="mt-3 text-ink/70">{model.text}</p>
              </article>
            ))}
          </div>

          <div data-reveal className="mt-12 rounded-2xl bg-ink p-7 text-paper md:p-10">
            <h2 className="font-display text-2xl text-paper md:text-3xl">
              {t('benefitsHeading')}
            </h2>
            <ul className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
              {benefits.map((benefit, i) => (
                <li key={i} className="flex items-start gap-3 text-paper/85">
                  <Check
                    className="mt-1 h-4 w-4 shrink-0 text-gold"
                    strokeWidth={2.5}
                    aria-hidden="true"
                  />
                  <span>{benefit}</span>
                </li>
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
