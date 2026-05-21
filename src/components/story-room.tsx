'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  createSequenceLoader,
  loadManifest,
  type LoadedSequence,
} from '@/lib/frame-sequence';

gsap.registerPlugin(ScrollTrigger);

interface StoryRoomProps {
  /** assetId aus story-spec, z.B. "seq_ankunft" -> /frames/seq_ankunft */
  framesBase: string;
  /** Reihenfolge ab 0, steuert die Platzhalter-Tönung */
  index: number;
  total: number;
  beat: string;
  subline: string;
  /** Höhe der Scroll-Strecke in vh (>= 100). Mehr = langsamerer Scrub. */
  heightVh?: number;
  /** Akzent-Tönung für den Platzhalter (Hex) */
  tint?: string;
  /** Scroll-Hinweis (nur im ersten Room sinnvoll) */
  scrollHint?: string;
}

// Cover-fit: zeichnet das Bild bildschirmfüllend ohne Verzerrung.
function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  w: number,
  h: number,
) {
  const ir = img.naturalWidth / img.naturalHeight;
  const cr = w / h;
  let dw = w;
  let dh = h;
  if (ir > cr) {
    dh = h;
    dw = h * ir;
  } else {
    dw = w;
    dh = w / ir;
  }
  const dx = (w - dw) / 2;
  const dy = (h - dh) / 2;
  ctx.drawImage(img, dx, dy, dw, dh);
}

// Cinematischer Platzhalter, solange noch keine echten Frames generiert sind.
function drawPlaceholder(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  progress: number,
  tint: string,
) {
  ctx.clearRect(0, 0, w, h);
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, '#0e0e0f');
  g.addColorStop(1, tint);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  // wandernder Lichtschein simuliert „Motion" beim Scrubben
  const cx = w * (0.2 + progress * 0.6);
  const cy = h * (0.35 + Math.sin(progress * Math.PI) * 0.15);
  const r = Math.max(w, h) * 0.6;
  const rg = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
  rg.addColorStop(0, 'rgba(224,162,60,0.22)');
  rg.addColorStop(1, 'rgba(224,162,60,0)');
  ctx.fillStyle = rg;
  ctx.fillRect(0, 0, w, h);
}

export function StoryRoom({
  framesBase,
  index,
  total,
  beat,
  subline,
  heightVh = 280,
  tint = '#1a1714',
  scrollHint,
}: StoryRoomProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const seqRef = useRef<LoadedSequence | null>(null);
  const progressRef = useRef(0);
  const renderRef = useRef<(() => void) | null>(null);

  // Manifest erst laden, wenn der Room in die Nähe des Viewports kommt.
  // (Sonst würden alle 8 Rooms ihre Eager-Frames beim Seitenstart ziehen
  //  und das Initial-Payload-Budget sprengen.)
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let active = true;

    const start = () => {
      if (!active || seqRef.current) return;
      loadManifest(framesBase).then((manifest) => {
        if (active && manifest) {
          seqRef.current = createSequenceLoader(manifest, 30, () =>
            renderRef.current?.(),
          );
          renderRef.current?.();
        }
      });
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          start();
          io.disconnect();
        }
      },
      { rootMargin: '120% 0px 120% 0px' },
    );
    io.observe(section);

    return () => {
      active = false;
      io.disconnect();
    };
  }, [framesBase]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const sticky = stickyRef.current;
    const section = sectionRef.current;
    if (!canvas || !sticky || !section) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = sticky.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      render();
    };

    const render = () => {
      const seq = seqRef.current;
      const p = progressRef.current;
      if (seq) {
        const frame = Math.min(
          seq.manifest.frameCount - 1,
          Math.floor(p * (seq.manifest.frameCount - 1)),
        );
        seq.ensureLoaded(frame);
        const img = seq.imageAt(frame);
        if (img) {
          drawCover(ctx, img, width, height);
          return;
        }
      }
      drawPlaceholder(ctx, width, height, p, tint);
    };

    const setOverlay = (p: number) => {
      const el = overlayRef.current;
      if (!el) return;
      // Text erscheint bei 8%, hält, blendet ab 88% aus.
      // Der erste Room ist sofort (bei Progress 0) sichtbar – kein leerer Einstieg.
      const fadeInUntil = index === 0 ? 0 : 0.08;
      let o = 1;
      if (fadeInUntil > 0 && p < fadeInUntil) o = p / fadeInUntil;
      else if (p > 0.88) o = Math.max(0, (1 - p) / 0.12);
      el.style.opacity = String(o);
      el.style.transform = `translateY(${(1 - o) * 24}px)`;
    };

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    renderRef.current = render;

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(sticky);

    let st: ScrollTrigger | null = null;

    if (prefersReduced) {
      progressRef.current = 0.5;
      setOverlay(1);
      render();
    } else {
      st = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        pin: sticky,
        pinSpacing: false,
        onUpdate: (self) => {
          progressRef.current = self.progress;
          setOverlay(self.progress);
          render();
        },
      });
      setOverlay(0);
    }

    return () => {
      ro.disconnect();
      st?.kill();
      renderRef.current = null;
    };
  }, [tint, index]);

  return (
    <section
      ref={sectionRef}
      aria-label={beat}
      style={{ height: `${heightVh}vh` }}
      className="relative"
    >
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen w-full overflow-hidden"
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        />
        <div className="text-scrim pointer-events-none absolute inset-0" />
        <div className="absolute inset-0 flex items-end md:items-center">
          <div
            ref={overlayRef}
            className="w-full px-6 pb-24 md:px-16 md:pb-0 lg:px-24"
            style={{ willChange: 'opacity, transform' }}
          >
            <span className="mb-4 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.25em] text-gold">
              <span className="tabular-nums">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="h-px w-8 bg-gold/50" />
              <span className="tabular-nums text-stone">
                {String(total).padStart(2, '0')}
              </span>
            </span>
            <h2 className="font-display max-w-4xl text-[clamp(2.5rem,8vw,7rem)] text-paper">
              {beat}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-paper/80 md:text-lg">
              {subline}
            </p>
          </div>
        </div>

        {scrollHint && (
          <div className="pointer-events-none absolute inset-x-0 bottom-8 flex flex-col items-center gap-2 text-xs uppercase tracking-[0.3em] text-paper/60">
            <span>{scrollHint}</span>
            <span className="h-10 w-px animate-pulse bg-linear-to-b from-gold to-transparent" />
          </div>
        )}
      </div>
    </section>
  );
}
