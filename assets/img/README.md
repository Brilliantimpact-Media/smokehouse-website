# Image assets

## Logo (delivered 2026-08-25)

`logo-onlight.png` (black) and `logo-ondark.png` (reversed/white) are the same
lockup: flame mark + SMOKEHOUSE + "CRAFTED MEAT & PROCESSING" descriptor. Both
ship; CSS swaps them by background — reversed on the hero/dark bands/footer,
black on paper.

**Still needed: vector originals (SVG/EPS/AI).** The supplied PNGs are 455×169,
which is fine at header size but will soften if scaled large or used in print.


**Empty on purpose.** Every image slot on the site currently renders a hatched
placeholder block (`.photo` in `assets/css/site.css`) so nobody mistakes a stand-in
for a finished asset.

The client wants to keep the existing product photography from
thedurandsmokehouse.com. Those web-sized files are **compressed derivatives, not
final assets** — higher-resolution originals should replace them before launch if
they exist.

## When photos arrive

1. Drop files here as `.webp` (with a `.jpg` fallback if needed).
2. Replace `<div class="photo">…</div>` with a real `<img>`/`<picture>`, keeping the
   same aspect-ratio class so the layout doesn't shift.
3. Every image needs real alt text — describe the cut or the scene, not "meat photo."

## Cut-chart highlights (`cuts/`, generated)

**Derived from the chart artwork itself, not hand-placed.** `tools/build-cut-
regions.py` reads `cut-chart-cow.png`, bridges the dashed separators with a
morphological dilation, seeds one point per primal, and runs a watershed so each
region grows out to the actual drawn boundary. Output is nine full-canvas
(1672x941) alpha WebPs — all nine total ~5KB, since each is a single flat colour
over transparency.

Because they are full-canvas, the page positions them with `inset: 0` and
`width: 100%` — registration is pixel-exact at every screen size with zero
placement math. Composited with `mix-blend-mode: multiply` so the chart's own
labels and dashed lines stay readable through the highlight.

Two tuned constants live in the script: the dilation kernel is 13 (needed to keep
sirloin from leaking over the round and down the tail) except for the shank,
which runs at 7 because the leg is too narrow for a 13px kernel and gets pinched
shut. **Re-run the script if the chart artwork is ever replaced.**

## Inspection stamp (`stamp-dry-aged.webp`, supplied 2026-08-25)

Client-supplied circular stamp: THE SMOKEHOUSE / DRY-AGED / UP TO 30 DAYS /
DURAND · WOODVILLE. Interior is transparent, so the butcher-paper ground shows
through like real ink. Ink reads #79070F — effectively the palette's oxblood.
Trimmed and downscaled to 509px (91KB); animates in with the stamp-hit "slam".

Note the claim on it — *up to 30 days* — matches the differentiator copy. If the
aging window ever changes, this artwork changes with it.

## VS slider (home-v2)

The "SmokeHouse vs. the meat aisle" comparison is **one steak, drawn twice** as
inline SVG — no photography needed and nothing to source. The same ribeye path
renders in both layers; only the styling differs:

- **Meat aisle:** pale grey-pink fill, faint marbling, and two plastic-wrap
  sheen strokes (clipped to the body so they stay on the meat).
- **The SmokeHouse:** deep oxblood, a proper cream fat cap, heavy marbling, no
  plastic.

The wipe layer carries a paper-coloured background — without it the layer
beneath ghosts through the transparent one. Paper on paper reads as no panel,
which is the point: there is no box, just the cut.

To swap in real photography later, replace the two `.steak` SVGs with `<img>`
of the same aspect — both sides must match framing exactly or the wipe breaks.

## Slots the site is currently reserving

| Page | Slot | What it wants |
|---|---|---|
| `index.html` | hero | One strong wide shot: the counter, the case, or a hand at work |
| `custom-processing.html` | process ×2 | Dry-aging room · labeled, wrapped packages |
| `in-the-case.html` | products ×6 | The four award winners + deli + weekly special |
| `wholesale.html` | 1 wide | Volume/bulk product or a delivery moment |
| `about.html` | 2 | The crew · the Durand building on the Chippewa |
