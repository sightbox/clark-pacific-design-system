# Figma file map

File: **CP-Design-System-3** — key `gwXCIJW8u9a6s3txBv30M2`
URL pattern for a node: `https://www.figma.com/design/gwXCIJW8u9a6s3txBv30M2/CP-Design-System-3?node-id=<id with - instead of :>`

## Pages

| Page | ID | Key frames |
|---|---|---|
| 00 · Cover | `0:1` | Cover `119:2` · Page order & flags `119:40` |
| 00 · Guide | `138:20` | 1 · Start here `138:21` · 2 · System foundations `139:20` · 3 · The component library `140:20` · 4 · Building a page `141:26` · 5 · Preview, handoff and upkeep `142:26` |
| 01 · Foundations | `2:2` | Overview `60:2` · Color `61:2` · Typography `62:2` · Type · Added styles `62:197` · Layout `63:2` · Buttons & links `64:2` |
| 02 · Components | `2:3` | Row 1 (y 0), left → right: 00 · Primitives `5:2` · 01 · Global `14:28` · 02 · Heroes `19:173` · 03 · Content Panels `8:2` · 04 · CTAs & Buttons `23:205` · 05 · Cards & Grids `24:214` · 06 · Data & Company `30:921` · 07 · Product Detail & Media `32:1016` · 08 · Forms `33:1094` (06–08 were nested in 05 until 1 Oct 2026). Row 2 (y ≈ 20438): 2.5 · Content Panels `225:1245` · 2.5 · Cards & Grids `225:1246` · 2.5 · CTAs `225:1247` · 2.5 · Data Display `225:1248` · 2.5 · Company Pages `225:1249` · 2.5 · Insights `225:1250` · 2.5 · Product Pages `225:1251` · 2.5 · Projects `225:1252` |
| 03 · Pages Desktop | `81:2` | 38 frames `Desktop / <Page>` (1440 wide) + `Build notes / Desktop / <Page>`, rows of 8 in manifest order |
| 04 · Pages Mobile | `81:3` | 38 frames `Mobile / <Page>` (390 wide) + Build notes, rows of 8 |
| 05 · Page References · Desktop | `2:4` | html.to.design imports, one SECTION per page (`<file>.html …`) |
| 06 · Page References · Mobile | `2:5` | same, 390 |

Page order (manifest): About Us, AccelCore, AccelDeck, AccelGen, AccelShell, Architectural Precast, Article, Blog, Building Envelope, Careers, Contact, Data Centers, Design Assist, Design Build, Finishes, GFRC, Glass And Glazing, Homepage, In The News, Infinite Facade, Lab Solutions, Leadership, NetZero Building Platform, News Article, Our Approach, PARC, Parking, PHMF, Podcast Episode, Podcast, Project Detail, Projects, Resources, Structural Solutions, Sustainability, Trade Partner, Webinar Detail, Webinars.

## Frequently used component IDs

| Component | Variant | ID |
|---|---|---|
| Announcement Bar | Desktop / Mobile | `14:29` / `14:32` |
| Header | Over photo D / Products open D / Solid D / Over photo M / Menu open M | `18:76` / `18:120` / `18:196` / `18:260` / `18:287` |
| Hero | Standard interior D / M | `19:174` / `19:287` |
| Hero | Homepage overlay D / M | `19:244` / `19:307` |
| Hero | Index D / M | `19:251` / `19:320` |
| Hero | Editorial banner D / M | `19:265` / `130:1266` |
| Hero | Editorial header D / M | `19:270` / `19:325` |
| Brand Sign-off Band | Desktop / Mobile | `14:36` / `14:47` |
| Footer | Desktop / Mobile | `16:31` / `16:105` |
| Stats Row | Desktop / Mobile | `31:921` / `31:935` |
| Logo / Long | set | `6:45` |

Full variant → ID map: `tooling/sets.json` (set name → variant name → node id).

## Figma 2.5 Additions file

File: **Clark Pacific 2.5 Additions**, key `EQ2vqFYpJhDbodciKa3FOj`, Sightbox team.

| Page | ID | Contents |
|---|---|---|
| Components · 2.5 Additions | `0:1` | 45 components `2.5 / …` in manifest order (x 0, 240px apart) + `Dev note / …` frames at x ≈ 1520. Test component `2.5 / CTA Decision Panel / Content left · Blue` = `5:16` |
| Building blocks (from 2.0) | — | Button `2:27`, Text Link `2:78`, Text Link / Card `2:99`, Accent Bar `2:105`, 47 icons (`tooling/a25/registry25.json`) |

## 2.5 Additions in this design-system file

The 45 components are on **02 · Components** (`2:3`), in eight `2.5 · <group>` sections on the second row (IDs above), grouped by the manifest `group`. Before 1 Oct 2026 they sat in a single `2.5 Additions` section (`206:1071`), which has been removed. Inside each section the components are stacked in manifest order, with the dev note to the right of each one. The nested `2.5 / Projects / Photo gallery` set sits to the right of the Overview accordion note. They use this file's own 2.0 Button, Accent Bar and icon components (`tooling/registry.json`). The 20 `Flagged/2.5 · #HEX NN%` paint styles (`tooling/a25/flagged-ds.txt`), 11 `Flagged/2.5 · Desktop · …` text styles and the `Flagged/2.5 · Ring #DEDFE0 1.5` effect style were added for them.

Layout tidy (1 Oct 2026): sections are laid out 00 → 08. 05 · Cards & Grids is one column, with Image Gallery moved in from x 13670 and the Canonical Card / Project Card overlap removed. 02 · Heroes now fits the Hero set, and 03 · Content Panels is re-stacked (Split Content no longer overlaps Quote Band). Only positions changed; no component, name or ID was touched.
