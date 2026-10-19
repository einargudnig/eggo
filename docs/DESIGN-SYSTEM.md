# Eggó design system: "Minimal"

Shipped 2026-10-15. Same content, structure, symptom picker and accessibility as the Vegvísir design (branch `vegvisir`), without the road-sign theme. The Vegvísir spec below is kept for reference; where it talks about signs, plates, arrows, the junction, the road or yellow, the shipped site has none of them.

- **Colour:** neutral greys with a faint green cast (never cream) and one muted pine accent, **Fura**, `#2F5D50` light / `#8FBFAE` dark (chosen 2026-10-15 over moss, lupine, fjord blue and ink-only; lupine was the bold runner-up but violet reads as the AI default), for links, buttons, ticked boxes and focus rings. Tokens: `page`, `page2`, `ink`, `muted`, `line`, `control` (field borders, 3:1), `accent`, `accentInk`.
- **Type:** Public Sans, headings 600 with tight tracking. One face, no monospace. Display `clamp(44px, 6.2vw, 88px)` across the full width of the hero, h2 `clamp(28px, 3vw, 40px)` (also the case-study numbers), h3 and lead 20, body 17 (also buttons and fields), small 15 (also `ui.label`). Five sizes; nothing readable under 13px, the hero figure included.
- **Space:** 2 · 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 144; 96px padding above and below each section (72 on phone), so about 190px between sections. Max width 1120.
- **Shape:** one container, `ui.card` (grey panel, 12px radius). Everything else is text and space: no divider lines between rows.
- **Detail:** each part has a 72×48 line drawing (`PartDrawing`) beside its name. Labels (`ui.label`) are small muted sentence case in the text face: the part a symptom points to ("→ AI agent"), the step's timing ("Ókeypis"), the kind of work and the client in the work list. Removed 2026-10-16 after the taste-skill review, as AI-look tells (DESIGN.md §0): the `§n · Section` labels over headings, the `01 · VEF` part codes, `01 ·` step numbers (the `<ol>` carries order), mono caps, and divider lines. The social videos (`video/`) follow the same rules since 2026-10-19; mono is left only in the agents post's terminal, which shows real command output.
- **Hero figure** (`BuildFigure`, "Mynd 1 — dæmigerð smíði"): the 2026.10 assembly diagram, redrawn in this palette: 1px ink boxes with the part name and a muted detail line, a dashed "Óljóst" box with an accent "?". Wires draw in once on load. Parts in the suggestion get an accent outline and the rest dim to 32%. Not shown on phones (2026-10-16, to cut scrolling). `aria-hidden`: the services list says the same in words.
- **Work page** (`/verk`, `/en/verk`, `WorkCases`; added 2026-10-16 to shorten the homepage, which now shows two cases from `featuredCaseIds` and links to the rest): built with the taste skill's "name as a monument" direction, palette and type kept. Each case is led by its one number at `type.monument` (clamp 72–144px, 64–88 on phones), the largest type on the site; cases alternate sides on a 12-column grid with 96px between them. Beside each number: the case name as an underlined link to the full story (↗), client and part, then problem, built, stack and outcome, ending on the outcome. The page closes on an ink field (ground and ink swapped, so it turns light in dark mode) with "Hvað tefur hjá þér?" at display size and an inverse button to the work order. Skipped from the dealt sheet, on purpose: photographs, the marquee and the tiled hero.
- **Motion** (one thread, expo-out `cubic-bezier(.16,1,.3,1)`): ticking a symptom draws the tick (180ms), unrolls the new line into the summary from its top edge (320ms, clip-path + 6px), and lights that part's square in its drawing down the page (400ms), so the picker, the summary and the services list read as one thing. Buttons nudge their arrow 3px on hover. The theme switch reveals the new theme as a circle from the switch (View Transitions, 520ms). Reduced motion removes all of it.
- **Browser surfaces:** selection, caret, native controls and scrollbars take the palette (`--selection` on body feeds `::selection` in global.css).
- **Copy:** the road metaphors are swapped for plain words ("Betri vefur. Minni handavinna." (each half on its own line), "Það sem ég smíða", "Svona vinn ég", "Tillaga").
- **Phone suggestion bar** (`PhoneBar`): once something is ticked, a bar at the bottom shows "Tillaga · n", the part names and "Fá verð →" while neither the summary card nor the work order is on screen. Unmounted, not hidden, when not needed.
- **Wordmark** (`Wordmark`, geometry in `src/design/wordmark.ts`): "eggo" drawn from Public Sans Bold outlines, tracked in by 70 units, with the ó's accent replaced by a slanted block in the accent colour (chosen 2026-10-15 over plain, tight, boxed and mark-plus-word versions). Letters take `currentColor`; the block goes `currentColor` in forced colours. 26px tall in the top bar, 24 on phones. No separate symbol: the favicon's 2×2 of boxes does that job. The geometry is generated with fontTools; regenerate it if the font file changes.
- **Share images and icons:** `bun scripts/brand-images.ts` renders the OG images (headline plus the four parts as boxes, 03 in the accent), the social logo and the touch icon from the dictionaries, light tokens and self-hosted fonts. The favicon is the same 2×2 of boxes with one filled, and follows the OS theme.

