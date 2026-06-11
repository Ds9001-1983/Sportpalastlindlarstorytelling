// Zentrale Brand-/Kontakt-Konstanten (aus sportpalast-lindlar.de übernommen).

const ORIGIN = 'https://www.sportpalast-lindlar.de';

export const SITE = {
  phone: '+492266470206',
  phoneDisplay: '+49 2266 470206',
  phonePhysio: '+492266470207',
  phonePhysioDisplay: '+49 2266 470207',
  phoneMeinerzhagen: '+49235412774',
  phoneMeinerzhagenDisplay: '+49 2354 12774',
  email: 'info@sportpalast-lindlar.de',
  emailCareer: 'bewerbung@sportpalast-lindlar.de',
  // ACHTUNG: Diese WhatsApp-Nummer ist der PHYSIO-Buchungskanal.
  // Nicht für Mitgliedschafts-/Probetrainings-Leads verwenden (falsches Team).
  whatsapp: '4915563183509',
  address: {
    lindlar: {
      street: 'Schlosserstraße 33',
      zip: '51789',
      city: 'Lindlar',
    },
    // Firmensitz laut Impressum; exakte Studio-Adresse Meinerzhagen ist auf
    // der Referenz nicht ausgewiesen — vor Go-live verifizieren.
    meinerzhagen: {
      street: 'Siepener Weg 10',
      zip: '58540',
      city: 'Meinerzhagen',
    },
  },
  maps: {
    lindlar:
      'https://www.google.com/maps/search/?api=1&query=Sportpalast+Schlosserstra%C3%9Fe+33+51789+Lindlar',
    meinerzhagen:
      'https://www.google.com/maps/search/?api=1&query=Sportpalast+Meinerzhagen',
  },
  social: {
    instagram: 'https://www.instagram.com/sportpalast.lindlar/',
    facebook: 'https://www.facebook.com/FitAndFunSportpalast',
    youtube: 'https://www.youtube.com/@SportpalastLindlarMeinerzhagen',
  },
  // Interne Routen dieser Site (relative Pfade; next-intl Link ergänzt die Locale).
  routes: {
    preise: '/preise',
    kurse: '/kurse',
    kursplan: '/kurse#plan',
    ueberUns: '/ueber-uns',
    physio: '/physiotherapie',
    reha: '/rehasport',
    firmenfitness: '/firmenfitness',
    karriere: '/karriere',
  },
  // Funnel-Ziele im externen Buchungssystem (MagicLine/eVERsports) — bleiben
  // extern, bis ein eigenes Buchungs-Frontend existiert.
  links: {
    trial: `${ORIGIN}/probetraining-vereinbaren/`,
    join: `${ORIGIN}/mitglied-werden/`,
  },
  // Live-Kursplan (PDF) der Referenz — verlinkt von /kurse als „aktuelle Fassung".
  kursplanPdf: `${ORIGIN}/kursplan/`,
  legal: {
    // AGB/Widerruf liegen auf der externen Konzern-Domain; Volltexte werden
    // separat beschafft — bis dahin Fallback auf die Live-Texte.
    agb: 'https://www.sportpalast-fitness.de/agb/',
    widerruf: 'https://www.sportpalast-fitness.de/widerrufsbelehrung/',
    kuendigung:
      'https://public.magicline.com/#/contractTermination?tenant=sportpalast',
  },
  superbrand: 'https://superbrand.marketing',
} as const;

export function whatsappLink(text: string) {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;
}
