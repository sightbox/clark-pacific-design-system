# Clark Pacific · Figma 2.5 · Dev Notes

30 Sep 2026. Goes with the Figma 2.5 additions file. Each section component gets its behavior and design intent. Components marked **Interactive** have behavior you can't see in the static Figma frame. Everything else is static apart from the standard hover states.

**Global hover rules:** Text links: the bar fills left to right to the label width on hover, Orange #FF8600, 400ms ease. Buttons: Primary darkens to #003D84 on hover; outlined buttons get a 12% fill of their outline colour. Pagination: inactive is a 6px gray dot; active is an orange 26×6 pill.

Part A covers the 45 components new in 2.5. Part B covers modules already in the Clark Pacific Figma file. They're here as notes only; nothing in the file was changed.

# Part A: New in 2.5

## Content Panels

### 2.5 / CTA / Footer image band
- Buttons: Primary darkens to #003D84 on hover; outlined buttons get a 12% fill of their outline colour.

*Design intent:* Full-bleed photo band with overlaid centered CTA. Blue primary button on dark.

### 2.5 / Split Content / Products intro
- Text link: bar fills left → right to the label width on hover, Orange #FF8600, 400ms ease.

*Design intent:* Two-Column 50/50. Heading left, body + CTA right. Standard light panel split.

### 2.5 / Split Content / Product detail + spec table

*Design intent:* Two-Column with a spec table (label / value rows on hairline dividers). Product photo left.

## Cards & Grids

### 2.5 / Cards / Insights feed · Filterable · Interactive
- FILTER. Chips (All / Articles / Podcasts / Webinars) filter the grid by content type; one active at a time, All by default.
- Active chip in Orange. Grid re-flows without a page reload.

*Design intent:* New — filterable 3-up grid. Type badges: Article / Podcast / Webinar. Click the filter pills above the grid.

### 2.5 / Carousel / Image + content · 3-up · Interactive
- CAROUSEL. ‹ › arrows move one card at a time; arrows dim to 30% at either end (no loop).
- Mobile: swipe row with pagination dots.

*Design intent:* 3 columns separated by 2px white gap. Each column: image → static accent bar (3px, Blue/Orange alternating) → type + date → uppercase bold title → body → Read More. The Read More track runs the full column width for structure; the short accent bar marks the label and fills on hover. Prev/Next arrows navigate. Used on Insights index, Projects index, and featured content strips.

### 2.5 / Carousel / Image + content · 4-up · Interactive
- CAROUSEL. ‹ › arrows move one card at a time; arrows dim at the ends (no loop).
- Mobile: swipe row with dots.

*Design intent:* Same card anatomy as 3-up but four columns. Use on wider content areas.

### 2.5 / Carousel / Product highlights · Interactive
- CAROUSEL. Arrows and dots advance the slide; the active dot is the orange 26×6 pill.
- Eyebrow and body copy change with the slide.

*Design intent:* Interactive — arrows and dots advance the slide. Use for product highlight reels.

### 2.5 / Lists / Product category list
- Each item is a link to its product page; hover turns it Orange.

*Design intent:* Products index — 4-column. Typos fixed (Infinite Facade, Glass & Glazing).

### 2.5 / Icon Module / 4-col
- Static.

*Design intent:* Icon + headline + description. 2/3/4-col variants fold behind a layout prop. Maps to Services / Capabilities List component.

### 2.5 / Icon Module / 3-col
- Static.

*Design intent:* Icon + headline + description. 2/3/4-col variants fold behind a layout prop. Maps to Services / Capabilities List component.

### 2.5 / Icon Module / 2-col horizontal
- Static.

*Design intent:* Icon + headline + description. 2/3/4-col variants fold behind a layout prop. Maps to Services / Capabilities List component.

## CTAs

### 2.5 / CTA Decision Panel / Content left · Blue
- Buttons: Primary darkens to #003D84 on hover; outlined buttons get a 12% fill of their outline colour.

*Design intent:* Dimensional CTA — headline + value statement + project image + one primary action. Six orientations: three content-left (image right) and three content-right (image left), across Blue / Dark / White-Light surfaces. Button: white or blue fill per surface; no white text on orange.

### 2.5 / CTA Decision Panel / Content left · Dark Charcoal
- Buttons: Primary darkens to #003D84 on hover; outlined buttons get a 12% fill of their outline colour.

