// Lädt eine manifest.json (vom compile_sequence.py erzeugt) und stellt die
// einzelnen Frames als vorgeladene HTMLImageElements bereit.

export interface FrameManifest {
  id: string;
  frameCount: number;
  fps: number;
  width: number;
  height: number;
  format: string;
  filenamePattern: string; // z.B. "frame_{N:03d}.webp"
  publicUrl: string; // z.B. "/frames/seq_ankunft"
}

export interface LoadedSequence {
  manifest: FrameManifest;
  imageAt: (index: number) => HTMLImageElement | null;
  ensureLoaded: (index: number) => void;
}

function frameUrl(manifest: FrameManifest, n: number): string {
  // unterstützt "frame_{N:03d}.webp"
  const match = manifest.filenamePattern.match(/\{N:0(\d+)d\}/);
  const pad = match ? parseInt(match[1], 10) : 3;
  const name = manifest.filenamePattern.replace(
    /\{N:0\d+d\}/,
    String(n).padStart(pad, '0'),
  );
  return `${manifest.publicUrl}/${name}`;
}

export async function loadManifest(
  framesBase: string,
): Promise<FrameManifest | null> {
  try {
    const res = await fetch(`${framesBase}/manifest.json`, {
      cache: 'force-cache',
    });
    if (!res.ok) return null;
    const data = (await res.json()) as FrameManifest;
    if (!data.frameCount || data.frameCount < 1) return null;
    return data;
  } catch {
    return null;
  }
}

/**
 * Erstellt einen Loader, der die ersten `eagerPercentage`% der Frames sofort
 * lädt und den Rest faul (lazy) bei Bedarf nachzieht.
 */
export function createSequenceLoader(
  manifest: FrameManifest,
  eagerPercentage = 30,
  onFrameReady?: (index: number) => void,
): LoadedSequence {
  const images: (HTMLImageElement | null)[] = new Array(
    manifest.frameCount,
  ).fill(null);
  const requested = new Set<number>();

  const load = (index: number) => {
    if (index < 0 || index >= manifest.frameCount) return;
    if (requested.has(index)) return;
    requested.add(index);
    const img = new Image();
    img.decoding = 'async';
    // Re-Render anstoßen, sobald ein Frame fertig dekodiert ist
    // (sonst bleibt der Canvas am Scroll-Anfang auf dem Platzhalter stehen).
    if (onFrameReady) img.onload = () => onFrameReady(index);
    img.src = frameUrl(manifest, index + 1); // Frames sind 1-basiert
    images[index] = img;
  };

  const eagerCount = Math.max(
    1,
    Math.ceil((manifest.frameCount * eagerPercentage) / 100),
  );
  for (let i = 0; i < eagerCount; i++) load(i);

  return {
    manifest,
    imageAt: (index) => {
      const img = images[index];
      return img && img.complete && img.naturalWidth > 0 ? img : null;
    },
    ensureLoaded: (index) => {
      // lade aktuellen Frame + kleinen Vorlauf
      for (let i = index; i < index + 4; i++) load(i);
    },
  };
}
