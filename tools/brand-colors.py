#!/usr/bin/env python3
"""Re-derive the SmokeHouse brand reds straight from the logo artwork.

Run this instead of eyedropping. It reports every saturated red in the file
with a pixel count, so a stray anti-aliased pixel can never be mistaken for a
brand colour.

    python3 tools/brand-colors.py assets/img/logo-color.png
"""
import sys
from collections import Counter

import cv2
import numpy as np


def reds(path):
    im = cv2.imread(path, cv2.IMREAD_UNCHANGED)
    if im is None:
        sys.exit("cannot read %s" % path)
    if im.shape[2] == 3:                       # no alpha: treat all as opaque
        im = cv2.cvtColor(im, cv2.COLOR_BGR2BGRA)
    b, g, r, a = (im[:, :, i].astype(int) for i in range(4))
    hi = np.maximum(np.maximum(r, g), b)
    lo = np.minimum(np.minimum(r, g), b)
    # opaque, red-dominant, clearly saturated, not near-black
    m = (a >= 250) & (r == hi) & ((r - lo) > 40) & (r > 60)
    counts = Counter(map(tuple, np.stack([r[m], g[m], b[m]], 1)))
    return counts, int(m.sum()), im.shape[1], im.shape[0]


for path in sys.argv[1:] or ["assets/img/logo-color.png"]:
    counts, total, w, h = reds(path)
    print("%s  (%dx%d)  %d red px in %d distinct values" %
          (path, w, h, total, len(counts)))
    for (R, G, B), n in counts.most_common(10):
        print("    #%02x%02x%02x  rgb(%3d,%3d,%3d)  %7d px  %5.1f%%" %
              (R, G, B, R, G, B, n, 100 * n / total))
    print()
