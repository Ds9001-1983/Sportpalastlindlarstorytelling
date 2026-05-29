import { useTranslations } from 'next-intl';
import { SITE } from '@/lib/site';
import { Link } from '@/i18n/navigation';
import {
  InstagramIcon,
  FacebookIcon,
  YoutubeIcon,
} from '@/components/social-icons';

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

export function SiteFooter() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const tHero = useTranslations('hero');
  const year = new Date().getFullYear();

  const columns: { title: string; links: FooterLink[] }[] = [
    {
      title: t('discover'),
      links: [
        { label: tNav('goals'), href: '#ziele' },
        { label: tNav('offers'), href: '#angebot' },
        { label: t('kursplan'), href: SITE.links.kursplan, external: true },
        { label: tNav('contact'), href: '#kontakt' },
      ],
    },
    {
      title: t('membershipCol'),
      links: [
        { label: t('trial'), href: SITE.links.trial, external: true },
        { label: tNav('membership'), href: SITE.links.join, external: true },
        { label: t('about'), href: SITE.links.ueberUns, external: true },
      ],
    },
    {
      title: t('legalCol'),
      links: [
        { label: t('imprint'), href: '/impressum' },
        { label: t('privacy'), href: '/datenschutz' },
        { label: t('terms'), href: '/agb' },
        { label: t('withdrawal'), href: '/widerruf' },
        { label: t('houseRules'), href: '/hausordnung' },
        { label: t('cancel'), href: SITE.legal.kuendigung, external: true },
      ],
    },
  ];

  const socials = [
    { href: SITE.social.instagram, label: 'Instagram', Icon: InstagramIcon },
    { href: SITE.social.facebook, label: 'Facebook', Icon: FacebookIcon },
    { href: SITE.social.youtube, label: 'YouTube', Icon: YoutubeIcon },
  ];

  return (
    <footer className="relative overflow-hidden bg-ink text-paper">
      <hr className="gold-hairline" />

      {/* Überdimensionierte Wortmarke als Hintergrund-Statement */}
      <span
        aria-hidden="true"
        className="font-display pointer-events-none absolute -bottom-4 left-1/2 w-full -translate-x-1/2 select-none text-center text-[clamp(4rem,18vw,15rem)] leading-none whitespace-nowrap text-paper/4"
      >
        Sportpalast
      </span>

      <div className="relative mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div data-reveal className="md:col-span-3">
            <div className="font-display text-2xl">{tHero('brand')}</div>
            <p className="mt-2 max-w-xs text-paper/60">{t('claim')}</p>
            <div className="mt-6 flex items-center gap-4">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="rounded-full border border-ink-line p-3 text-paper/70 transition-colors hover:border-gold hover:text-gold"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <nav
              key={col.title}
              data-reveal
              aria-label={col.title}
              className="md:col-span-3"
            >
              <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                {col.title}
              </h2>
              <ul className="mt-4 flex flex-col gap-2.5 text-sm text-paper/70">
                {col.links.map((link) =>
                  link.external ? (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors hover:text-paper"
                      >
                        {link.label}
                        <span className="sr-only"> ({t('newTab')})</span>
                      </a>
                    </li>
                  ) : link.href.startsWith('#') ? (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="transition-colors hover:text-paper"
                      >
                        {link.label}
                      </a>
                    </li>
                  ) : (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="transition-colors hover:text-paper"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-ink-line/60 pt-6 text-sm text-paper/50 md:flex-row md:items-center md:justify-between">
          <span>
            © {year} {tHero('brand')}. {t('rights')}
          </span>
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
