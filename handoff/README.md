# Handoff: Clark Pacific Web Design System, Figma build

## Overview
Clark Pacific is a prefabricated-building manufacturer. This bundle holds its full web design system: **42 canonical desktop components, 40 mobile components, and 38 pages at desktop (1440) and mobile (390)**. All of it is finished and client-approved, in HTML.

**The job:** build it as a proper Figma file for Clark Pacific's web team. They build the live site in WordPress, most likely Elementor Pro. The file needs:
1. Color and text styles (or variables).
2. A published component library: one component set per component, with a `Breakpoint = Desktop | Mobile` property and the variants listed below.
3. 38 Desktop and 38 Mobile page frames, **built from instances of those components**.

**Tool:** the Figma MCP server's write-to-canvas tool (`use_figma`), which runs Plugin API JavaScript in the file. It needs a Full Figma seat and write access to the target file.

### Why this is being handed to Claude Code
Two earlier routes failed:
- **html.to.design import + Figma's in-app agent.** Converting the imported layers into components and swapping page sections for instances worked partly. Then one broad instruction ("hug height, auto layout everywhere") spread through every instance and **wrecked both the components and the pages**.
- **Lessons:**
  - Build components deterministically from the source, in code.
  - Build pages **from instances only**, never by converting imported layers.
  - Never restructure a main component once it's instanced, unless you've re-verified every page that uses it.
  - Work in small, verifiable batches, and save a named version before each batch.

## About the design files
Every file in `source/` is a **design reference made in HTML**: static, script-free markup with inline styles only, showing the exact final look. It isn't production code, and it isn't meant to be imported as layers. Read it, then **recreate each piece as native Figma nodes** (frames with auto layout, text, rectangles, vectors, and so on) using the Plugin API.

Each file is plain HTML with inline `style=""` attributes and no classes. Every value you need (size, color, padding, gap, font) is on the element itself, so it parses cleanly with any DOM parser.

## Fidelity
**High fidelity.** Final colors, type, spacing and copy. Match them exactly. Photos are deliberate placeholders: solid `#52565A` (dark) or `#F0F0F0` (light) blocks with a small caption. Keep them as frames named `Placeholder / …`, so the web team can drop in real images.

## Recommended build order
Save a named Figma version after each step, and check against the source before moving on.
1. **Styles.** Create the color and text styles below. Name them exactly as listed; the names become Elementor Global Colors and Fonts.
2. **Foundations page.** Swatches, the type scale, the breakpoint rules and the button system (from `reference/Documentation.html`).
3. **Components, one group at a time.** For each component:
   - read its Desktop artboard in `source/kits/desktop-kit.html` (div `id="d-…"`) and its Mobile twin in `mobile-kit.html` or `mobile-additions.html` (div `id="m-…"`)
   - build both variants
   - combine them into a set
   - expose text properties for every visible string
   - add a `Show item N` boolean for repeating items
   - bind every fill and text to a style
   Make **repeating items their own component** (FAQ Item, Card, Icon Grid Item, Stat, Process Step), so each item can be overridden separately.
4. **Publish** the library. This is manual in the Figma UI: Assets → Libraries → Publish.
5. **One test page:** AccelCore Desktop.
   - Read `source/pages-desktop/accelcore.html`. Each section begins with `<div data-component="Name">`, followed by an HTML comment and the section markup.
   - For each section, insert the matching instance, pick its variant, and fill the text from the page.
   - Sections tagged `One-off: …`, or with no library match, get built as plain frames named `Page-specific / …`.
   - Compare the frame's height and look against the HTML rendered at 1440 before doing the others.
6. **The remaining 37 Desktop pages,** in batches of about five, with a version saved before each batch.
7. **Mobile pages.** Same method from `source/pages-mobile/`, using `Breakpoint = Mobile`. The copy is identical to desktop.
8. **Prototype interactions** on components only (see Interactions).
9. **Cover page and page order.** Pages: `00 · Cover`, `01 · Foundations`, `02 · Components`, `03 · Pages Desktop`, `04 · Pages Mobile`.

`manifest.json` lists every component (id and name, grouped) and, for every page, its sections in order with their component tags. Use it as the checklist.

## Layout system
- **Every section has two layers:**
  - an outer frame, full width (1440 or 390), holding the background fill
  - an inner container: max width 1440, centred, padding `NNpx 72px` (Desktop) or `NNpx 20px` (Mobile)
  - In Figma, name them `Section` → `Container` → `Column`, to match Elementor's containers.
- **Four layout types:** one column; 50/50 two-column; 40/60 two-column; three-column cards. Plus icon rows.
- **Content panel spacing:**
  - accent bar or eyebrow → headline: 20
  - headline → paragraph: 20
  - paragraph → CTA: 34
- **Image gaps** in grids and mosaics: 2px, white.
- **Corners:** square everywhere, radius 0. The exceptions are circles (play buttons, icon wells, social icons), pagination dots, and the active pagination pill (26×6, radius 3).
- **Surfaces:**
  - Every module sits on **white**.
  - The only coloured surfaces are CTA banners (Blue `#004A9F` or Dark Charcoal `#52565A`), the footer (`#52565A`) and the announcement bar (`#52565A`).
  - `#F0F0F0` is only for boxed elements *inside* a module (chips, icon wells, featured table column).

