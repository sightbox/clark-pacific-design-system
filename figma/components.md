# Component inventory

42 component sets on **02 · Components**. Every set that represents a section has Desktop and Mobile variants; the four primitives without a Breakpoint property are breakpoint-independent. Text is edited through named text properties (counts below); `Show item N` booleans hide repeating items.

| Group | Set | ID | Variant properties | Booleans | Text props |
|---|---|---|---|---|---|
| 00 · Primitives | Logo / Long | `6:45` | Tone = Web / White | — | — |
| | Button | `6:70` | Type = Primary / Secondary / On-dark · State = Default / Hover · Breakpoint | — | Label |
| | Text Link | `7:46` | Color = Orange / Blue / Green / On dark · State · Breakpoint | — | Label |
| | Text Link / Card | `7:63` | Accent = Blue / Orange · State | — | Label |
| | Accent Bar | `7:67` | Color = Blue / Orange / Green | — | — |
| | Pagination Dot | `7:70` | State = Inactive / Active | — | — |
| 01 · Global | Announcement Bar | `14:35` | Breakpoint | — | Message, Link |
| | Header | `18:337` | State = Over photo / Products open / Solid / Menu open · Breakpoint | — | nav, CTA, mega-menu groups (40+) |
| | Brand Sign-off Band | `14:50` | Breakpoint | — | Body |
| | Footer | `16:160` | Breakpoint | — | columns, newsletter, legal (27) |
| 02 · Heroes | Hero | `19:338` | Type = Standard interior / Homepage overlay / Index / Editorial banner / Editorial header · Breakpoint | — | 25 (breadcrumbs, eyebrow, body, buttons, meta, tagline…) |
| 03 · Content Panels | FAQ Item | `8:24` | State = Open / Closed · Breakpoint | — | Question, Answer |
| | FAQ Accordion | `9:42` | Breakpoint | Show item 1–4 | — |
| | Split Content | `21:428` | Layout = Image left 50/50 / Image right 50/50 / Bulleted / 40/60 Image left / 40/60 Image right / Horizontal icon callout / Stacked list + photo · Breakpoint | — | 16 |
| | Quote Band | `22:219` | Breakpoint | — | Name, Attribution |
| | Comparison Table | `22:275` | Breakpoint | — | 23 (4 rows desktop, 2 rows mobile) |
| 04 · CTAs & Buttons | CTA Banner | `23:379` | Surface = Blue / Dark Charcoal / White / BG Alt / Light / Photo overlay · Layout = Content left / Content right / Centered · two buttons / Centered · single button / Align left / Align center / Align right / Stacked · Breakpoint | — | Eyebrow, Body, Button 1/2 label, Photo caption |
| 05 · Cards & Grids | Icon Grid Item | `24:252` | Style = Compact / Inline / Stacked · Breakpoint | — | Title, Body |
| | Icon Grid | `25:825` | Layout = Headline left 2×3 / 4-col with body / 3-col spacious / 4-col spacious · Breakpoint | Show item 1–8 | — |
| | Canonical Card | `26:729` | Type = Standard / Compact / Text only / Image as button · Breakpoint · State = Default / Hover | — | 6 |
| | Project Card | `26:753` | Style = Default / Title only · Breakpoint | — | 4 |
| | Resource Card | `26:775` | Breakpoint | — | 5 |
| | Related Content Row | `27:748` | Breakpoint | Show item 1–3 | Link label |
| | Filterable Index Grid | `27:828` | Breakpoint | Show item 1–3 | search, filters, chips |
| | Featured Resources | `27:908` | Breakpoint | Show item 1–3 | Eyebrow, Button label |
| | Projects Photo Mosaic | `28:856` | Breakpoint | — | 7 |
| | Image Gallery | `28:896` | Breakpoint · Slide = 1–5 | — | Project name, Photo caption, Caption |
| | Leadership Card | `28:926` | State = Default / Hover · Breakpoint | — | 5 |
| | Leadership Grid | `29:939` | Breakpoint | Show item 1–8 | Eyebrow, Body |
| 06 · Data & Company | Stat | `30:940` | Divider = None / Left / Bottom / Bottom + Left · Breakpoint | — | Value, Label |
| | Process Step | `30:959` | Surface = Light / Dark · Breakpoint | — | Number, Title, Body |
| | Core Values | `30:996` | Breakpoint | — | 12 |
| | Stats Row | `31:948` | Breakpoint | Show item 1–4 | — |
| | Process Steps | `31:981` | Breakpoint | Show item 1–3 | — |
| | Timeline | `31:1066` | Breakpoint | — | 15 |
| | Benefits Grid | `31:1172` | Breakpoint | — | 12 |
| 07 · Product Detail & Media | CARBONSHIELD® | `32:1051` | Breakpoint | — | 5 |
| | Finishes Guide · Graphic CTA | `32:1103` | Breakpoint | — | 9 |
| | System Overview + Materials | `32:1152` | Breakpoint | — | 12 |
| | Assembly + Specifications | `33:1093` | Breakpoint | — | 21 |
| | Video Module | `36:1186` | Layout = Full width / Video left / Video right / Carousel · Breakpoint · Slide = 1–3 (carousel) | — | 11 |
| 08 · Forms | Form | `33:1180` | Type = Contact / Newsletter · Breakpoint | — | 21 |

## Prototype interactions (on the components)

| Component | Behaviour |
|---|---|
| Button | Hover → Hover state (Primary #003D84; Secondary/On-dark 12% fill), 150 ms |
| Text Link, Text Link / Card | Hover → bar fill, Smart animate 400 ms ease-out |
| FAQ Item | Click toggles Open/Closed, 250 ms (first item open by default) |
| Header | Mouse-enter "Our Products" → Products open; mouse-leave → Over photo. Mobile: menu icon → Menu open, close icon → Over photo |
| Leadership Card | Hover → bio overlay, 300 ms |
| Canonical Card · Image as button | Hover → Scrim 40% + "View Projects →", 300 ms |
| Image Gallery | Thumbnail click → Slide N |
| Video Module · Carousel | Dot click → Slide N, 400 ms |

Hover states are Desktop only.
