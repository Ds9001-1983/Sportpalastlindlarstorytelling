// Zentrale Brand-/Kontakt-Konstanten (aus sportpalast-lindlar.de übernommen).

const ORIGIN = 'https://www.sportpalast-lindlar.de';

export const SITE = {
  phone: '+492266470206',
  phoneDisplay: '+49 2266 470206',
  // ACHTUNG: Diese WhatsApp-Nummer ist der PHYSIO-Buchungskanal.
  // Nicht für Mitgliedschafts-/Probetrainings-Leads verwenden (falsches Team).
  whatsapp: '4915563183509',
  maps: {
    lindlar: 'https://www.google.com/maps/search/?api=1&query=Sportpalast+Lindlar',
    meinerzhagen:
      'https://www.google.com/maps/search/?api=1&query=Sportpalast+Meinerzhagen',
  },
  social: {
    instagram: 'https://www.instagram.com/sportpalast.lindlar/',
    facebook: 'https://www.facebook.com/FitAndFunSportpalast',
    youtube: 'https://www.youtube.com/@SportpalastLindlarMeinerzhagen',
  },
  // Funnel-/Inhalts-Ziele auf der bestehenden Live-Seite. Beim Domain-Umzug
  // (wenn diese Site live geht) auf interne Routen umstellen.
  links: {
    trial: `${ORIGIN}/probetraining-vereinbaren/`,
    join: `${ORIGIN}/mitglied-werden/`,
    kursplan: `${ORIGIN}/kursplan/`,
    ueberUns: `${ORIGIN}/ueber-uns/`,
  },
  // Rechtlich erforderliche Seiten: verweisen vorerst auf die Live-Texte,
  // bis die internen Routen (/impressum etc.) mit verbindlichem Text befüllt sind.
  legal: {
    impressum: `${ORIGIN}/impressum/`,
    datenschutz: `${ORIGIN}/datenschutz/`,
    agb: 'https://www.sportpalast-fitness.de/agb/',
    widerruf: 'https://www.sportpalast-fitness.de/widerrufsbelehrung/',
    hausordnung: `${ORIGIN}/hausordnung/`,
    kuendigung:
      'https://public.magicline.com/#/contractTermination?tenant=sportpalast',
  },
  superbrand: 'https://superbrand.marketing',
} as const;

export function whatsappLink(text: string) {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;
}
