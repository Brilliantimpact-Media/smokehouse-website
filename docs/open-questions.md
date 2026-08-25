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
2. **Logo.** Not yet received. A typographic wordmark stands in. When it arrives,
   replace `.wordmark` in the header/footer.
3. **Tagline.** "Local Cuts. No Shortcuts." was rejected by the client and is not
   used anywhere. The current site's "We Put the Thrill Back Into the Grill!" is
   neither carried over nor retired — the site simply ships without a tagline until
   the client decides keep / retire / replace.
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
- Inventing brand colors or designing around a placeholder logo.
- Copying the current site's layout, tone, or structure.
