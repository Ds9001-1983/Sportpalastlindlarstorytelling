import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { StickyCta } from '@/components/sticky-cta';
import { Reveal } from '@/components/reveal';

// Gemeinsame Shell für alle Inhalts-Unterseiten: gleicher Header/Footer wie die
// Home (Funnel bleibt überall erreichbar), aber ohne Promo-Banner — der gehört
// als Aktions-Hook auf die Startseite.
export function SubpageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main id="inhalt">{children}</main>
      <SiteFooter />
      <StickyCta />
      <Reveal />
    </>
  );
}
