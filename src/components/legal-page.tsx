import { useTranslations } from 'next-intl';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { SITE } from '@/lib/site';

type LegalDoc = 'impressum' | 'datenschutz' | 'agb' | 'widerruf' | 'hausordnung';

// Eigenständiges, minimales Layout für die Rechtsseiten — bewusst ohne die
// Home-Anker des Hauptfooters, damit jeder Link von hier aus funktioniert.
// Das Gerüst verweist auf den rechtsverbindlichen Live-Text, bis er hier
// eingepflegt wird (Routen sind auf noindex gesetzt).
export function LegalPage({ doc }: { doc: LegalDoc }) {
  const t = useTranslations('legal');
  const tHero = useTranslations('hero');
  const liveUrl = SITE.legal[doc];

  return (
    <div className="flex min-h-screen flex-col bg-ink text-paper">
      <header className="border-b border-ink-line/60">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-5">
          <Link href="/" className="font-display text-lg tracking-tight">
            {tHero('brand')}
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-paper/70 transition-colors hover:text-paper"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            {t('backHome')}
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16 md:py-24">
        <h1 className="font-display text-[clamp(2rem,6vw,3.5rem)] leading-[0.95]">
          {t(`docs.${doc}.title`)}
        </h1>
        <p className="mt-5 text-lg text-paper/70">{t(`docs.${doc}.intro`)}</p>

        <div className="mt-10 rounded-2xl border border-ink-line/60 bg-ink-soft p-6 md:p-8">
          <p className="text-paper/75">{t('note')}</p>
          <a
            href={liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-semibold text-ink transition-colors hover:bg-gold-bright"
          >
            {t('liveButton')}
            <ExternalLink className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
            <span className="sr-only"> ({t('newTab')})</span>
          </a>
        </div>
      </main>

      <footer className="border-t border-ink-line/60">
        <div className="mx-auto flex max-w-3xl flex-wrap gap-x-6 gap-y-2 px-6 py-6 text-sm text-paper/50">
          <Link href="/impressum" className="hover:text-paper">{t('docs.impressum.title')}</Link>
          <Link href="/datenschutz" className="hover:text-paper">{t('docs.datenschutz.title')}</Link>
          <Link href="/agb" className="hover:text-paper">{t('docs.agb.title')}</Link>
          <Link href="/widerruf" className="hover:text-paper">{t('docs.widerruf.title')}</Link>
          <Link href="/hausordnung" className="hover:text-paper">{t('docs.hausordnung.title')}</Link>
        </div>
      </footer>
    </div>
  );
}
