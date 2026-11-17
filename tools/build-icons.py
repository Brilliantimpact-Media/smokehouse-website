#!/usr/bin/env python3
"""Rebuild the whole favicon set from the logo artwork.

    python3 tools/build-icons.py

Everything is derived from assets/img/logo-color.png, so if the logo is ever
re-supplied this regenerates the icons rather than anyone re-cropping by hand.
Writes favicon.svg, mask-icon.svg, favicon-32.png, favicon-16.png and
apple-touch-icon.png into assets/img/.

Three things are worth knowing before changing this:

* The artwork is flat colour with hard edges and binary alpha - there is no
  anti-aliasing to recover - so separating it into three colour layers is
  lossless and the contour trace is exact.
* The chimney's mortar courses are transparent GAPS, not light-coloured
  pixels. Masking opaque pixels therefore still leaves the courses behind;
  where a solid chimney is wanted it has to be filled per column.
* Safari fills the mask-icon path with the link's color= and ignores
  everything else, so a background rect in that file paints the entire tab a
  solid block. The previous mask-icon pointed at a file that had one.
"""
import os
import sys

import cv2
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG = os.path.join(ROOT, "assets", "img")
SRC = os.path.join(IMG, "logo-color.png")

INK, DECAL, BRICK, PAPER = "#171310", "#b11e24", "#720e16", "#f2ece0"
MARK_W = 87        # the mark ends here; a 26px gap follows before the wordmark
CHIM_TOP = 100     # first row of the chimney; the flame is everything above
SS = 8             # supersample factor for tracing and rasterising


def load():
    im = cv2.imread(SRC, cv2.IMREAD_UNCHANGED)
    if im is None:
        sys.exit("cannot read %s" % SRC)
    im = im[:, 0:MARK_W]
    b, g, r, a = (im[:, :, i].astype(int) for i in range(4))
    op = a >= 128
    layers = {
        "ink":   op & (r < 90) & (g < 90) & (b < 90),
        "decal": op & (abs(r-177) < 45) & (abs(g-30) < 45) & (abs(b-36) < 45) & (r > g+60),
        "brick": op & (abs(r-114) < 34) & (abs(g-14) < 34) & (abs(b-22) < 34) & (r > g+40),
    }
    stray = int((op & ~(layers["ink"] | layers["decal"] | layers["brick"])).sum())
    if stray:
        print("  note: %d opaque px matched no colour layer" % stray)
    return op, layers


def solid_chimney(op):
    """Close the transparent mortar courses, leaving the chimney's outline."""
    out = op.copy()
    for x in range(op.shape[1]):
        col = np.nonzero(op[CHIM_TOP:, x])[0]
        if col.size:
            out[CHIM_TOP + col.min():CHIM_TOP + col.max() + 1, x] = True
    return out


def bbox(mask):
    ys, xs = np.where(mask)
    return xs.min(), xs.max() + 1, ys.min(), ys.max() + 1


def trace(mask, box, eps=0.45):
    X0, X1, Y0, Y1 = box
    mw, mh = X1 - X0, Y1 - Y0
    m = (mask[Y0:Y1, X0:X1].astype(np.uint8)) * 255
    big = cv2.resize(m, (mw*SS, mh*SS), interpolation=cv2.INTER_CUBIC)
    _, big = cv2.threshold(big, 127, 255, cv2.THRESH_BINARY)
    cnts, _ = cv2.findContours(big, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_SIMPLE)
    out = []
    for c in cnts:
        if cv2.contourArea(c) < (SS*SS) * 0.5:
            continue
        c = cv2.approxPolyDP(c, eps*SS, True)
        out.append("M" + "L".join("%.2f,%.2f" % (p[0][0]/SS, p[0][1]/SS)
                                  for p in c) + "Z")
    return " ".join(out)


def hex2bgr(h):
    h = h.lstrip("#")
    return (int(h[4:6], 16), int(h[2:4], 16), int(h[0:2], 16))


