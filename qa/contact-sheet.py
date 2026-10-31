"""Contact sheet of a screenshot folder: python qa/contact-sheet.py <dir> [cols] [width] -> <dir>/sheet.png"""
import sys
from pathlib import Path

from PIL import Image, ImageDraw

d = Path(sys.argv[1])
cols = int(sys.argv[2]) if len(sys.argv) > 2 else 3
tw = int(sys.argv[3]) if len(sys.argv) > 3 else 640
files = sorted(f for f in d.glob("desk-*.png"))
th = round(tw * 900 / 1440)
rows = (len(files) + cols - 1) // cols
sheet = Image.new("RGB", (cols * tw, rows * (th + 22)), "white")
dr = ImageDraw.Draw(sheet)
for i, f in enumerate(files):
    im = Image.open(f).convert("RGB").resize((tw, th), Image.LANCZOS)
    x, y = (i % cols) * tw, (i // cols) * (th + 22)
    sheet.paste(im, (x, y + 22))
    dr.text((x + 6, y + 5), f.stem, fill="black")
sheet.save(d / "sheet.png")
print(d / "sheet.png", sheet.size)
