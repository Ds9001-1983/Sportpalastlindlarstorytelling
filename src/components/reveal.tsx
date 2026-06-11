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
          const dist = isDesktop ? 20 : 12;
          const dur = isDesktop ? 0.5 : 0.4;
          // Elemente, die beim Trigger bereits tiefer als 60% im Viewport stehen
          // (Anker-Sprung, Reload mit Scroll-Restore, sehr schnelles Scrollen),
          // hat der Nutzer schon im Blick → Sofort-Reveal statt Entrance.
          const DEEP = 0.6;

          // 1) Generische Reveals (Karten, Blöcke) — gestaffelt pro Sichtbar-Gruppe
          const reveals = gsap.utils.toArray<HTMLElement>('[data-reveal]');
          if (reveals.length) {
            gsap.set(reveals, { y: dist, autoAlpha: 0 });
            ScrollTrigger.batch('[data-reveal]', {
              start: 'top 92%',
              once: true,
              interval: 0.06,
              batchMax: 6,
              onEnter: (batch) => {
                const vh = window.innerHeight;
                const deep: Element[] = [];
                const fresh: Element[] = [];
                for (const el of batch) {
                  (el.getBoundingClientRect().top < vh * DEEP
                    ? deep
                    : fresh
                  ).push(el);
                }
                if (deep.length) {
                  // Sofort statt Mini-Tween: nach einem Sprung gibt es keinen
                  // Bewegungskontext, und auf schwachen Geräten (RAF-Starvation)
                  // darf hier nichts "hängen".
                  gsap.set(deep, { y: 0, autoAlpha: 1, overwrite: true });
                }
                if (fresh.length) {
                  gsap.to(fresh, {
                    y: 0,
                    autoAlpha: 1,
                    duration: dur,
                    ease: 'power3.out',
                    stagger: 0.05,
                    overwrite: true,
                  });
                }
              },
            });
          }

          // 2) Headlines — clipPath-Sweep von links
          const sweeps = gsap.utils.toArray<HTMLElement>('[data-sweep]');
          sweeps.forEach((el) => {
            gsap.set(el, { clipPath: 'inset(0 100% 0 0)', y: 8 });
            ScrollTrigger.create({
              trigger: el,
              start: 'top 92%',
              once: true,
              onEnter: () =>
                gsap.to(el, {
                  clipPath: 'inset(0 0% 0 0)',
                  y: 0,
                  duration: 0.8,
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
              start: 'top 95%',
              once: true,
              onEnter: (self) => {
                // Anker-Sprung/Restore: Element steht schon mittig oder die
                // Scroll-Velocity ist hoch → verkürzt zählen.
                const jumped =
                  Math.abs(self.getVelocity()) > 3000 ||
                  el.getBoundingClientRect().top < window.innerHeight * 0.5;
                gsap.to(proxy, {
                  v: to,
                  duration: jumped ? 0.4 : 0.8,
                  ease: 'power3.out',
                  onUpdate: () => {
                    el.textContent = prefix + fmt.format(proxy.v) + suffix;
                  },
                  // Endwert garantiert exakt (kein Rundungsrest wie „1.999")
                  onComplete: () => {
                    el.textContent = prefix + fmt.format(to) + suffix;
                  },
                });
              },
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
