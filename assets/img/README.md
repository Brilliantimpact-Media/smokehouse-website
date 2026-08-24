# Image assets

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

## Slots the site is currently reserving

| Page | Slot | What it wants |
|---|---|---|
| `index.html` | hero | One strong wide shot: the counter, the case, or a hand at work |
| `custom-processing.html` | process ×2 | Dry-aging room · labeled, wrapped packages |
| `in-the-case.html` | products ×6 | The four award winners + deli + weekly special |
| `wholesale.html` | 1 wide | Volume/bulk product or a delivery moment |
| `about.html` | 2 | The crew · the Durand building on the Chippewa |
