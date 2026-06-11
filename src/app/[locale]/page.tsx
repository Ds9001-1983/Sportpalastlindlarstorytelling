import { setRequestLocale, getTranslations } from 'next-intl/server';
import { ROOMS } from '@/lib/rooms';
import { SITE } from '@/lib/site';
import { StoryRoom } from '@/components/story-room';
import { MobileStory } from '@/components/mobile-story';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { PromoBanner } from '@/components/promo-banner';
import { StickyCta } from '@/components/sticky-cta';
import { Reveal } from '@/components/reveal';
import { Stats } from '@/components/sections/stats';
import { Goals } from '@/components/sections/goals';
import { Offers } from '@/components/sections/offers';
import { Schedule } from '@/components/sections/schedule';
import { SocialProof } from '@/components/sections/social-proof';
import { Pricing } from '@/components/sections/pricing';
import { MembershipCta } from '@/components/sections/membership-cta';
import { Team } from '@/components/sections/team';
import { Faq } from '@/components/sections/faq';
import { Contact } from '@/components/sections/contact';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('hero');
  const tMeta = await getTranslations('meta');
  const tFaq = await getTranslations('faq');

  const rooms = ROOMS.map((r, i) => ({
    ...r,
    index: i,
    beat: t(`rooms.${r.id}.beat`),
    subline: t(`rooms.${r.id}.subline`),
  }));

  // Structured Data: SportsActivityLocation + ExerciseGym (beide Standorte)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': ['SportsActivityLocation', 'ExerciseGym'],
    name: 'Sportpalast Lindlar',
    description: tMeta('description'),
    url: 'https://www.sportpalast-lindlar.de',
    telephone: SITE.phone,
    email: SITE.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.address.lindlar.street,
      postalCode: SITE.address.lindlar.zip,
      addressLocality: SITE.address.lindlar.city,
      addressRegion: 'NRW',
      addressCountry: 'DE',
    },
    priceRange: '€€',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Friday'],
        opens: '08:00',
        closes: '22:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Tuesday', 'Wednesday', 'Thursday'],
        opens: '07:00',
        closes: '22:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday', 'Sunday'],
        opens: '09:00',
        closes: '19:00',
      },
    ],
    containsPlace: {
      '@type': 'ExerciseGym',
      name: 'Sportpalast Meinerzhagen',
      telephone: SITE.phoneMeinerzhagen,
      address: {
        '@type': 'PostalAddress',
        streetAddress: SITE.address.meinerzhagen.street,
        postalCode: SITE.address.meinerzhagen.zip,
        addressLocality: SITE.address.meinerzhagen.city,
        addressRegion: 'NRW',
        addressCountry: 'DE',
      },
    },
    sameAs: [SITE.social.instagram, SITE.social.facebook, SITE.social.youtube],
  };

  // FAQPage-Schema aus den FAQ-Inhalten
  const faqItems = tFaq.raw('items') as { q: string; a: string }[];
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <PromoBanner />
      <SiteHeader />
      <main id="inhalt">
        {/* Genau eine H1 für die ganze Seite (Story-Beats bleiben H2). */}
        <h1 className="sr-only">{t('h1')}</h1>

        {/* Desktop: Frame-Sequence-Scrollytelling (gepinnte Rooms) */}
        <div className="hidden md:block">
          {rooms.map((r) => (
            <StoryRoom
              key={r.id}
              framesBase={`/frames/${r.assetId}`}
              index={r.index}
              total={rooms.length}
              beat={r.beat}
              subline={r.subline}
              heightVh={r.heightVh}
              tint={r.tint}
              scrollHint={r.index === 0 ? t('scrollHint') : undefined}
            />
          ))}
        </div>

        {/* Mobile: Variante B (statische Keyframes, kein Scrub) */}
        <MobileStory rooms={rooms} />

        {/* Content-Module nach der Hero (CTA delayed_after_arrival):
            Stats → Ziele → Angebot → Kursplan-Teaser → Social Proof →
            Preise → Mitglieds-CTA → Team-Teaser → FAQ → Kontakt */}
        <Stats />
        <Goals />
        <Offers />
        <Schedule variant="teaser" />
        <SocialProof />
        <Pricing variant="home" />
        <MembershipCta />
        <Team variant="teaser" />
        <Faq />
        <Contact />
      </main>
      <SiteFooter />

      {/* Sticky Mobile-CTA + zentraler Scroll-Reveal-Layer */}
      <StickyCta />
      <Reveal />
    </>
  );
}