---

# Eggó design system: "Vegvísir"

Status: **chosen 2026-10-15** (branch `vegvisir`). It replaces A1 "Verkstæði / Pappír", whose look (paper grey, orange accent, mono caps labels, numbered parts, hairline grid, spec tables) had become the documented 2026 "Claude look". See `DESIGN.md` §0 for the research and the alternatives.
The tokens live in code: `src/design/tokens.stylex.ts` is the source of truth, and this file explains them.

The visitor arrives somewhere ("allt í Excel") and the site gives directions the way Vegagerðin's signs do. Services are destinations, and the distance to each is the build time. The page around the signs stays calm and plain; the signs carry the identity.

---

## 1. Principles

1. **One metaphor, used with restraint.** Signs are the only branded objects: the wordmark plate, the junction sign, the direction sign, the route chips, the buttons and the end sign. Everything else is plain text on white or asphalt grey. No road puns in the copy beyond the section titles.
2. **Show the offer working.** The hero is a tool: tick what's wrong and the sign lights the way and prices it. Fixed prices are shown, not claimed.
3. **Ornament must do a job.** A warning triangle is a checkbox. A dashed line means "no road yet" (part 05). A blue dot on the road means "yours". Nothing is numbered unless order matters (only the process steps, which are an `<ol>` with no visible numbers).
4. **Banned, because they read as generated:** cream or beige backgrounds, orange or terracotta accents, mono caps labels or eyebrows, decorative 01/02/03 numbering, "A · B · C" meta strings, hairline grids, spec tables, a coloured word in the headline, status dots, live clocks, giant footer wordmarks, fade-up on scroll.
5. **First person, Icelandic first.** "Ég", not "við". Correct „quotes“, glyphs and number formats (`199.900 kr.`).

## 2. Typography

| Role | Face | Notes |
|---|---|---|
| Signs, headings, labels, buttons | **Overpass** (variable 400–900, OFL) | Based on Highway Gothic, the US road-sign face. Stand-in for a licensed **Transport**-style face, which is what Iceland's road signs actually use (adapted for þ ð æ). Buying one is the single biggest upgrade left. |
| Body text | **Public Sans** (variable 400–700, OFL) | Plain, legible, government-signage lineage. Pairs with Overpass without competing. |

Both are self-hosted Latin subsets (`public/fonts/`, `src/styles/fonts.css`) with Arial fallbacks metric-matched by fontTools, so the swap doesn't shift layout. There is no monospace and no handwriting face.

Scale (`type.*`): display `clamp(42px, 5.2vw, 72px)`, h2 `clamp(32px, 3.8vw, 52px)`, sign name `clamp(28px, 2.8vw, 38px)`, h3 24, lead 20, body 18, small 16, fine 15. Headings are 800 weight with slight negative tracking.

## 3. Colour

| Token | Light | Dark | Use |
|---|---|---|---|
| `page` | `#FFFFFF` | `#17191B` asphalt | page |
| `page2` | `#EEF0F1` pale asphalt | `#202326` | alternate bands, the route summary |
| `ink` / `muted` | `#16191C` / `#545B62` | `#E9ECEE` / `#A3AAB1` | text |
| `line` | `#D5D9DC` | `#34393E` | list dividers only |
| `sign` | `#0B4F9C` road-sign blue | `#0E5AAE` | every sign, buttons |
| `signInk` / `signSoft` | white / `#C9DBF0` | white / `#D3E2F4` | text on signs |
| `link` | `#0B4F9C` | `#8DB8EC` | links and focus rings on the page |
| `warn` / `warnEdge` | `#FFD200` / `#C8102E` | same / `#E0243F` | the "you are here" dot, ticked triangles, focus rings on signs |

Blue is the brand. Yellow is never text and never decoration: it marks *you* (where you are, what you ticked) and keyboard focus on a sign. Signs stay blue in dark mode, slightly lighter so they don't sink into the asphalt. `bun run contrast` checks every pair.

## 4. Space and shape

