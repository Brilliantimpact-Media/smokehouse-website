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
9. **"Decades" wording — RESOLVED 2026-08-26.** Client confirmed the singular:
   "The SmokeHouse has been earning this craft for **over a decade**." Applied to
   the statement aside and to the sequence heading, now "A decade of craft, one
   crew" (client wording, 2026-08-26).
   **Deliberately NOT changed: about.html.** Its "Decades on the Chippewa" and
   "smoking meat for decades" describe the shop and the site, not the current
   ownership, and the very next sentence supports it: the previous owner ran it
   34 years and the current owners bought the business in 2011. Changing those
   would contradict the copy around them. The meta description still says
   "serving the Chippewa and St. Croix Valley for decades" and reads either way.
   Flagged for the client to confirm.

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

## Client revision round 1, applied 2026-08-26

14. **Homepage reordered** to the client's numbering: hero, statement, best
    sellers, products, comparison graphic + chart, dry-aging sequence, reviews,
    two locations, closing CTA. Item 10 "cutting / custom processing" was
    confirmed by the client as the existing "One does the cutting. One does the
    counter." locations row, not a new section.
15. **Removed:** the scrolling marquee ticker and the "What are you here for"
    three-column persona row, with their CSS and JS.
16. **Header logo** raised from 54px to 78px to sit with the footer lockup
    (60px under 1000px, 46px under 560px). Applies to every page.
17. **Hero tagline** enlarged and reversed to full paper with a double shadow.
    While doing it: `.eyebrow--plain` had been in the markup since the start with
    no rule behind it, so the tick marks it was meant to suppress were still
    drawing on the hero. Now implemented.
18. **Best sellers** cut to four (thick-cut bacon removed), retitled
    "Award-Winning Meat That's Worth the Drive" with "Best sellers" demoted to
    the eyebrow, and the row changed from a scrolling carousel to a four-column
    grid so it fits without scrolling.
19. **Products row added** using the approved sign design: their eight
    categories, each opening the full grouped catalogue popup.
    **Still open:** the popup itself has had no design pass, it is currently the
    plain two-column list from the preview.

20. **Products popup designed 2026-08-26** from the client's mockup: parchment
    ground, double rounded frame, seal beside the category name, round oxblood
    close button, two columns split by a dotted rule, star-ruled group headings,
    chevron bullets. Typography deliberately stays on the site system, Big
    Shoulders Display and Archivo, rather than the distressed western face in the
    mockup, per the client's "font should be consistent the whole way out".
21. **Category tiles simplified:** corner stars and rule dividers removed (client
    found them too western), names enlarged, photo scrim lightened from 42% to
    58% brightness.
    **ASSUMPTION TO CONFIRM:** the client wrote "we could just have the symbol,
    sausage, and then a few product". Read as symbol + category name + the View
    Products button, taking "a few product" as dictation for "View Products".
    If she meant listing two or three example products on each tile, that is a
    different build.
    Stars removed from the popup headings too, 2026-08-26; group headings are
    now a plain rule either side of the name. No stars anywhere on the site.

22. **Award labelling audited 2026-08-26.** Their product list labels exactly five
    items "Award Winning!": Thick bacon, Regular bacon and Cheddar Garden Brat
    under Pork, and Butches Franks and Hungarian Style Kielbasa under Sausage.
    Beef, Venison, Lamb, Misc., Poultry and Woodville Deli carry none. Our popups
    mirror that exactly, which is why some categories show labels and some do not.
    Our wording is now theirs verbatim, "Award Winning!", on both the popup chips
    and the best-seller cards. Ham keeps "Grand Champion." per client direction.
    **FOR JOHN:** their product list does not label ham as award winning at all,
    even though ham is the most-decorated product on their own awards page. It
    does label Hungarian Style Kielbasa, which has no matching award record.
    Those two contradictions are still unresolved.
23. **Dry-aging bar** confirmed as `.seq__bar`, the scroll progress line. Now a
    grass verge with a cow walking it as the four panels advance. The counter is
    back on the right, top-aligned with the heading via a two-column grid.
    A blanket `.seq__sticky > *` rule had overridden `position: absolute` on the
    counter, label and bar, which is what moved the number left and dropped the
    bar on top of the copy.

24. **Sub-page consistency pass, 2026-08-26.** Root cause of the drift: every
    piece of homepage design lived in index.html's inline <style>, so the
    sub-pages, which link only site.css, inherited none of it. The shared card,
    sign and popup CSS is now in site.css, and the products JS is in site.js.
    Applied to all five sub-pages: framed photographs, cards with the oxblood
    rule over the name, restyled heroes, grain on the dark bands.
    in-the-case.html now runs the real sign row and popup in place of the
    duplicate .cat-icons list; assets/img/icons/ and its CSS are deleted.
    Also removed three em dashes that were still in the cut-chart copy in
    site.js, which had escaped the earlier sweep because they were \u2014
    escapes rather than literal characters.
    **Still open:** visit.html has no photography at all, and only six real
    photos exist across the five sub-pages.

25. **REGRESSION, found and fixed same day.** Promoting the sign and popup CSS
    out of index.html into site.css broke every category photograph and seal
    glyph on the products row. A relative url() carried in a custom property
    resolves against the stylesheet that CONSUMES it, so
    url("assets/img/cat/...") became assets/css/assets/img/cat/... and 404'd.
    The tiles rendered as flat charcoal with empty seals.
    Fixed by not routing paths through custom properties at all: site.js now
    sets background-image and mask-image inline on the elements, which resolves
    against the document. The CSS keeps only the non-URL longhands.
    LESSON: moving CSS between files changes the base URL for every relative
    url() in it, including ones passed through variables.

26. **Client feedback 2026-08-25, second item is moot.** "Text overlay on the what
    are you here for section, second black box, shorten 'you are' to 'you're'."
    That three-column persona section was removed on 2026-08-26 at the client's
    own request, so both the overlay and the title are gone. No "what are you
    here for" copy remains anywhere on the site. The only text that briefly
    overlaps now is the dry-aging panel crossfade, which is intentional and
    settles to a single panel; measured one visible panel at rest at every scroll
    position.
