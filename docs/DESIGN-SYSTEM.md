# Eggó design system: A1 "Verkstæði / Pappír"

Status: **locked (2026-10-11)**, including the type, dark mode, drawings, brand assets and accessibility pass. The tokens now live in code: `src/design/tokens.stylex.ts` is the source of truth, and this file explains them.
Live mockup: https://claude.ai/artifact/PKLNUy7Xx82Y8a97m2oQbY
Background and alternatives: `DESIGN.md`.

The site is the manual for a well-made instrument. Every rule below follows from that metaphor: parts have numbers, measurements are real, lines mean something, and nothing is decorative.

---

## 1. Principles

1. **Every mark encodes something.** A part number appears only on a part; a dashed line means "not yet defined." The grid is visible because the page really sits on it. If an element doesn't carry information, it goes.
2. **Mechanical, not floaty.** Motion steps and snaps like a switch. There are no springs or parallax.
3. **One accent, used for state.** Orange means *active, selected, or the next action*. Never use it as decoration.
4. **Hairlines over boxes.** Structure comes from 1px rules and alignment, not cards, shadows or radius. Radius is 0 everywhere.
5. **Warmth comes from one human layer.** The handwriting (signature, margin notes in 05) is the only organic element. Keep it to at most 2–3 instances per page.
6. **Phone is its own layout.** It is not a squeezed desktop. Each section gets a pattern designed for thumbs (see §8).
7. **Icelandic first, typographically.** Use correct quotes, glyphs, hyphenation and number formats. English is a mirror, not the source.

## 2. Typography

### Faces

| Role | Face | Weights | Why |
|---|---|---|---|
| Display + text | **Schibsted Grotesk** (**locked 2026-10-11**) | 400, 500, 700, 800, 900 | A Nordic newsprint grotesk. It's tight at 800 for display and calm at 400 for text. Icelandic glyphs are verified. |
| Labels, data, UI | **JetBrains Mono** | 400, 500, 700 | Readable at 10–11px caps. Its tabular figures line up part numbers and dates. |
| Human layer | **Reenie Beanie** | 400 | A handwriting stand-in. **Replace it with a scan of Einar's real handwriting** (vectorised SVG) before launch. |

Self-host and subset to Latin + Latin Extended-A, and preload Schibsted 800 only. The final candidates were Schibsted and Familjen Grotesk, and Schibsted won. Familjen stops at weight 700, and the hero and the back-cover wordmark need 800–900. Or Type L10 stays a possible later upgrade if trial files arrive.

Use `tabular-nums` only where digits must line up. In Schibsted it also widens the comma and period, so don't put `.num` on rows that are mostly text.

### Scale (tokens in the mockup's `:root`)

| Token | Desktop | Phone | Line height | Tracking | Use |
|---|---|---|---|---|---|
| `--fs-display` | clamp(46, 7.4vw, 104) | clamp(46, 14.2vw, 72) | .92 / .90 | −.045em | Hero only |
| contact h2 | clamp(40, 5.6vw, 80) | clamp(38, 11vw, 56) | .95 | −.045em | Closing statement |
| `--fs-h2` | clamp(28, 3.8vw, 52) | clamp(28, 8.4vw, 38) | 1 | −.035em | Section heads |
| `--fs-h3` | clamp(30, 3vw, 40) | 34 | 1 | −.035em | Part names |
| row title | 22 | 20 | 1.15 | −.02em | Work index, symptoms (19–20) |
| `--fs-lead` | 18 | 17 | 1.5 | 0 | Intro paragraphs |
| `--fs-body` | 17 | 17 | 1.5 | 0 | Body. Never below 15 for reading text. |
| `--fs-small` | 15 | 15 | 1.5 | 0 | Case notes, step text |
| `--fs-label` | 11 mono caps | 11 | 1 | +.08em | Every label, `dt`, part number |

**Rules:**
- **Tracking:** display type tightens as it grows (−.045em at hero size). Mono caps always get +.08em, and +.06em for buttons.
- **Weights:** use 800 for headings and 900 only for the logo and the back-cover wordmark. Body is 400, and 500 for symptoms. Don't use 600.
- **Widths:** cap running text at `max-width: 44–46ch`. Headings get `text-wrap: balance`, paragraphs `text-wrap: pretty`.
- **Numbers:** apply `font-variant-numeric: tabular-nums` (`.num`) to every number that sits in a column or ticks (clock, years, ticket numbers).
- **Quotes:** Icelandic uses „…“ and English uses “…”, switched by `:root[lang]`. This is already done in Bilanaleit.
- **Number formats:** in Icelandic, `1.284`, `0,8 s` and `184.900 kr.`; in English, `1,284`, `0.8 s` and `ISK 184,900`. In production, format with `Intl.NumberFormat(lang)`, never by hand.
- **Long Icelandic words:** set `hyphens: auto` with `lang="is"`, plus `overflow-wrap: anywhere` on display type. Test "Gervigreindarsamþætting" at 320px.
- **Stress test:** set "Það þjóðþekkta Þ" in display 800. The ð crossbar and the Þ bowl must not collide at −.045em.

