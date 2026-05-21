// Zentrale Brand-/Kontakt-Konstanten (aus sportpalast-lindlar.de übernommen).

export const SITE = {
  phone: '+492266470206',
  phoneDisplay: '+49 2266 470206',
  whatsapp: '4915563183509', // Physio-Buchung
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
  superbrand: 'https://superbrand.marketing',
} as const;

export function whatsappLink(text: string) {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;
}