## Design tokens

### Colors (the only allowed values)
| Style name | Value | Use |
|---|---|---|
| Primary/Blue | `#004A9F` | Primary buttons, CTA banner surface, accent bars |
| Accent/Orange | `#FF8600` | Accent bars (40×3), text-link hover, active nav bar, active pagination pill. **Never as type on a dark surface** |
| Sustainability/Green | `#009663` | Sustainability content only |
| Text/Dark Charcoal | `#52565A` | All headline and body type; also the dark surface (footer, announcement bar, dark CTA) |
| Neutral/Mid Gray | `#7F8A92` | Tertiary text, labels |
| Neutral/BG Alt | `#F0F0F0` | Boxed elements inside modules; light placeholders |
| Neutral/Border | `#DEDFE0` | Strokes and dividers only, never text |
| Neutral/White | `#FFFFFF` | Module background |
| Overlay/Scrim | `#52565A` at 84% | Photo overlays (Leadership bio, photo CTAs) |
| Overlay/On-dark divider | `#FFFFFF` at 25% | Dividers on dark surfaces |
| Text/Faded | `#52565A` at 28% | Decorative faded numerals on white |
| Text/Faded on dark | `#FFFFFF` at 38% | The same on dark |
| Track/Light | `#000000` at 12% | Text-link track on light |
| Outline/On-dark | `#FFFFFF` at 55% | On-dark secondary button outline |

**Retired. Must not appear anywhere:** `#00ADC8` / `#00AAC4` (teal; allowed *only* inside the Infinite Facade® logo artwork), `#231F20` / `#241F20` (INF Black), `#BDBDBD`, `#F68D2E`, `#F0631C`, `#000000`.

### Typography
Fonts: **Poppins** (weights 200, 300, 400 and 600 only; **never 700**). Inter is used only for placeholder captions.

**Headline rule:** every section headline pairs a light weight (context) with a SemiBold 600 keyword at the same size, with the keyword at or near the end. Headings are uppercase, with letter-spacing −0.04em.
- On light surfaces, the keyword is `#52565A`.
- On dark surfaces, it's `#FFFFFF`.
- On sustainability panels, it may be Green.
- In Figma, make one text style per tier and keep the SemiBold keyword run as a weight override.

| Style | Desktop | Mobile | Weight(s) |
|---|---|---|---|
| Display XL | 92 | 52 | 200 + 600 (homepage hero only) |
| Display L | 84 | 44 | 200 + 600 |
| Display M | 72 | 40 | 200/400 + 600 |
| Heading LG | 49 | 32 | 300 + 600 |
| Heading | 45 | 30 | 300 + 600 |
| Heading MD | 35 | 26 | 400 + 600 |
| Heading SM | 30 | 22 | 300/400 + 600 |
| Lead | 26 | 20 | 400 |
| Heading XS | 25 | 20 | 600 |
| Body | 18 | 16 | 400 |
| Body Light | 14–16 | 14–16 | 300 |
| Subheading / Eyebrow | 16 (13 small) | 14 (13) | 600 uppercase, +0.06em |
| Button / Label | 14 | 14 | 600 uppercase |
| Caption / Meta | 12–13 | 12–13 | 400 |
| Fine print | 10–11 | 10–11 | 400 |

Letter-spacing is limited to these values: −0.04em (headings), −0.01em, 0.02em, 0.06em (eyebrows), 0.1em (tiny labels), 0. Line heights come from the source, per element.

### Spacing
Use values from this scale: 0, 2, 4, 8, 12, 16, 20, 24, 28, 32, 34, 40, 48, 56, 64, 72, 80, 88, 96, 120.
- **Side padding:** Desktop 72, Tablet 40, Mobile 20.
- **Section vertical padding:** Desktop 80–96, Mobile about 56.

### Breakpoints (Elementor defaults)
- Desktop above 1024 (frame 1440), Tablet 768–1024 (frame 1024, optional), Mobile up to 767 (frame 390).
- **How layouts collapse on mobile:**
  - grids of 4 columns → 2 columns
  - 3 or 2 columns → 1 column
  - 50/50 splits → stacked, image first
  - stats rows 4 → 2×2
  - carousels → swipe rows with dots
  - header → logo + 44px hamburger with a full-screen menu
  - minimum tap target 44px
- `reference/cp-static-mobile.js` holds the exact reflow rules used to produce `pages-mobile/`.

## Components

**Key specs**, which all appear in the source:
- **Accent bar:** 40×3, Blue or Orange (mixed, never all one colour), Green on sustainability content. It goes below card photos and above leading copy blocks, never on hero images.
- **Buttons:**
  - Primary: `#004A9F` fill, white label, padding 15×32.
  - Secondary: 1.5px `#52565A` outline.
  - On-dark: 1.5px white-55% outline, white label.
  - All labels Poppins 600, 14px, uppercase. Square corners.
