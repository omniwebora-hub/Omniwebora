"""
Authoring-time asset pipeline for the Higgsfield-rendered hero world.

Inputs  (not committed, re-downloadable from the job IDs in assets/ASSET_MANIFEST.md):
  assets/higgsfield/raw/H00_v1_gpt.png          hero keyframe (3840x2160)
  assets/higgsfield/raw/H01_dolly_minimax.mp4   push-in clip (2560x1440, 24 fps)
  assets/higgsfield/raw/R01_pullback.png        establishing pull-back still
  assets/higgsfield/raw/D01_colonnade.png       colonnade detail still (21:9)
  assets/higgsfield/raw/A01_studio_table.png    studio worktable still (About)

Outputs (committed, served by Next.js):
  public/assets/cinematic/*.webp                optimised stills
  public/assets/cinematic/h01/{lg,md}/fNNN.webp scroll sequence frames
  src/content/cinematic.generated.ts            frame count + per-frame cube track

Requires Pillow and numpy. ffmpeg is located via the FFMPEG environment variable
(any static build works, e.g. `npx ffmpeg-static`). The website never runs this script.

    FFMPEG=/path/to/ffmpeg python scripts/cinematic/build_assets.py
"""

from __future__ import annotations

import json
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
RAW = ROOT / "assets" / "higgsfield" / "raw"
OUT = ROOT / "public" / "assets" / "cinematic"
TRACK_TS = ROOT / "src" / "content" / "cinematic.generated.ts"

SEQ_FRAMES = 56  # sampled from the 158-frame clip; the renderer cross-blends neighbours
SEQ_SIZES = {"lg": (1440, 810, 60), "md": (960, 540, 58)}  # name: (w, h, webp quality)


def save_webp(img: Image.Image, path: Path, width: int, quality: int) -> None:
    h = round(img.height * width / img.width)
    path.parent.mkdir(parents=True, exist_ok=True)
    img.resize((width, h), Image.LANCZOS).save(path, "WEBP", quality=quality, method=6)
    print(f"  {path.relative_to(ROOT)}  {width}x{h}  {path.stat().st_size // 1024} KB")


def stills() -> None:
    print("stills")
    h00 = Image.open(RAW / "H00_v1_gpt.png").convert("RGB")
    for w, q in ((2560, 78), (1920, 78), (1280, 76)):
        save_webp(h00, OUT / f"h00-hero-{w}.webp", w, q)
    # Portrait crop centred on the sculpture for phones (keeps the pedestal and ring).
    crop = h00.crop((1880, 260, 3720, 2160))  # 1840 x 1900
    save_webp(crop, OUT / "h00-hero-portrait-1100.webp", 1100, 76)
    save_webp(crop, OUT / "h00-hero-portrait-720.webp", 720, 74)

    r01 = Image.open(RAW / "R01_pullback.png").convert("RGB")
    for w, q in ((2400, 74), (1280, 72)):
        save_webp(r01, OUT / f"r01-pullback-{w}.webp", w, q)

    d01 = Image.open(RAW / "D01_colonnade.png").convert("RGB")
    for w, q in ((2400, 72), (1280, 70)):
        save_webp(d01, OUT / f"d01-colonnade-{w}.webp", w, q)

    a01 = Image.open(RAW / "A01_studio_table.png").convert("RGB")
    for w, q in ((2400, 74), (1280, 72)):
        save_webp(a01, OUT / f"a01-studio-table-{w}.webp", w, q)


def cube_track(frame: np.ndarray) -> tuple[float, float, float]:
    """Centre and height of the sapphire cube, normalised to the frame."""
    r, g, b = (frame[..., i].astype(np.int16) for i in range(3))
    mask = (b > 55) & (b < 190) & (r < 70) & (g < 90) & (b - r > 45)
    ys, xs = np.nonzero(mask)
    hgt, wid = mask.shape
    y0, y1 = np.percentile(ys, [3, 97])
    return float(np.median(xs) / wid), float(np.median(ys) / hgt), float((y1 - y0) / hgt)


def smooth(values: list[float], radius: int = 4) -> list[float]:
    arr = np.asarray(values)
    out = np.empty_like(arr)
    for i in range(len(arr)):
        lo, hi = max(0, i - radius), min(len(arr), i + radius + 1)
        out[i] = arr[lo:hi].mean()
    return out.tolist()


def sequence() -> None:
    ffmpeg = os.environ.get("FFMPEG") or shutil.which("ffmpeg")
    if not ffmpeg:
        sys.exit("Set FFMPEG to an ffmpeg executable.")
    print("sequence")
    with tempfile.TemporaryDirectory() as tmp:
        subprocess.run(
            [ffmpeg, "-hide_banner", "-loglevel", "error", "-i", str(RAW / "H01_dolly_minimax.mp4"), "-an", f"{tmp}/f%04d.png"],
            check=True,
        )
        files = sorted(Path(tmp).glob("f*.png"))
        total = len(files)
        picks = [round(i * (total - 1) / (SEQ_FRAMES - 1)) for i in range(SEQ_FRAMES)]

        # Track every source frame, then smooth, then sample, so the overlay never jitters.
        raw = [cube_track(np.asarray(Image.open(f).convert("RGB"))) for f in files]
        cx, cy, ch = (smooth([t[k] for t in raw]) for k in range(3))

        for name in SEQ_SIZES:
            shutil.rmtree(OUT / "h01" / name, ignore_errors=True)
        sizes = {name: 0 for name in SEQ_SIZES}
        for n, idx in enumerate(picks):
            img = Image.open(files[idx]).convert("RGB")
            for name, (w, h, q) in SEQ_SIZES.items():
                p = OUT / "h01" / name / f"f{n:03d}.webp"
                p.parent.mkdir(parents=True, exist_ok=True)
                img.resize((w, h), Image.LANCZOS).save(p, "WEBP", quality=q, method=6)
                sizes[name] += p.stat().st_size
        # A sharp still of the final pose for the resting end state.
        save_webp(Image.open(files[-1]).convert("RGB"), OUT / "h01-end-2560.webp", 2560, 78)
        for name, total_bytes in sizes.items():
            print(f"  h01/{name}: {SEQ_FRAMES} frames, {total_bytes // 1024} KB total")

        track = [[round(cx[i], 4), round(cy[i], 4), round(ch[i], 4)] for i in picks]

    TRACK_TS.write_text(
        "// Generated by scripts/cinematic/build_assets.py. Do not edit by hand.\n"
        "// Per-frame track of the glass cube in the H01 push-in: [centreX, centreY, height],\n"
        "// normalised to the 16:9 frame. Used to camera-match the HTML logo and panels.\n\n"
        f"export const H01_FRAMES = {SEQ_FRAMES};\n"
        f"export const H01_TRACK: readonly (readonly [number, number, number])[] = {json.dumps(track)};\n",
        encoding="utf-8",
    )
    print(f"  {TRACK_TS.relative_to(ROOT)}")


if __name__ == "__main__":
    stills()
    sequence()