*Design intent:* Dimensional CTA — headline + value statement + project image + one primary action. Six orientations: three content-left (image right) and three content-right (image left), across Blue / Dark / White-Light surfaces. Button: white or blue fill per surface; no white text on orange.

### 2.5 / CTA Decision Panel / Content left · White
- Buttons: Primary darkens to #003D84 on hover; outlined buttons get a 12% fill of their outline colour.

*Design intent:* Dimensional CTA — headline + value statement + project image + one primary action. Six orientations: three content-left (image right) and three content-right (image left), across Blue / Dark / White-Light surfaces. Button: white or blue fill per surface; no white text on orange.

### 2.5 / CTA Decision Panel / Content right · Light
- Buttons: Primary darkens to #003D84 on hover; outlined buttons get a 12% fill of their outline colour.

*Design intent:* Dimensional CTA — headline + value statement + project image + one primary action. Six orientations: three content-left (image right) and three content-right (image left), across Blue / Dark / White-Light surfaces. Button: white or blue fill per surface; no white text on orange.

### 2.5 / CTA Decision Panel / Content right · Blue
- Buttons: Primary darkens to #003D84 on hover; outlined buttons get a 12% fill of their outline colour.

*Design intent:* Dimensional CTA — headline + value statement + project image + one primary action. Six orientations: three content-left (image right) and three content-right (image left), across Blue / Dark / White-Light surfaces. Button: white or blue fill per surface; no white text on orange.

### 2.5 / CTA Decision Panel / Content right · Dark Charcoal
- Buttons: Primary darkens to #003D84 on hover; outlined buttons get a 12% fill of their outline colour.

*Design intent:* Dimensional CTA — headline + value statement + project image + one primary action. Six orientations: three content-left (image right) and three content-right (image left), across Blue / Dark / White-Light surfaces. Button: white or blue fill per surface; no white text on orange.

### 2.5 / Promo / Tagline statement band
- Static.

*Design intent:* One-Column centered statement. Lead-scale, bold keyword. Sits on white.

### 2.5 / Promo / Content promo band · Podcast
- Band links to the Podcast index.
- Buttons: Primary darkens to #003D84 on hover; outlined buttons get a 12% fill of their outline colour.

*Design intent:* New — full-width dark promotional band. Eyebrow + headline left, CTA right. Used on homepage for podcast; works for any content promotion (webinar, guide, event).

### 2.5 / Promo / Content promo band · Webinar
- Band links to the webinar detail / registration.
- Buttons: Primary darkens to #003D84 on hover; outlined buttons get a 12% fill of their outline colour.

*Design intent:* New — full-width dark promotional band. Eyebrow + headline left, CTA right. Used on homepage for podcast; works for any content promotion (webinar, guide, event).

### 2.5 / CTA / Asset download block
- Button downloads the asset directly (spec sheet, guide or whitepaper).
- Buttons: Primary darkens to #003D84 on hover; outlined buttons get a 12% fill of their outline colour.

*Design intent:* New — configurable for any spec sheet, guide, or whitepaper. Thumbnail left, description + download CTA right.

## Data Display

### 2.5 / Stats Row / Accent dividers
- Static.

*Design intent:* White background. Dark numerals, gray body, orange accent dividers between sections.

### 2.5 / Project Detail / Spec panel · Interactive
- "+6" thumbnail opens a full-screen lightbox gallery.
- Clicking any thumbnail swaps the main photo.

*Design intent:* New — structured sidebar for project detail pages. Photo + thumbnail strip left; key/value spec rows + product badges right.

## Company Pages

### 2.5 / Careers / Open positions list · Interactive
- FILTER. Department tabs filter the list (underline indicator on the active tab).
- Each job row links out to the posting in the ATS.

*Design intent:* Filter tab row (underline indicator) + job rows. Each row: title + dept tag + location + type pill + "Apply →" CTA. Interactive — clicking filters shows matching jobs only. Rows on 1px #DEDFE0 dividers.

### 2.5 / Sustainability / Sustainable callout
- Static.

*Design intent:* Green keyword — the sanctioned exception (sustainability content). Two-Column 50/50.

### 2.5 / Sustainability / Stats band
- Static. Confirm the 40% cement figure with Clark Pacific before launch.

