---
name: cp-figma-page
description: Build or rebuild a Clark Pacific Desktop/Mobile page in the Figma file from its source HTML, using library instances, the FPO copy policy and the page-builder runtime. Use when asked to add, rebuild or fix a page on 03 · Pages Desktop / 04 · Pages Mobile.
---

# Build or rebuild a page

Figma file `gwXCIJW8u9a6s3txBv30M2`. Load the `figma-use` skill before any `use_figma` call. Read `CLAUDE.md` (locked rules, API gotchas) first.

## Steps

1. **Source.** The page's HTML must exist in `handoff/source/pages-desktop/<file>.html` and `pages-mobile/<file>.html`, with each section starting at a `<div data-component="…">` marker. Add the display name to `tooling/pages/titles.json` and the file to `tooling/pages/order.txt` if it is new.
2. **Sections.** `cd tooling && node pagex.js ../handoff/source/pages-desktop ex/pages/desk 1440 <file>.html` (and `pages-mobile … ex/pages/mob 390`).
3. **Match.** `node match.js desk ex/pages/desk/<file>.json` (and `mob`). Read the report: ✓ = instance, ✗ = page-specific. Use `node mdbg.js desk ex/pages/desk/<file>.json <sectionIndex>` to inspect an alignment.
4. **Batch.** `LIMIT=30000 node pages/batch.js desk <file>.html` → `pages/batch_desk_1.js`. If `pages/dict_desk.js` changed, run its contents in Figma first (it re-stores the shared text dictionary).
5. **Build.** Run the batch file's contents as one `use_figma` call. It removes any existing frame with the same title, builds the page from the stored runtime (`cpbuild/pagert`), and writes the Build notes panel. The return lists heights and any `FALLBACK` (page-specific) sections.
6. **Check.**
   - Compare the page height with the source and screenshot the frame (`get_screenshot`).
   - Look at every FALLBACK and every section that trimmed a heading or several titles. A poor fit is better as page-specific than as a scrambled instance; a stats/FAQ/grid with the wrong item count can often be fixed by filling the instance by hand.
   - Run `tooling/figma-scripts/overlap-scan.js` and the acceptance checks (`/cp-acceptance`).
7. **Lay out.** Frames sit in rows of 8 in manifest order (1440 + 80 + 560 notes + 240 gap per column on Desktop; 390 + 60 + 560 + 200 on Mobile).
8. Tell the user what changed, what was trimmed or made page-specific, and remind them to save a version.

## Rules that apply

- FPO copy: merge extra body paragraphs, trim the rest, record it in Build notes — don't ask.
- Header: Over photo (absolute, on top of the hero) on photo/dark heroes; Solid on white pages. Global sections (Announcement Bar, Header, Sign-off, Footer) are always instances.
- Hero Type follows the section tag (`Header + Hero / Index` → Index, etc.). Pages whose source hero is a full-bleed photo with no text use Editorial banner.
- After any manual copy edit on a two-weight headline, re-apply the Keyword style to the keyword run.
