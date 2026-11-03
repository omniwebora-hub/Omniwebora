"""
Portrait (9:16) cut of the films, for phones and other tall screens (owner, 2026-11-03: "how we crop for
mobile is not good; make video specifically for that ratio"). Every scene is re-composed for a tall frame
(Higgsfield keyframes at 9:16) and its camera moves are generated as vertical clips between them.

Writes public/assets/cinematic/portrait/:
  <still>-{720,1080,1440}.webp            hold stills
  <segment>/v1600.mp4 (1080x1920), v1280.mp4 (720x1280)   scrub videos (short GOP, like the landscape cut)
  <segment>-{start,end}-{720,1080,1440}.webp
and src/content/portrait.generated.ts (segment timing, measured display rects as fractions of the 9:16
frame).

    FFMPEG=/path/to/ffmpeg python scripts/cinematic/build_portrait.py        (ONLY=id1,id2 to rebuild some)
"""
from __future__ import annotations

import json
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

from PIL import Image

sys.path.insert(0, str(Path(__file__).parent))
from build_film import display_rect, display_rects  # noqa: E402  (same display detection as the landscape cut)

ROOT = Path(__file__).resolve().parents[2]
RAW = ROOT / "assets" / "higgsfield" / "raw" / "portrait"
OUT = ROOT / "public" / "assets" / "cinematic" / "portrait"
TS = ROOT / "src" / "content" / "portrait.generated.ts"
VIDEOS = {"v1600": (1080, 1920, 27), "v1280": (720, 1280, 28)}
KEYINT = 8
FPS = 24
WIDTHS = ((1440, 80), (1080, 80), (720, 76))

# id, source clip (in RAW), optional "reverse" (play the clip backwards), optional "multi" (count of
# displays to measure in the last frame; "column" sorts them top to bottom instead of left to right),
# optional "screen_end" (measure the one blank display in the last frame; "min_w" its least width)
SEGMENTS = [
    {"id": "home-push", "clip": "PH01_push.mp4"},
    {"id": "home-dive", "clip": "PH10_dive.mp4"},
    {"id": "home-design", "clip": "PHB_draw_to_model.mp4"},
    {"id": "home-build", "clip": "PHC_model_to_built.mp4"},
    {"id": "home-launch", "clip": "PHD_built_to_lit.mp4"},
    {"id": "home-facade", "clip": "PH11_wall_to_terrace.mp4"},
    {"id": "home-enter", "clip": "PH11_wall_to_terrace.mp4", "reverse": True, "multi": 3},
    {"id": "home-night", "clip": "PH12_dusk.mp4"},
    {"id": "price-grow1", "clip": "PP10_basic_to_standard.mp4"},
    {"id": "price-grow2", "clip": "PP11_standard_to_premium.mp4"},
    # Solutions: the gallery and its six rooms, then out to the terrace
    {"id": "sol-enter", "clip": "PS10_gallery_to_web.mp4", "screen_end": True},
    {"id": "sol-web-mobile", "clip": "PS12_web_to_mobile.mp4", "screen_end": True, "min_w": 0.08},
    {"id": "sol-mobile-ops", "clip": "PS13_mobile_to_ops.mp4", "screen_end": True},
    {"id": "sol-ops-auto", "clip": "PS14_ops_to_auto.mp4", "screen_end": True},
    {"id": "sol-auto-mkt", "clip": "PS15_auto_to_marketing.mp4", "screen_end": True},
    {"id": "sol-mkt-ent", "clip": "PS16_marketing_to_ent.mp4", "screen_end": True},
    {"id": "sol-finale", "clip": "PS17_ent_to_terrace.mp4"},
    # About, Contact, How We Work
    {"id": "about-in", "clip": "PA20_studio_to_drafting.mp4", "multi": 2, "column": True},
    {"id": "about-out", "clip": "PA21_drafting_to_pavilion.mp4"},
    {"id": "contact-arrive", "clip": "PC10_terrace_to_pavilion.mp4"},
    # two tablets side by side above the laptop, open marble below for the words (PL01b; the first
    # take, PL01, stacked all three devices down the frame, leaving the words nowhere to sit)
    {"id": "plan-arrive", "clip": "PL10b_table_to_topdown.mp4", "multi": 3},
]
STILLS = [
    ("PH00_hero.png", "h00-hero"),
    ("PK1_blueprint.png", "k1-draw"),
    ("PH02_wall.png", "h02-wall"),
    ("PP01_basic.png", "p01-basic"),
    ("PS00_gallery.png", "s00-gallery"),
]
MULTI = {"h02-wall": 3}


