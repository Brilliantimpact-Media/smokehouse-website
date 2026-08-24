# The SmokeHouse — Website

New site for The SmokeHouse (Durand & Woodville, WI), built for Brilliant Impact.

**Copy source of truth:** [`smokehouse-messaging-brief.md`](smokehouse-messaging-brief.md)
**Decisions needed:** [`docs/open-questions.md`](docs/open-questions.md)

## Stack

Static HTML/CSS/JS. No build step, no dependencies — open `index.html` or serve the
folder with anything. Google Fonts (Archivo + Newsreader) is the only external
resource.

## Pages

| File | Persona it serves |
|---|---|
| `index.html` | All three — routes each to their page in the first screen |
| `custom-processing.html` | #1 Farm-to-Freezer (cut sheets, split orders, scheduling) |
| `in-the-case.html` | #2 Neighborhood Retail (weekly case, award winners, deli) |
| `wholesale.html` | #3 Wholesale Partner (fast pricing, consistency, local story) |
| `about.html` | Story, differentiators, partners, awards |
| `visit.html` | Hours, both locations, all CTAs land here |

## Placeholder status (intentional)

- **Branding:** neutral paper-and-ink palette only — logo not delivered, identity
  direction undecided. All colors are CSS tokens in `assets/css/site.css:root`.
- **No tagline anywhere** — drafted one was rejected; replacement TBD.
- **Images:** hatched placeholder blocks, not photos. Map in `assets/img/README.md`.
- **Reviews:** placeholder cards awaiting real Google/Yelp quotes.

Visible `.note` build-note callouts mark every placeholder on the pages themselves;
strip them before launch.
