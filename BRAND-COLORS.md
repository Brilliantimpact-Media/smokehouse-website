# The SmokeHouse — brand colour palette

Source of truth: `assets/img/logo-color.png`. Both reds were read out of the
artwork by pixel count, not sampled by eye. Re-derive at any time with:

```
python3 tools/brand-colors.py assets/img/logo-color.png
```

The logo contains exactly two saturated reds and nothing else. There is no
third red, and no gradient between them.

## The two reds

| Role | Hex | RGB | Where it lives in the logo |
|---|---|---|---|
| **Lighter decal red** | `#B11E24` | `177, 30, 36` | The flame, and the bright bricks |
| **Darker brick red** | `#720E16` | `114, 14, 22` | The chimney cap, and the dark bricks |

One derived value, not in the logo:

| Role | Hex | RGB | Derived how |
|---|---|---|---|
| Brick, pressed | `#590B11` | `89, 11, 17` | `#720E16` × 0.78 — hover and active only |

## How they are used

**`#B11E24` — lighter decal red.** Everything decorative and every small
detail: eyebrow tick marks, section rules, hand-written annotations, stamp
glyphs, price-label type, star ratings, carousel dots, photo registration
brackets, award flags, the seal on product cards.

**`#720E16` — darker brick red.** Buttons and prominent interactive controls
only: every `.btn`, the slaughter-date sign button, the product modal's close
button, and focus outlines. Hover and active press to `#590B11`.

The split is deliberate. The decal red is the louder of the two, so it earns
its place on small marks where it has to be seen at a glance; the brick red is
heavier and calmer, which is what a large filled button wants.

### One documented exception

On the dark footer, the "Employment Opportunities" pill hovers to the **decal
red**, not the brick. Brick sits at 1.6:1 against the near-black footer ground
and all but vanishes; the decal red reads at 2.8:1 and still carries cream text
at 5.8:1.

## Contrast

Measured as WCAG 2.1 contrast ratios.

| Pair | Ratio | Verdict |
|---|---|---|
| Cream `#F7F2E8` on brick `#720E16` (button text) | **10.5 : 1** | AAA |
| Cream `#F7F2E8` on pressed brick `#590B11` | **12.7 : 1** | AAA |
| Decal red `#B11E24` on cream `#F2ECE0` (accent type) | **5.8 : 1** | AA |
| Cream `#F2ECE0` on decal red `#B11E24` (flags, banners) | **5.8 : 1** | AA |
| Brick `#720E16` focus ring on cream `#F2ECE0` | **10.0 : 1** | AAA |

The old single red `#7A1F26` scored 9.2:1 as a button ground. The new brick is
a genuine improvement, not a trade-off.

## Where they are defined

`assets/css/site.css`, in `:root`:

```css
--brand-red:        #b11e24;   /* lighter decal red - accents and details */
--brand-brick:      #720e16;   /* darker brick red  - buttons and CTAs    */
--brand-brick-dark: #590b11;   /* derived, hover/active only              */
```

Role aliases sit directly underneath (`--btn-bg`, `--accent`, `--focus`, and
the legacy `--oxblood*` names). **Change a role alias, never a raw hex in a
rule.** No rule in the stylesheet should contain a red hex literal.

## The rest of the palette, unchanged

| Token | Hex | Role |
|---|---|---|
| `--paper` | `#F2ECE0` | Butcher-paper cream, page ground |
| `--paper-2` | `#E9E1D2` | Kraft-tinted cream |
| `--paper-3` | `#DDD2BE` | Faded tan |
| `--kraft` | `#C2AB8B` | Kraft |
| `--ink` | `#171310` | Near-black, body type and rules |
| `--ink-2` | `#3B322A` | Deep brown |
| `--ink-3` | `#7D746A` | Muted steel grey |
| `--rule` | `#CFC3AE` | Hairline rules |
| `--rule-strong` | `#A8998A` | Heavier rules |
| `--steel` | `#8B8681` | Steel |
| `--char` | `#14100D` | Charcoal ground, dark bands |
| `--char-2` | `#1F1915` | Charcoal, lifted |
| `--accent-ink` | `#F7F2E8` | Type on a red ground |

## Reporting dashboard

Use the same two reds and the same split: decal red for accents and data
marks, brick red for buttons and primary controls. For charts needing more
than one red, tint toward cream rather than inventing a third hue.