## 3. Colour

| Token | Light | Dark | Use |
|---|---|---|---|
| `--surface` | `#F2F1EC` | `#121211` | Page (warm paper, not white) |
| `--surface-2` | `#E9E7E0` | `#1B1B19` | Active row, highlighted part |
| `--ink` | `#111110` | `#E6E4DC` | Text, strong rules, filled controls |
| `--muted` | `#5F5D57` | `#9D9B93` | Secondary text, labels |
| `--rule` | ink @ 13% | ink @ 11% | Hairlines inside components |
| `--rule-strong` | ink @ 55% | ink @ 42% | Section dividers, component outlines |
| `--grid` | ink @ 10% | ink @ 5.5% | The background column grid only |
| `--accent` | `#E8501A` | `#F2622B` | Fills: primary button, active state, packet dot |
| `--accent-ink` | `#B83A0C` | `#F47A4A` | Accent *text*, darker so it passes AA on paper and surface-2 |
| `--signal` | `#E8D600` | `#CDBE12` | Used only for the "example data" banner, a warning tape |
| `--contact-bg` / `--contact-fg` | `#111110` / `#F2F1EC` | `#1C1B18` / `#E6E4DC` | Contact section |
| `contactRule` / `contactMuted` | fg @ 42% / 66% | fg @ 42% / 62% | Contact hairlines (3:1 for form boundaries) and labels |

**Rules:**
- **Accent split:** accent as a fill takes ink text (`--on-accent`). Accent as text uses `--accent-ink`. Never put orange text on an orange-adjacent fill.
- **Contrast:** checked 2026-10-11 with `bun run contrast`, which reads `src/design/tokens.stylex.ts` directly. Everything passes AA in both themes:

  | Pair | Light | Dark |
  |---|---|---|
  | ink / surface | 16.7 | 14.7 |
  | muted / surface-2 (tightest text pair) | 5.3 | 6.2 |
  | accent-ink / surface-2 | 4.65 (was 4.02, failing, before the darken) | 6.35 |
  | on-accent / accent (buttons) | 5.0 | 5.9 |
  | contact muted / contact bg | 6.9 | 6.0 |
  | rule-strong / surface (UI, needs 3:1) | 4.0 | 3.5 |
- **Contact section:** it inverts (ink background). Its own derived tokens `--c-rule` and `--c-muted` come from `color-mix`, so it inverts correctly in dark mode too.
- **Dark mode is warm graphite, not blue-black.** The dark-mode pass on 2026-10-11 changed four things:
  - **Contact section:** in light mode it inverts to ink. In dark mode it stays dark (a raised `#1C1B18` with a top rule), because inverting made it a cream slab, the brightest thing on the page.
  - **Glare:** the accent drops a step (`#FF6A33` → `#F2622B`), because a 104px orange headline glared. Ink drops to `#E6E4DC` and the yellow tape dims, both for the same reason.
  - **Grid:** grid lines get their own token, set to half the strength of `--rule`. At full rule strength they made the page busy.
  - **Kept as is:** the hatching in 05 and the dashed lines read fine.

## 4. Grid, spacing and lines

- **Grid:** 12 columns on desktop, 6 on tablet (≤960) and 4 on phone (≤760), all drawn as visible 1px hairlines. Content edges land on grid lines.
- **Gutter:** 24px on desktop, 16px on phone. Max width is 1240px.
- **Spacing scale:** 4 · 8 · 12 · 16 · 22 · 28 · 36 · 56 · 72. Section padding is 28/32 for heads, 56–72 for the hero and contact; on phone, 22/20 and 28–44.
- **Line language:**

  | Line | Means |
  |---|---|
  | `--rule` 1px | separates items within a thing |
  | `--rule-strong` 1px | separates things (sections, modules) |
  | **dashed** | undefined, provisional or "could become anything" (part 05 only) |
  | dotted | the leader line in the table of contents only |
  | 45° hatching | the unknown area (05 module, 05 tab) |

## 5. Components

