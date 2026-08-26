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


## Logo — `logo.svg` (cleaned 2026-08-26)

**Use `logo.svg`.** One vector lockup, painted with `currentColor` through a CSS
mask, so a single file serves every ground. Colour it by setting `color` on the
`.wordmark` wrapper; no per-colourway files needed.

### How it was cleaned

Two rounds of supplied SVGs were unusable as delivered:

1. **First round** exported the wordmark as live `<text>` calling for Citrus
   Gothic Solid, Quincy CF and Ultra. Browsers have none of them, so the type
   fell back to a serif, set too wide, and clipped at the canvas edge.
2. **Second round** outlined the type correctly, but shipped the whole artboard:
   several overlapping copies of the lockup (black, white and a dark red
   `#930000`), plus five leftover live-`<text>` duplicates. Two of those text
   duplicates sat off to the left yet rendered wide enough in the fallback font
   that their right edges pushed into the canvas — the stray red text and the
   sliver of a letter that were showing on the site. On a machine with the real
   fonts installed they are narrower and stay hidden, which is why they looked
   fine to the designer.

Measured every element's true bounds with the browser's `getBBox()` (parsing the
path data by hand is unreliable — SVG uses relative commands), which isolated
the 37 shapes that make up the genuine in-canvas lockup. `logo.svg` is those 37
paths, class and fill stripped. 58KB to 26KB.

**If a new logo file ever arrives, check it the same way** rather than trusting
the visual in Illustrator.

`logo-onlight.png` / `logo-ondark.png` are retained as raster fallbacks and for
anywhere a mask is unsuitable (email, og:image).

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

## VS slider steaks (`steaks/`, added 2026-08-26)

`steak-dryaged.webp` and `steak-store.webp`. Client-generated on white, then
processed here: the ground was removed with a corner flood fill (so pale
intramuscular fat is never mistaken for background), the cut-outs were scaled
to an identical 1429px subject width, and both were centred on the same
1600x1000 canvas. Because the subject sits at the same size and centre in both
files, the wipe transforms one steak into the other without any shift.

They are transparent, so the stage renders them over the butcher-paper ground
rather than inside a white photo box.

**Open question for the client.** The pairing shows a difference in *marbling*
as much as ageing, and marbling is a function of grade, not of dry-ageing. If
The SmokeHouse mostly sells Choice-grade beef, the dry-aged image promises more
than a customer will receive. The honest version is two similarly-marbled
steaks where only the colour and surface differ. Raised with Alexia 2026-08-26.

## Slots the site is currently reserving

| Page | Slot | What it wants |
|---|---|---|
| `index.html` | hero | One strong wide shot: the counter, the case, or a hand at work |
| `custom-processing.html` | process ×2 | Dry-aging room · labeled, wrapped packages |
| `in-the-case.html` | products ×6 | The four award winners + deli + weekly special |
| `wholesale.html` | 1 wide | Volume/bulk product or a delivery moment |
| `about.html` | 2 | The crew · the Durand building on the Chippewa |
