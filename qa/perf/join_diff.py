"""Frame-to-frame change across each join written by join-check.mjs.

For every boundary: the mean absolute luminance change between consecutive settled steps, the
largest step and how many times it exceeds the median (a jump stands far above smooth motion).
Also writes a strip of the frames around the largest change for visual inspection.
    python qa/perf/join_diff.py qa/perf/joins_solutions
"""
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image

d = Path(sys.argv[1])
man = json.loads((d / "manifest.json").read_text().replace("joins_solutions/", d.name + "/"))
rows = []
for j in man:
    ims = [np.asarray(Image.open(s["f"]).convert("L").resize((480, 300))).astype(np.float32) for s in j["shots"]]
    diffs = [float(np.abs(ims[i + 1] - ims[i]).mean()) for i in range(len(ims) - 1)]
    med = float(np.median(diffs)) or 0.01
    k = int(np.argmax(diffs))
    rows.append((j["name"], round(med, 2), round(diffs[k], 2), round(diffs[k] / med, 1), j["shots"][k]["y"], j["shots"][k]["block"], j["shots"][k + 1]["block"]))
    strip = [Image.open(j["shots"][i]["f"]).resize((480, 300)) for i in range(max(0, k - 1), min(len(ims), k + 3))]
    s = Image.new("RGB", (480 * len(strip), 300))
    for i, im in enumerate(strip):
        s.paste(im, (480 * i, 0))
    s.save(d / f"strip-{j['name']}.png")
print(f"{'join':<14}{'median':>8}{'max':>8}{'max/med':>9}  at(px)  blocks")
for r in rows:
    print(f"{r[0]:<14}{r[1]:>8}{r[2]:>8}{r[3]:>9}  {r[4]:>6}  {r[5]}->{r[6]}")

print("\nchange per step around each boundary (| marks the step that crosses into the new chapter)")
for j in man:
    ims = [np.asarray(Image.open(s["f"]).convert("L").resize((480, 300))).astype(np.float32) for s in j["shots"]]
    seq = []
    for i in range(len(ims) - 1):
        v = float(np.abs(ims[i + 1] - ims[i]).mean())
        cross = j["shots"][i]["y"] < 0 <= j["shots"][i + 1]["y"]
        seq.append(("|" if cross else "") + f"{v:.1f}")
    print(f"{j['name']:<14}", " ".join(seq))