*Design intent:* Converted to the light treatment August 2026 — the dark band is retired, and a stats row carries no CTA, so it is not a sanctioned coloured surface. Same anatomy as the canonical Stats Row (Simple Dividers): white surface between top and bottom #DEDFE0 hairlines, 1px divider between cells, SemiBold Dark Charcoal numerals. The Green accent bar is kept — this is sustainability content.

### 2.5 / Sustainability / EPD + credentials grid
- Each credential tile links to its PDF.

*Design intent:* Open 2×2 grid on white, 28px gutters (the #F0F0F0 hairline field was retired August 2026 — the fill now sits only on the individual credential boxes, which is the sanctioned use). Each box: white 64×64 icon card (green checkmark) + SemiBold uppercase title + body. Use for third-party certifications, green building contributions, or verified claims.

### 2.5 / About / Timeline · Horizontal
- Scrolls horizontally at narrow widths; show a fade at the right edge to hint more.

*Design intent:* Horizontal milestone strip, horizontally scrollable at narrow widths. Connecting line at node center. Each node: filled circle (filled = key milestone, outline = standard) + year + uppercase title + caption body. First/last nodes use brand colors.

### 2.5 / About / Territory map
- Static image — Clark Pacific to supply the map artwork.

*Design intent:* Schematic SVG map: two CA plants (West Sacramento HQ + Woodland), Pacific NW expansion in 2026. Primary service territory shaded Blue, expansion area shaded Orange. Legend + stat callouts to the right. Used on About Us and Contact pages.

## Insights

### 2.5 / Insights / Filter bar · Interactive
- FILTER. Underline tab row filters the list below; active tab gets the 2px bar.

*Design intent:* Underline-indicator tab row. Active tab: #52565A text + 2px bottom border. Inactive: #7F8A92. Used on Webinars, In the News, and Podcast index pages. Horizontally scrollable at narrow widths.

### 2.5 / Insights / Webinar card · List
- Whole card links to the webinar detail page. Badge reads On Demand or Upcoming.

*Design intent:* Horizontal list card. 320px dark video thumbnail left with play button + "On Demand" badge. Right: category tag + title + date (if applicable) + description + "Watch Now →". Rows separated by 1px #DEDFE0 dividers. Stacks vertically in a bordered container.

### 2.5 / Insights / Content archive · Paginated · Interactive
- FILTER + SEARCH + PAGINATION. Type chips filter; search narrows; result count updates.
- Numbered pagination with prev/next; prev/next dim at the ends. Page change scrolls to the list top.

*Design intent:* Paginated list for In the News and Resources index pages. Search bar + content-type filter chips + result count + sorted row list (thumbnail · type badge · title · date · excerpt · CTA) + numbered pagination. Interactive — filter chips and pagination are JS-driven. 5 items per page.

## Product Pages

### 2.5 / Products / Sub-category card grid
- Whole card is the link; the underline animates on hover.

*Design intent:* 2×2 (or 2×1) grid of product sub-category cards. Each: 16:9 photo placeholder + eyebrow (product type) + bold uppercase title + description + animated underline text link. All cards white with a 1px #DEDFE0 outline and 28px gutters — the alternating BG Alt fills and 1px-packed gutters are retired (June 2026).

### 2.5 / Products / Structural components strip
- Scrolls horizontally when items overflow.

*Design intent:* Horizontal scrollable strip inside a bordered container. Each item: 64×64px BG Alt icon cell + SemiBold uppercase label below. 1px #DEDFE0 right dividers. White background, equal column widths. Used on Data Centers page to list structural components (L Beams, R Beams, etc.).

### 2.5 / Products / Product intro · Infinite Facade®
- Text link: bar fills left → right to the label width on hover, Orange #FF8600, 400ms ease.

*Design intent:* Brand-neutral eyebrow — Infinite Facade® uses the standard palette. Two-Column 50/50 with product imagery, on white.

### 2.5 / Products / Finish grid · Infinite Facade®
- "View finishes guide" text link — Orange hover.

*Design intent:* Ten finish swatches. "View finishes guide" text-link uses the Orange accent bar — left-aligned, fills on hover.

### 2.5 / Stats Row / Light · Infinite Facade®
- Static.

*Design intent:* White background — the only stats surface. The dark stats band is retired (June 2026): all modules sit on white. Extra-large bold numerals (92px), equal column padding, hairline dividers.

### 2.5 / Sustainability / Video + bullet highlights
- Play button plays the video inline.

*Design intent:* Green keyword — sanctioned exception for sustainability content. Video thumbnail left, bullet points right.

### 2.5 / Sustainability / Initiatives list
- Static.

*Design intent:* Green applied. Two columns, six distinct sustainability initiatives with icon wells.

## Projects

### 2.5 / Projects / Filter bar · Interactive
- FILTER + SEARCH. Category chips and Region chips combine (AND). Search narrows further.
- "Showing N projects" count updates live; badges use the category colours (Parking Orange, Envelope Blue, Data Centers gray).

*Design intent:* Full-width interactive filter for the Projects index. Search bar first (users frequently search by product name), then product-type pills (filled #52565A = active, #F0F0F0 = inactive) + Region row. Live filtered project count. Grid updates to match. Used at the top of the Projects index page, above the project card grid.

### 2.5 / Projects / Project card grid
- Whole card is the link; the photo darkens slightly on hover.

*Design intent:* 4:3 photo with embedded product badge (top-left — category colors: Parking = Orange, Building Envelope / Facades = Blue, Data Centers & Structural = Dark Charcoal until a color is chosen) + 3px Orange accent bar + bold uppercase title + industry · region metadata + "View Project →". Used on Projects index and related projects strips.

### 2.5 / Projects / Resource card · 4 variants
- Video variants: play overlay opens the video in a lightbox. Format badge sits top-left.

*Design intent:* 3:2 photo with optional video play button overlay + format badge (filled = primary type, outlined = secondary) + product category + uppercase title + excerpt + CTA. Used on Resources index. Format badges: Webinar/Podcast use outlined; Datasheet/Case Study/Guide use filled.

### 2.5 / Projects / Featured blog post
- Whole block links to the post.

*Design intent:* 16:9 image left (1.2fr) + right column: "Featured" dark badge, category + date, bold title, excerpt, "Read Article →". Used at top of Blog index, on white.

### 2.5 / Projects / Detail sidebar trio · Interactive
- Photo gallery: thumbnail click swaps the main photo; "+N" opens a lightbox.
- Facts & Figures and Project Team are static.

*Design intent:* Three sidebar components used together on Project Detail pages: Photo Gallery (main + 5 thumbnails), Facts & Figures spec table, Project Team credits. All use 1px #DEDFE0 border containers with #F0F0F0 header band.

### 2.5 / Projects / Overview accordion · Alt detail · Interactive
- EXPANDABLE LIST. Three sections — Project Overview, Facts & Figures, Project Team. Click a header to open it; opening one closes the others.
- Project Overview is open on load. Sign flips + → –.

*Design intent:* Alternate detail layout: photo gallery left, accordion right (same 1.5/1 split as the sidebar trio). The page leads with an expandable Project Overview — the written project description (not every project has a formal case study) — with Facts & Figures and Project Team collapsed beneath. Opening one section collapses the others. Interactive — click the section headers.

# Part B: Already in your file (notes only)

## Heroes

### Hero / Standard interior
- Header sits transparent over the photo and switches to the Solid state once the page scrolls past the hero (see Header / States).
- Buttons: Primary darkens to #003D84 on hover; outlined buttons get a 12% fill of their outline colour.

In your Figma file as: Hero / Standard interior

### Hero / Homepage overlay
- Header sits transparent over the photo and switches to the Solid state once the page scrolls past the hero (see Header / States).
- Headline stays overlaid on the photo — homepage only.
- Buttons: Primary darkens to #003D84 on hover; outlined buttons get a 12% fill of their outline colour.

*Design intent:* Homepage keeps its headline overlaid on the photo, anchored lower-left, with the same 45° accent line. Every other page places copy below the image.

In your Figma file as: Hero / Homepage overlay

### Hero / Index
- Header sits transparent over the photo and switches to the Solid state once the page scrolls past the hero (see Header / States).

*Design intent:* Insights, Projects and other listing pages: image hero then eyebrow + two-tier headline + intro below. No CTA in the opener.

In your Figma file as: Hero / Index

### Hero / Editorial banner
- Header sits transparent over the photo and switches to the Solid state once the page scrolls past the hero (see Header / States).

*Design intent:* Article, news and project detail pages lead with a full-bleed image banner; the title, meta and body follow in the article column below.

In your Figma file as: Hero / Editorial banner

### Hero / Editorial header
- Category eyebrow links to the filtered index.
- Meta row (date · author · read time) is pulled from the post.

*Design intent:* Title + meta block that leads Article, News, Webinar and Podcast detail pages — breadcrumb, category eyebrow, a 3px orange accent bar, two-tier headline and a meta row (date · author · read time) on a hairline base rule. Sits on white beneath the Hero 04 photo banner.

In your Figma file as: Hero / Editorial header

## Content Panels

### Split Content / 50-50 · Image left
- Text link: bar fills left → right to the label width on hover, Orange #FF8600, 400ms ease.

*Design intent:* Four column arrangements — all on white (full-module background fills are retired, June 2026). Static accent bars are the graphic touch: 3px, brand Blue or Orange mixed (never all gray), touching the photo's bottom edge or leading the copy — never on the hero. Any variant can be used for any product line.

In your Figma file as: Split Content / 4 variants

### Split Content / 50-50 · Image right
- Text link: bar fills left → right to the label width on hover, Orange #FF8600, 400ms ease.

*Design intent:* Four column arrangements — all on white (full-module background fills are retired, June 2026). Static accent bars are the graphic touch: 3px, brand Blue or Orange mixed (never all gray), touching the photo's bottom edge or leading the copy — never on the hero. Any variant can be used for any product line.

In your Figma file as: Split Content / 4 variants

### Split Content / 50-50 · Bulleted list
- Text link: bar fills left → right to the label width on hover, Orange #FF8600, 400ms ease.

*Design intent:* Four column arrangements — all on white (full-module background fills are retired, June 2026). Static accent bars are the graphic touch: 3px, brand Blue or Orange mixed (never all gray), touching the photo's bottom edge or leading the copy — never on the hero. Any variant can be used for any product line.

In your Figma file as: Split Content / 4 variants

### Split Content / 60-40 · Wide image left
- Text link: bar fills left → right to the label width on hover, Orange #FF8600, 400ms ease.

*Design intent:* Four column arrangements — all on white (full-module background fills are retired, June 2026). Static accent bars are the graphic touch: 3px, brand Blue or Orange mixed (never all gray), touching the photo's bottom edge or leading the copy — never on the hero. Any variant can be used for any product line.

In your Figma file as: Split Content / 4 variants

### Split Content / 40-60 · Wide image right
- Text link: bar fills left → right to the label width on hover, Orange #FF8600, 400ms ease.

*Design intent:* Four column arrangements — all on white (full-module background fills are retired, June 2026). Static accent bars are the graphic touch: 3px, brand Blue or Orange mixed (never all gray), touching the photo's bottom edge or leading the copy — never on the hero. Any variant can be used for any product line.

In your Figma file as: Split Content / 4 variants

### Split Content / Horizontal icon callout
- Text link: bar fills left → right to the label width on hover, Orange #FF8600, 400ms ease.

*Design intent:* Single full-width row: line icon + two-tier headline (SemiBold + Light) · intro paragraph · text-link CTA. Use to lead a section with a single capability statement.

In your Figma file as: Split Content / Horizontal icon callout

### Split Content / 40-60 · Stacked list + photo
- Each stacked block's text link animates independently.
- Text link: bar fills left → right to the label width on hover, Orange #FF8600, 400ms ease.

*Design intent:* Left column stacks 2–4 titled text blocks on hairline dividers, each with a right-aligned text-link; right column holds a single tall photo spanning the full height. Use for a capability/solutions overview.

In your Figma file as: Split Content / 40-60 stacked list + photo

### Product Detail / Assembly + Specifications
- Static. Spec rows can stack as title + description (AccelDeck) instead of label / value.

*Design intent:* One module for every product page that pairs specs with benefits (deck slides 30, 34, 54, 56). A single 4:5 photo left; accent bar, two-tier headline and label/value spec rows on hairlines right; benefits run horizontally beneath as a titled row with orange check marks. Spec rows may also stack as title + description (AccelDeck). Replaces the four side-by-side specs/benefits layouts on AccelDeck, AccelShell, Architectural Precast and GFRC.

In your Figma file as: Assembly + Specifications

### Product Detail / Finishes guide · Graphic CTA
- Blue button downloads the guide PDF directly (confirm with Clark Pacific whether it should be gated behind the form).
- Text link: bar fills left → right to the label width on hover, Orange #FF8600, 400ms ease.

*Design intent:* The finishes guide as its own module (deck slides 40, 57). White surface; a #F0F0F0 boxed graphic shows the guide cover with four swatches on 2px white gaps; accent bar, eyebrow, two-tier headline, blue download button and an optional text link. Replaces the dark, blue and paired download banners on Building Envelope, Finishes and Data Centers.

In your Figma file as: Finishes Guide · Graphic CTA

### Product Detail / System overview + Materials

*Design intent:* Two-part module (deck slide 47): 40/60 overview (headline left, lead + body right), then a titled 3-up materials row on a hairline with photo, Blue/Orange accent bars, name and description. Built for Infinite Facade® weather-barrier materials; content comes from the live site.

In your Figma file as: System Overview + Materials

### Quote Band

*Design intent:* Large pull-quote on white with an orange quotation-mark accent and a name / title attribution. Any emphasis inside the quote is SemiBold gray (never orange on light). May also render on the Blue decision surface for a client-testimonial CTA.

In your Figma file as: Quote Band

### FAQ Accordion · Interactive
- EXPANDABLE LIST. Click a question row to open its answer directly beneath it; click again to close.
- First item is open on page load. Opening one row closes the others (single-open).
- Open row: sign flips + → –, answer fades/slides in over 250ms, 3px orange bar sits under the open answer.
- Whole row is the hit target (min 44px tall). Use a <button> with aria-expanded on each question.

*Design intent:* Question rows on hairline dividers; the open row reveals its answer with a 3px orange bar beneath. Used site-wide — product, solutions, and platform pages (relocated from Infinite Facade®, June 2026).

In your Figma file as: FAQ Accordion

### Comparison Table

*Design intent:* Side-by-side comparison of two systems. The Clark Pacific option is the featured column — a subtle #F0F0F0 fill (a boxed element inside the module) with a 3px orange top accent. Attribute rows on hairlines. Use for “X vs Y” product decisions.

In your Figma file as: Comparison Table

### Video / Single column
- Play button opens the video inline in the 16:9 frame (YouTube/Vimeo embed, autoplay on click).

*Design intent:* Single Column, Two Column Left, Two Column Right, Carousel — per client mockups. Consistent player frame, play button, and control bar treatment across all. The peek-a-boo carousel defaults to the middle video so the peek shows on both sides; the set is finite (3) with a hard start and end.

In your Figma file as: Video Module / 4 variants

### Video / Video left
- Play button plays inline in the frame.

*Design intent:* Single Column, Two Column Left, Two Column Right, Carousel — per client mockups. Consistent player frame, play button, and control bar treatment across all. The peek-a-boo carousel defaults to the middle video so the peek shows on both sides; the set is finite (3) with a hard start and end.

In your Figma file as: Video Module / 4 variants

### Video / Video right
- Play button plays inline in the frame.

*Design intent:* Single Column, Two Column Left, Two Column Right, Carousel — per client mockups. Consistent player frame, play button, and control bar treatment across all. The peek-a-boo carousel defaults to the middle video so the peek shows on both sides; the set is finite (3) with a hard start and end.

In your Figma file as: Video Module / 4 variants

### Video / Carousel · Peek-a-boo · Interactive
- CAROUSEL. Three slides; the middle one is active on load, so both neighbours peek (~72px, dimmed to 38%, scaled 97%).
- Click a peeking slide or a dot to make it active — 450ms ease. Finite (no loop).
- Only the active slide plays; its title and description update beneath.
- Mobile: swipe between slides.

*Design intent:* Single Column, Two Column Left, Two Column Right, Carousel — per client mockups. Consistent player frame, play button, and control bar treatment across all. The peek-a-boo carousel defaults to the middle video so the peek shows on both sides; the set is finite (3) with a hard start and end.

In your Figma file as: Video Module / 4 variants

## Cards & Grids

### Card / Canonical card · 4 variants
- Read More: the track spans the full card column; the short accent bar fills it on hover.
- Image-as-button variant: the whole photo is the link — hover darkens it (scrim 40%) and reveals "VIEW PROJECTS →".

*Design intent:* August 2026 — the consolidation. Insight cards, related-content cards, resource cards, sub-category cards and project tiles were five near-identical treatments; they are now one anatomy with four variants. Fixed parts never change between variants; only the marked rows are optional.

In your Figma file as: Canonical Card / 4 variants

### Cards / Projects photo mosaic · Interactive
- HOVER. The whole photo is the button: hover darkens it and slides in "VIEW PROJECTS →" (350ms). Category label beneath darkens.
- Single centred rollup button links to the Projects index.

*Design intent:* 3-col photo mosaic for the homepage projects section. Updated August 2026: the per-card links are gone and one “View Projects” rollup button closes the module — three CTAs in a row crowded the panel and repeated the same destination. Each column is one large 4:3 photo + category label, 2px white column gaps.

In your Figma file as: Projects Photo Mosaic

### Cards / Related content row
- View All links to the matching index.
- Read More track fills on hover.

*Design intent:* Closes a detail page with three related items (projects, articles, products, episodes). Section headline + “View all” text-link, then a 3-up card row. Each card: photo with a static Blue/Orange accent bar (mixed), category label, title, meta, and a full-width Read More track with a short accent bar that fills on hover.

In your Figma file as: Related Content Row

### Cards / Filterable index grid · Interactive
- FILTER + SEARCH. Search narrows by keyword as you type; chips filter by category; both combine.
- Active chip in Orange. No page reload.

*Design intent:* Listing pages (Projects, Insights / Blog, Resources) lead with a search field + filter chips — one active in Orange — then a responsive 3-up card grid. Cards reuse the Related Content card anatomy. The active-chip accent matches the tab-indicator rule.

In your Figma file as: Filterable Index Grid

### Icon Grid / Headline left 2×3
- Static.

*Design intent:* 40/60 split. Headline + subhead left; 2×3 compact icon tiles right — icon circle + uppercase label, no body copy.

In your Figma file as: Icon Grid / Headline left 2×3

### Icon Grid / 4-col with body
- Static.

*Design intent:* Headline above, then 4-col × 2-row grid (8 items). Icon + uppercase SemiBold title + short body.

In your Figma file as: Icon Grid / 4-col with body

### Icon Grid / 3-col spacious
- Static.

*Design intent:* Headline above, then 3-col × 2-row (6 items). Large icon (46px), SemiBold title, 2-line body. More breathing room.

In your Figma file as: Icon Grid / 3-col spacious

### Icon Grid / 4-col spacious
- Static.

*Design intent:* Same spacious treatment as 3-col but 4-col × 2-row (8 items). Use for longer feature lists.

In your Figma file as: Icon Grid / 4-col spacious

### Leadership / Team cards · Interactive
- HOVER. Hover a portrait: dark scrim + bio fade in (300ms), 40×3 orange bar flush at the lower-left corner.
- Touch devices: tap toggles the bio. The second card is pinned open only to show the state.

*Design intent:* Portrait grid, 3:4 crop. Default: photo + name (first bold / last light) + title. Hover darkens the photo and reveals the bio over a dark overlay; the orange accent bar sits flush at the image's lower-left corner. Second card is shown pinned in the overlay state. Names & photos are placeholders.

In your Figma file as: Leadership Card

## CTAs

### Buttons / Button system
- Buttons: Primary darkens to #003D84 on hover; outlined buttons get a 12% fill of their outline colour.
- Text link: bar fills left → right to the label width on hover, Orange #FF8600, 400ms ease.
- On-dark text link: white label, hover bar Orange.

*Design intent:* Blue fill = primary; outline = secondary; underline-bar = text link. Track width matches label text (inline-block). Bar starts at 0, fills to full text width on hover. Shown on light and dark surfaces.

In your Figma file as: Button + Text Link

### CTA Banner / Light · Two buttons
- Buttons: Primary darkens to #003D84 on hover; outlined buttons get a 12% fill of their outline colour.

*Design intent:* Banner-shaped CTA with no image — the light alternative to the solid Blue banner, adopted September 2026 at client request (deck slides 40, 84, 89, 93, 96, 100, 106) and now in place on Building Envelope, Lab Solutions, Parking, PARC, Design-Assist, Design-Build and PHMF. White surface with a #DEDFE0 hairline top and bottom, 40×3px Orange accent bar, two-tier headline and body in #52565A, Blue-fill primary with optional dark-outline secondary. Use this where a CTA closes a page and there is no photo to carry; use the Decision Panel above when an image is part of the layout.

In your Figma file as: CTA Banner / Light

### CTA Photo Overlay / Left
- Buttons: Primary darkens to #003D84 on hover; outlined buttons get a 12% fill of their outline colour.

*Design intent:* Full-bleed photo background with semi-transparent dark overlay and text/CTA centered vertically. Three content alignment variants. Photo spans full width. Min-height: 480px. Overlay: rgba(82,86,90,0.74). Text: white throughout.

In your Figma file as: CTA Banner / Full-photo overlay

### CTA Photo Overlay / Center
- Buttons: Primary darkens to #003D84 on hover; outlined buttons get a 12% fill of their outline colour.

*Design intent:* Full-bleed photo background with semi-transparent dark overlay and text/CTA centered vertically. Three content alignment variants. Photo spans full width. Min-height: 480px. Overlay: rgba(82,86,90,0.74). Text: white throughout.

In your Figma file as: CTA Banner / Full-photo overlay

### CTA Photo Overlay / Right
- Buttons: Primary darkens to #003D84 on hover; outlined buttons get a 12% fill of their outline colour.

*Design intent:* Full-bleed photo background with semi-transparent dark overlay and text/CTA centered vertically. Three content alignment variants. Photo spans full width. Min-height: 480px. Overlay: rgba(82,86,90,0.74). Text: white throughout.

In your Figma file as: CTA Banner / Full-photo overlay

## Data Display

### Stats Row / Simple dividers
- Static. Stats reflow 4 → 2×2 on mobile.

*Design intent:* White background. Dark numerals, gray body, simple hairline dividers between sections.

In your Figma file as: Stats Row

## Forms

### Form / Contact · 3 inquiry types · Interactive
- TABS. Inquiry-type tabs (General / Project / Trade Partner) swap the field set below — the form does not reload.
- Required fields validate on submit; the submit button shows a success state in place of the form.
- Map this to one Elementor Pro Form with conditional fields.

*Design intent:* New — unified form with three inquiry types. Select a tab to see conditional fields. Click Submit to see the success state.

In your Figma file as: Form / Contact

### Form / Newsletter
- Inline submit. On success the field is replaced by a confirmation line.

*Design intent:* New — dark charcoal (#52565A) panel. Native inline form replacing the current iframe embed. Click Subscribe to see success state.

In your Figma file as: Form / Newsletter

## Company Pages

### Careers / Benefits grid
- Static.

*Design intent:* Updated August 2026 to the values-grid treatment: the hairline cell grid and the #F0F0F0 icon wells are gone, leaving an open 3×2 grid of bare 42px line icons on white with 56px / 52px gutters. Icons stay here because the items are concrete benefits — abstract values use the accent-bar marker instead (see Core Values Grid).

In your Figma file as: Benefits Grid

### About / Core values grid
- Static.

*Design intent:* Open 3×2 grid on white, 56px / 52px gutters (the hairline cell grid was retired August 2026). Each cell: 48px Orange accent bar + SemiBold uppercase value name + body. Values carry the accent bar rather than an icon — Safety, Integrity and Partnership have no honest construction icon. Use on About Us, Culture, or Careers.

In your Figma file as: Core Values

### About / Timeline · Vertical
- Static. Stacks to one column on mobile, line on the left.

*Design intent:* Alternating left/right layout with a central vertical line. Key milestones use filled dark/blue nodes; standard milestones use outline nodes with orange dot. Year in large faded numerals on the opposite side. Content cards have 1px border. Use for long histories or project milestone pages. Sits on white.

In your Figma file as: Timeline / Vertical

## Product Pages

### Products / Process steps
- Static. Numerals stay faded (#52565A at 28%).

*Design intent:* 3-column numbered block with large faded step numeral (faded gray on white / faded white on dark — the bright orange numerals are retired). Center column uses #52565A background for visual hierarchy. Sits on white. Used to communicate the 3-step delivery process on product pages.

In your Figma file as: Process Steps

## Projects

### Projects / Image gallery · Interactive
- GALLERY. Click a thumbnail to swap the lead 16:9 frame; the counter pill (1 / 6) and caption update.
- Active thumbnail at full opacity with an accent bar; others dimmed.

*Design intent:* New, August 2026 — the second half of the project-detail set alongside the spec panel and the overview accordion. Interactive: click a thumbnail to change the lead image. 16:9 lead frame, five 4:3 thumbnails on a 2px white gap, counter pill in the lower-right, caption beneath. The active thumbnail carries a 3px orange bar; the rest sit at 45% opacity.

In your Figma file as: Image Gallery

