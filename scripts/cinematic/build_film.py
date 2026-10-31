"""
Builds scroll-scrubbed film segments for the immersive pages (Solutions pilot and later wings).

For each segment: extract frames from the Higgsfield clip, sample N, encode lg/md WebP,
export a sharp end still, and (optionally) measure the blank display surface in the end frame so
HTML interfaces can be placed exactly on it. Writes src/content/film.generated.ts.

    FFMPEG=/path/to/ffmpeg python scripts/cinematic/build_film.py
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
TS = ROOT / "src" / "content" / "film.generated.ts"
SIZES = {"lg": (1440, 810, 56), "md": (960, 540, 56)}
# Scrub video (primary engine): every source frame, short GOP so any seek decodes only a few frames.
# Benchmarked in qa/perf/seek-bench.mjs: 1600x900 CRF 25 keyint 8 seeks in ~5 ms p50 on an Intel UHD iGPU.
VIDEOS = {"v1600": (1600, 900, 25), "v1280": (1280, 720, 25)}
KEYINT = 8
FPS = 24

# id, source clip, frames to keep, measure a display in the first/last frame?
SEGMENTS = [
    {"id": "sol-enter", "clip": "S10_gallery_to_web.mp4", "frames": 64, "screen_end": True},
    {"id": "sol-web-mobile", "clip": "S12b_web_to_phone.mp4", "frames": 64, "screen_end": True, "min_w": 0.06},
    {"id": "sol-mobile-ops", "clip": "S13b_phone_to_ops.mp4", "frames": 64, "screen_end": True},
    {"id": "sol-ops-auto", "clip": "S14_ops_to_ai.mp4", "frames": 64, "screen_end": True},
    {"id": "sol-auto-mkt", "clip": "S15_auto_to_marketing.mp4", "frames": 64, "screen_end": True},
    {"id": "sol-mkt-ent", "clip": "S16_marketing_to_ent.mp4", "frames": 64, "screen_end": True},
    {"id": "sol-finale", "clip": "S17_mezz_to_terrace.mp4", "frames": 64},
    # Home opening (2026-10-30, owner reference): the v1 crystal push-in (H01), then into the crystal's
    # core and out onto the drawing (HDV, ends on the exact K1 frame so 01 Innovate joins without a cut)
    {"id": "home-push", "clip": "H01_dolly_minimax.mp4", "frames": 64},
    {"id": "home-dive", "clip": "HDV_core_to_draw.mp4", "frames": 64, "trim_end": 0.22, "end_still": "K1_blueprint.png", "end_fade": 0.16},
    # Home "Ideas we bring to life" (design/HOME_SCRIPT.md): drawing → study model → built → lit,
    # then in through the centre bay (H11 reversed) to the product wall
    {"id": "home-design", "clip": "HB_draw_to_model.mp4", "frames": 64},
    {"id": "home-build", "clip": "HC_model_to_built.mp4", "frames": 64},
    {"id": "home-launch", "clip": "HD_built_to_lit.mp4", "frames": 64},
    {"id": "home-enter", "clip": "H11r_terrace_to_wall.mp4", "frames": 64},
    # How We Work: from eye level in the studio, a crane up over the planning table
    {"id": "plan-arrive", "clip": "L10_studio_to_table.mp4", "frames": 64},
    # Home (earlier): through the core → product wall → terrace → sunset to night
    {"id": "home-core", "clip": "H10_core_to_wall.mp4", "frames": 64, "multi": (3, 0.15)},
    {"id": "home-facade", "clip": "H11_wall_to_terrace.mp4", "frames": 64},
    {"id": "home-night", "clip": "H12_dusk.mp4", "frames": 64},
    # Pricing scope atelier: the model grows Basic → Standard → Premium
    {"id": "price-grow1", "clip": "P10_basic_to_standard.mp4", "frames": 64},
    {"id": "price-grow2", "clip": "P11_standard_to_premium.mp4", "frames": 64},
    # Contact: along the terrace to the consultation pavilion at dusk
    {"id": "contact-arrive", "clip": "C10_terrace_to_pavilion.mp4", "frames": 64},
    # About: studio worktable → top-down drafting table → out to the dusk pavilion
    {"id": "about-in", "clip": "A20_studio_to_drafting.mp4", "frames": 64},
    # only the clean second half (from the open glass onto the terrace); entered with a dissolve
    {"id": "about-out", "clip": "A21b_drafting_to_pavilion.mp4", "frames": 64, "trim_start": 0.6},
]
# stills whose frame holds several displays: name → how many
MULTI = {"h02-wall": (3, 0.15), "l01-lab": (3, 0.0)}
STILLS = [
    ("H02_product_wall.png", "h02-wall"),
    ("S08n_terrace_night.png", "s08-night"),
    ("P01_model_basic.png", "p01-basic"),
    ("P02_model_standard.png", "p02-standard"),
    ("P03_model_premium.png", "p03-premium"),
    ("L01_lab_topdown.png", "l01-lab"),
    ("L02_table_eye.png", "l02-table-eye"),
    ("C01_contact_pavilion.png", "c01-pavilion"),
    ("A10_drafting_table.png", "a10-drafting"),
    ("I01_city_panorama.png", "i01-city"),
    ("S00_gallery.png", "s00-gallery"),
    ("S01_web_alcove.png", "s01-web"),
    ("S03b_mobile_phone.png", "s03-mobile"),
    ("S02_ops_room.png", "s02-ops"),
    ("S04_ai_study.png", "s04-auto"),
    ("S07_marketing_studio.png", "s07-marketing"),
    ("S06_mezzanine.png", "s06-enterprise"),
    ("S08_terrace_facade.png", "s08-terrace"),
    ("K1_blueprint.png", "k1-draw"),
    ("K2_model.png", "k2-model"),
    ("K3_built.png", "k3-built"),
]


def save(img: Image.Image, path: Path, w: int, q: int) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    img.resize((w, round(img.height * w / img.width)), Image.LANCZOS).save(path, "WEBP", quality=q, method=6)


def display_rect(img: Image.Image, min_w: float = 0.15, lum_t: int = 230, sat_t: int = 28) -> list[float] | None:
    """The blank display surface: bright, low-saturation pixels. For each row's longest solid run,
    grow vertically while rows stay >92% solid across that run, and keep the largest area (so a
    floor reflection of the same width cannot win). Fractions [x, y, w, h] of the 16:9 frame."""
    W, H = 960, 540
    a = np.asarray(img.convert("RGB").resize((W, H))).astype(np.int16)
    lum = a.mean(axis=2)
    sat = a.max(axis=2) - a.min(axis=2)
    m = (lum > lum_t) & (sat < sat_t)
    best, best_area = None, 0
    for y in range(0, H, 2):
        row = m[y]
        run, x = None, 0
        while x < W:
            if row[x]:
                x0 = x
                while x < W and row[x]:
                    x += 1
                if run is None or x - x0 > run[1] - run[0]:
                    run = (x0, x)
            x += 1
        if not run or run[1] - run[0] < W * min_w:
            continue
        x0, x1 = run
        solid = lambda r: m[r, x0:x1].mean() > 0.92
        y0 = y
        while y0 > 0 and solid(y0 - 1):
            y0 -= 1
        y1 = y
        while y1 < H - 1 and solid(y1 + 1):
            y1 += 1
        area = (x1 - x0) * (y1 + 1 - y0)
        if (y1 + 1 - y0) >= H * 0.08 and area > best_area:
            best, best_area = (x0, y0, x1, y1), area
    if not best:
        return None
    x0, y0, x1, y1 = best
    return [round(x0 / W, 4), round(y0 / H, 4), round((x1 - x0) / W, 4), round((y1 + 1 - y0) / H, 4)]


def display_rects(img: Image.Image, n: int, min_w: float = 0.03, lum_t: int = 230, sat_t: int = 28, skip_left: float = 0.0) -> list[list[float]]:
    """Several blank displays in one frame (left to right): find the largest, blank it out, repeat.
    `skip_left` blanks a strip on the left first (e.g. a bright window that is not a display)."""
    W, H = 960, 540
    work = img.convert("RGB").resize((W, H)).copy()
    if skip_left:
        px = work.load()
        for yy in range(H):
            for xx in range(int(W * skip_left)):
                px[xx, yy] = (0, 0, 0)
    found = []
    for _ in range(n):
        r = display_rect(work, min_w, lum_t, sat_t)
        if not r:
            break
        found.append(r)
        x, y, w, h = r
        px = work.load()
        for yy in range(max(0, int(y * H) - 3), min(H, int((y + h) * H) + 3)):
            for xx in range(max(0, int(x * W) - 3), min(W, int((x + w) * W) + 3)):
                px[xx, yy] = (0, 0, 0)
    return sorted(found, key=lambda r: r[0])


def main() -> None:
    ffmpeg = os.environ.get("FFMPEG") or shutil.which("ffmpeg")
    if not ffmpeg:
        sys.exit("Set FFMPEG.")
    only = set(filter(None, os.environ.get("ONLY", "").split(",")))
    meta = {}
    if only and TS.exists():
        body = TS.read_text(encoding="utf-8")
        meta = json.loads(body[body.index("{") : body.rindex("}") + 1])
    for src, name in STILLS:
        path = RAW / src if (RAW / src).exists() else ROOT / src
        img = Image.open(path).convert("RGB")
        for w, q in ((2560, 78), (1920, 78), (1280, 76)):
            if not only:  # with ONLY, stills are only measured, never (re)written
                save(img, OUT / f"{name}-{w}.webp", w, q)
        meta[name] = {"screen": display_rect(img, 0.06 if "mobile" in name else 0.15)}
        if name in MULTI:
            meta[name]["screens"] = display_rects(img, MULTI[name][0], skip_left=MULTI[name][1])
    for seg in SEGMENTS:
        if only and seg["id"] not in only:
            continue
        with tempfile.TemporaryDirectory() as tmp:
            subprocess.run([ffmpeg, "-hide_banner", "-loglevel", "error", "-i", str(RAW / seg["clip"]), "-an", f"{tmp}/f%04d.png"], check=True)
            files = sorted(Path(tmp).glob("f*.png"))
            if seg.get("trim_end"):
                files = files[: int(len(files) * (1 - seg["trim_end"]))]
            if seg.get("end_still"):
                # dissolve the clip's last frames into the exact still the next chapter holds
                still = Image.open(RAW / seg["end_still"]).convert("RGB")
                size = Image.open(files[0]).size
                still = np.asarray(still.resize(size, Image.LANCZOS)).astype(np.float32)
                k0 = int(len(files) * (1 - seg["end_fade"]))
                for k in range(k0, len(files)):
                    t = (k - k0 + 1) / (len(files) - k0)
                    t = t * t * (3 - 2 * t)
                    fr = np.asarray(Image.open(files[k]).convert("RGB")).astype(np.float32)
                    Image.fromarray((fr * (1 - t) + still * t + 0.5).clip(0, 255).astype(np.uint8)).save(files[k])
                # re-encode from the kept (and dissolved) frames
                kept = Path(tmp) / "kept"
                kept.mkdir()
                for k, f in enumerate(files):
                    shutil.copy(f, kept / f"k{k:04d}.png")
                src_video = ["-framerate", str(FPS), "-i", str(kept / "k%04d.png")]
            elif seg.get("trim_start"):
                files = files[int(len(files) * seg["trim_start"]) :]
                # the video files are re-encoded from the kept frames
                trimmed = Path(tmp) / "trimmed"
                trimmed.mkdir()
                for k, f in enumerate(files):
                    shutil.copy(f, trimmed / f"t{k:04d}.png")
                src_video = ["-framerate", str(FPS), "-i", str(trimmed / "t%04d.png")]
            elif not seg.get("end_still"):
                src_video = ["-i", str(RAW / seg["clip"])]
            n = seg["frames"]
            picks = [round(i * (len(files) - 1) / (n - 1)) for i in range(n)]
            base = OUT / seg["id"]
            shutil.rmtree(base, ignore_errors=True)
            total = {k: 0 for k in SIZES}
            for k, idx in enumerate(picks):
                img = Image.open(files[idx]).convert("RGB")
                for size, (w, h, q) in SIZES.items():
                    p = base / size / f"f{k:03d}.webp"
                    p.parent.mkdir(parents=True, exist_ok=True)
                    img.resize((w, h), Image.LANCZOS).save(p, "WEBP", quality=q, method=6)
                    total[size] += p.stat().st_size
            for name, (vw, vh, crf) in VIDEOS.items():
                dst = base / f"{name}.mp4"
                subprocess.run(
                    [ffmpeg, "-hide_banner", "-loglevel", "error", "-y", *src_video, "-an",
                     "-vf", f"scale={vw}:{vh}:flags=lanczos,fps={FPS},format=yuv420p",
                     "-c:v", "libx264", "-preset", "slow", "-crf", str(crf), "-profile:v", "high",
                     "-x264-params", f"keyint={KEYINT}:min-keyint=1:scenecut=0:bframes=0",
                     "-movflags", "+faststart", str(dst)],
                    check=True,
                )
                total[name] = dst.stat().st_size
            first = Image.open(files[0]).convert("RGB")
            last = Image.open(files[-1]).convert("RGB")
            save(first, OUT / f"{seg['id']}-start-2560.webp", 2560, 78)
            save(first, OUT / f"{seg['id']}-start-1920.webp", 1920, 80)
            save(first, OUT / f"{seg['id']}-start-1280.webp", 1280, 74)
            save(last, OUT / f"{seg['id']}-end-2560.webp", 2560, 78)
            save(last, OUT / f"{seg['id']}-end-1920.webp", 1920, 80)
            save(last, OUT / f"{seg['id']}-end-1280.webp", 1280, 74)
            meta[seg["id"]] = {
                "frames": n,
                "videoFrames": len(files),
                "fps": FPS,
                "screenStart": display_rect(first, seg.get("min_w", 0.15)) if seg.get("screen_start") else None,
                "screenEnd": display_rect(last, seg.get("min_w", 0.15)) if seg.get("screen_end") else None,
                **({"screensEnd": display_rects(last, seg["multi"][0], skip_left=seg["multi"][1])} if seg.get("multi") else {}),
            }
            print(seg["id"], {k: f"{v // 1024} KB" for k, v in total.items()}, meta[seg["id"]])
    TS.write_text(
        "// Generated by scripts/cinematic/build_film.py. Do not edit by hand.\n"
        "// Film segments for immersive pages; screen rects are [x, y, w, h] fractions of the 16:9 frame.\n\n"
        f"export const FILM = {json.dumps(meta, indent=2)} as const;\n",
        encoding="utf-8",
    )
    print("wrote", TS.relative_to(ROOT))


if __name__ == "__main__":
    main()
