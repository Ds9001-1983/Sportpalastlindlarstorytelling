// Mobile-Variante B: statt Frame-Sequence pro Room ein statischer Keyframe.
// Gestapelte 100svh-Panels, kein Scroll-Jacking -> robust auf iOS Safari.

interface MobileRoom {
  id: string;
  assetId: string;
  beat: string;
  subline: string;
  tint: string;
}

export function MobileStory({ rooms }: { rooms: MobileRoom[] }) {
  return (
    <div className="md:hidden">
      {rooms.map((room, i) => (
        <section
          key={room.id}
          aria-label={room.beat}
          className="relative flex h-svh flex-col justify-end overflow-hidden"
          style={{
            background: `linear-gradient(to bottom, #0e0e0f, ${room.tint})`,
          }}
        >
          {/* Mobile-Keyframe (poster.webp) als Background-Layer.
              Fehlt die Datei, bleibt einfach der Gradient sichtbar. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(/frames-mobile/${room.assetId}/poster.webp)`,
            }}
          />
          <div className="text-scrim pointer-events-none absolute inset-0" />
          <div className="relative px-6 pb-20">
            <span className="mb-3 inline-flex items-center gap-2 text-[0.7rem] font-medium uppercase tracking-[0.25em] text-gold">
              <span className="tabular-nums">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="h-px w-6 bg-gold/50" />
              <span className="tabular-nums text-stone">
                {String(rooms.length).padStart(2, '0')}
              </span>
            </span>
            <h2 className="font-display text-[2.5rem] leading-[0.95] text-paper">
              {room.beat}
            </h2>
            <p className="mt-3 max-w-md text-base leading-relaxed text-paper/85">
              {room.subline}
            </p>
          </div>
        </section>
      ))}
    </div>
  );
}
