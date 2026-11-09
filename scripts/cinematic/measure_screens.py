"""Measure the four corners of each blank screen in a still (white quads on a table), for content
mapped onto them with a perspective transform (CSS matrix3d).

Usage: python scripts/cinematic/measure_screens.py <still> [--min-y 0.35] [--out preview.jpg]
Prints one quad per screen, left to right, as plate fractions [[x, y] TL, TR, BR, BL].
"""
import sys, json, itertools
import numpy as np, cv2

path = sys.argv[1]
args = sys.argv[2:]
min_y = float(args[args.index("--min-y") + 1]) if "--min-y" in args else 0.35
out = args[args.index("--out") + 1] if "--out" in args else None
im = cv2.imread(path)
H, W = im.shape[:2]
hsv = cv2.cvtColor(im, cv2.COLOR_BGR2HSV)
m = ((hsv[..., 2] > 238) & (hsv[..., 1] < 22)).astype(np.uint8) * 255
m[: int(H * min_y), :] = 0
m = cv2.morphologyEx(m, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))
n, lab, stats, cent = cv2.connectedComponentsWithStats(m)


def area(p):
    x, y = p[:, 0], p[:, 1]
    return 0.5 * abs(np.dot(x, np.roll(y, -1)) - np.dot(y, np.roll(x, -1)))


quads = []
for k in range(1, n):
    if stats[k, cv2.CC_STAT_AREA] < W * H * 0.004:
        continue
    cs, _ = cv2.findContours((lab == k).astype(np.uint8), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    hull = cv2.convexHull(max(cs, key=cv2.contourArea)).reshape(-1, 2).astype(float)
    # thin the hull to at most 40 points, then take the largest quadrilateral on it (its corners)
    if len(hull) > 40:
        hull = hull[np.linspace(0, len(hull) - 1, 40).astype(int)]
    best, bq = -1, None
    for idx in itertools.combinations(range(len(hull)), 4):
        a = area(hull[list(idx)])
        if a > best:
            best, bq = a, hull[list(idx)]
    c = bq.mean(0)
    bq = bq[np.argsort(np.arctan2(bq[:, 1] - c[1], bq[:, 0] - c[0]))]  # clockwise (y down)
    left = [i for i in range(4) if bq[i, 0] < c[0]]
    start = min(left, key=lambda i: bq[i, 1]) if len(left) >= 2 else int(np.argmin(bq.sum(1)))
    bq = np.roll(bq, -start, axis=0)
    quads.append((c[0], [[round(x / W, 5), round(y / H, 5)] for x, y in bq]))
quads.sort()
if out:
    vis = im.copy()
    for _, q in quads:
        pts = (np.array(q) * [W, H]).astype(np.int32)
        cv2.polylines(vis, [pts], True, (0, 0, 255), max(2, W // 600))
        cv2.circle(vis, tuple(pts[0]), max(6, W // 200), (255, 0, 0), -1)
    cv2.imwrite(out, cv2.resize(vis, (W * 1280 // max(W, H), H * 1280 // max(W, H))))
print(json.dumps([q for _, q in quads]))
