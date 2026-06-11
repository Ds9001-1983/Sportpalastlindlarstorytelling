import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { subpageMetadata } from '@/lib/page-metadata';
import { SubpageShell } from '@/components/subpage-shell';
import { PageHero } from '@/components/page-hero';
import { Schedule } from '@/components/sections/schedule';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return subpageMetadata(locale, 'pageKurse', '/kurse');
}

export default async function KursePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('pageKurse');

  return (
    <SubpageShell>
      <PageHero
        kicker={t('hero.kicker')}
        heading={t('hero.heading')}
        intro={t('hero.intro')}
      />
      <Schedule variant="page" />
    </SubpageShell>
  );
}
