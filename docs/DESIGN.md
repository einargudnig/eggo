# Eggó redesign: design plan

Status: **shipped 2026-10-15: "Minimal"**, a plain version of "Vegvísir" (road signs) with the Tilboð symptom picker, replacing A1 "Pappír" (§0). Vegvísir itself stays on the `vegvisir` branch. The system lives in [`DESIGN-SYSTEM.md`](DESIGN-SYSTEM.md), and the accessibility audit in [`ACCESSIBILITY.md`](ACCESSIBILITY.md). This file keeps the brief, the alternatives and the reasoning behind each choice.

---

## 0. Why A1 was replaced (2026-10-15)

A1 shipped and looked good, but it read as generated: another developer's portfolio had the same look. Research confirmed it was a named style by then:

- Kyle Chayka, *The New Yorker* (June 2026), "The A.I.-Design Aesthetic That's Taking over the Internet": cream or beige, a rusty orange accent, tracked small-caps subheads.
- [avoid-ai-design](https://github.com/funboy322/avoid-ai-design) and Charlie Hills' "29 tells" list the rest of A1 almost item by item: "cream + terracotta (the Claude look)", mono caps labels, decorative 01/02/03, "A · B · C" meta strings, broadsheet hairlines, one accented word in the headline. A1's paper `#F2F1EC` sat next to Anthropic's own parchment `#f5f4ed`.

Four new directions were mocked up: **Auglýsing** (newsprint classifieds), **Bréf** (a letter), **Vegvísir** (Icelandic road signs) and **Tilboð** (a quote builder). The choice was Vegvísir as the base with Tilboð's symptom picker in the hero: a borrowed public visual language (Vegagerðin's blue signs) that no template uses, and a hero that does something (tick what's wrong, see the route, time and price) instead of describing it. Auglýsing is worth keeping for the 404 or social videos.

Second pass, same day: the site is about the work and the possible solutions, not about Einar. The bio section went; a "nothing is too small" section and a visible "prices are a guide, always negotiable" plate came in. A plain version without the road-sign theme was built alongside it and is the one that shipped.

What would make it more distinctive, in order: a licensed Transport-style face and real screenshots in the work log.

## 1. Brief

- **What Eggó is:** a one-person studio (Einar). Drop the "við" and own being solo. Suggested line: *"Ég er einn. Það er kostur, ekki galli."*
- **What the site says:** what Eggó makes, not how Eggó works. Lead with the output:
  - **Vefsíður**: websites and web apps
  - **Kerfi**: internal tools and custom systems
  - **AI agents**: agents that do real work (support, ops, data entry, research)
  - **Tengingar**: integrations and automations between the tools a business already uses
  - **Óskilgreint (05 · ???)**: the problem that doesn't fit yet. Start with a one-week mapping; the output is a map the client owns, and then it becomes 01–04, something new, or nothing.
- **Who it's for:** small and medium Icelandic businesses that know they're behind digitally ("something with AI") but don't know where to start. Secondary: English-speaking clients and foreign companies in Iceland.
- **Design is the product.** For a solo studio the site *is* the portfolio piece. If it looks like a template, the pitch fails.
- **Bilingual:** Icelandic first (default at `/`), English at `/en`. Recommendation: write the English by hand rather than machine-translate (see §9).
- **Theme:** light by default, with a dark mode. Toggle in the UI.

## 2. What's wrong with the current site

The April 2026 pass fixed the obvious AI-template tells (Inter, emerald, card grids). It still reads as a nice template rather than a place.

- The hero is centred-left serif + amber italic + two pill buttons. It's well executed, but it's the 2025 default "tasteful studio" look.
- It describes services ("Vefþróun", "Hugbúnaðarþróun") instead of showing outputs. There's no work and no proof on the page.
- It uses "Við" throughout, which contradicts the solo positioning.
- Nothing about it says Iceland apart from the language.
- It defaults to dark, and light was bolted on (`html.light` overrides).

## 3. Design principles

1. **Show, don't list.** Every output type gets an artifact: a screenshot, a live demo, an agent transcript, or a before/after number. No icon + headline + two-sentence blurb cards.
2. **One person, one voice.** Write in the first person, with a signature, a face or hand-made element, and real dates.
3. **A sense of place.** Iceland should show up as material: light, time, letters (þ, ð), signage. Avoid puffins, auroras, and volcano stock photos.
4. **Crafted details over effects.** Tabular numerals, real hairlines, considered hover states, and keyboard focus that looks designed. No glassmorphism, gradient blobs, or particle backgrounds.
5. **Fast and quiet.** Static HTML, minimal JS, and no scroll-jacking. Motion must earn its place and respect `prefers-reduced-motion`.

## 4. Information architecture

```
/                   Forsíða: hero, outputs, selected work, how a project runs, contact
/verk               Verk: work index (list view)
/verk/[slug]        Case study
/afhverju           Manifesto ("Þetta reddast!?"), kept and restyled
/en, /en/work, /en/work/[slug], /en/why   English mirror
```

**Homepage sections, in order:**

1. **Hero:** one sentence about output, plus a live element (see each direction's "signature moment").
2. **Outputs (Það sem ég smíða):** five parts (01–04 plus 05 · ???), each with an artifact, not a card.
3. **Selected work:** 3–5 rows linking to case studies. Use Maul internal tools (anonymised if needed), client sites, agents.
4. **How it runs:** a short timeline: first call → scope (fixed price) → build in weekly drops → handover (you own everything).
5. **Who:** Einar, a photo or hand-drawn portrait, a few lines, and links.
6. **Contact:** Cal.com booking plus the form. Keep the existing PostHog events (`cta_clicked`, `booking_opened`, `contact_submitted`).

**Content gap:** the site needs **real work to show**. List 4–6 candidate projects before mockups are finalised (§9).

---

## 5. Directions

Each direction is a complete system. They share the scaffolding in §6. They are deliberately far apart so the choice is real.

### Direction A: "Verkstæði" (spec sheet / workshop manual)

> The site reads like the manual for a well-made instrument. Eggó's outputs are presented as products with part numbers.

**References:** teenage.engineering (numbered parts, tiny caps labels, visible grid), Vercel Geist site (hairline grid, mono annotations), Dieter Rams/Braun manuals.

- **Layout:** a visible 12-column hairline grid that runs edge to edge. Content snaps into cells. Section labels are numbered (`01 — VEFSÍÐUR`) and set in mono caps at 11px.
- **Type:**
  - Display: **Schibsted Grotesk** (Nordic, newsprint DNA) or **Familjen Grotesk**, tight tracking, big.
  - Labels and data: **JetBrains Mono** or **IBM Plex Mono**.
  - No serif at all.
- **Colour** (first proposal; the locked values are in `DESIGN-SYSTEM.md` §3):

  | Token | Light | Dark |
  |---|---|---|
  | surface | `#F2F1EC` warm paper grey | `#121211` |
  | ink | `#111110` | `#EDECE6` |
  | rule (hairlines) | `#11111022` | `#EDECE61F` |
  | accent | `#FF5A1F` signal orange | `#FF6A33` |
  | accent-2 | `#E8D600` road-sign yellow, used sparingly | same |

- **Outputs as spec cards:** each output type is a module with *Input → Output*, *Typical time*, *Stack*, and *You own*, shown like a product spec table. For example, the AI agents module reads `INPUT: tölvupóstar, PDF · OUTPUT: flokkuð verkefni í Asana · TÍMI: 2–4 vikur`.
- **Signature moment:** in the hero, an "assembly diagram" of a live system. Small labelled boxes (Vefsíða → API → Agent → Slack) connected by lines that draw in on load. Hovering a box highlights its part number in the outputs section.
- **Motion:** mechanical: snaps, 120–180ms steps, no floaty easing. Numbers tick instead of fading.
- **Theme toggle:** a physical two-position switch drawn as a hardware slider and labelled `LJÓS / MYRKUR`.
- **Language toggle:** `IS | EN` in mono caps, the active one in a filled box.
- **Risks:** it can feel cold. It needs one warm element: a handwritten signature, or the photo. The teenage.engineering look is popular, so the copy has to carry it.

### Direction B: "Ritstjórn" (editorial)

> A magazine about one studio. Big serif headlines, a real reading experience, work presented like features.

**References:** linear.app/now (editorial long-form), paco.me (restraint, dated lists), Pentagram (plain, confident work index), Icelandic print (Lesbók Morgunblaðsins era).

- **Layout:** asymmetric editorial grid, with a narrow text column and a wide margin for notes, dates, and captions (sidenotes). Large type sits next to small type, with very little in between.
- **Type:**
  - Display: **Newsreader** (optical sizes) or **Fraunces** (variable, with SOFT/WONK axes for subtle kinetic type on hover). This evolves the current Instrument Serif rather than throwing it away.
  - Text: **Instrument Sans** or **Hanken Grotesk**.
  - Figures: mono for dates (`2026·03`).
- **Colour:**

  | Token | Light | Dark |
  |---|---|---|
  | surface | `#FBF9F4` newsprint | `#16140F` warm black |
  | ink | `#1A1814` | `#EFEAE0` |
  | muted | `#6E675C` | `#9C9488` |
  | accent | `#B23A1E` oxide red (Reykjavík roofs) | `#E2603F` |

  Amber is retired. Red reads more confident on paper and doesn't drift toward "luxury template".
- **Work as an index:** a plain list with one row per project (`Nafn — Tegund — Ár — Stack`). Hovering a row shows a preview image that follows the cursor (Studio Freight pattern). On touch devices, the preview is inline under the row.
- **Signature moment:** a hero headline set very large, with a hand-written margin note in the outer column. For example, "← þetta er í alvöru allt ég" in a script or scan of Einar's handwriting. The page feels authored.
- **Motion:** slow and quiet. Text fades up 8px, images unmask. Fraunces' WONK axis animates on the hovered word.
- **Theme toggle:** text-only ("ljóst / dökkt") in the masthead, like a newspaper edition label.
- **Language toggle:** "Íslenska · English" written out in the masthead.
- **Risks:** this is the closest to the current site. Executed timidly, it becomes "nice serif template" again. It needs the sidenotes and the handwritten layer to work.

### Direction C: "Birta" (daylight / place)

> The site behaves like Iceland: its light follows real Reykjavík daylight. Place as an interface, not a decoration.

**References:** Icelandic road signage (DIN-like, yellow-on-black), Íslandspóstur stamps, basalt columns, Vatnajökull ice, June lupine fields.

- **Big idea:** the default theme is still light, but the hero shows **Reykjavík time and today's daylight** (for example, `64.1°N · 11:42 · 6 klst 12 mín birta í dag`). In "auto" mode the palette shifts subtly through the day (warmer at dawn and dusk). The manual toggle always wins.
- **Layout:** full-bleed colour bands per section, like geological strata. Each output type gets its own band colour from the palette.
- **Type:**
  - Display: **Bricolage Grotesque** (variable width and optical size). It's quirky and warm; condensed widths for big headlines.
  - Text: **Hanken Grotesk**.
  - Mono: **Geist Mono** for coordinates and time.
- **Colour (strata palette):**

  | Name | Light | Dark | Used for |
  |---|---|---|---|
  | snjór (surface) | `#F7F7F4` | `#0F1112` basalt | page |
  | basalt (ink) | `#1C1F21` | `#E9ECEB` | text |
  | mosi | `#5D6B3A` | `#8FA05E` | Kerfi band |
  | lúpína | `#6B5CA5` | `#9C8CE0` | AI agents band |
  | brennisteinn | `#E3C33B` | `#E8CB4D` | accent, CTAs |
  | jökull | `#CFE3E8` | `#1D3238` | Vefsíður band |

- **Brand glyph:** **þ** becomes the mark. A heavy custom "þ" works as the favicon, the logo, and the loading state. "eggó" keeps its wordmark, but þ is the stamp.
- **Stamps:** each case study gets a small "frímerki" illustration (a framed, perforated-edge badge) as its thumbnail. The stamps are collectable, consistent, and very un-template.
- **Signature moment:** the daylight bar. A thin horizontal timeline at the top of the hero shows today's sunrise to sunset over 24h, with a dot for "now". In December it's almost all dark, in June almost all light. It's a quiet talking point that's only true in Iceland.
- **Motion:** slow colour transitions between bands on scroll (scroll-driven animations in CSS, no JS lib). Stamps tilt slightly on hover.
- **Theme toggle:** a three-state toggle: `Birta` (auto, daylight-driven) / `Ljóst` / `Myrkt`.
- **Language toggle:** `ÍS / EN` styled like a route-number sign (rounded rectangle, white-on-blue).
- **Risks:** this direction is the most work (illustrations, daylight logic). Colour bands can go kitsch if the palette is too saturated, so keep chroma low. Auto-shifting colour must never hurt contrast.

### Direction D: "Hávaði" (loud / kinetic)

> Big, black and white, one acid colour, type that moves. Confidence through volume.

**References:** basement.studio, Darkroom Engineering.

- **Layout:** huge type fills the viewport. Headlines run to 20vw and break across lines on purpose. Content in between is small and dense.
- **Type:** a single family, **Bricolage Grotesque** or **Familjen Grotesk**, at extreme weight and width contrast, plus a mono.
- **Colour:** paper `#F4F4F0` / ink `#0B0B0B` with one acid accent, `#C6FF3D` (light mode uses it as a highlight block behind text, not as text colour).
- **Signature moment:** the hero headline is set in a variable font whose width axis responds to cursor position or scroll ("SMÍÐA" stretches as you scroll). The four outputs cycle in the headline: *Ég smíða [vefsíður / kerfi / AI agents / tengingar]*.
- **Risks:** it dates fastest, it's hard to make accessible, and it can overpower the "approachable for a small Icelandic business" tone. Best used as a *flavour* inside another direction (e.g. only the hero), not the whole site.

**Chosen (2026-10-11): A.** The v2 mockup adds:
- part **05 · ???, Óskilgreint**, drawn with dashed lines, with a before → map → then panel
- a **Bilanaleit** (troubleshooting) table that maps symptoms to parts
- an expandable work index with problem / built / result
- the contact form as a **Verkbeiðni** (work order) with part checkboxes
- a Reykjavík clock and count superscripts in the nav
- three variants to compare: **A1 Pappír** (paper and orange), **A2 Teikning** (blueprint navy), **A3 Merki** (road-sign yellow)

**Locked: A1 Pappír**, with phone treated as its own layout. From C it borrows only the Reykjavík clock. The þ mark, strata palette and daylight bar were not carried over.

### Original recommendation (superseded by the choice above)

Use **A + C**: the spec-sheet structure and honesty of *Verkstæði*, with *Birta*'s sense of place (daylight bar, þ mark, strata palette in muted form) and B's handwritten layer for warmth. A gives the outputs a format that's genuinely different from service cards. C makes the site unmistakably Icelandic. D is held in reserve for one moment, the cycling output word in the hero.

---

## 6. Shared system (regardless of direction)

### Theming

- Tokens live on `:root` as CSS custom properties with semantic names (`--surface`, `--ink`, `--muted`, `--rule`, `--accent`, `--on-accent`). Tailwind v4 `@theme` maps to them.
- Theme state is `data-theme="light|dark"` on `<html>`, plus an "auto/system" option. The **default is light**. An inline script in `<head>` reads `localStorage` before first paint, so there's no flash.
- Use the **View Transitions API** (`document.startViewTransition`) for the toggle animation, replacing the current overlay div. Fall back to an instant swap when unsupported or under reduced motion.
- Every colour pair is checked at **WCAG AA in both themes** before ship.

### Language

- Routes: `/` is Icelandic and `/en/...` is English. Slugs are translated (`/verk` ↔ `/en/work`).
- `<html lang>`, `hreflang` alternates, and `og:locale` per page. Sitemap entries cover both languages.
- The toggle links to the **equivalent page** in the other language, not the homepage.
- No auto-redirect on `Accept-Language`. At most, show a one-time dismissible hint ("This site is also in English →") for non-`is` browsers.
- Copy lives in typed dictionaries (`is.ts`, `en.ts` with a shared `Dict` type), so a missing key is a type error. Case studies are MDX/Markdown per language.
- Icelandic words run long ("Gervigreindarsamþætting"). Every heading needs `hyphens: auto` with `lang="is"` and should be tested at 320px.

### Motion rules

- Easing: keep the existing `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)`.
- Durations: 120–200ms for UI, 400–600ms for reveals. Nothing over 800ms.
- Everything is wrapped in `@media (prefers-reduced-motion: no-preference)`.
- No smooth-scroll libraries and no scroll-jacking.

### Craft checklist

- `font-variant-numeric: tabular-nums` on all dates and numbers.
- `text-wrap: balance` on headings and `pretty` on paragraphs.
- Real typographic quotes („Icelandic“ vs “English”), with quote style switched per locale.
- A designed focus ring for keyboard focus, not the browser default.
- Hover effects gated behind `(hover: hover) and (pointer: fine)`, as the site already does.
- Proper `::selection` colours per theme.
- 404 page in both languages with personality.
- OG images generated per page and per language.
- A favicon that adapts to the theme (SVG with `prefers-color-scheme`).

### Anti-slop list (do not ship any of these)

- Centred hero + subhead + two pill buttons
- Three equal feature cards with icons
- Gradient blobs, glows, grain overlays used as decoration
- "Trusted by" logo strips with no real clients
- Inter / Space Grotesk as the primary face
- Purple-to-blue anything
- Testimonials with no name or company
- Emoji as icons

### Performance budget

- LCP < 1.5s on 4G. JS < 50KB gzipped on the homepage (excluding analytics). Revised to ≤ 150 KB with the chosen stack; see `MIGRATION.md` §0.
- Fonts: at most 3 files, self-hosted and subset to Latin + Latin Extended (Icelandic), with `font-display: swap` and a preloaded display face.

---

## 7. Fonts: Icelandic support

Every face must render **þ ð æ ö á é í ó ú ý Þ Ð Æ Ö Á É Í Ó Ú Ý** and „Icelandic quotes“ correctly. The fonts below had their character maps checked with fontTools (2026-10-11), so coverage is confirmed. What's left to judge is how they *look*: set "Það þjóðþekkta" at display size before committing.

| Font | Role | Source | Notes |
|---|---|---|---|
| Schibsted Grotesk | display/text | Google, OFL | Nordic newsprint grotesk (A) |
| Familjen Grotesk | display | Google, OFL | Swedish, slightly quirky (A/D) |
| Bricolage Grotesque | display | Google, OFL | variable width/opsz (C/D) |
| Newsreader | display serif | Google, OFL | optical sizes (B) |
| Fraunces | display serif | Google, OFL | SOFT/WONK axes (B) |
| Instrument Sans / Serif | text / display | Google, OFL | current serif, continuity (B) |
| Hanken Grotesk | text | Google, OFL | neutral, warm (B/C) |
| JetBrains Mono / IBM Plex Mono / Geist Mono | mono | OFL | labels, data |
| Söhne, ABC Diatype, PP Neue Montreal | paid upgrade | Klim / Dinamo / PP | only if a direction needs it |
| Martian Mono / Departure Mono / Commit Mono | mono (alt) | OFL | more character for agent logs |
| **Or Type: L10, Separat** | display/text | Or Type, Reykjavík (paid) | Icelandic foundry, so a genuine sense of place. Glyphs and price not checked yet |

## 8. Process

Steps 1–4 are done (2026-10-11).

1. **Pick 2 directions** from §5, or confirm the A + C hybrid.
2. **Mockups:** build a static HTML homepage for each direction (hero + outputs + one work row + footer), in light and dark, at desktop and mobile. Each is a single file with no framework, so it doesn't depend on the migration decision.
3. **Critique round:** compare side by side and pick one.
4. **Design system:** lock tokens, type scale, spacing, and components (toggle, buttons, work row, spec module, stamp).
5. **Content:** write the Icelandic copy first, then the English. Gather the work.
6. **Build** on the new stack (see `MIGRATION.md`).

## 9. Open questions

- **Work:** which 4–6 projects can be shown publicly? Can Maul work be shown, even anonymised?
- **Photo:** real photo, illustrated portrait, or none?
- ~~**Handwriting:**~~ answered: Einar will supply his own. Reenie Beanie is the placeholder until then.
- **Pricing:** show indicative prices ("frá 400.000 kr.")? This is a strong trust signal for small businesses.
- **Logo:** keep "eggó." with the dot, or move to the þ mark (C)?
- **Manifesto:** does `/afhverju` stay as is, get shortened, or get folded into the homepage?
- **English copy:** written by hand, or machine-drafted then edited?
- **Domain:** should English live at `eggo.is/en`, or does an `eggo.studio`-type domain make sense?

---

## 10. Inspiration (verified 2026-10-11)

The single best-matching move is listed first.

| Site | Move to steal | Fits |
|---|---|---|
| [bakkenbaeck.com](https://bakkenbaeck.com) (Oslo) | Case thumbnails are real system data, e.g. a latency waterfall ("Transcription 242ms") or spec drawings with px dimensions. Also has an A–Z project index. | A, AI agents |
| [basement.studio](https://basement.studio) | Count superscripts on nav ("Showcase (26)"), a live status dot, and a `.md` version of every page for machines, which is a smart signal for an AI studio. | A |
| [heydays.no](https://heydays.no) | A live local clock in the header. That's the honest version of "we're from here." | C |
| [henry.codes](https://henry.codes) | A ticker strip with weather, coordinates and time; condensed grotesk mixed with an italic serif. | C |
| [metall.is](https://metall.is) (Reykjavík) | Heavy grotesk, hand-drawn stickers, handwritten margin notes, and an "AT NIGHT" button as the theme toggle. | B, C |
| [kolofon.is](https://kolofon.is) (Reykjavík) | A masonry grid that keeps each image's proportions, with filters named in Icelandic (Allt / Útlit / Umbrot). | work index |
| [aton.is](https://aton.is) | Proof that þ and ð look great at display size in a heavy grotesk. | type |
| [teenage.engineering](https://teenage.engineering) | Industrial labelling and microcopy with personality. | A |
| [rauno.me](https://rauno.me) | One flat colour shape instead of a gradient blob, and copy-email-on-click. | all |
| [paco.me](https://paco.me), [emilkowal.ski](https://emilkowal.ski) | Restraint: projects as name plus one line. | B |
| [siggieggertsson.com](https://siggieggertsson.com) | An Icelandic illustrator whose stamp mural is a direct reference for C's stamp thumbnails. | C |

**Iceland notes:**
- Icelandic road signs use a version of the UK *Transport* typeface with æ, ð and þ added. Road numbers, "ÓFÆRT" and F-road markers could serve as status badges.
- Pósturinn stamp designers (Hlynur Ólafsson, Örn Smári Gíslason) are a reference for the stamp style.

**Toggle notes:**
- Use words, not icons ("Bjart / Myrkur" or "Dagur / Nótt"), and no globe icon.
- Slide the indicator between the two options, and add `T`/`L` keyboard shortcuts.
- An egg-in-a-frying-pan toggle is an "eggó" pun, but only as a deliberate signature moment.

**Mockups:** A ([Verkstæði](https://claude.ai/artifact/PKLNUy7Xx82Y8a97m2oQbY)) · C ([Birta](https://claude.ai/artifact/FoYKjbEQjLE9UXrxa1ARHF))