def save(img: Image.Image, path: Path, w: int, q: int) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    img.resize((w, round(img.height * w / img.width)), Image.LANCZOS).save(path, "WEBP", quality=q, method=6)


def main() -> None:
    ffmpeg = os.environ.get("FFMPEG") or shutil.which("ffmpeg")
    if not ffmpeg:
        sys.exit("Set FFMPEG.")
    only = set(filter(None, os.environ.get("ONLY", "").split(",")))
    meta: dict = {"segments": {}, "stills": {}}
    if TS.exists():
        body = TS.read_text(encoding="utf-8")
        meta = json.loads(body[body.index("{") : body.rindex("}") + 1])
    for src, name in STILLS:
        if only and name not in only or not (RAW / src).exists():
            continue
        img = Image.open(RAW / src).convert("RGB")
        for w, q in WIDTHS:
            save(img, OUT / f"{name}-{w}.webp", w, q)
        meta["stills"][name] = {"screens": display_rects(img, MULTI[name], skip_left=0.0)} if name in MULTI else {}
        print("still", name)
    for seg in SEGMENTS:
        if only and seg["id"] not in only or not (RAW / seg["clip"]).exists():
            continue
        with tempfile.TemporaryDirectory() as tmp:
            vf = "reverse," if seg.get("reverse") else ""
            subprocess.run([ffmpeg, "-hide_banner", "-loglevel", "error", "-i", str(RAW / seg["clip"]), "-an", "-vf", f"{vf}fps={FPS}", f"{tmp}/f%04d.png"], check=True)
            files = sorted(Path(tmp).glob("f*.png"))
            base = OUT / seg["id"]
            shutil.rmtree(base, ignore_errors=True)
            base.mkdir(parents=True)
            sizes = {}
            for name, (vw, vh, crf) in VIDEOS.items():
                dst = base / f"{name}.mp4"
                subprocess.run(
                    [ffmpeg, "-hide_banner", "-loglevel", "error", "-y", "-framerate", str(FPS), "-i", f"{tmp}/f%04d.png", "-an",
                     "-vf", f"scale={vw}:{vh}:flags=lanczos,format=yuv420p",
                     "-c:v", "libx264", "-preset", "slow", "-crf", str(crf), "-profile:v", "high",
                     "-x264-params", f"keyint={KEYINT}:min-keyint=1:scenecut=0:bframes=0",
                     "-movflags", "+faststart", str(dst)],
                    check=True,
                )
                sizes[name] = f"{dst.stat().st_size // 1024} KB"
            first = Image.open(files[0]).convert("RGB")
            last = Image.open(files[-1]).convert("RGB")
            for w, q in WIDTHS:
                save(first, OUT / f"{seg['id']}-start-{w}.webp", w, q)
                save(last, OUT / f"{seg['id']}-end-{w}.webp", w, q)
            screens = None
            if seg.get("multi"):
                screens = display_rects(last, seg["multi"], skip_left=0.0)
                if seg.get("column"):
                    screens.sort(key=lambda r: r[1])
            meta["segments"][seg["id"]] = {
                "frames": 64,
                "videoFrames": len(files),
                "fps": FPS,
                **({"screensEnd": screens} if screens else {}),
                **({"screenEnd": display_rect(last, seg.get("min_w", 0.15))} if seg.get("screen_end") else {}),
            }
            print(seg["id"], sizes, meta["segments"][seg["id"]])
    TS.write_text(
        "// Generated by scripts/cinematic/build_portrait.py. Do not edit by hand.\n"
        "// The portrait (9:16) cut: segment timing and display rects as [x, y, w, h] fractions of the 9:16 frame.\n\n"
        f"export const PORTRAIT = {json.dumps(meta, indent=2)} as const;\n",
        encoding="utf-8",
    )
    print("wrote", TS.relative_to(ROOT))


if __name__ == "__main__":
    main()
