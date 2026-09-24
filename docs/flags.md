# Open items and flags

Mirrors the **Page order & flags** frame on the Figma file's 00 · Cover (as of 2026-09-24). Keep both in step.

## Needs client confirmation

Figures left exactly as supplied:

1. **Data Centers — "20% vs 25% cement".** CARBONSHIELD® copy says it replaces 25% of the portland cement while reducing embodied carbon by roughly 20%.
2. **Infinite Facade® — "40% less cement".** Stats row figure.

## To be supplied by the web team

1. Photography and video — every image and video in the file is a placeholder frame.
2. FAQ answers for AccelDeck and Parking.
3. The Careers quote.
4. Featured Resources items per page (pages currently repeat the same three sample resources).
5. Footer copy.
6. The Parking Design Guide PDF.
7. Infinite Facade® materials copy (System Overview + Materials repeats one placeholder description).

## Build decisions to review

1. **Page copy is FPO.** Copy that did not fit a component slot was merged into nearby body copy or trimmed. Each page's Build notes panel lists what changed.
2. **Page-specific sections.** Where a component was a poor fit (copy overflowed, a heading or several titles had no slot, or 5+ strings were lost) or the section is a one-off, the section is a copy of the reference import named `Page-specific / …` — Desktop 69, Mobile 107. These are the candidates for new components or variants.
3. **Header states.** The kit's Solid state showed the Our Approach dropdown open — the panel is hidden so Solid is the closed bar ("Products open" is the open menu). Over photo and Products open were drawn on an opaque demo photo — now transparent so the page shows through under the scrim. The mobile Over photo header carried its own announcement strip, duplicating the Announcement Bar — hidden.
4. **Homepage hero.** The Homepage overlay component carries the headline and tagline; the homepage phone number has no slot and is not placed.
5. **Editorial headers.** Article, News Article and Project Detail open with a full-bleed photo → Hero · Editorial banner (a Mobile banner variant was added). Podcast Episode and Webinar Detail use a dark Charcoal editorial header with colour tags that the kit's white Editorial header doesn't cover — page-specific for now. Consider a dark Editorial header variant.
6. **Mobile Footer and Brand Sign-off.** Every mobile page uses the Footer · Mobile and Brand Sign-off Band · Mobile components exactly as designed (no copy overrides); the desktop-only footer lines from the source pages are intentionally not shown.
7. **Added text styles.** 38 styles were added for off-scale roles in the source (stat values and units, step numbers, years, keyword weights, quote keywords, strong/regular variants). Each is flagged in its description — review before adding to Elementor Global Fonts.
8. **Utility style naming.** `handoff/reference/Documentation.html` defines a different Utility style set (e.g. Stat Numeral 64/40, Numeral 48/44, Quote 33/22) from the README table used here. Needs reconciling.
9. **Text links.** The source uses ~25 inconsistent text-link treatments; the Text Link component follows the kit's canonical spec.
10. **Retired colours removed.** The source's #241F20 image-hover overlay and its black (#000000) photo scrims are retired. Image-as-button hover uses Overlay/Scrim at 40%; photo scrims are Dark Charcoal gradient styles.
11. **Flagged colours.** `Flagged/On-dark muted` (#FFF 30%), `Flagged/Accent line on photo` (#FFF 32%), `Flagged/Dot inactive` (#000 18%) are in the approved source but not on the token list — confirm or remap.
12. **Prototype behaviour.** Hover states are Desktop only. Leaving the mega-menu returns the header to Over photo, including from Solid. Image Gallery and Video Module gained a Slide property for click-through carousels.
13. **Publish the library** from Figma (Assets → Libraries → Publish) — manual.

## Manual steps in Figma

- Set the cover as the file thumbnail: right-click the **Cover** frame → *Set as thumbnail*.
- Save a version after changes; publish the library.
