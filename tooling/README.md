# Tooling

The scripts that built the Figma file. Two kinds:

- **Node scripts** (run locally) read the source HTML and generate data or `use_figma` call bodies.
- **Figma scripts** (run inside Figma through the Figma MCP `use_figma` tool) create and check nodes. Several are also stored in the file itself — see `CLAUDE.md`.

Setup: `npm install` here (installs `playwright-core`; the extractor drives your installed Google Chrome). Paths below are relative to `tooling/`; source HTML is in `../handoff/source/`.

## Pipeline

```
handoff/source/kits/*.html ──extract──▶ ex/desk, ex/mob (layout trees) ──planner/compbuild──▶ component calls ──▶ 02 · Components
handoff/source/pages-*/*.html ──pagex──▶ ex/pages ──match──▶ ex/match ──pages/batch──▶ page calls ──runtime──▶ 03 / 04 Pages
                                                                                          checks: acceptance · rebind · overlap-scan
```

## 1. Extract layouts from HTML (Chrome)

| Script | Usage | Output |
|---|---|---|
| `extract.js` | `node extract.js <html> <selector> <out.json> [viewportWidth]` | computed-layout tree for one element |
| `extract-batch.js` | `node extract-batch.js <html> <outdir> <vw> <id> [id…]` | many kit artboards in one browser session |
| `clean.js` | module | strips kit build aids, collapses plain wrappers |
| `tree.js` | `node tree.js <tree.json> [depth] [raw]` | prints a tree for inspection |
| `shot.js`, `docshots.js`, `pagesurvey.js`, `docsurvey.js`, `survey.js` | ad-hoc | screenshots and surveys used while building |

## 2. Components

| Script | Role |
|---|---|
| `planner.js` | layout tree → compact build plan (auto layout, spacers, style binding, primitive instance matching) |
| `extras.js` | instance matchers for primitives, gradients, polygons, shadows |
| `compbuild.js` | `node compbuild.js <specs/x.json> <step> [chunk]` → `use_figma` call bodies for a component set (step = `items:<i>` or `set`) |
| `pack.js` | `node pack.js <extract.json> <bp> <name> <page> <x> <y> [parentId] > code.js` — one-off artboard build |
| `lib.js` | the converter (plan → Figma nodes). Stored in the file as `cpbuild/lib`; `install_lib.js` stores it |
| `builder.js` | standalone converter variant used before `lib` was stored |
| `specs/` | per-set specs (variants, props, sources) |
| `registry.json`, `reg_add.js` | built items/sets and their text-property names |
| `sets.json` | set name → variant name → Figma node id (re-export when variants change) |
| `icons.json`, `icons_raw.json`, `icon_geom_index.json`, `code_icons.js`, `logos.json` | line icons and logo artwork |

## 3. Foundations

`found/gen.js` → generates one `use_figma` call per Foundations section (plans built at runtime from the stored `lib`).

## 4. Pages

| Script | Usage |
|---|---|
| `pagex.js` | `node pagex.js ../handoff/source/pages-desktop ex/pages/desk 1440 [file…]` — splits pages into sections at `data-component` markers |
| `match.js` | `node match.js <desk\|mob> ex/pages/<bp>/*.json` → `ex/match/<bp>/*.json` (best variant per section, text overrides, hides, overlays). `node mdbg.js <bp> <page.json> <section> [variant]` prints an alignment |
| `pages/batch.js` | `LIMIT=30000 node pages/batch.js <desk\|mob> <file.html…>` → `pages/batch_<bp>_<n>.js` call bodies (≤ LIMIT bytes) and `pages/dict_<bp>.js` (shared text dictionary — run it in Figma first if it changed) |
| `pages/gen.js` | single-page call: `node pages/gen.js <desk\|mob> <file.html>` |
| `pages/runtime.js` | the page builder that runs inside Figma (stored as `cpbuild/pagert`). `node pages/mkstore.js` writes `pages/store_rt.js`, a call that re-stores it |
| `pages/titles.json`, `pages/order.txt` | page display names and manifest order |

Each batch call deletes existing frames with the same title before rebuilding, so re-running is safe. The runtime writes a **Build notes** panel next to each page and falls back to a `Page-specific /` copy of the reference import when a component is a poor fit (see `docs/build-log.md`).

## 5. Alignment and checks (inside Figma)

| Script | What it does |
|---|---|
| `align/core.js` | aligns an html.to.design import to the system (binds paints and text, hides tag pills, collapses stacked fills). Inject `PAGE_ID, BP, FROM, TO, DRY` above it |
| `fix/` | component text-style binding (`dry.js`, `apply.js`, `styles_common.js`) and text-property renames (`rename.js`, `rename_map.json`) |
| `figma-scripts/acceptance.js` | README acceptance checks (read-only) |
| `figma-scripts/rebind.js` | nearest-style rebind for detached text runs and icon vectors |
| `figma-scripts/overlap-scan.js` | text overlap and spill scan across both page sets |
| `figma-scripts/guide-lib.js` | layout helpers for the Guide and cover pages |

## 6. Tokens

`node build-tokens.js` → `../tokens/` (colors.json, typography.json, tokens.css, elementor-globals.md) from `../tokens/source/figma-styles.json`.

## Data

`ex/` holds generated data: kit layout trees (`desk`, `mob`, `mobadd`), page sections (`pages`) and match results (`match`). All of it can be regenerated from `handoff/source`.
