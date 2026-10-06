#!/usr/bin/env python3
"""Regenerate the HOG cut-chart highlight overlays from the chart artwork.

Run from the site root:  python3 tools/build-cut-regions.py
Requires: opencv-python, pillow, numpy.

Each primal is seeded with one interior point; a watershed grows it out to the
drawn boundary, so the highlights match the artwork exactly instead of being
positioned by hand. Output: assets/img/cuts/<name>.webp, full-canvas alpha.
"""
import cv2, numpy as np, os
from PIL import Image

# the shipped chart has its interior knocked out to match the cow, so region
# finding runs against the original filled artwork
CHART = "tools/src/cut-chart-pig-source.png"
OUT   = "assets/img/cuts-pig"
FILL  = (196, 40, 52)

SEEDS = {
    "head": (215, 300), "shoulder": (510, 235), "picnic": (495, 440),
    "rib": (745, 258), "loin": (964, 250), "belly": (862, 466),
    "ham": (1290, 316), "hockfront": (513, 597), "hockrear": (1372, 597),
}
# dashed primal lines need a wider kernel to close than the cow's solid rules;
# the hocks sit on narrow legs and get pinched shut at that size.
# 15 closes the dashed primal lines; the hocks sit on narrow legs and get
# pinched shut at that size, so they run at 9
KMAP = {n: 15 for n in SEEDS}; KMAP["hockfront"] = 9; KMAP["hockrear"] = 9
OPEN = {n: 9 for n in SEEDS};  OPEN["hockfront"] = 3; OPEN["hockrear"] = 3

# The ears and the snout are drawn with their own outlines, so the fill stops at
# them and leaves the head hollow in three places. Each is seeded separately and
# merged into the head. (x, y, kernel) -- the snout needs a smaller kernel or the
# dilation eats most of it.
EXTRA = {
    "head": [(182, 120, 5), (238, 121, 15), (38, 358, 5)],  # near ear, far ear, snout
}


def main():
    img = cv2.imread(CHART, cv2.IMREAD_UNCHANGED)
    H, W = img.shape[:2]
    alpha = img[..., 3]
    gray = cv2.cvtColor(img[..., :3], cv2.COLOR_BGR2GRAY)
    ink = ((alpha > 60) & (gray < 150)).astype(np.uint8)
    bgr = np.ascontiguousarray(img[..., :3])

    # the primal names are drawn in ink, so a label position sits on a letter and
    # has no clearance. Move each seed to the most open point nearby, measured by
    # distance to the nearest ink pixel.
    dist = cv2.distanceTransform((1 - ink).astype(np.uint8), cv2.DIST_L2, 5)
    dist[alpha <= 60] = 0
    WIN = {"hockfront": 38, "hockrear": 38, "picnic": 85, "shoulder": 85}
    def clear_seed(name, x, y):
        win = WIN.get(name, 120)
        x0, x1 = max(0, x - win), min(W, x + win)
        y0, y1 = max(0, y - win), min(H, y + win)
        sub = dist[y0:y1, x0:x1]
        iy, ix = np.unravel_index(int(np.argmax(sub)), sub.shape)
        return (x0 + int(ix), y0 + int(iy))

    for _n in list(SEEDS):
        SEEDS[_n] = clear_seed(_n, *SEEDS[_n])
    print("seeds:", {k: (v, round(float(dist[v[1], v[0]]), 1)) for k, v in SEEDS.items()})

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

    # free-space components for the extra pieces, by kernel
    def comps_at(k):
        kern = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (k, k))
        _, lab = cv2.connectedComponents((1 - cv2.dilate(ink, kern)).astype(np.uint8))
        return lab
    extra_labs = {k: comps_at(k) for k in {kk for v in EXTRA.values() for *_, kk in v}}
    os.makedirs(OUT, exist_ok=True)
    grow = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
    for i, name in enumerate(SEEDS):
        m = (sheets[KMAP[name]] == i + 2).astype(np.uint8)
        for ex, ey, ek in EXTRA.get(name, []):
            lab = extra_labs[ek]
            cid = int(lab[ey, ex])
            if not cid:
                raise SystemExit(f"{name}: extra seed ({ex},{ey}) k={ek} landed on ink")
            cell = (lab == cid).astype(np.uint8)
            # the kernel that isolated the cell also ate a rim off it, so grow it
            # back out to the drawn edge. Confined to the cell's own box, so a
            # gap in the outline cannot leak across the chart.
            ys, xs = np.where(cell)
            pad = ek + 6
            box = np.zeros_like(cell)
            box[max(0, ys.min() - pad):ys.max() + pad, max(0, xs.min() - pad):xs.max() + pad] = 1
            kern = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (ek * 2 + 1, ek * 2 + 1))
            m[(cv2.dilate(cell, kern) & (1 - ink) & box) > 0] = 1
        m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, grow)
        ok = OPEN[name]
        if ok > 1:
            m = cv2.morphologyEx(
                m, cv2.MORPH_OPEN,
                cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (ok, ok)))
        if name in EXTRA:
            out = np.zeros((H, W, 4), np.uint8)
            out[..., 0], out[..., 1], out[..., 2] = FILL
            out[..., 3] = cv2.dilate(m, grow) * 255
            path = os.path.join(OUT, name + ".webp")
            Image.fromarray(out).save(path, "WEBP", lossless=True, method=6)
            print(f"{name:10s} {os.path.getsize(path) // 1024:3d}KB  (+{len(EXTRA[name])} pieces)")
            continue
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
