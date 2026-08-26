# Open questions & decisions needed

Running list of everything blocked on client/project-owner input. Nothing here has
been decided by the developer; the site currently ships the neutral/safe option in
each case.

## Blocking-ish (affect launch)

1. **Visual identity direction — RESOLVED 2026-08-25.** The client directed a
   "modern blue-collar butcher shop / meat market / smokehouse" aesthetic and
   specified the palette: butcher-paper cream, warm off-white, deep oxblood /
   meat red, dark burgundy, charcoal, near-black, deep brown, muted steel gray,
   kraft tan. This **supersedes the earlier hold on inventing brand colors.**
   Implemented as CSS tokens in `assets/css/site.css` (`:root`). Type is
   Big Shoulders Display (condensed signage) + Archivo (body).
   **Still open:** whether the incoming logo agrees with this palette.
2. **Logo — RECEIVED 2026-08-25.** Flame mark + "SMOKEHOUSE" condensed caps +
   "CRAFTED MEAT & PROCESSING" descriptor. Two colorways supplied and both are in
   use: `logo-ondark.png` (reversed/white) on dark grounds, `logo-onlight.png`
   (black) on paper. **Still needed: vector originals (SVG/EPS/AI).** The supplied
   PNGs are 455×169 — fine at header size, soft if ever scaled large or printed.
3. **Tagline — RESOLVED 2026-08-25.** Confirmed: **"Crafted Meat, Trusted
   Processing"** — now treated as verbatim text. "Local Cuts. No Shortcuts."
   remains rejected; "We Put the Thrill Back Into the Grill!" is retired.
4. **Product catalog scope.** Current site lists hundreds of SKUs across dozens of
   categories. New site currently shows a category-level overview + the four named
   award winners. Full list vs. category pages vs. highlights — undecided.
5. **Photography.** CONFIRMED: the large steak photo stays as the homepage hero
   (now live as `assets/img/hero-steak-WEB-PULLED.jpg`, pulled from
   thedurandsmokehouse.com — 1920px compressed derivative, NOT a final asset; a
   visible chip on the hero flags this). All other slots remain hatched
   placeholders. Ask whether higher-res originals exist. (Slot map:
   `assets/img/README.md`.)
6. **Reviews.** Homepage review block uses placeholders. Need 3 real Google/Yelp
   quotes that name specific products or staff (per the guide) + permission to use
   names.

## Confirm-before-launch facts

7. **Supplier partnerships** — Rattlesnake Ridge Bison and Painted Outlaw Beef are
   featured on `about.html`; confirm both are still active or remove.
8. **Hours** — carried from the current site; confirm they're current, apply to both
   locations, and whether deer-season hours differ.
9. **"Decades" wording** — the guide's competitor page headline reads "Decade of
   Craft, One Crew" while its body copy says decades; the site uses "Decades."
   Confirm.

## Feature decisions (proposed, not built — need approval per the creative mandate)

10. **Slaughter-date request form** (`visit.html#schedule`). The current site has
    one; the guide's persona 1 wants "easy scheduling, phone or online." Needs: where
    submissions go, and a form backend (Netlify Forms is free if we host there).
11. **Lead magnet** — "What to Expect When You Schedule a Custom Order" gated
    download + 4-email nurture sequence (guide pp. 20, 24–27). Needs: the actual
    one-pager content, a sample cut sheet, and an email platform decision.
12. **Weekly "in the case" automation** — see suggestion in project notes: if the
    shop posts weekly to Facebook anyway, the site section could mirror it instead
    of being hand-edited.

## Explicitly rejected / do-not-do

- "Local Cuts. No Shortcuts." — anywhere, in any form.
- "We Put the Thrill Back Into the Grill!" — retired.
- Substituting the logo's "Crafted Meat & Processing" descriptor for the tagline.
- Copying the current site's layout, tone, or structure.

## Resolved 2026-08-26

13. **Kielbasa award claim / missing ham — RESOLVED.** The "Hungarian Style
    Kielbasa" card had no supporting award record on the client's own /awards
    page, and ham (their most-decorated product) was absent from the site.
    Per client direction the kielbasa card was replaced with **Smoked Boneless
    Ham**, and the generic "Award-winning." line was replaced with the client's
    own wording from /awards, shortened at the client's request to
    **"Grand Champion"** (2017 National, full record reads "Grand Champion -
    Ham Boneless Commercial"). Ham leads the row as the highest honour. Ham also holds 2019 International Gold for Boneless and
    Semi-Boneless Ham, and 2019 State Reserve Grand Champion (Commercial
    Boneless) and Champion (Traditional Boneless), if a stronger or different
    line is wanted later.
    **Still open:** the ham slot has no photograph, so it currently shows the
    hatched "Ham photo pending" placeholder while the other four cards show
    generated stand-ins. Also, the review label further up the homepage still
    names the Hungarian Style Kielbasa.