def raster(size, pad_frac, radius_frac, draw, box):
    """Draw the listed (mask, colour) pairs at 8x, then box-filter down."""
    X0, X1, Y0, Y1 = box
    mw, mh = X1 - X0, Y1 - Y0
    S = size * SS
    canvas = np.zeros((S, S, 4), np.uint8)
    rad = int(radius_frac * S)
    g = np.full((S, S), 255, np.uint8)
    if rad:
        g[:] = 0
        cv2.rectangle(g, (rad, 0), (S-rad, S), 255, -1)
        cv2.rectangle(g, (0, rad), (S, S-rad), 255, -1)
        for cx, cy in ((rad, rad), (S-rad, rad), (rad, S-rad), (S-rad, S-rad)):
            cv2.circle(g, (cx, cy), rad, 255, -1)
    canvas[:, :, :3] = hex2bgr(PAPER)
    canvas[:, :, 3] = g
    pad = pad_frac * S
    sc = min((S - 2*pad) / mw, (S - 2*pad) / mh)
    ox, oy = (S - mw*sc) / 2, (S - mh*sc) / 2
    for mask, colour in draw:
        m = (mask[Y0:Y1, X0:X1].astype(np.uint8)) * 255
        big = cv2.resize(m, (int(mw*sc), int(mh*sc)), interpolation=cv2.INTER_CUBIC)
        _, big = cv2.threshold(big, 127, 255, cv2.THRESH_BINARY)
        hh, ww = big.shape
        sub = canvas[int(oy):int(oy)+hh, int(ox):int(ox)+ww]
        sel = big > 0
        sub[:, :, :3][sel] = hex2bgr(colour)
        sub[:, :, 3][sel] = 255
    return cv2.resize(canvas, (size, size), interpolation=cv2.INTER_AREA)


def main():
    op, L = load()
    box = bbox(op)
    X0, X1, Y0, Y1 = box
    mw, mh = X1 - X0, Y1 - Y0

    # favicon.svg - full mark, real colours, cream rounded ground
    BOX, PAD = 100, 14
    s = min((BOX - 2*PAD) / mw, (BOX - 2*PAD) / mh)
    tx, ty = (BOX - mw*s) / 2, (BOX - mh*s) / 2
    svg = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %d %d" '
           'role="img" aria-label="The SmokeHouse">\n'
           '  <rect width="%d" height="%d" rx="18" fill="%s"/>\n'
           '  <g transform="translate(%.2f %.2f) scale(%.4f)">\n'
           '    <path fill="%s" d="%s"/>\n'
           '    <path fill="%s" d="%s"/>\n'
           '    <path fill="%s" d="%s"/>\n'
           '  </g>\n</svg>\n') % (
        BOX, BOX, BOX, BOX, PAPER, tx, ty, s,
        INK, trace(L["ink"], box),
        BRICK, trace(L["brick"], box),
        DECAL, trace(L["decal"], box))
    open(os.path.join(IMG, "favicon.svg"), "w").write(svg)
    print("  favicon.svg          %5d B" % len(svg))

    # mask-icon.svg - flat silhouette, solid chimney, no ground
    sil = solid_chimney(op)
    sbox = bbox(sil)
    msvg = ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %d %d">\n'
            '  <path fill="black" d="%s"/>\n</svg>\n') % (
        sbox[1]-sbox[0], sbox[3]-sbox[2], trace(sil, sbox))
    open(os.path.join(IMG, "mask-icon.svg"), "w").write(msvg)
    print("  mask-icon.svg        %5d B" % len(msvg))

    full = [(L["ink"], INK), (L["brick"], BRICK), (L["decal"], DECAL)]
    for fn, size, pad, rad in [("favicon-32.png", 32, 0.09, 0.17),
                               ("apple-touch-icon.png", 180, 0.16, 0.0)]:
        cv2.imwrite(os.path.join(IMG, fn), raster(size, pad, rad, full, box))
        print("  %-20s %5d B" % (fn, os.path.getsize(os.path.join(IMG, fn))))

    # 16px gets an optically-sized variant: at that size the five mortar
    # courses fall under a pixel each and turn the chimney into a smudge, so
    # it is drawn solid and only the silhouette survives, which is the part
    # that is legible anyway.
    chim = solid_chimney(op)
    chim[:CHIM_TOP, :] = False
    fi, fd = L["ink"].copy(), L["decal"].copy()
    fi[CHIM_TOP:, :] = False
    fd[CHIM_TOP:, :] = False
    small = [(chim, BRICK), (fi, INK), (fd, DECAL)]
    cv2.imwrite(os.path.join(IMG, "favicon-16.png"),
                raster(16, 0.04, 0.17, small, box))
    print("  favicon-16.png       %5d B" % os.path.getsize(os.path.join(IMG, "favicon-16.png")))


if __name__ == "__main__":
    print("rebuilding icons from %s" % os.path.relpath(SRC, ROOT))
    main()
