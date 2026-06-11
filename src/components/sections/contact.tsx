import { useTranslations } from 'next-intl';
import {
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Car,
  Waves,
} from 'lucide-react';
import { SITE, whatsappLink } from '@/lib/site';
import { SectionHeader } from '@/components/section-header';

interface Hour {
  days: string;
  time: string;
}

function HoursList({ hours }: { hours: Hour[] }) {
  return (
    <dl className="mt-4 divide-y divide-ink-line/40">
      {hours.map((h, i) => (
        <div key={i} className="flex justify-between gap-4 py-2 text-sm">
          <dt className="text-paper/70">{h.days}</dt>
          <dd className="whitespace-nowrap tabular-nums text-paper">{h.time}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Contact() {
  const t = useTranslations('contact');
  const hours = t.raw('hours') as Hour[];
  const saunaHours = t.raw('saunaHours') as Hour[];
  const meinerzhagenHours = t.raw('meinerzhagenHours') as Hour[];

  const locations = [
    { key: 'lindlar', maps: SITE.maps.lindlar, phone: SITE.phone },
    {
      key: 'meinerzhagen',
      maps: SITE.maps.meinerzhagen,
      phone: SITE.phoneMeinerzhagen,
    },
  ] as const;

  const cardClass =
    'rounded-2xl border border-ink/8 bg-white p-7 shadow-[0_1px_2px_rgba(14,14,15,0.04),0_12px_32px_-12px_rgba(14,14,15,0.1)] transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-[0_20px_48px_-16px_rgba(224,162,60,0.35)]';

  return (
    <section
      id="kontakt"
      aria-labelledby="contact-heading"
      className="paper-glow on-paper text-ink"
    >
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
        <SectionHeader
          kicker={t('kicker')}
          heading={t('heading')}
          tone="light"
          headingId="contact-heading"
        />

        <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-3">
          {/* Standorte */}
          <div className="lg:col-span-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {locations.map(({ key, maps, phone }) => (
              <div key={key} data-reveal className={cardClass}>
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/12 text-gold-ink ring-1 ring-gold/15">
                  <MapPin className="h-6 w-6" strokeWidth={1.5} aria-hidden="true" />
                </span>
                <h3 className="font-display mt-6 text-2xl">
                  {t(`locations.${key}.name`)}
                </h3>
                <p className="mt-1 text-ink/65">
                  {t(`locations.${key}.address`)}
                </p>
                <a
                  href={`tel:${phone}`}
                  className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-ink/75 hover:text-gold-ink"
                >
                  <Phone className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                  {t(`locations.${key}.phoneDisplay`)}
                </a>
                <br />
                <a
                  href={maps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-gold-ink hover:underline"
                >
                  {t('directionsLabel')}
                  <span className="sr-only"> ({t('newTab')})</span>
                </a>
              </div>
            ))}

            <div
              data-reveal
              className={`flex items-center gap-3 sm:col-span-2 ${cardClass}`}
            >
              <Car className="h-6 w-6 shrink-0 text-gold-ink" strokeWidth={1.5} aria-hidden="true" />
              <span className="text-ink/75">{t('parking')}</span>
            </div>

            {/* Kontakt-CTAs */}
            <div
              data-reveal
              className="flex flex-col gap-3 rounded-2xl bg-ink p-7 text-paper sm:col-span-2 sm:flex-row"
            >
              <a
                href={`tel:${SITE.phone}`}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-semibold text-ink transition-colors hover:bg-gold-bright"
              >
                <Phone className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                {t('phoneLabel')}: {t('phoneDisplay')}
              </a>
              <a
                href={whatsappLink(t('whatsappLabel'))}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-paper/25 px-5 py-3 text-sm font-semibold text-paper transition-colors hover:bg-paper/10"
              >
                <MessageCircle className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
                {t('whatsappLabel')}
                <span className="sr-only"> ({t('newTab')})</span>
              </a>
            </div>
          </div>

          {/* Öffnungszeiten: Studio Lindlar, Sauna, Meinerzhagen */}
          <div data-reveal className="rounded-2xl bg-ink p-7 text-paper">
            <div className="flex items-center gap-2 text-gold">
              <Clock className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
              <h3 className="font-display text-xl text-paper">
                {t('hoursHeading')}
              </h3>
            </div>
            <HoursList hours={hours} />

            <div className="mt-7 flex items-center gap-2 text-gold">
              <Waves className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
              <h3 className="font-display text-xl text-paper">
                {t('saunaHeading')}
              </h3>
            </div>
            <HoursList hours={saunaHours} />

            <div className="mt-7 flex items-center gap-2 text-gold">
              <Clock className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
              <h3 className="font-display text-xl text-paper">
                {t('meinerzhagenHoursHeading')}
              </h3>
            </div>
            <HoursList hours={meinerzhagenHours} />

            <p className="mt-7 border-t border-ink-line/40 pt-4 text-xs leading-relaxed text-paper/55">
              {t('holidayNote')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
