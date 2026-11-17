#!/usr/bin/env python3
"""Report the SmokeHouse brand reds straight from the logo artwork.

    python3 tools/brand-colors.py

The client's SVG declares both reds outright, so this just reads them back and
says where each one is used in the mark. Run it instead of eyedropping.

Before the SVG arrived these were recovered from a PNG export by counting
pixels - 2,967 px of #b11e24 and 3,252 px of #720e16 - and the SVG confirmed
both exactly. The pixel route is gone with the PNG; this is now the source.
"""
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEFAULT = os.path.join(ROOT, "assets", "img", "logo-color.svg")

# Which part of the mark each class paints, for anyone reading the output cold.
WHERE = {
    "#b11e24": "flame, and the bright bricks  - lighter decal red",
    "#720e16": "chimney cap, and the dark bricks - darker brick red",
}


def main(path):
    try:
        svg = open(path).read()
    except OSError as e:
        sys.exit(str(e))

    classes = dict(re.findall(r'\.(cls-\d)\s*\{\s*fill:\s*(#[0-9a-fA-F]{3,6});', svg))
    if not classes:
        sys.exit("no fill classes in %s - is this the right file?" % path)

    # Count how many shapes of the mark each class paints. The mark is every
    # shape left of x=100; the wordmark starts at x=142.
    used = {}
    for m in re.finditer(r'<(?:path|polygon)\b[^>]*/>', svg):
        tag = m.group(0)
        g = re.search(r'(?:\sd|\spoints)="([^"]+)"', tag)
        if not g:
            continue
        nums = [float(n) for n in re.findall(r'-?\d+\.?\d*', g.group(1))]
        if max(nums[0::2]) >= 100:
            continue
        c = re.search(r'class="(cls-\d)"', tag)
        key = classes.get(c.group(1), "?") if c else "#000000 (unclassed)"
        used[key] = used.get(key, 0) + 1

    print("%s\n" % os.path.relpath(path, ROOT))
    for colour, n in sorted(used.items(), key=lambda kv: -kv[1]):
        note = WHERE.get(colour.lower(), "")
        print("  %-22s %d shape%s  %s" % (colour, n, "" if n == 1 else "s", note))
    extra = set(classes.values()) - set(used)
    if extra:
        print("\n  elsewhere in the file: %s" % ", ".join(sorted(extra)))


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else DEFAULT)
