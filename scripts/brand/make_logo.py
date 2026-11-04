"""
The owner's logo (assets/brand/omniwebora-logo-source.jpg, 2026-11-04: "use the same logo, no change"),
cut from its white background for the web. Nothing in the artwork is redrawn or recoloured:

- the page-white around the logo (and the soft glow under the eye, which fades into it) is turned into
  transparency with "colour to alpha" against white, so anti-aliased edges and the glow keep their
  true colour over any background;
- white enclosed by the eye (its highlights) stays as it is; the holes of the letters (o, b, a, e) are
  page-white and become transparent too.

Writes public/brand/omniwebora-logo-{480,960,1440}.webp (tight crop, alpha; a third of the PNG size) and the browser icon
(the eye alone, square): src/app/icon.png (256) and src/app/apple-icon.png (180, on white).

    python scripts/brand/make_logo.py
"""
from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / "assets" / "brand" / "omniwebora-logo-source.jpg"
OUT = ROOT / "public" / "brand"
EYE_RIGHT = 606  # first empty column between the eye and the wordmark (source pixels)


def to_alpha(rgb: np.ndarray, region: np.ndarray) -> np.ndarray:
    """RGBA where `region` pixels are un-composited from white (colour to alpha); others stay opaque."""
    h, w, _ = rgb.shape
    out = np.zeros((h, w, 4), dtype=np.float64)
    out[..., :3] = rgb
    out[..., 3] = 255
    c = rgb[region].astype(np.float64)
    a = np.clip((255 - c).max(axis=1) / 255.0, 0, 1)
    # the faintest JPEG noise in the page-white is not part of the artwork
    a = np.clip((a - 0.02) / 0.98, 0, 1)
    safe = np.maximum(a, 1e-6)[:, None]
    f = np.clip((c - (1 - a)[:, None] * 255.0) / safe, 0, 255)
    out[region, :3] = f
    out[region, 3] = a * 255
    return out


def main() -> None:
    rgb = np.asarray(Image.open(SRC).convert("RGB")).astype(np.int16)
    h, w, _ = rgb.shape
    light = rgb.min(axis=2) > 200
    # page-white: light pixels connected to the border (includes the glow under the eye)
    lab, _ = ndimage.label(light)
    border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    outside = np.isin(lab, list(border))
    # the holes of the letters: near-white, grey, enclosed, in the wordmark only
    sat = rgb.max(axis=2) - rgb.min(axis=2)
    hole = (rgb.min(axis=2) > 236) & (sat < 14)
    hole[:, :EYE_RIGHT] = False
    region = outside | hole
    # include the anti-aliased rim around those areas, so no white fringe is left on dark grounds
    region = ndimage.binary_dilation(region, iterations=2)
    region[:, :EYE_RIGHT] &= ndimage.binary_dilation(outside, iterations=2)[:, :EYE_RIGHT]
    rgba = to_alpha(rgb, region).round().astype(np.uint8)
    img = Image.fromarray(rgba, "RGBA")
    box = img.getchannel("A").point(lambda v: 255 if v > 6 else 0).getbbox()
    img = img.crop(box)
    OUT.mkdir(parents=True, exist_ok=True)
    for width in (480, 960, 1440):
        im = img if width >= img.width else img.resize((width, round(img.height * width / img.width)), Image.LANCZOS)
        im.save(OUT / f"omniwebora-logo-{width}.webp", "WEBP", quality=90, method=6, alpha_quality=100)
        print("logo", width, im.size)

    # the eye alone, centred on a square (browser tab and home-screen icons)
    eye = img.crop((0, 0, EYE_RIGHT - box[0], img.height))
    eb = eye.getchannel("A").point(lambda v: 255 if v > 40 else 0).getbbox()
    eye = eye.crop(eb)
    side = round(max(eye.size) * 1.08)
    sq = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    sq.paste(eye, ((side - eye.width) // 2, (side - eye.height) // 2), eye)
    # a palette PNG keeps the tab icon small
    sq.resize((256, 256), Image.LANCZOS).quantize(colors=256, method=Image.Quantize.FASTOCTREE).save(ROOT / "src" / "app" / "icon.png", optimize=True)
    apple = Image.new("RGBA", (side, side), (255, 255, 255, 255))
    apple.alpha_composite(sq)
    apple.convert("RGB").resize((180, 180), Image.LANCZOS).save(ROOT / "src" / "app" / "apple-icon.png", optimize=True)
    print("icons", eye.size)


if __name__ == "__main__":
    main()