| Component | Anatomy | States | Notes |
|---|---|---|---|
| **Top bar** | logo · nav with count superscripts · RVK clock · IS/EN · theme switch | sticky, 92% surface + blur | Counts like "(5)" are real counts, so update them from content |
| **IS/EN toggle** | two cells in one outlined box | pressed = ink fill | Words, never flags or globes. Links to the *same page* in the other language |
| **Theme switch** | LJÓS · hardware track · MYRKUR | `role="switch"`, knob slides 18px over 160ms | Text labels hidden on phone, where it moves into the contents sheet |
| **Label** | mono 11 caps +.08em | muted, or `b` for ink | The workhorse: every eyebrow, `dt`, caption |
| **Part number** | `01 · VEF` in an outlined box | active = accent fill; 05 = dashed | The three-letter codes are VEF, KRF, AGT, TNG and ??? |
| **Button** | mono 13 caps + arrow | primary (accent), ghost (outline); hover = ink fill; active = 1px press | Minimum height 48, full width on phone with the arrow pushed right |
| **Spec module** | name · part number + line drawing · lead · `dl` (Inntak/Tími/Tækni/Þú átt) | highlighted from the diagram or troubleshooting | "Þú átt" always comes last and is bold with a ■, because ownership is the promise |
| **05 module** | as above, dashed + hatched, plus a Fyrir → Kort → Svo strip | | The only module allowed handwriting |
| **Diagram node** | rect · part number · name · detail | hover/focus/on = accent fill | Desktop is a loop; phone is a vertical chain with a dimension line |
| **Work row** | name · part · year · stack · + | `<details>`, + rotates 45° when open | Opens into Vandi / Smíðað / Niðurstaða; the metric sits in display 800 |
| **Troubleshooting row** | „symptom“ · fix · part button | button jumps to and highlights the part | Write symptoms in the customer's words, not ours |
| **Step** | outlined numeral · label · title · text | none | Outlined numerals are the only stroke-only type |
| **Work order (Verkbeiðni)** | header with ticket number · fields as ruled cells · part chips · submit | focus-within tints the cell; errors in mono accent | The receipt shows a ticket number, `VB-2026-NNNN` |
| **Contents sheet** (phone) | full-screen `<dialog>` · §-numbered list with dotted leaders · IS/EN + theme at the bottom | | A manual's table of contents, not a hamburger list |
| **Part nav** (phone) | 5 equal cells, sticky under the bar | current = ink; 05 current = accent | Buttons with `aria-current`, not ARIA tabs (see `ACCESSIBILITY.md` §2). Kept in sync with the swipe position |
| **Thumb bar** (phone) | Bóka símtal (primary) + Verkbeiðni | hidden over the hero and the contact section | Slides in and out over 220ms |
| **Back cover** | colophon row + giant "eggó." | | The wordmark bleeds off the bottom edge |

## 6. Iconography and drawings

