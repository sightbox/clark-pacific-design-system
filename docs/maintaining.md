# Maintaining the system

## After changing styles in Figma

1. In a Claude Code session with the Figma MCP connected, run `/cp-tokens` — it re-exports the paint and text styles into `tokens/source/figma-styles.json` and runs `node tooling/build-tokens.js`.
2. Review the diff in `tokens/` and commit.
3. Tell the web team which Global Colors / Global Fonts changed (`tokens/elementor-globals.md`).

## After changing components or pages

1. Run `/cp-acceptance` — the README acceptance checks plus the text overlap/spill scan, on every page.
2. Fix anything it reports (the rebind script repairs detached text runs; see `tooling/figma-scripts/rebind.js`).
3. In Figma: save a version, then Assets → Libraries → Publish.
4. Update the cover flags frame and `docs/flags.md` if a decision changed.

## Adding or rebuilding a page

Use `/cp-figma-page`. In short: add the page's HTML to `handoff/source/pages-desktop` and `pages-mobile` with `data-component` section markers → `pagex.js` → `match.js` → `pages/batch.js` → run the generated call in Figma → check the Build notes panel and run the overlap scan. Details in `tooling/README.md`.

## Adding a component or variant

Build it on 02 · Components next to its siblings, in both Desktop and Mobile, with every fill and text bound to a style and copy exposed as named text properties. Add hover/click interactions on the component itself. Then:
- add it to `tooling/sets.json` (re-export the set → variant → id map) so the matcher can use it;
- if it should replace page-specific sections, rebuild those pages;
- update `figma/components.md`.

## Keeping the stored scripts in sync

Scripts stored in the file (`figma.root.getSharedPluginData('cpbuild', key)`) are listed in `CLAUDE.md`. When you change a repo copy, re-store it (for the page runtime: `node tooling/pages/mkstore.js` and run the output in Figma); when you patch a stored copy in Figma, copy the change back here.
