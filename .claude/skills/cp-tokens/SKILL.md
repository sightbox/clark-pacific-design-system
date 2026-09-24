---
name: cp-tokens
description: Re-export the Clark Pacific paint and text styles from Figma and regenerate the design tokens (JSON, CSS, Elementor mapping). Use when styles changed in Figma or when asked to update tokens for the web team.
---

# Refresh tokens

1. Load the `figma-use` skill. In Figma file `gwXCIJW8u9a6s3txBv30M2`, run a read-only `use_figma` call that returns:
   - every local paint style: name, description, and either `hex` + `opacity` (solid) or gradient `stops` (hex, alpha, position) with a direction (`to bottom` when the gradient transform's first row is `[0,1,0]`, `to top` when it is `[0,-1,1]`);
   - every local text style as a compact string `name|family|weight|size|lineHeight|letterSpacing|U|A` (lineHeight as `auto`, `NN%` or `NNpx`; letterSpacing as `N%` or `Npx`; `U` when textCase is UPPER; `A` when the style was added during the build — its description starts with "Added").
   Responses are truncated around 20 KB, so fetch paints and text styles in separate calls.
2. Write the result into `tokens/source/figma-styles.json` (same shape as the existing file; update `exported`).
3. Run `node tooling/build-tokens.js`.
4. Review `git diff tokens/` and summarise for the user which Global Colors / Global Fonts changed (`tokens/elementor-globals.md` is the web team's reference). Commit when the user agrees.