- **Text link:** a label with a 2px track underneath, as wide as the label.
  - Rest: the track is `#000000` at 12%, with a coloured bar at width 0.
  - Hover: the bar fills left to right to the full track width, in Orange (400ms, ease). Variants: Blue, Green, White (on dark).
  - **Inside cards:** the track spans the full column, with a short 32–44px Blue or Orange bar under the label that fills on hover.
- **Hero, Standard interior:**
  - A full-bleed `#52565A` photo placeholder, 560px tall (homepage 700), with a single 45° accent line through the right third and a 100×100 white triangular notch at the lower right.
  - The transparent header sits over it: white long logo, white nav, orange 3px active bar, outlined-white "Talk to an Expert" button.
  - Below, on white: breadcrumb, eyebrow, then a two-column row (two-tier headline left; body and CTAs right, with the tops aligned).
  - The homepage is the only overlaid-text hero.
- **Header states:** Over photo · Solid (scrolled) · Products mega-menu open (translucent, 4 columns) · Mobile over photo · Mobile menu open.
- **Footer:** a single band on `#52565A`:
  - brand + social icons on the left
  - three link columns (Products / Company / Resources)
  - a "Stay in the Loop" newsletter strip with a Blue submit button
  - a legal bar at the bottom
- **Leadership card:** portrait with the name at 26px (first name 600, last name 400). On hover, a dark scrim and bio fade in, with a 40×3 orange bar flush at the lower-left corner.
- **Pagination:** inactive is a 6px gray dot; active is an orange 26×6 pill.

**Variants to model:** these are the artboards in the kit that stack several variants.
- Split Content, Layout: Image left 50/50, Image right 50/50, 40/60, Bulleted, Stacked list, Horizontal icon callout
- CTA Banner, Surface: Blue, Dark Charcoal, Light, Photo overlay (Align: Left, Center, Right)
- Canonical Card, Type: Standard, Compact, Text only, Image as button
- Video Module, Layout: Full width, Video left, Video right, Carousel (peek-a-boo)
- Icon Grid, Layout: Headline left 2×3, 4-col with body, 3-col spacious, 4-col spacious
- Hero, Type: Standard interior, Homepage overlay, Index, Editorial banner, Editorial header
- Header, State: see above
- Form, Type: Contact, Newsletter

## Interactions (prototype, components only)
- Button: Hover state. Primary darkens to `#003D84`; Secondary and On-dark get a 12% fill of their outline colour.
- Text link: hover bar fill, Smart animate, 400ms, ease-out.
- FAQ item: click toggles Open/Closed, 250ms. The first item is open by default.
- Header: hovering "Products" opens the mega-menu. On mobile, the menu icon opens the full-screen menu and the close icon closes it.
- Leadership card: hover shows the bio overlay, 300ms.
- Image-as-button card: hover darkens the photo (Scrim at 40%) and shows "VIEW PROJECTS →".
- Carousels: dot click changes the slide.

## Assets
Everything is in `source/*/uploads/`.
- **Logos:** `CP_Logo_Long_Web.svg` (gray, for light surfaces) and `CP_Logo_Long_White.svg` (for dark and photo backgrounds).
- **Line icons:** the `CP_v01_*_Line.svg` files, 24 viewBox, 1.15 stroke, `#52565A`. Import them as vectors.
- **Photos:** there aren't any. Every image is a placeholder frame.
- The Infinite Facade® logo is the only place teal may appear.

## Content notes
All copy is final approved or realistic sample copy. The web team will supply photography and video, FAQ answers for AccelDeck and Parking, the Careers quote, per-page Featured Resources items, footer copy, the Parking Design Guide PDF, and the Infinite Facade® materials copy. Two figures need client confirmation: Data Centers "20% vs 25% cement" and Infinite Facade "40% less cement". Don't change them; flag them on the cover.

## Files
- `manifest.json`: the component list (desktop and mobile ids) and the section list for every page.
- `source/kits/desktop-kit.html`: 42 desktop component artboards at 1440 (`id="d-…"`, label "Name / Desktop").
- `source/kits/mobile-kit.html` and `mobile-additions.html`: the mobile twins at 390 (`id="m-…"`).
- `source/pages-desktop/*.html`: 38 pages at 1440. Sections are tagged `data-component`. The small tag pills are build aids only; don't reproduce them.
- `source/pages-mobile/*.html`: 38 pages at 390, with the same tags.
- `reference/Documentation.html`: the full written design-system documentation (rules, specs, do's and don'ts).
- `reference/Library (September Edition).html`: the living style-guide doc, with every module and its notes.
- `reference/CLAUDE (project rules).md`: the project's decision log, with every locked rule and why.
- `reference/cp-static-mobile.js`: the mobile reflow rules.

## Acceptance checks (run at the end, read-only)
- 0 layers with a colour or text not bound to a style (placeholders excepted).
- No font other than Poppins, and no weight 700.
- No retired colours (teal allowed only inside the Infinite Facade® logo).
- No orange text on Blue or Dark Charcoal.
- Every component set has both Desktop and Mobile variants.
- Every page section is a library instance or a `Page-specific /` frame. No detached instances.
- Each Desktop page has the same number of sections as its Mobile twin.
- Corner radius 0 on images, cards, buttons and panels.
