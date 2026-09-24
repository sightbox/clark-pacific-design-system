# Guide — how to use the Clark Pacific design system

A text version of the **00 · Guide** page in the Figma file.

## 1. Start here

The Figma file holds the colour and type foundations, a component library with Desktop and Mobile variants, and all 38 site pages built from those components at 1440 and 390.

**Who it's for**
- **Designers** — build new pages and modules from the library, extend components with new variants, keep Desktop and Mobile in step.
- **Web team (Elementor)** — build the site from it: colour and text styles map one-to-one to Elementor Global Colors and Global Fonts (`tokens/elementor-globals.md`), and sections follow Section → Container → Column.
- **Content & marketing** — see every layout, how much copy each module holds, and what still needs supplying. Page copy is placement copy (FPO) unless marked final.

**Quick start**
1. Read the cover flags (`docs/flags.md`).
2. Enable the library in your working file: Assets → Libraries → CP-Design-System-3 → Enable (it must be published first).
3. Insert components from the Assets panel. Set **Breakpoint** first — Desktop for 1440 frames, Mobile for 390.
4. Edit through the properties panel instead of detaching; hide unused repeating items with the **Show item** toggles.
5. Start from the closest built page in 03/04 and read its Build notes panel.

**Golden rules:** styles, never raw values · radius 0 (circles and pills excepted) · headlines pair two weights at one size, never Bold 700 · orange is never text on Blue or Dark Charcoal · every module sits on white · change the component, not the instance, when it should apply everywhere.

## 2. System foundations

**Core colours:** Primary/Blue `#004A9F` (brand, CTAs, links) · Accent/Orange `#FF8600` (accent bars, highlights) · Sustainability/Green `#009663` (sustainability only) · Text/Dark Charcoal `#52565A` (all type, dark surfaces) · Neutral/Mid Gray `#7F8A92` · Neutral/BG Alt `#F0F0F0` (boxed elements inside a module) · Neutral/Border `#DEDFE0` · Neutral/White (every module background).

**Supporting groups:** Text/Faded (low-emphasis) · Overlay/* (scrims, dividers, gradient scrims) · State/* (hovers) · Track/Light, Outline/On-dark · Flagged/* (source values awaiting a decision).

**Type:** Poppins 200/300/400/600. Three sets — `Desktop/…`, `Mobile/…` (sizes step down, e.g. Heading 45 → 30), `Utility/…`. `… Keyword` styles are the SemiBold partner for two-weight headlines.

**Two-weight headline:** apply the base style to the whole headline (e.g. Desktop/Heading, Light 45) → select the last one to three words → apply the matching Keyword style. Never override the weight by hand.

**Layout:** every section is a full-width frame (1440 / 390) with a centred container (max 1440, padding 72 / 20) — named Section → Container → Column to match Elementor. Four layout types: one column; 50/50; 40/60; three-column cards (plus icon rows). Mobile stacks to one column. Accent bars are 40×3, Blue or Orange (Green on sustainability), never on hero images.

## 3. The component library

Nine groups on 02 · Components (full list in `figma/components.md`): Primitives · Global · Heroes · Content Panels · CTAs & Buttons · Cards & Grids · Data & Company · Product Detail & Media · Forms.

**Properties:** Breakpoint (set first) · Type / Layout / Surface (the main design choice) · State (Default/Hover, Open/Closed, header states) · Slide (galleries and carousels) · text properties (named copy fields) · Show item N (hide unused items).

**Do:** use instances and change them through properties · hide unused items with toggles · keep Desktop and Mobile variants in step · add a variant when a need repeats · name one-offs `Page-specific / …`.
**Don't:** detach instances · type hex values or override weights · resize text boxes to squeeze copy · put orange text on dark · build from the Page Reference imports.

## 4. Building a page

**Anatomy, in order:** Announcement Bar → Header (Over photo on photo/dark heroes, absolute on top; Solid on white pages) → Hero → content sections (full width, stacked, on white) → CTA Banner → Brand Sign-off Band → Footer.

**Which hero:** Homepage overlay (homepage) · Standard interior (product, solution and company pages) · Index (Blog, In the News, Projects, Resources, Podcast, Webinars) · Editorial banner (Article, News Article, Project Detail) · Editorial header (white text header; the dark variant used by Podcast Episode and Webinar Detail is page-specific for now).

**Steps:** create the page frame (`Desktop / Name`, 1440, vertical auto layout, white) → add the global sections and hero → add content sections in order → fill copy through properties → close with CTA, Sign-off, Footer → build the Mobile twin with the same sections in the same order.

**Reading the built pages:** each page has a **Build notes** panel (component and variant per section; merged, trimmed and hidden copy). `Page-specific / …` sections are copies of the reference import where no component fit. Copy is FPO.

## 5. Preview, handoff and upkeep

**Preview:** select a page frame or component → Present → hover buttons, links, cards and "Our Products"; click FAQ questions, gallery thumbnails and carousel dots. On Mobile, tap the menu icon. Hover states are Desktop only.

**Handoff to Elementor:** colour styles → Global Colors (same names) · text styles → Global Fonts (Desktop base, Mobile override) · Section → Container → Column → Elementor containers · components → templates or global widgets · use Dev Mode to inspect · assets in `handoff/source/*/uploads`.

**Upkeep:** change the component, not the instance · publish and save a version after library changes · promote repeated page-specific sections to components · keep the flags current (`docs/flags.md` and the cover).
