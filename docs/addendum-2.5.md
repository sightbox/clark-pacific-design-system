# Figma 2.5 addendum

On 30 Sep 2026 Kim found that most of the library's section components never made it into Figma. The addendum adds the **45 missing desktop section components**. It only adds: it never changes, merges into or restructures an existing 2.0 component or page.

## Where things are

| What | Where |
|---|---|
| Source (canonical for geometry and copy) | `handoff/source/kits/additions-2.5.html` (artboards `id="a25-…"`) |
| Component list, behaviour and intent | `handoff/manifest.json → additions25` |
| Rules for the build | `handoff/README.md` → "Addendum: Figma 2.5" |
| Developer notes | `handoff/reference/Figma 2.5 Dev Notes.md` |
| Kim's guide (HTML + PDF) | `handoff/addendum-2.5/Clark Pacific Figma 2.5 Guide.dc.html` / `.pdf`. Rewritten 1 Oct 2026 for using the components from the library (no copy-paste); the separate 2.5 Additions file is retired |
| Claude Design source frames and full package manifest | `handoff/addendum-2.5/` |
| Figma build | file **Clark Pacific 2.5 Additions**, key `EQ2vqFYpJhDbodciKa3FOj` (Sightbox team), **and** this design system (`gwXCIJW8u9a6s3txBv30M2`) → 02 · Components → eight **2.5 · <group>** sections |
| Build tooling | `tooling/a25/` (see `tooling/README.md` § 7) |

## The Figma build

The 45 were built as real components, not imported as frames, in two places:

1. **In the design-system file** (the main copy): page **02 · Components**, in eight `2.5 · <group>` sections on the second row (see `figma/file-map.md`). They use this file's own 2.0 Button, Accent Bar and icons, and are published with the library. Each has its description and dev note. The audit (30 Sep 2026) found no unbound fill, stroke, effect or text, and no overlaps, and the existing sections were untouched.
2. **In the separate 2.5 Additions file**: **retired 1 Oct 2026** (a notice sits at the top of its components page). It lacks the interactions, text properties and fixes, so don't copy from it; it's described below for reference.

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

## Prototype and editable text (design-system file, 1 Oct 2026)

- **Click interactions.** The 10 interactive components are now component sets whose variants hold each state. Clicks switch variants with Smart Animate.
  - Insights filter bar: `Tab`.
  - Insights feed: `Filter`.
  - Careers list: `Department`. Empty departments show an FPO empty-state line.
  - Content archive: `Filter` × `Page`. Filters reset to page 1. Pages 2–3 reuse the rows as FPO.
  - Projects filter bar: `Type` × `Region`, 20 variants. The count and empty state update.
  - Carousels 3-up and 4-up: `Slide` 1–3. The arrows dim at the ends. Two FPO cards were added to each so there is something to scroll to.
  - Product highlights: `Slide` 1–5. The dots, arrows, caption and copy change. The copy for slides 2–5 is FPO, taken from the product cards.
  - Spec panel: `Photo` 1–3 + `Lightbox`. "+6" opens it and ✕ closes it.
  - Overview accordion: `Open`. One section is open at a time.
- **Photo gallery.** A new nested set, `2.5 / Projects / Photo gallery` (`Photo` 1–5), is used in the Detail sidebar trio and the Overview accordion. Thumbnails swap the photo, and clicking the photo advances.
- **Search fields** aren't prototyped.
- **Editable text.** Every 2.5 component has text properties named by item and role, e.g. `Card 2 · Heading`, `Tab 3 · Label` or `Body`. There are 524 in total.
  - Two-weight keyword headlines are not properties, following the 2.0 rule: binding would flatten the keyword run.
  - Text that changes between variants (counts, slide copy, captions) stays on the layer.
  - Nested 2.0 Button / Text Link instances are exposed, so their labels can be edited from the parent.
- **Fixes made at the same time:**
  - Carousel arrows now sit inside the 72px gutters (they were off-frame).
  - Facts & Figures label/value rows have their spacing.
  - Stats Row · Light · Infinite Facade® dividers are on the right edge of cells 1–3, as in the source.
  - These three fixes are not in the separate 2.5 Additions file.
- **Tooling:** `tooling/a25/ix.js`, stored in the file as `sharedPluginData('a25','ix')`.

## 2.5 components on the Desktop pages (1 Oct 2026)

Nine one-off frames on 03 · Pages Desktop were replaced with 2.5 instances. The copy comes from each page, and Build notes record what was trimmed (FPO copy policy). The originals are kept on **05 · Page References · Desktop** → section **Replaced page-specific frames · 1 Oct 2026**.

| Page | Was | Now |
|---|---|---|
| Careers | Page-specific / Open Positions | 2.5 / Careers / Open positions list (3 of 12 roles, one per department) |
| Sustainability | Page-specific / EPD & Credentials | 2.5 / Sustainability / EPD + credentials grid (page tile copy) |
| Projects | Page-specific / Filterable Index Grid | 2.5 / Projects / Filter bar (5 page projects placed by category + region; Data Centers slots keep placeholders) |
| In The News | Page-specific / Filterable Index Grid | 2.5 / Insights / Content archive · Paginated (page chips, 5 of 9 stories) |
| Resources | Page-specific / Filterable Index Grid | 2.5 / Insights / Content archive · Paginated (page chips, 5 of 9 resources) |
| Webinars | Page-specific / Filterable Index Grid | 2.5 / Insights / Filter bar + Webinar card · List (2 of 6 webinars) |
| Blog | Page-specific / Filterable Index Grid | 2.5 / Cards / Insights feed · Filterable (6 of 9 articles; Sustainability chip dropped) |
| Data Centers | Page-specific / Card / Standard (grid) | 2.5 / Products / Sub-category card grid, Show heading on ("Data center solutions"), page card copy |
| Data Centers | Page-specific / Structural Components Strip | 2.5 / Products / Structural components strip, Show heading on ("Structural components") |

How the matches were chosen and checked:
- Candidates were found by text overlap, then checked by structure. Frames that only shared words were left alone: Homepage, Finishes and Infinite Facade split sections, Podcast, Project Detail.
- **Optional heading.** `Sub-category card grid` and `Structural components strip` gained a `Show heading` boolean (off by default) that reveals a two-weight heading block: Heading LG at the grid's 32px gutter, and Heading MD at 72px for the strip. The headline is edited on the canvas, not through a text property, so the keyword run keeps its style.
- Mobile pages keep their Page-specific frames until mobile 2.5 components exist (noted on each page).

Component fixes made during the swaps:
- Category tags and badges in the 2.5 components now hug their text. Long labels like "Building Envelope" or "On Demand" were wrapping and clipping.
- Text-property names were refined: the largest text in a card is `Title`, filled tags are `Badge`, and a second label is `Meta`. Names are unique per component.

Flag for review: `2.5 / Insights / Webinar card · List` runs edge to edge (no 72px side padding), as in the source. On the Webinars page it sits under a padded filter bar.

## Not done yet

- Mobile versions (none drawn yet).
- The same interactions, text properties and fixes in the separate 2.5 Additions file (kept as-is for Kim's guide).

## Open questions

- Clark Pacific: should the finishes-guide download sit behind a form?
- Clark Pacific: confirm the 40% cement figure (Sustainability stats band and Stats Row · Light · Infinite Facade®).
- Kim: is the expandable list she described the FAQ or the Project Detail accordion?
