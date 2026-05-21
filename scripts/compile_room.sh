#!/usr/bin/env bash
# Kompiliert ein seedance-Video zu einer WebP-Frame-Sequence + manifest.json.
# Nutzt ffmpeg (Frame-Extraktion) + cwebp (WebP-Encoding), weil das lokale
# ffmpeg keinen libwebp-Encoder hat.
#
# Usage: scripts/compile_room.sh <ASSET_ID> <VIDEO_URL_OR_PATH> [WIDTH] [FPS] [QUALITY]
set -euo pipefail

ASSET_ID="${1:?asset id}"
SRC="${2:?video url or path}"
WIDTH="${3:-1280}"
FPS="${4:-16}"
QUALITY="${5:-64}"

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/public/frames/$ASSET_ID"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

# 1. Quelle beschaffen
if [[ "$SRC" =~ ^https?:// ]]; then
  echo "⬇️  Download $ASSET_ID ..."
  curl -sL -o "$TMP/in.mp4" "$SRC"
else
  cp "$SRC" "$TMP/in.mp4"
fi

# 2. Frames als PNG extrahieren (Breite W, Höhe gerade)
echo "🎞️  Extrahiere Frames ($WIDTH px, ${FPS}fps) ..."
ffmpeg -y -loglevel error -i "$TMP/in.mp4" \
  -vf "fps=$FPS,scale=$WIDTH:-2" "$TMP/f_%04d.png"

# 3. PNG -> WebP via cwebp
mkdir -p "$OUT"
rm -f "$OUT"/frame_*.webp
i=0
H=0
for png in "$TMP"/f_*.png; do
  i=$((i+1))
  n=$(printf "%03d" "$i")
  cwebp -quiet -q "$QUALITY" -m 4 "$png" -o "$OUT/frame_$n.webp"
done
# Höhe aus erstem Frame lesen
H=$(ffprobe -v error -select_streams v:0 -show_entries stream=height -of csv=p=0 "$OUT/frame_001.webp" 2>/dev/null || echo 0)

# 4. manifest.json schreiben (Format passend zu src/lib/frame-sequence.ts)
TOTAL_KB=$(du -sk "$OUT" | awk '{print $1}')
cat > "$OUT/manifest.json" <<JSON
{
  "id": "$ASSET_ID",
  "frameCount": $i,
  "fps": $FPS,
  "width": $WIDTH,
  "height": $H,
  "format": "webp",
  "filenamePattern": "frame_{N:03d}.webp",
  "publicUrl": "/frames/$ASSET_ID"
}
JSON

echo "✅ $ASSET_ID: $i Frames, ${TOTAL_KB}KB -> $OUT"
