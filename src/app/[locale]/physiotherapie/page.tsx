import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Check, Phone, MessageCircle } from 'lucide-react';
import { SITE, whatsappLink } from '@/lib/site';
import { subpageMetadata } from '@/lib/page-metadata';
import { SubpageShell } from '@/components/subpage-shell';
import { PageHero } from '@/components/page-hero';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return subpageMetadata(locale, 'pagePhysio', '/physiotherapie');
}

export default async function PhysiotherapiePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('pagePhysio');
  const services = t.raw('services') as string[];

  return (
    <SubpageShell>
      <PageHero
        kicker={t('hero.kicker')}
        heading={t('hero.heading')}
        intro={t('hero.intro')}
      />
      <section
        aria-labelledby="physio-services-heading"
        className="paper-glow on-paper text-ink"
      >
        <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
          <h2
            id="physio-services-heading"
            data-sweep
            className="font-display text-3xl text-ink md:text-4xl"
          >
            {t('servicesHeading')}
          </h2>
          <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {services.map((service, i) => (
              <li
                key={i}
                data-reveal
                className="flex items-start gap-3 rounded-2xl border border-ink/8 bg-white p-5 shadow-[0_1px_2px_rgba(14,14,15,0.04),0_12px_32px_-12px_rgba(14,14,15,0.1)]"
              >
                <Check
                  className="mt-1 h-4 w-4 shrink-0 text-gold-ink"
                  strokeWidth={2.5}
                  aria-hidden="true"
                />
                <span className="text-ink/80">{service}</span>
              </li>
            ))}
          </ul>
          <div data-reveal className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            <p className="rounded-2xl bg-gold/10 p-5 font-semibold text-gold-ink ring-1 ring-gold/20">
              {t('insuranceNote')}
            </p>
            <p className="rounded-2xl border border-ink/8 bg-white p-5 text-ink/70">
              {t('sessionNote')}
            </p>
          </div>

          <div data-reveal className="mt-12 rounded-2xl bg-ink p-7 text-paper md:p-10">
            <h2 className="font-display text-2xl text-paper md:text-3xl">
              {t('contactHeading')}
            </h2>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href={`tel:${SITE.phonePhysio}`}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3.5 text-sm font-semibold text-ink transition-colors hover:bg-gold-bright"
              >
                <Phone className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                {t('phoneLabel')}: {SITE.phonePhysioDisplay}
              </a>
              <a
                href={whatsappLink(t('whatsappText'))}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-paper/25 px-6 py-3.5 text-sm font-semibold text-paper transition-colors hover:bg-paper/10"
              >
                <MessageCircle className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                {t('whatsappLabel')}
              </a>
            </div>
          </div>
        </div>
      </section>
    </SubpageShell>
  );
}
