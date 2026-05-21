#!/usr/bin/env python3
"""
SUPERBRAND Premium Web Skill - Frame Sequence Compiler

Wandelt ein Higgsfield-Motion-Video (MP4) in eine WebP-Frame-Sequenz um,
die vom CanvasSequence-Renderer im Frontend gescrubt wird.

Output: Folder mit frame_001.webp ... frame_NNN.webp + manifest.json

Voraussetzung: ffmpeg im PATH. Idealerweise mit libwebp-Support
(brew install ffmpeg). Falls libwebp fehlt, fällt das Script automatisch
auf JPG zurück und gibt eine Warnung aus.

Beispiel-Aufruf:

    python compile_sequence.py input.mp4 \\
        --out public/frames/cave_entrance \\
        --id cave_entrance \\
        --fps 30 --width 1920 --height 1080

Mobile-Variante B (statt Sequence nur 5 Keyframes):

    python compile_sequence.py input.mp4 \\
        --out public/frames-mobile/cave_entrance \\
        --id cave_entrance_mobile \\
        --width 720 --height 720 --mobile-keyframes 5
"""

from __future__ import annotations

import argparse
import json
import os
import shutil
import subprocess
import sys
import tempfile
import urllib.request
from datetime import datetime, timezone
from pathlib import Path


def check_ffmpeg() -> tuple[bool, bool]:
    """Prüft ob ffmpeg installiert ist und libwebp-Support hat."""
    if not shutil.which("ffmpeg"):
        return False, False

    try:
        out = subprocess.run(
            ["ffmpeg", "-hide_banner", "-version"],
            capture_output=True,
            text=True,
            timeout=5,
        )
        has_libwebp = "libwebp" in (out.stdout + out.stderr).lower()
        return True, has_libwebp
    except Exception:
        return True, False


def download_if_url(input_path: str) -> tuple[str, bool]:
    """Wenn input_path eine URL ist, lade in Tempfile. Returnt (lokaler_pfad, ist_temp)."""
    if input_path.startswith(("http://", "https://")):
        tmp = tempfile.NamedTemporaryFile(suffix=".mp4", delete=False)
        tmp.close()
        print(f"📥 Lade Video herunter: {input_path}")
        urllib.request.urlretrieve(input_path, tmp.name)
        size_mb = os.path.getsize(tmp.name) / 1024 / 1024
        print(f"   Größe: {size_mb:.1f} MB")
        return tmp.name, True
    return input_path, False


def extract_frames_sequence(
    video: str,
    out_dir: Path,
    fps: int,
    width: int,
    height: int,
    fmt: str,
    quality: int,
    max_frames: int | None,
) -> int:
    """Extrahiert kontinuierliche Frame-Sequenz für CanvasSequence."""
    out_dir.mkdir(parents=True, exist_ok=True)

    pattern = str(out_dir / f"frame_%03d.{fmt}")
    cmd = [
        "ffmpeg",
        "-y",
        "-i", video,
        "-vf", f"fps={fps},scale={width}:{height}:flags=lanczos",
    ]

    if fmt == "webp":
        cmd += ["-c:v", "libwebp", "-quality", str(quality), "-lossless", "0"]
    else:  # jpg
        cmd += ["-q:v", str(max(1, int(31 - (quality / 100) * 28)))]

    if max_frames:
        cmd += ["-frames:v", str(max_frames)]

    cmd += [pattern]

    print(f"🎞️  ffmpeg startet ({fmt}, {width}x{height}, {fps}fps)...")
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print("❌ ffmpeg-Fehler:")
        print(result.stderr[-2000:])
        sys.exit(1)

    frames = sorted(out_dir.glob(f"frame_*.{fmt}"))
    return len(frames)


