# Image assets

## Pulled from thedurandsmokehouse.com (2026-08-25)

Migrated from the client's own live site, per the brief. **All web-sized
derivatives, not final assets** — replace with originals before launch if they
exist.

In `shop/`: `brisket-sliced`, `steak-plated`, `owners-awards`, `award-wall`,
`awards-medals`, `wood-grain`.
In `icons/`: the six category marks, lifted off their green tiles and recoloured
to `--ink` with transparency.

**What the old site does NOT have.** Its photo library is far thinner than it
looks. There are only three real product photographs on the whole site
(`meat_slide`, `1.jpg`, `page-title`), plus award documentation. Notably the
`/gallery` page — titled "Local Butcher Shop" — and `/programs` are filled with
**stock yoga and fitness images** left over from the WordPress theme demo and
never replaced. Nothing there is usable.

So these slots still need a real shoot and cannot be filled from the old site:
- the five named award winners (Cheddar Garden Brat, Hungarian Kielbasa,
  Butches Franks, thick-cut and regular bacon) — no individual product shots exist
- the two matched steaks for the homepage comparison wipe
- the retail case, the deli counter, the dry-aging room, the crew at work,
  and the Durand building exterior


## Logo (delivered 2026-08-25)

`logo-onlight.png` (black) and `logo-ondark.png` (reversed/white) are the same
lockup: flame mark + SMOKEHOUSE + "CRAFTED MEAT & PROCESSING" descriptor. Both
ship; CSS swaps them by background — reversed on the hero/dark bands/footer,
black on paper.

**Still needed: usable vector originals.** SVGs were supplied on 2026-08-25 but
are **not usable**: they were exported with live `<text>` rather than outlines,
and depend on three fonts a browser will never have — Citrus Gothic Solid,
Quincy CF, and Ultra. Browsers substitute a default serif, which renders the
wordmark in the wrong typeface *and* too wide, so it overflows the viewBox and
gets clipped. They also carry several duplicate copies of the mark positioned
far outside the viewBox.

Re-export from Illustrator with **Type > Create Outlines** applied first (or
tick "Convert text to outlines" in the SVG export dialog), and delete the
off-canvas duplicates. Once that lands, the PNGs can be retired.

Until then the site uses the 455×169 PNGs, which are fine at the sizes in use
(54px header, 82px footer) but will soften if scaled much larger or used in print.


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

## VS slider photography (home-v2) — NEEDED

The "SmokeHouse vs. the meat aisle" comparison is a photo wipe. Two slots, both
hatched placeholders right now:

| Slot | Subject |
|---|---|
| A | A SmokeHouse dry-aged steak |
| B | A steak bought from a grocery store |

**The two frames must match exactly or the wipe breaks.** Shoot both in one
session without moving the camera:

- Tripod or a phone propped and untouched between shots
- Same lighting, same background, same surface; plain white or the paper cream
- Same distance, same angle (straight-on or straight-down — pick one)
- Steak in the same position in frame, roughly the same size in frame
- Landscape, 16:10-ish, highest resolution available
- Manual/locked exposure and white balance if the camera allows — auto mode
  will shift the colour between shots and give the comparison away

Swap each `.vs__ph` div for an `<img>` inside its `.vs__shot` figure.

**Honesty note:** the grocery-store steak must be a genuine, fairly-photographed
one. Don't stage a bad example — a comparison that overreaches is both a legal
risk and, if a customer notices, worse for trust than no comparison at all.

## Slots the site is currently reserving

| Page | Slot | What it wants |
|---|---|---|
| `index.html` | hero | One strong wide shot: the counter, the case, or a hand at work |
| `custom-processing.html` | process ×2 | Dry-aging room · labeled, wrapped packages |
| `in-the-case.html` | products ×6 | The four award winners + deli + weekly special |
| `wholesale.html` | 1 wide | Volume/bulk product or a delivery moment |
| `about.html` | 2 | The crew · the Durand building on the Chippewa |
