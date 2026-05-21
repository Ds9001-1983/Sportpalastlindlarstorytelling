import { useTranslations } from 'next-intl';
import { Phone, MessageCircle, MapPin, Clock, Car } from 'lucide-react';
import { SITE, whatsappLink } from '@/lib/site';

interface Hour {
  days: string;
  time: string;
}

export function Contact() {
  const t = useTranslations('contact');
  const hours = t.raw('hours') as Hour[];

  const locations = [
    { key: 'lindlar', maps: SITE.maps.lindlar },
    { key: 'meinerzhagen', maps: SITE.maps.meinerzhagen },
  ] as const;

  return (
    <section id="kontakt" className="bg-paper text-ink">
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-ink">
          {t('kicker')}
        </span>
        <h2 className="font-display mt-4 max-w-3xl text-[clamp(2rem,5vw,4rem)]">
          {t('heading')}
        </h2>

        <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* Standorte */}
          <div className="lg:col-span-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {locations.map(({ key, maps }) => (
              <div
                key={key}
                className="rounded-2xl border border-ink/10 bg-white/60 p-7"
              >
                <MapPin
                  className="h-6 w-6 text-gold-ink"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <h3 className="font-display mt-4 text-2xl">
                  {t(`locations.${key}.name`)}
                </h3>
                <p className="mt-1 text-ink/65">
                  {t(`locations.${key}.address`)}
                </p>
                <a
                  href={maps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-gold-ink hover:underline"
                >
                  {t('directionsLabel')}
                </a>
              </div>
            ))}

            <div className="flex items-center gap-3 rounded-2xl border border-ink/10 bg-white/60 p-7 sm:col-span-2">
              <Car className="h-6 w-6 text-gold-ink" strokeWidth={1.5} aria-hidden="true" />
              <span className="text-ink/75">{t('parking')}</span>
            </div>
          </div>

          {/* Öffnungszeiten + Kontakt */}
          <div className="rounded-2xl bg-ink p-7 text-paper">
            <div className="flex items-center gap-2 text-gold">
              <Clock className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
              <h3 className="font-display text-xl text-paper">
                {t('hoursHeading')}
              </h3>
            </div>
            <dl className="mt-5 space-y-2">
              {hours.map((h, i) => (
                <div key={i} className="flex justify-between gap-4 text-sm">
                  <dt className="text-paper/70">{h.days}</dt>
                  <dd className="tabular-nums text-paper">{h.time}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 flex flex-col gap-3">
              <a
                href={`tel:${SITE.phone}`}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-semibold text-ink transition-colors hover:bg-gold-bright"
              >
                <Phone className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                {t('phoneLabel')}: {t('phoneDisplay')}
              </a>
              <a
                href={whatsappLink(t('whatsappLabel'))}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-paper/25 px-5 py-3 text-sm font-semibold text-paper transition-colors hover:bg-paper/10"
              >
                <MessageCircle className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                {t('whatsappLabel')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
