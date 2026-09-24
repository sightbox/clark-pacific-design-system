# Clark Pacific Website — Design Handoff

**For:** [TODO: development team / agency name]
**From:** [TODO: your name], Sightbox — [TODO: email]
**Date:** [TODO: date] · **Design version:** [TODO: Figma version name, e.g. "Handoff v1 — 2026-09-24"]

This package contains the complete web design system for the Clark Pacific website: foundations, a component library, and all 38 pages at Desktop (1440) and Mobile (390). It also has design tokens mapped to Elementor, the source HTML, and a list of open items.

---

## 1. Start here (15 minutes)

1. Open the **[Figma file](https://www.figma.com/design/gwXCIJW8u9a6s3txBv30M2/CP-Design-System-3)** and read the **[Cover and flags](https://www.figma.com/design/gwXCIJW8u9a6s3txBv30M2/CP-Design-System-3?node-id=119-40)**. They say what is final, what is placeholder, and what is still to come.
2. Skim the **[Guide](https://www.figma.com/design/gwXCIJW8u9a6s3txBv30M2/CP-Design-System-3?node-id=138-21)**, a five-chapter walkthrough of the file. A text version is in [`docs/guide.md`](docs/guide.md).
3. Set up the Elementor globals from [`tokens/elementor-globals.md`](tokens/elementor-globals.md).

## 2. Links

### Design (Figma)

| What | Link |
|---|---|
| Figma file | [CP-Design-System-3](https://www.figma.com/design/gwXCIJW8u9a6s3txBv30M2/CP-Design-System-3) |
| Cover · page order & flags | [Open](https://www.figma.com/design/gwXCIJW8u9a6s3txBv30M2/CP-Design-System-3?node-id=119-40) |
| Guide | [Open](https://www.figma.com/design/gwXCIJW8u9a6s3txBv30M2/CP-Design-System-3?node-id=138-21) |
| Foundations (colour, type, layout, buttons) | [Open](https://www.figma.com/design/gwXCIJW8u9a6s3txBv30M2/CP-Design-System-3?node-id=60-2) |
| Components (42 sets, Desktop + Mobile) | [Open](https://www.figma.com/design/gwXCIJW8u9a6s3txBv30M2/CP-Design-System-3?node-id=5-2) |
| Pages · Desktop (38 at 1440) | [Open](https://www.figma.com/design/gwXCIJW8u9a6s3txBv30M2/CP-Design-System-3?node-id=105-6274) |
| Pages · Mobile (38 at 390) | [Open](https://www.figma.com/design/gwXCIJW8u9a6s3txBv30M2/CP-Design-System-3?node-id=112-3435) |
| Prototype (click-through) | [TODO: Figma prototype link — Share → Copy prototype link] |
| Figma file copy (.fig), if provided | [TODO: link to .fig download] |

### Build package (this repo)

| What | Link |
|---|---|
| Repository | [sightbox/clark-pacific-design-system](https://github.com/sightbox/clark-pacific-design-system) (public, read-only) |
| Elementor Global Colors & Fonts | [`tokens/elementor-globals.md`](tokens/elementor-globals.md) |
| CSS variables + type classes | [`tokens/tokens.css`](tokens/tokens.css) |
| Tokens as JSON | [`tokens/colors.json`](tokens/colors.json) · [`tokens/typography.json`](tokens/typography.json) |
| Open items & decisions | [`docs/flags.md`](docs/flags.md) |
| Component inventory (variants, properties, interactions) | [`figma/components.md`](figma/components.md) |
| Source HTML (all pages, Desktop + Mobile) | [`handoff/source/pages-desktop`](handoff/source/pages-desktop) · [`handoff/source/pages-mobile`](handoff/source/pages-mobile) |
| Component kits (HTML) | [`handoff/source/kits`](handoff/source/kits) |
| Written design documentation | [`handoff/reference/Documentation.html`](handoff/reference/Documentation.html) |
| Page list & section order | [`handoff/manifest.json`](handoff/manifest.json) |

### Assets

| What | Link |
|---|---|
| Logos (web and white) | [TODO: link — also exportable from the Figma Components page, *Logo / Long*] |
| Line icons (SVG, 24 viewBox, 1.15 stroke) | [TODO: link — also in `handoff/source/*/uploads`] |
| Photography & video | [TODO: link when supplied — every image in the designs is a placeholder] |
| Fonts | Poppins 200 / 300 / 400 / 600 — [Google Fonts](https://fonts.google.com/specimen/Poppins) |
| Parking Design Guide PDF | [TODO: link when supplied] |

## 3. How the design maps to the build

- **Colours → Elementor Global Colors.** The names match the Figma styles one-to-one (e.g. *Primary/Blue*, *Accent/Orange*).
- **Text styles → Elementor Global Fonts.** Use the Desktop value as the base and the Mobile value as the responsive override.
- **Two-weight headlines:** a light base weight, with the last one to three words in SemiBold at the same size. Never use Bold (700).
- **Layout:** Section (full width, holds the background) → Container (max 1440, padding 72 desktop / 20 mobile) → Column. These names match Elementor containers.
- **Components → Elementor templates or global widgets,** one per component set, with its variants as options. Interactions (hover, FAQ toggle, mega-menu, carousels) are shown in the prototype.
- **Inspecting:** use Figma's Dev Mode on any page or component for spacing, sizes and styles.

## 4. What is final and what isn't

- **Page copy is placement copy (FPO).** It was fitted to the components, so final copy may differ in length. Each page has a *Build notes* panel beside it listing what was trimmed or merged.
- **Placeholders:** all photography and video.
- **Awaiting client confirmation:** the Data Centers cement figure ("20% vs 25%") and Infinite Facade® "40% less cement".
- **Still to be supplied:** FAQ answers (AccelDeck, Parking), the Careers quote, per-page Featured Resources, footer copy, the Parking Design Guide PDF, and Infinite Facade® materials copy.
- **Page-specific sections:** some sections are one-offs, not library components; they're named *Page-specific / …* in Figma.
- The full list is in [`docs/flags.md`](docs/flags.md).

## 5. Questions and access

- **Figma access:** [TODO: who to ask for view or Dev Mode access]
- **Design questions:** [TODO: name, email / Slack]
- **Content & client approvals:** [TODO: name, email]
- **Working sessions / check-ins:** [TODO: cadence or link]
