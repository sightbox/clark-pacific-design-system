---
name: cp-acceptance
description: Run the Clark Pacific README acceptance checks and the text overlap/spill scan across the Figma file, then report (and optionally repair) failures. Use after any change to components, pages, styles or copy, or when asked to "check", "audit" or "QA" the file.
---

# Acceptance checks

Figma file `gwXCIJW8u9a6s3txBv30M2`. Load the `figma-use` skill first. All checks are read-only unless you choose to repair.

## 1. Style and structure checks — one call per page, in parallel

For each page id — `0:1` Cover, `138:20` Guide, `2:2` Foundations, `2:3` Components, `81:2` Pages Desktop, `81:3` Pages Mobile — run:

```js
const p = await figma.getNodeByIdAsync('<pageId>'); await figma.setCurrentPageAsync(p);
const check = eval("(async function(ROOTS){" + figma.root.getSharedPluginData('cpbuild','accept') + "})");
return await check(p.children.filter(n => !n.name.startsWith('Build notes')));
```

(The stored script is the same as `tooling/figma-scripts/acceptance.js`; if the stored copy is missing, paste the file's body instead.)

Pass means: `unboundFill.total` 0 and `unboundText.total` 0 (placeholders, logo artwork and glyph-only text are excepted by design), no fonts other than Poppins (Inter only in placeholders), `w700` 0, `offPalette.total` 0, `orangeOnDarkN` 0, `radius.total` 0, `detached` 0.

## 2. Page structure

In one call on `81:2` and `81:3`: every child of each `Desktop / …` / `Mobile / …` frame is an instance with a main component or a frame named `Page-specific / …`, and each Desktop page has the same number of sections as its Mobile twin (don't count Header / Announcement Bar overlays).

## 3. Component sets

On `2:3`: every component set with a `Breakpoint` property has both Desktop and Mobile options. Logo / Long, Text Link / Card, Accent Bar and Pagination Dot are breakpoint-independent by design.

## 4. Text overlap and spill

Run `tooling/figma-scripts/overlap-scan.js` as the whole script. Expect `overlaps: []` and `spills: []` for both breakpoints. For each hit, screenshot the section and fix the cause (usually a fixed-height container — make it hug, or make the section page-specific).

## Repairing

- Unbound text runs → run `tooling/figma-scripts/rebind.js` (stored as `cpbuild/rebind`) on 02 · Components first, then the other pages; report anything it leaves.
- Unstyled gradients → bind to an `Overlay/*` gradient style (Dark Charcoal only; black is retired).
- Report results as a short table per page; update the acceptance section of the cover's flags frame and `docs/flags.md` if the status changed.
