import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { subpageMetadata } from '@/lib/page-metadata';
import { SubpageShell } from '@/components/subpage-shell';
import { PageHero } from '@/components/page-hero';
import { Team } from '@/components/sections/team';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return subpageMetadata(locale, 'pageUeberUns', '/ueber-uns');
}

export default async function UeberUnsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('pageUeberUns');
  const story = t.raw('story') as string[];

  return (
    <SubpageShell>
      <PageHero
        kicker={t('hero.kicker')}
        heading={t('hero.heading')}
        intro={t('hero.intro')}
      />
      <section className="relative bg-ink text-paper">
        <div className="mx-auto max-w-7xl px-6 pb-20 md:px-10 md:pb-24">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {story.map((paragraph, i) => (
              <p
                key={i}
                data-reveal
                className="text-base leading-relaxed text-paper/75"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
        <hr className="gold-hairline" />
      </section>
      <Team variant="page" />
    </SubpageShell>
  );
}
