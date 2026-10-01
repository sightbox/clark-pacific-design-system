# Figma 2.5 addendum

On 30 Sep 2026 Kim found that most of the library's section components never made it into Figma. The addendum adds the **45 missing desktop section components**. It only adds: it never changes, merges into or restructures an existing 2.0 component or page.

## Where things are

| What | Where |
|---|---|
| Source (canonical for geometry and copy) | `handoff/source/kits/additions-2.5.html` (artboards `id="a25-…"`) |
| Component list, behaviour and intent | `handoff/manifest.json → additions25` |
| Rules for the build | `handoff/README.md` → "Addendum: Figma 2.5" |
| Developer notes | `handoff/reference/Figma 2.5 Dev Notes.md` |
| Kim's guide (HTML + PDF) | `handoff/addendum-2.5/Clark Pacific Figma 2.5 Guide.dc.html` / `.pdf` |
| Claude Design source frames and full package manifest | `handoff/addendum-2.5/` |
| Figma build | file **Clark Pacific 2.5 Additions**, key `EQ2vqFYpJhDbodciKa3FOj` (Sightbox team), **and** this design system (`gwXCIJW8u9a6s3txBv30M2`) → 02 · Components → section **2.5 Additions** |
| Build tooling | `tooling/a25/` (see `tooling/README.md` § 7) |

## The Figma build

The 45 were built as real components, not imported as frames, in two places:

1. **In the design-system file** (the main copy): page **02 · Components**, section **2.5 Additions** (`206:1071`) to the right of 05 · Cards & Grids. They use this file's own 2.0 Button, Accent Bar and icons, and are published with the library. Each has its description and dev note. The audit (30 Sep 2026) found no unbound fill, stroke, effect or text, and no overlaps, and the existing sections were untouched.
2. **In the separate 2.5 Additions file**, which is kept as Kim's working copy for the guide. It's described below.

- **Page `Components · 2.5 Additions`:** the 45 components in manifest order, each named exactly as its manifest `name` (`2.5 / …`), with a yellow dev note (plain frame, `Annotation/*` styles) to its right. Each component's description holds its intent and behaviour.
- **Page `Building blocks (from 2.0)`:** the 2.0 library isn't published to the Sightbox team, so the file carries copies of what the 45 use: all 26 paint and 81 text styles (from `tokens/source/figma-styles.json`), the Button, Text Link, Text Link / Card and Accent Bar sets (rebuilt from the 2.0 file's structure, hover reactions included) and the 47 icons. Logo / Long was not copied; none of the 45 use it.
- Every fill, stroke, effect and text is bound to a style.

## Build decisions

1. **Off-token values are flagged, not remapped.** Colours the 2.0 palette doesn't have became `Flagged/2.5 · #HEX NN%` paint styles (20). The common ones are `#000000 10%` hairlines (50 uses) and `#FFFFFF 72%` muted text on dark (10). Off-scale type became `Flagged/2.5 · Desktop · <weight> <size>/<line>` text styles (11), e.g. 40px and 52px headings, 92px SemiBold numerals. A ring shadow on the territory-map legend became the effect style `Flagged/2.5 · Ring #DEDFE0 1.5`. Each style's description says to map it to the nearest 2.0 style or approve it.
2. **Text binding** follows the 2.0 rule: exact match, else nearest style (size ±2, weight ±1 step, same case), else a flagged style. Keyword runs in headlines use the matching `… Keyword` style.
3. **Image placeholders.** The library's striped FPO photo slots (≈30 patterns) became flat fills: `Neutral/BG Alt` on light, `Text/Dark Charcoal` on dark, `State/Hover fill on dark` on blue/charcoal panels, each frame named `Image placeholder`.
4. **Placeholder captions** set in system monospace fonts use `Utility/Placeholder Caption` (Inter), per the "Inter only in placeholders" rule.
5. **Icons** whose stroke colour and weight sit on the SVG paths are instances of the matching icon in Dark Charcoal at the icon's own weight. Five CP/Crane icons draw a different shape from the 2.0 Crane and are kept as vectors bound to styles.
6. **Stat dividers** (Stats Row · Accent dividers, Stats Row · Light · Infinite Facade®) are a 1px left rule, top 65% track and bottom 35% Orange, as in the source.
7. **Radii** from the source (4px carousel frames, 2px tiles/badges) are kept and flagged here; the 2.0 rule is radius 0 except circles and pills.
8. Buttons and text links in the 45 are instances only where the source matches a 2.0 variant exactly (2 Buttons, Green Accent Bars, icons). The others (white buttons on blue, 45% outline buttons, text links on a `#000000 10%` track) differ from the 2.0 variants and stay as frames.

## Not done yet

- Prototype interactions for the 11 interactive components (accordion, filter chips, carousel dots).
- Text component properties.
- Mobile versions (none drawn yet).

## Open questions

- Clark Pacific: should the finishes-guide download sit behind a form?
- Clark Pacific: confirm the 40% cement figure (Sustainability stats band and Stats Row · Light · Infinite Facade®).
- Kim: is the expandable list she described the FAQ or the Project Detail accordion?
