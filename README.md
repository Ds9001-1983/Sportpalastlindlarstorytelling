# Sportpalast Lindlar — Scrollytelling Premium

Mehrsprachige (DE/EN/TR/RU) Scrollytelling-Website für das Premium-Fitnessstudio
Sportpalast Lindlar. Story-Archetype **Transformation** – „Werde deine beste Version".

Gebaut mit dem `superband-premium-web`-Skill (Site-Typ 2: Scrollytelling Premium).

## Stack

- **Next.js 16** (App Router, Turbopack) · **React 19.2**
- **Tailwind CSS 4** · **shadcn-kompatible** Tokens
- **next-intl 4** (i18n, Locales `de`/`en`/`tr`/`ru`, Default `de`)
- **Lenis** (Smooth Scroll) + **GSAP/ScrollTrigger** (Pin + Frame-Scrub)
- **lucide-react** (Icons; Social-Glyphen als Inline-SVG in `social-icons.tsx`)

## Befehle

```bash
npm run dev            # Dev-Server (Turbopack)
npm run build          # Production-Build
npm start              # Production-Server (Default Port 3000)
npm run qa:lighthouse  # Lighthouse-Budget-Check (Server muss laufen; --url anpassen)
npm run qa:visual      # Playwright Visual Regression (5 Breakpoints)
```

## Architektur

- `src/app/[locale]/` — lokalisiertes Root-Layout + Single-Page-Komposition
- `src/proxy.ts` — next-intl Locale-Routing (Next 16: „Middleware" heißt jetzt „Proxy")
- `src/i18n/` — `routing.ts`, `request.ts`, `navigation.ts`
- `messages/{de,en,tr,ru}.json` — alle Texte
- `src/components/story-room.tsx` — gepinnter **Frame-Scrub-Canvas** (Desktop)
- `src/lib/frame-sequence.ts` — Manifest-Loader mit Eager/Lazy-Preloading
- `src/components/mobile-story.tsx` — **Variante B** (statische Keyframes, kein Scrub)
- `src/components/sections/*` — Angebot, Social Proof, Mitglieds-CTA, Kontakt
- `story-spec.json` — verbindliche Story-/Asset-Definition (gegen Skill-Schema validiert)

Die StoryRoom-Komponente lädt pro Room `/<framesBase>/manifest.json`. **Solange keine
echten Frames existieren, rendert sie einen cinematischen Platzhalter** – die Seite ist
also schon ohne KI-Assets vollständig lauffähig.

## KI-Assets generieren (Phase 3)

Pro Room (siehe Prompts in `story-spec.json` → `assets[]`):

1. Keyframe via Higgsfield `generate_image` (`soul_cinematic`/`nano_banana_2`, 16:9)
2. Motion via Higgsfield `generate_video` (`seedance_2_0`, `start_image` = Keyframe)
3. Frame-Extraktion:

```bash
# Desktop-Sequenz
python scripts/compile_sequence.py <video.mp4> \
  --out public/frames/seq_ankunft --id seq_ankunft \
  --width 1920 --height 1080 --fps 30 --overwrite

# Mobile-Variante B: ein Poster-Keyframe pro Room
python scripts/compile_sequence.py <video.mp4> \
  --out public/frames-mobile/seq_ankunft --id seq_ankunft_mobile \
  --width 1080 --height 1920 --mobile-keyframes 1 --overwrite
# danach den Keyframe nach poster.webp benennen (von mobile-story.tsx erwartet)
```

`assetId`s: `seq_ankunft, seq_entschluss, seq_kraft_egym, seq_kurse_energie,
seq_functional, seq_regeneration, seq_verwandlung, seq_ankunft_ziel`.

Frame-Sequenzen werden über `next.config.ts` / `vercel.json` mit
`Cache-Control: immutable` ausgeliefert.

## Deploy

Vercel Pro, Region `fra1` (`vercel.json`). Domain `sportpalast-lindlar.de`.

## Offene Punkte / bewusste Abweichungen

- **Display-Font:** Bricolage Grotesque (statt Clash Display) – via `next/font/google`
  selbst gehostet, robuster als ein externer Fontshare-Download. Anti-AI-Slop-konform.
- **Akzent-Hex `#e0a23c` (Gold)** ist ein Premium-Platzhalter passend zum „Palast"-Thema.
  Vor Go-live am echten Sportpalast-Logo verifizieren/justieren (`src/app/globals.css`).
- **Tracking:** GA4/Meta-Pixel sind im `story-spec.json` als `null` angelegt
  (Consent-gated). IDs nachtragen, wenn vom Kunden gewünscht.
- **Impressum/Datenschutz:** Footer-Links sind Platzhalter (`#`).

---

Made with ❤️ by SUPERBRAND.marketing – Dein Superheld für deine Werbung.
