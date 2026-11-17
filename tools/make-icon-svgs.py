#!/usr/bin/env python3
"""Build favicon.svg and mask-icon.svg from the client's vector logo.

    python3 tools/make-icon-svgs.py

Both reuse the artwork's own paths - nothing is traced or redrawn. The PNG
favicons come from tools/make-icon-pngs.html, which uses the same padding
figures below; change them in both places together.

Two things worth knowing:

* Safari fills the mask-icon path with the link's color= and ignores
  everything else, so a background rect in that file paints the whole pinned
  tab a solid block.
* The chimney's mortar courses are gaps between polygons. At the ~16px Safari
  draws a pinned tab they read as stripes, so the silhouette replaces the nine
  brick polygons with two rects spanning their extents.
"""
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG = os.path.join(ROOT, "assets", "img")

PAPER = "#f2ece0"
CLS = {"cls-1": "#b11e24", "cls-2": "#720e16"}
MX, MY, MW, MH = 8.72, 14.34, 85.94, 187.77   # mark bbox, measured with getBBox
BOX, PAD, RX = 100, 20, 18                    # PAD 13 read as cramped; 20 breathes

# The chimney's outline, for the silhouette: the cap, then the brickwork.
CAP = (8.72, 113.85, 85.94, 14.88)
BODY = (14.69, 128.73, 74.41, 73.38)


def mark_shapes(svg):
    """Every shape left of x=100. The wordmark starts at x=142."""
    out = []
    for m in re.finditer(r'<(?:path|polygon)\b[^>]*/>', svg):
        tag = m.group(0)
        g = re.search(r'(?:\sd|\spoints)="([^"]+)"', tag)
        if not g:
            continue
        nums = [float(n) for n in re.findall(r'-?\d+\.?\d*', g.group(1))]
        if max(nums[0::2]) < 100:
            out.append(tag)
    return out


def paint(tag):
    m = re.search(r'class="(cls-\d)"', tag)
    if m:
        return tag.replace(m.group(0), 'fill="%s"' % CLS[m.group(1)])
    return re.sub(r'^<(path|polygon)\s', r'<\1 fill="#000000" ', tag)


def main():
    src = open(os.path.join(IMG, "logo-color.svg")).read()
    shapes = mark_shapes(src)
    if len(shapes) != 11:
        raise SystemExit("expected 11 shapes in the mark, found %d" % len(shapes))

    s = min((BOX - 2*PAD)/MW, (BOX - 2*PAD)/MH)
    tx = (BOX - MW*s)/2 - MX*s
    ty = (BOX - MH*s)/2 - MY*s
    body = "\n    ".join(paint(t) for t in shapes)
    open(os.path.join(IMG, "favicon.svg"), "w").write(
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {BOX} {BOX}" '
        f'role="img" aria-label="The SmokeHouse">\n'
        f'  <rect width="{BOX}" height="{BOX}" rx="{RX}" fill="{PAPER}"/>\n'
        f'  <g transform="translate({tx:.3f} {ty:.3f}) scale({s:.5f})">\n'
        f'    {body}\n  </g>\n</svg>\n')

    flames = [re.sub(r'\s*class="cls-\d"', '', t) for t in shapes if t.startswith("<path")]
    rects = "\n  ".join(
        '<rect x="%s" y="%s" width="%s" height="%s"/>' % r for r in (CAP, BODY))
    open(os.path.join(IMG, "mask-icon.svg"), "w").write(
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{MX} {MY} {MW} {MH}">\n'
        f'  ' + "\n  ".join(flames) + f'\n  {rects}\n</svg>\n')

    for f in ("favicon.svg", "mask-icon.svg"):
        print("  %-16s %5d B" % (f, os.path.getsize(os.path.join(IMG, f))))


if __name__ == "__main__":
    main()