- **Line drawings only:** each part has one drawing; never use icon-font glyphs or emoji. Rules:
  - 72×48 box, every coordinate on a 4px grid, 4px inset from the edge
  - 1px `currentColor` stroke, no fill, square corners, `crispEdges` for rectangles
  - exactly one **4×4 accent square** per drawing, marking *what you get*: the CTA on the site, the selected row in the system, the core of the agent, the data that arrived through the integration
  - in 05, that square is an outlined, dotted orange square, because the output is unknown
  - small solid 2×2 squares are allowed for detail (browser dots, the "?" dot)
  - dashed strokes mean "asks you" (the agent's line upward) or "undefined" (05)
  - when the part is highlighted, the accent square turns ink so it doesn't vanish on the accent fill
- **Arrows:** use the typographic → in mono, not an SVG chevron.
- **Status:** a solid 8px square (`■`), never a circle. The packet dot is the one circle, because it moves.

## 7. Motion

| What | Duration | Easing | Notes |
|---|---|---|---|
| Hover/press colour | 120ms | `--step` cubic-bezier(.7,0,.3,1) | instant-feeling, mechanical |
| Switch knob, + rotate | 160ms | `--step` | |
| Sheet in, thumb bar | 220ms | `--step` | 16px rise |
| Diagram wires draw | 700ms, staggered 250ms | `--step` | once, on load |
| Packet along wires | 4s loop (3.2s phone) | linear | the only perpetual motion besides the status blink |
| Status square blink | 1.6s `steps(2)` | | on/off, never a fade |

**Rules:**
- No scroll-triggered reveals: everything is visible at rest.
- No smooth-scroll library.
- `prefers-reduced-motion` removes the draw, packet, blink and slides, and makes jumps instant.

## 8. UX rules

### Phone first-class (≤760px)

- **Navigation:** the "Efni" button opens a full-screen contents page. Language and theme controls live there, so the bar stays clean: logo plus one button.
- **Primary action:** a fixed thumb bar appears after the hero and hides when the contact section is visible, so it never duplicates the on-screen CTA.
- **Hero diagram:** becomes a vertical chain. Each node is a 64px-tall tap target that jumps to its part.
- **Parts:** a horizontal snap carousel (88% card width, so the next card peeks) with sticky part tabs and a "1 / 5" counter. Cards size to their content and don't stretch.
- **Tables become cards:** the troubleshooting table turns into stacked rows, and the work index drops year and stack, putting the part number under the title.
- **Steps:** numerals move to a left column, like an instruction leaflet.
- **Form:** fields are single column with 16px inputs (no iOS zoom). Use `inputmode="email"`, `autocomplete` and `enterkeyhint`. Part chips sit in a 2-column grid at 44px height.
- **Sizing and safe areas:** tap targets are at least 44px, preferably 48px. Pad with `env(safe-area-inset-*)` on the bar, sheet and thumb bar.

### Everywhere

- **Hover:** gate all hover effects behind `(hover: hover) and (pointer: fine)`. Touch gets an `:active` state instead.
- **Focus:** a 2px `--accent-ink` outline offset by 3px. Diagram nodes are focusable and respond to Enter/Space.
- **Jumps:** a jump (diagram → part, symptom → part) scrolls to the part, highlights it for 1.8s, then releases. The user always sees where they landed.
- **Language:** the toggle keeps the scroll position and the page. On the real site it routes `/` ↔ `/en` with `hreflang`. Don't auto-redirect.
- **Theme:** light by default, with an explicit toggle that persists. Respect the OS setting only until the visitor chooses.
- **Errors:** say what's missing and how to fix it ("Fylltu út nafn, netfang og hvað þarf að leysa."), with no apology.
- **Copy:** the email is selectable text plus a Copy button. Never rely on `mailto:` alone.
- **Honesty markers:** example data stays under the yellow "Dæmi" tape until real projects replace it.

## 9. References and what each contributes

| Reference | What we took |
|---|---|
| teenage.engineering | product-manual labelling, numbered parts, the industrial tone |
| bakkenbaeck.com | show the system itself (data, diagrams), not mockups |
| basement.studio | count superscripts in the nav |
| heydays.no | the live local clock (RVK) |
| metall.is | handwriting as the human layer |
| Dieter Rams / Braun manuals | line drawings, restraint, every element functional |
| Icelandic road signage | the yellow "signal" tape for warnings and examples |

## 10. Next design iterations (no new sections)

1. **Real handwriting:** scan the signature and the 05 notes, vectorise them, and replace Reenie Beanie.
2. **Type proof, done (Schibsted locked, §2):** the specimen is at https://claude.ai/artifact/Ezd1eE5h7EX8UVJDPqfbfT. It shows Schibsted, Archivo (wdth 82), Familjen, Instrument Sans and Hanken with identical samples at 104 and 46px, in IS/EN and light/dark.
   - No ð or Þ collisions at −.045em in any candidate.
   - Ranking so far: Schibsted (weight and Nordic tone) > Archivo condensed (most "manual and signage") > Instrument > Familjen (capped at 700) > Hanken (too soft).
   - L10 still needs trial files and licence terms from Or Type, then a local test using the same specimen.
3. **Line drawings, done:** the five part drawings were redrawn to the rules in §6.
4. **Dark-mode pass:** done 2026-10-11 (see §3).
5. **Touch feel:** done. Rows, tabs and nodes get a surface-2 flash; chips, toggles and small buttons get a 1px press over 80ms; the switch knob widens while pressed.
6. **Wide screens (≥1600px), decided:** content stays at a 1240 max width for reading measure. Section rules already run full-bleed, which is enough to make wide screens feel intentional. The column grid follows the content, not the window.
7. **Favicon and OG image, done (`docs/brand/`):**
   - `favicon.svg` is the part box with the orange ■, and it switches with the OS theme.
   - `og-is.png` and `og-en.png` (1200×630) use the hero line, the grid, the parts list and the mark.
   - The "e" was dropped from the mark: it needs Schibsted outlines to render reliably, and the box plus ■ is distinct at 16px.
8. ~~**Accessibility audit**~~ done 2026-10-11. See [`ACCESSIBILITY.md`](ACCESSIBILITY.md): axe 0 violations across 8 runs, keyboard paths verified, 11 build rules. Real screen-reader runs remain (before launch).
