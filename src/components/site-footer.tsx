import { useTranslations } from 'next-intl';
import { SITE } from '@/lib/site';
import {
  InstagramIcon,
  FacebookIcon,
  YoutubeIcon,
} from '@/components/social-icons';

export function SiteFooter() {
  const t = useTranslations('footer');
  const tHero = useTranslations('hero');
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-paper">
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-10">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="font-display text-2xl">{tHero('brand')}</div>
            <p className="mt-2 max-w-sm text-paper/60">{t('claim')}</p>
          </div>
          <div className="flex items-center gap-4">
            <a
              href={SITE.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="rounded-full border border-ink-line p-3 text-paper/70 transition-colors hover:border-gold hover:text-gold"
            >
              <InstagramIcon className="h-5 w-5" />
            </a>
            <a
              href={SITE.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="rounded-full border border-ink-line p-3 text-paper/70 transition-colors hover:border-gold hover:text-gold"
            >
              <FacebookIcon className="h-5 w-5" />
            </a>
            <a
              href={SITE.social.youtube}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="rounded-full border border-ink-line p-3 text-paper/70 transition-colors hover:border-gold hover:text-gold"
            >
              <YoutubeIcon className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-ink-line/60 pt-6 text-sm text-paper/50 md:flex-row md:items-center md:justify-between">
          <div className="flex gap-6">
            <span>
              © {year} {tHero('brand')}. {t('rights')}
            </span>
            <a href="#" className="hover:text-paper">
              {t('imprint')}
            </a>
            <a href="#" className="hover:text-paper">
              {t('privacy')}
            </a>
          </div>
          <a
            href={SITE.superbrand}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gold"
          >
            {t('madeWith')}
          </a>
        </div>
      </div>
    </footer>
  );
}
