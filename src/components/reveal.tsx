'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/*
  Zentraler Reveal-Layer für alle Content-Sektionen.
  Eine einzige Client-Komponente (in page.tsx gemountet) verdrahtet
  dokumentweit Daten-Attribute — die Sektionen selbst bleiben Server-Komponenten.

  API (per Attribut):
    data-reveal              → Fade + Aufstieg, gestaffelt via ScrollTrigger.batch
    data-sweep               → Headline-Reveal per clipPath-Sweep (plugin-frei)
    data-countup data-to=""  → Zahl zählt hoch (data-suffix, data-decimals optional)

  Prinzipien:
   • Initial-States werden NUR im no-preference-Branch per gsap.set gesetzt
     (nie via CSS opacity:0) → Progressive Enhancement, kein leerer Bildschirm
     bei deaktiviertem JS, reduced-motion oder für Crawler.
   • gsap.context + matchMedia → sauberes Cleanup, HMR-/Locale-Wechsel-fest.
   • ScrollTrigger.refresh() nach fonts.ready, da die gepinnten Story-Rooms
     (pinSpacing:false) die Dokumenthöhe stark verändern.
*/
export function Reveal() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          desktop: '(prefers-reduced-motion: no-preference) and (min-width: 768px)',
          mobile: '(prefers-reduced-motion: no-preference) and (max-width: 767px)',
        },
        (context) => {
          const isDesktop = !!context.conditions?.desktop;
          const dist = isDesktop ? 36 : 22;
          const dur = isDesktop ? 0.9 : 0.7;

          // 1) Generische Reveals (Karten, Blöcke) — gestaffelt pro Sichtbar-Gruppe
          const reveals = gsap.utils.toArray<HTMLElement>('[data-reveal]');
          if (reveals.length) {
            gsap.set(reveals, { y: dist, autoAlpha: 0 });
            ScrollTrigger.batch('[data-reveal]', {
              start: 'top 85%',
              once: true,
              onEnter: (batch) =>
                gsap.to(batch, {
                  y: 0,
                  autoAlpha: 1,
                  duration: dur,
                  ease: 'power3.out',
                  stagger: 0.08,
                  overwrite: true,
                }),
            });
          }

          // 2) Headlines — clipPath-Sweep von links
          const sweeps = gsap.utils.toArray<HTMLElement>('[data-sweep]');
          sweeps.forEach((el) => {
            gsap.set(el, { clipPath: 'inset(0 100% 0 0)', y: 8 });
            ScrollTrigger.create({
              trigger: el,
              start: 'top 88%',
              once: true,
              onEnter: () =>
                gsap.to(el, {
                  clipPath: 'inset(0 0% 0 0)',
                  y: 0,
                  duration: 1,
                  ease: 'power4.out',
                }),
            });
          });

          // 3) Count-up-Zahlen (Stat-Band, Trust-Werte)
          const counters = gsap.utils.toArray<HTMLElement>('[data-countup]');
          counters.forEach((el) => {
            const to = parseFloat(el.dataset.to ?? '0');
            const decimals = parseInt(el.dataset.decimals ?? '0', 10);
            const suffix = el.dataset.suffix ?? '';
            const prefix = el.dataset.prefix ?? '';
            const fmt = new Intl.NumberFormat('de-DE', {
              minimumFractionDigits: decimals,
              maximumFractionDigits: decimals,
            });
            const proxy = { v: 0 };
            ScrollTrigger.create({
              trigger: el,
              start: 'top 90%',
              once: true,
              onEnter: () =>
                gsap.to(proxy, {
                  v: to,
                  duration: 1.6,
                  ease: 'power2.out',
                  onUpdate: () => {
                    el.textContent = prefix + fmt.format(proxy.v) + suffix;
                  },
                }),
            });
          });

          return () => {
            // matchMedia-Cleanup: gsap.set-Reverts übernimmt der Kontext
          };
        },
      );

      // Layout nach Font-Load neu vermessen (Story-Rooms ändern die Höhe stark)
      ScrollTrigger.refresh();
      if (typeof document !== 'undefined' && document.fonts?.ready) {
        document.fonts.ready.then(() => ScrollTrigger.refresh());
      }
    });

    return () => ctx.revert();
  }, []);

  return null;
}
