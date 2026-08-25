#!/usr/bin/env python3
"""Regenerate the cut-chart highlight overlays from the chart artwork.

Run from the site root:  python3 tools/build-cut-regions.py
Requires: opencv-python, pillow, numpy.

Each primal is seeded with one interior point; a watershed grows it out to the
drawn boundary, so the highlights match the artwork exactly instead of being
positioned by hand. Output: assets/img/cuts/<name>.webp, full-canvas alpha.
"""
import cv2, numpy as np, os
from PIL import Image

CHART = "assets/img/cut-chart-cow.png"
OUT   = "assets/img/cuts"
FILL  = (196, 40, 52)

SEEDS = {
    "chuck": (520, 230), "rib": (790, 230), "shortloin": (975, 235),
    "sirloin": (1150, 240), "round": (1330, 300), "brisket": (545, 520),
    "plate": (800, 470), "flank": (1085, 460), "shank": (575, 610),
}
# 13 keeps sirloin from leaking over the round; the shank leg is too narrow for
# that kernel and gets pinched shut, so it runs at 7.
KMAP = {n: 13 for n in SEEDS}; KMAP["shank"] = 7
OPEN = {n: 9 for n in SEEDS};  OPEN["shank"] = 3


def main():
    img = cv2.imread(CHART, cv2.IMREAD_UNCHANGED)
    H, W = img.shape[:2]
    alpha = img[..., 3]
    gray = cv2.cvtColor(img[..., :3], cv2.COLOR_BGR2GRAY)
    ink = ((alpha > 60) & (gray < 150)).astype(np.uint8)
    bgr = np.ascontiguousarray(img[..., :3])

    def watershed_at(k):
        kern = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (k, k))
        free = (1 - cv2.dilate(ink, kern)).astype(np.uint8)
        _, lab = cv2.connectedComponents(free)
        ids = {n: int(lab[y, x]) for n, (x, y) in SEEDS.items()}
        if 0 in ids.values() or len(set(ids.values())) != len(SEEDS):
            raise SystemExit(f"seeds collide or land on ink at k={k}: {ids}")
        m = np.zeros((H, W), np.int32)
        m[(lab > 0) & (~np.isin(lab, list(ids.values())))] = 1
        for i, n in enumerate(SEEDS):
            m[lab == ids[n]] = i + 2
        cv2.watershed(bgr, m)
        return m

    sheets = {k: watershed_at(k) for k in set(KMAP.values())}
    os.makedirs(OUT, exist_ok=True)
    grow = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
    for i, name in enumerate(SEEDS):
        m = (sheets[KMAP[name]] == i + 2).astype(np.uint8)
        m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, grow)
        ok = OPEN[name]
        if ok > 1:
            m = cv2.morphologyEx(
                m, cv2.MORPH_OPEN,
                cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (ok, ok)))
        _, cl = cv2.connectedComponents(m)
        sx, sy = SEEDS[name]
        keep = cl[sy, sx]
        if keep == 0:
            _, cl = cv2.connectedComponents(cv2.dilate(m, grow))
            keep = cl[sy, sx]
        m = ((cl == keep) & (m > 0)).astype(np.uint8)
        m = cv2.dilate(m, grow)
        out = np.zeros((H, W, 4), np.uint8)
        out[..., 0], out[..., 1], out[..., 2] = FILL
        out[..., 3] = m * 255
        path = os.path.join(OUT, name + ".webp")
        Image.fromarray(out).save(path, "WEBP", lossless=True, method=6)
        print(f"{name:10s} {os.path.getsize(path) // 1024:3d}KB")


if __name__ == "__main__":
    main()