- Spacing scale `space.*`: 2 · 4 · 8 · 12 · 16 · 22 · 28 · 36 · 56 · 72 · 96. Sections are 96px apart (64 on phone).
- Max width 1180px, gutter 28px (16 on phone).
- **Sign plate** (`ui.plate` + `ui.plateIn`): a blue rim, then a white inset border, radius 22/15px (16/11 on phone). Radius belongs to signs; nothing else on the page is rounded except form fields, buttons and the route summary.
- Section heads are a two-column row: heading left, one muted sentence right, bottom-aligned.

## 5. Components

| Component | Anatomy | Notes |
|---|---|---|
| **Wordmark** | "eggó" on a small sign plate | Links home. |
| **Top bar** | plate · four section links · other language · theme switch | Not sticky. On phones the section links hide; language and theme stay. |
| **Theme switch** | half-filled disc + "Myrkur" | `role="switch"`. The visible word stays inside the accessible name. |
| **Symptom picker** ("Hvar ertu?") | five „quotes“ in the customer's words, each with a warning-triangle checkbox | Real checkboxes, visually hidden. Unticked: outline. Ticked: yellow with a red edge. Maps symptom → part through `troubles` in `src/content/work.ts`. |
| **Junction sign** | five roads leave a yellow dot; name and time per arm; "Þú ert hér:" + where you are | Ticked routes stay white, the rest dim to 22%. `aria-hidden`: the route summary says it in words. Arms draw in once on load. |
| **Route summary** ("Leiðarlýsing") | one leg per part: name, time, starting price; a note when there are several or "veit ekki"; "guide prices, always negotiable"; "Fá fast verð" | `aria-live="polite"`. The button scrolls to the work order and focuses Nafn. |
| **Direction sign** ("Hvert viltu komast?") | one tall plate, a row per part: arrow, name, lead, what you own, time, price | Arrows point the way the junction's roads do (`parts[id].arrow`) and nudge that way on hover. Part 05 has a "?" and a dashed gravel divider. Rows are jump targets (`#leid-01`). |
| **Route chip** | tiny sign: arrow + part name | Tags each work entry with the route it took; links to that row of the direction sign. |
| **Work log** | chip, name, client · engagement / outcome + "Öll sagan" / the number that mattered | The metric is the one big number per row. |
| **Road** ("Svona gengur ferðin") | an asphalt band with a dashed centre line and four stops | The last stop is a blue dot: "Þitt". Vertical on phones. |
| **Small jobs** ("Ekkert er of lítið.") | six one-line example fixes on supplementary plates (`ui.subPlate`), a note that small jobs get a fixed price too | The site is about the work, not the person: there's no bio section (decided 2026-10-15). The footer links to einargudni.com. |
| **Supplementary plate** (`ui.subPlate`) | white plate, 3px ink border | Hangs under the direction sign with "prices are a guide, always negotiable"; also the small-jobs cards. |
| **End sign** ("Segðu mér hvar þú ert.") | the work order form on a blue plate: name, email, destination chips, message | Chips arrive pre-ticked from the hero and can be changed. White fields; errors and focus in yellow. |
| **Button** | sign-style: blue with a white inset line (`sign`), or white with a blue inset line on signs (`onSign`) | Always ends in →, which is hidden from screen readers. |
| **404** ("Tapast hefur: þessi síða") | a warning sign, a lost-and-found line, a link home | |

## 6. Motion

| What | Duration | Notes |
|---|---|---|
| Hover, press, triangle tick | 120ms `--step` | `cubic-bezier(.6,0,.3,1)` |
| Junction arms dim and light | 160ms | |
| Junction arms appear | 420ms, staggered 90ms | once, on load |
| Direction-sign arrow nudge | 160ms | hover only, `(hover: hover) and (pointer: fine)` |

No scroll-triggered reveals, no perpetual motion, no smooth-scroll library. `prefers-reduced-motion` removes all of it and makes jumps instant.

## 7. UX rules

- **Hover** is gated behind `(hover: hover) and (pointer: fine)`.
- **Focus:** 3px link-blue ring on the page, 3px yellow ring on signs (blue backgrounds).
- **Focus follows the viewport:** "Fá fast verð" focuses the first form field; the receipt heading takes focus after sending.
- **Errors** say what's missing in plain words, with no apology.
- **Language** links to the same page in the other language. No auto-redirect.
- **Theme:** follows the OS until the visitor chooses, then persists.

## 8. Still to do

1. **Licence a road-sign face** to replace Overpass (a Transport-style face, or ask Or Type in Reykjavík).
2. **A sticky route bar on phones**, if analytics show people tick symptoms and then lose the summary below the sign.
