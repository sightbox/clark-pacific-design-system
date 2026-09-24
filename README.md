# Clark Pacific — Web Design System

The handoff repo for the Clark Pacific web design system. The design itself lives in Figma; this repo holds everything around it: design tokens for the build, the source brief, the tooling that built the Figma file, and the documentation.

**Repository:** https://github.com/sightbox/clark-pacific-design-system (private)
**Figma file:** [CP-Design-System-3](https://www.figma.com/design/gwXCIJW8u9a6s3txBv30M2/CP-Design-System-3) (file key `gwXCIJW8u9a6s3txBv30M2`)
Start with its **00 · Cover** (flags and page order) and **00 · Guide** (how to use the file).

## What's in the Figma file

| Page | What it holds |
|---|---|
| 00 · Cover | Cover, page order, flags (client confirmations, content to supply, build decisions), acceptance results |
| 00 · Guide | Five-chapter walkthrough: start here, foundations, component library, building a page, preview/handoff/upkeep |
| 01 · Foundations | Colour, type scale (incl. added styles), layout, buttons and links |
| 02 · Components | 42 component sets in 9 groups, all with Desktop and Mobile variants, plus icons and item components |
| 03 · Pages Desktop | 38 pages at 1440, built from library instances, each with a Build notes panel |
| 04 · Pages Mobile | The same 38 pages at 390 |
| 05 / 06 · Page References | The imported HTML screens, aligned to system styles — reference only |

## What's in this repo

```
tokens/        Design tokens generated from the Figma styles
  colors.json, typography.json   machine-readable tokens
  tokens.css                     CSS custom properties + type classes (Desktop, Mobile media query)
  elementor-globals.md           Elementor Global Colors / Global Fonts mapping (names match Figma)
  source/figma-styles.json       raw export from Figma — the source for the files above
figma/         Map of the Figma file: page and node IDs, component inventory
docs/          guide.md (the walkthrough), flags.md (open items), build-log.md (decisions), maintaining.md
handoff/       The original build brief: README, manifest, source HTML (kits + 38×2 pages), reference docs
tooling/       The scripts that built the Figma file (extract → plan → components → pages → checks)
.claude/       Claude Code skills for working on the file (build a page, run checks, refresh tokens)
CLAUDE.md      Project rules and Figma-API gotchas for Claude Code sessions
```

## Who should read what

- **Web team (Elementor):** `tokens/elementor-globals.md`, `tokens/tokens.css`, `docs/flags.md`, then the Figma file's 03/04 pages in Dev Mode.
- **Designers:** the Figma file's 00 · Guide, then `docs/guide.md` and `docs/maintaining.md`.
- **Content:** `docs/flags.md` (what is still to be supplied or confirmed). Page copy in Figma is placement copy (FPO).
- **Continuing the build with Claude Code:** `CLAUDE.md`, `tooling/README.md`, and the skills in `.claude/skills/`.

## Quick commands

```bash
# regenerate tokens after re-exporting tokens/source/figma-styles.json from Figma
node tooling/build-tokens.js

# tooling dependencies (only needed for the HTML extractor, which drives Chrome)
cd tooling && npm install
```

## Status

Built and checked 2026-09-24. All README acceptance checks pass (styles bound, Poppins only, no weight 700, no retired colours, no orange text on dark, Desktop + Mobile variants, sections are instances or `Page-specific /` frames, section counts match, radius 0, no text overlap). Open items are in [`docs/flags.md`](docs/flags.md). The library still needs to be **published** from Figma (Assets → Libraries → Publish).
