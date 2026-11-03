"""Centre (window px) of the crystal's dark navy core in a screenshot: prints [x, y]."""
import sys, json
import numpy as np
from PIL import Image
from scipy import ndimage
a = np.asarray(Image.open(sys.argv[1]).convert("RGB")).astype(int)
H, W, _ = a.shape
r, g, b = a[..., 0], a[..., 1], a[..., 2]
m = ((r + g + b) / 3 < 85) & (b > r + 25) & (b > g + 5)
m[: int(H * 0.08), :] = False
m = ndimage.binary_closing(ndimage.binary_opening(m, iterations=1), iterations=4)
lab, n = ndimage.label(m)
k = int(np.argmax(ndimage.sum(m, lab, range(1, n + 1)))) + 1
ys, xs = np.nonzero(lab == k)
print(json.dumps([(xs.min() + xs.max()) / 2, (ys.min() + ys.max()) / 2]))