def extract_keyframes(
    video: str,
    out_dir: Path,
    width: int,
    height: int,
    n_keyframes: int,
    fmt: str,
    quality: int,
) -> int:
    """Extrahiert N gleichmäßig verteilte Keyframes (Mobile-Variante B)."""
    out_dir.mkdir(parents=True, exist_ok=True)

    # Video-Duration ermitteln
    probe = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=noprint_wrappers=1:nokey=1", video],
        capture_output=True, text=True,
    )
    try:
        duration = float(probe.stdout.strip())
    except ValueError:
        print("⚠️  Video-Duration nicht ermittelbar, nutze 5s als Fallback")
        duration = 5.0

    timestamps = [(i / (n_keyframes - 1)) * duration for i in range(n_keyframes)]
    if n_keyframes == 1:
        timestamps = [duration / 2]

    for idx, ts in enumerate(timestamps, start=1):
        out_file = out_dir / f"frame_{idx:03d}.{fmt}"
        cmd = [
            "ffmpeg", "-y",
            "-ss", str(ts),
            "-i", video,
            "-vf", f"scale={width}:{height}:flags=lanczos",
            "-frames:v", "1",
        ]
        if fmt == "webp":
            cmd += ["-c:v", "libwebp", "-quality", str(quality)]
        else:
            cmd += ["-q:v", str(max(1, int(31 - (quality / 100) * 28)))]
        cmd += [str(out_file)]

        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode != 0:
            print(f"❌ Keyframe {idx} fehlgeschlagen")
            print(result.stderr[-1000:])
            sys.exit(1)
        print(f"   Keyframe {idx}/{n_keyframes} bei {ts:.2f}s")

    return n_keyframes


def write_manifest(
    out_dir: Path,
    sequence_id: str,
    frame_count: int,
    fps: int,
    width: int,
    height: int,
    fmt: str,
    public_url: str,
    source_video: str,
    mode: str,
) -> None:
    """Schreibt manifest.json für den CanvasSequence-Renderer."""
    frames = []
    total_size_bytes = 0
    for n in range(1, frame_count + 1):
        f = out_dir / f"frame_{n:03d}.{fmt}"
        size = f.stat().st_size if f.exists() else 0
        total_size_bytes += size
        frames.append({
            "n": n,
            "file": f.name,
            "sizeKB": round(size / 1024, 1),
        })

    manifest = {
        "id": sequence_id,
        "mode": mode,  # "sequence" oder "static_keyframes"
        "frameCount": frame_count,
        "fps": fps if mode == "sequence" else None,
        "width": width,
        "height": height,
        "format": fmt,
        "filenamePattern": f"frame_{{N:03d}}.{fmt}",
        "publicUrl": public_url.rstrip("/"),
        "totalSizeKB": round(total_size_bytes / 1024, 1),
        "averageFrameSizeKB": round(total_size_bytes / 1024 / max(frame_count, 1), 1),
        "loopable": False,
        "createdAt": datetime.now(timezone.utc).isoformat(),
        "sourceVideo": source_video,
        "frames": frames,
    }

    out_file = out_dir / "manifest.json"
    out_file.write_text(json.dumps(manifest, indent=2))
    print(f"📝 manifest.json geschrieben: {out_file}")


