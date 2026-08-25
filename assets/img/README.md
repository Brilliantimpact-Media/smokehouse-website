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

## Cut-chart highlight pieces (`cuts/`, supplied 2026-08-25)

Nine anatomical shapes — chuck, rib, shortloin, sirloin, round, brisket, plate,
flank, shank — used as hover/tap highlights on the beef chart. Processed from the
supplied PNGs: trimmed, interiors flattened, and the baked-in labels removed (the
chart already carries its own labels). Positioned as percentages of the
1672x941 chart so they scale with it, and composited with `mix-blend-mode:
multiply` so the chart's dashed lines and labels stay readable underneath.

If the chart artwork is ever replaced, these placements must be re-derived.

## Inspection stamp (`stamp-dry-aged.webp`, supplied 2026-08-25)

Client-supplied circular stamp: THE SMOKEHOUSE / DRY-AGED / UP TO 30 DAYS /
DURAND · WOODVILLE. Interior is transparent, so the butcher-paper ground shows
through like real ink. Ink reads #79070F — effectively the palette's oxblood.
Trimmed and downscaled to 509px (91KB); animates in with the stamp-hit "slam".

Note the claim on it — *up to 30 days* — matches the differentiator copy. If the
aging window ever changes, this artwork changes with it.

## VS slider graphics (home-v2, awaiting client artwork)

The "SmokeHouse vs. the meat aisle" slider reserves two banner slots, both
currently hatched placeholders. They must be the **same dimensions and framing**
so the wipe lines up:

| Side | Wants |
|---|---|
| Left | A grocery-store meat case — sterile, shrink-wrapped, fluorescent |
| Right | The SmokeHouse counter — same camera distance, warm, real |

Drop them in as `<img>` inside `.vs__media`, replacing the `.vs__slot` div.

## Slots the site is currently reserving

| Page | Slot | What it wants |
|---|---|---|
| `index.html` | hero | One strong wide shot: the counter, the case, or a hand at work |
| `custom-processing.html` | process ×2 | Dry-aging room · labeled, wrapped packages |
| `in-the-case.html` | products ×6 | The four award winners + deli + weekly special |
| `wholesale.html` | 1 wide | Volume/bulk product or a delivery moment |
| `about.html` | 2 | The crew · the Durand building on the Chippewa |
