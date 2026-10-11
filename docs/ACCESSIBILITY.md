# Eggó: accessibility

Target: **WCAG 2.2 AA** in both languages and both themes, at desktop and phone widths. This file records what the A1 mockup ([Verkstæði](https://claude.ai/artifact/PKLNUy7Xx82Y8a97m2oQbY)) does and why, so the real build copies the decisions, not just the markup.

Audit: 2026-10-11, mockup v7.

---

## 1. How it was checked

| Check | Tool | Result |
|---|---|---|
| Automated rules (wcag2a/aa, 2.1, 2.2, best-practice) | axe-core 4.10 in headless Chromium, 1280 + 390px × light/dark × IS/EN (8 runs) | **0 violations** (before: 3 rules, 13 hits; see §2) |
| Colour contrast, every token pair | `bun run contrast` | all pass AA (see DESIGN-SYSTEM §3) |
| Keyboard | scripted Playwright pass: tab order, sheet, part nav, diagram, form | as described in §3 |
| Forced colours / reduced motion | manual CSS review | §4 |

What axe leaves "incomplete" and why that's fine:

- **SVG text contrast:** axe can't compute a background behind `<text>`. Those labels use `--muted` on `--surface`, which `bun run contrast` already passes in both themes.
- **The arrow span in buttons:** it's glyph-only, and the button text carries the name.

Not yet tested: real VoiceOver (macOS + iOS) and TalkBack runs. They're needed before launch (§6).

## 2. Findings and fixes

| # | Found | Severity | Fix |
|---|---|---|---|
| 1 | Diagram SVGs were `role="img"` with no name, yet contained 5 focusable nodes. A screen reader announced one unnamed image, then focus landed inside it. | serious (axe `svg-img-alt`) | SVG is `role="group"` labelled by the figure caption ("Mynd 1"). Each node is `role="button"` with an aria-label ("02 Kerfi, sjá lýsingu"). Wires, dimension lines, ticks, wire labels and the moving packet are `aria-hidden`. |
| 2 | Phone part strip used `role="tab"` without tabpanels or arrow keys: a half-implemented pattern that promises behaviour it doesn't have. | serious | Dropped the tab roles. It's now a `<nav aria-label="Hlutar">` of buttons with `aria-controls` + `aria-current`. Activating one scrolls to the card and moves focus to it. (Real tabs would hide the other cards, which the swipe carousel doesn't do.) |
| 3 | Phone carousel `#specs` scrolled horizontally but couldn't be reached by keyboard. | serious (axe `scrollable-region-focusable`) | `role="region"` + label + `tabindex="0"`, phone only (toggled with the media query). |
| 4 | Process steps were `h4` directly under an `h2`, and "§5 Hver" wasn't a heading at all. | moderate (axe `heading-order`) | Steps are `h3` (styled by `.h4`). "Hver" is an `h2`, styled as the label it was. |
| 5 | Thumb CTA bar slides off-screen but stayed in the tab order. | serious (focus lands on something invisible, 2.4.11) | `inert` whenever `data-hidden="true"`. |
| 6 | Sheet: `aria-expanded` never set, focus not returned on close. TOC links closed the sheet but left focus on `<body>`. | moderate | `aria-expanded` synced on open/close (Esc included). Native `<dialog>.showModal()` handles the trap and return. TOC links move focus to the target section (`tabindex="-1"`). |
| 7 | Form errors: one shared message, no link to fields, focus stayed on the submit button. | serious (3.3.1) | `required` + `aria-describedby="o-err"` on each field. Empty or bad fields get `aria-invalid="true"` (plus a visible accent underline), and focus moves to the first bad field. The `#o-err` region is `role="alert"`. |
| 8 | Receipt appeared silently; focus was lost when the form became `hidden`. | moderate | Receipt title is an `h3` with `tabindex="-1"` and gets focus. "Ný beiðni" returns focus to the name field. |
| 9 | "05 · ???" read aloud as "zero five question question question". | moderate | Visual code is `aria-hidden`, with a visually hidden "hluti 05, óskilgreint" / "part 05, undefined". The same goes for the troubleshooting "→" buttons ("Sjá hluta 03, AI agent"). |
| 10 | Aria-labels were "Myrkur hamur / Dark mode": both languages at once, and they didn't follow the IS/EN switch. | moderate | Single-language labels plus `data-en-label`. `setLang` swaps every `aria-label` along with the text. IS/EN buttons have `lang` and full names ("Íslenska", "English"). |
| 11 | No skip link. | moderate (2.4.1) | "Fara í efni / Skip to content" is first in tab order, visible on focus, and targets `<main tabindex="-1">`. |
| 12 | Copy-email feedback was visual only. | minor (4.1.3) | Polite live region announces "Netfang afritað". |
| 13 | Accessible names ran together: "DK03 · AGT2026", "§1Smíði01–05". | minor | Visually hidden ", " separators in work-row summaries and TOC links. Section numbers (`§1`) are `aria-hidden` in the TOC. |
| 14 | Ticking clock (`RVK 12:44`) and status dot were read as content. | minor | `aria-hidden`. They're decoration, and a changing time is noise. |
| 15 | The troubleshooting table goes `display:block` on phone, and Safari then drops table semantics. | moderate | Explicit `role="table/rowgroup/row/columnheader/cell"`. The `#` header gets a hidden "Liður". |
| 16 | `.mapflow` had an aria-label on a role-less div (ignored by most screen readers). | minor | `role="group"` + bilingual label. |

## 3. Keyboard: the verified paths

**Desktop tab order:** skip link → logo → 4 nav links → IS / EN → theme switch → hero CTA → diagram nodes 01–05 → 5 work rows (`<summary>`) → 5 troubleshooting buttons → contact CTA → copy → form.

**Phone tab order:** skip link → logo → Efni → hero CTA → diagram nodes → part nav 01–05 → carousel region → same as desktop from the work rows on.

| Path | Expected | Verified |
|---|---|---|
| Diagram node, Enter or Space | highlight, scroll to part card, focus card | ✅ |
| Phone part nav, Enter | carousel scrolls, `aria-current` moves, focus on card | ✅ |
| Efni → sheet | focus on "Loka". Tab cycles inside the sheet and browser chrome only, never the page behind. | ✅ |
| Esc in sheet | closes, focus back on Efni, `aria-expanded="false"` | ✅ |
| TOC link | sheet closes, focus on the section heading area | ✅ |
| Submit empty form | 3 fields `aria-invalid`, focus on Nafn, error announced | ✅ |
| Submit bad email | only email invalid, focus on email | ✅ |
| Submit valid | focus on "Verkbeiðni móttekin" | ✅ |
| Switch to EN | all aria-labels switch ("Dark mode", "Main menu", "05 Undefined, see details") | ✅ |

## 4. Rules for the real build

1. **Every focusable thing has a name in the current language.** No "IS / EN" double labels. Labels live in the same dictionary as the visible strings.
2. **Don't borrow ARIA patterns half-way.** Tabs, menus and listboxes come with keyboard contracts. If you're not going to implement arrow keys and panels, use buttons + `aria-current`.
3. **Decoration is `aria-hidden`:** wires, ticks, dimension lines, the clock, the signature, the big footer mark, the "Strjúktu" hint and the line drawings. If it's only there to look like a manual page, hide it.
4. **Off-screen means `inert`.** This applies to anything translated out of view: the thumb bar, and later any drawer.
5. **Focus follows intent.** Any action that moves the viewport moves focus with it (part nav, diagram, TOC, form result).
6. **Part codes are visual.** Codes like "03 · AGT" stay visible but are spoken as words ("hluti 03, AI agent").
7. **Heading outline:** one `h1` (hero), `h2` per § section, `h3` inside. Labels styled as small caps can still be headings.
8. **Forced colours:** states shown only by fill (active part, pressed language, checked part chip, switch knob) get an outline in `@media (forced-colors: active)`.
9. **Motion:** the packet animation is removed under `prefers-reduced-motion`. Scrolling goes instant. No animation conveys information on its own.
10. **Touch targets** ≥ 44×44 on phone (already in DESIGN-SYSTEM §8), and never under the 24×24 minimum (2.5.8) on desktop. The nav links and IS/EN buttons are the ones to measure.
11. **`lang` attributes:** the build sets `<html lang>` per route (`/` = is, `/en` = en) instead of swapping text in place. Mixed-language strings (e.g. "AI agent" in Icelandic copy) are fine untagged. The mockup's in-place swap is a prototype shortcut.

## 5. Not covered by the mockup (build-time items)

- `<html lang>`, `<title>`, and meta description per locale. The artifact wrapper supplies these in the mockup.
- Real `<form>` submit: server errors need the same `aria-invalid` + focus treatment, and the success state needs a real heading/route.
- Cal.com popup: it's third party. Check its focus trap and Esc, or link to a page instead of opening a popup.
- Case-study pages: image alt text rules (describe what the screenshot proves, not what it shows).
- 400% zoom / 320px reflow (1.4.10): not checked yet. Long Icelandic compounds in `h1`/`h2` are the risk; they need `hyphens: auto` with `lang="is"` or manual `&shy;`.

## 6. Before launch

- [ ] VoiceOver macOS (Safari) + iOS: full read-through in IS and EN
- [ ] TalkBack (Chrome Android): carousel + sheet
- [ ] Windows High Contrast (forced colours) screenshot pass
- [ ] axe in CI on built pages (`@axe-core/playwright`), failing on any violation
- [ ] Lighthouse accessibility = 100 on `/` and `/en`