def main():
    parser = argparse.ArgumentParser(
        description="Frame-Sequence-Compiler für SUPERBRAND Scrollytelling",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    parser.add_argument("input", help="Pfad oder URL zum MP4-Input")
    parser.add_argument("--out", required=True, help="Output-Ordner")
    parser.add_argument("--id", required=True, help="Sequence-ID (für manifest.json)")
    parser.add_argument("--fps", type=int, default=30, help="Framerate (Default: 30)")
    parser.add_argument("--width", type=int, default=1920, help="Frame-Breite (Default: 1920)")
    parser.add_argument("--height", type=int, default=1080, help="Frame-Höhe (Default: 1080)")
    parser.add_argument("--public-url", default="/frames", help="URL-Prefix für Frontend (Default: /frames)")
    parser.add_argument("--format", choices=["webp", "jpg", "auto"], default="auto", help="Output-Format")
    parser.add_argument("--quality", type=int, default=82, help="Quality 0-100 (Default: 82)")
    parser.add_argument("--overwrite", action="store_true", help="Bestehende Frames überschreiben")
    parser.add_argument("--max-frames", type=int, help="Max Frame-Anzahl (Hard-Cap)")
    parser.add_argument("--mobile-keyframes", type=int, default=0,
                        help="Statt Sequence nur N Keyframes extrahieren (für Mobile-Variante B)")

    args = parser.parse_args()

    # 1. ffmpeg-Check
    ffmpeg_ok, libwebp_ok = check_ffmpeg()
    if not ffmpeg_ok:
        print("❌ ffmpeg nicht gefunden. Installation: brew install ffmpeg")
        sys.exit(1)

    # 2. Format bestimmen
    if args.format == "auto":
        fmt = "webp" if libwebp_ok else "jpg"
        if not libwebp_ok:
            print("⚠️  libwebp nicht in ffmpeg verfügbar — falle auf JPG zurück")
            print("   Für bessere Performance: brew uninstall ffmpeg && brew install ffmpeg")
    else:
        fmt = args.format
        if fmt == "webp" and not libwebp_ok:
            print("❌ WebP explizit gewünscht, aber ffmpeg hat kein libwebp")
            sys.exit(1)

    # 3. Output-Folder prüfen
    out_dir = Path(args.out)
    if out_dir.exists() and any(out_dir.iterdir()):
        if not args.overwrite:
            print(f"❌ {out_dir} existiert und ist nicht leer. Nutze --overwrite oder lösche manuell.")
            sys.exit(1)
        for f in out_dir.glob("frame_*"):
            f.unlink()
        manifest = out_dir / "manifest.json"
        if manifest.exists():
            manifest.unlink()

    # 4. Input laden
    local_video, is_temp = download_if_url(args.input)

    try:
        # 5. Frames extrahieren
        if args.mobile_keyframes > 0:
            print(f"📱 Mobile-Variante B: extrahiere {args.mobile_keyframes} Keyframes")
            frame_count = extract_keyframes(
                local_video, out_dir, args.width, args.height,
                args.mobile_keyframes, fmt, args.quality,
            )
            mode = "static_keyframes"
        else:
            frame_count = extract_frames_sequence(
                local_video, out_dir, args.fps, args.width, args.height,
                fmt, args.quality, args.max_frames,
            )
            mode = "sequence"

        if frame_count == 0:
            print("❌ Keine Frames extrahiert.")
            sys.exit(1)

        # 6. Manifest schreiben
        write_manifest(
            out_dir, args.id, frame_count, args.fps,
            args.width, args.height, fmt,
            f"{args.public_url}/{args.id}" if args.public_url == "/frames" else args.public_url,
            args.input, mode,
        )

        # 7. Budget-Hinweis
        total_kb = sum(f.stat().st_size for f in out_dir.glob(f"frame_*.{fmt}")) / 1024
        total_mb = total_kb / 1024
        print(f"\n✅ Fertig: {frame_count} Frames, {total_mb:.1f} MB total ({total_kb / frame_count:.1f} KB/Frame)")

        if mode == "sequence" and total_mb > 25:
            print(f"⚠️  Größe ({total_mb:.1f} MB) über Standard-Budget von 25MB für Desktop-Sequences.")
            print("   Optionen: --quality 70 oder --width 1280 oder weniger Frames")
        elif mode == "static_keyframes" and total_mb > 3:
            print(f"⚠️  Mobile-Keyframes ({total_mb:.1f} MB) über Budget von 3MB.")
            print("   Optionen: --quality 70 oder --width 540")

    finally:
        if is_temp and os.path.exists(local_video):
            os.unlink(local_video)


if __name__ == "__main__":
    main()
