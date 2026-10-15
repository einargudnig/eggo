# Eggó: accessibility

Target: **WCAG 2.2 AA** in both languages and both themes, at desktop and phone widths. This file records what the A1 mockup ([Verkstæði](https://claude.ai/artifact/PKLNUy7Xx82Y8a97m2oQbY)) does and why, so the real build copies the decisions, not just the markup.

Audit: 2026-10-11, mockup v7. Re-checked 2026-10-15 for the Vegvísir redesign (§2b, §3); findings 1–6, 13–16 in §2 describe components that no longer exist and are kept as history.

---

## 1. How it was checked

| Check | Tool | Result |
|---|---|---|
| Automated rules (wcag2a/aa, 2.1, 2.2, best-practice) | axe-core 4.10 in headless Chromium, 1280 + 390px × light/dark × IS/EN (8 runs) | **0 violations** (before: 3 rules, 13 hits; see §2) |
| Colour contrast, every token pair | `bun run contrast` | all pass AA (see DESIGN-SYSTEM §3) |
| Keyboard | `tests/keyboard.spec.ts`: skip link, symptom picker, "Senda Einari", form errors, language, theme | as described in §3 |
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

## 2b. Vegvísir (2026-10-15)

| Component | Decision |
|---|---|
| Symptom picker | Real checkboxes inside `<label>`s, visually hidden but focusable; the warning triangle is `aria-hidden`. Ticked state is shown by fill *and* shape (the triangle fills), with an underline in forced colours. |
| Junction sign | `aria-hidden` SVG. The route summary next to it says the same thing in words and is `aria-live="polite"`, so ticking a symptom announces the new route. |
| Direction sign arrows, route-chip arrows, button "→" | `aria-hidden`. The part name carries the meaning. |
| Destination chips (work order) | Checkboxes in a `<fieldset>` with a `<legend>`; pre-ticked from the hero, changeable. |
| Focus on blue | Yellow `warn` ring on signs, link-blue ring on the page (yellow fails 3:1 on white). |

## 3. Keyboard: the verified paths

**Tab order (desktop):** skip link → wordmark → 4 section links → other language → theme switch → 5 symptom checkboxes → "Fá fast verð" → work log links → work order (email link, Nafn, Netfang, 5 destinations, message, send).

**Phone:** the section links are hidden; otherwise the same.

| Path | Expected | Verified |
|---|---|---|
| Space on a symptom | ticks it, the route summary updates and is announced, the matching destination is pre-ticked in the work order | ✅ |
| "Fá fast verð" | scrolls to the work order, focus on Nafn | ✅ |
| Submit empty form | 3 fields `aria-invalid`, focus on Nafn, error announced | ✅ |
| Submit bad email | only email invalid, focus on email | ✅ |
| Submit valid | focus on "Verkbeiðni móttekin" | ✅ |
| Language link | same page in the other language, `<html lang>` follows | ✅ |
| Theme switch | `role="switch"`, choice persists across reloads | ✅ |

## 4. Rules for the real build

1. **Every focusable thing has a name in the current language.** No "IS / EN" double labels. Labels live in the same dictionary as the visible strings.
2. **Don't borrow ARIA patterns half-way.** Tabs, menus and listboxes come with keyboard contracts. If you're not going to implement arrow keys and panels, use buttons + `aria-current`.
3. **Decoration is `aria-hidden`:** the junction drawing, sign arrows, the road band and its dashes, warning triangles. If a drawing says something, say it in text next to it.
4. **Off-screen means `inert`.** Anything translated out of view (a future drawer or sticky bar) leaves the tab order.
5. **Focus follows intent.** Any action that moves the viewport moves focus with it ("Fá fast verð", form errors, form result).
6. **Part codes are visual.** Where numbers like "03" show, they're spoken as the part's name.
7. **Heading outline:** one `h1` (hero), `h2` per section, `h3` inside.
8. **Forced colours:** states shown only by fill (ticked symptom, ticked destination, switch knob) get an outline or underline in `@media (forced-colors: active)`.
9. **Motion:** the junction draw-in and arrow nudges are removed under `prefers-reduced-motion`. Scrolling goes instant. No animation conveys information on its own.
10. **Touch targets** ≥ 44×44 on phone, and never under the 24×24 minimum (2.5.8) on desktop.
11. **`lang` attributes:** `<html lang>` per route (`/` = is, `/en` = en). Mixed-language strings (e.g. "AI agent" in Icelandic copy) are fine untagged.

## 5. Not covered by the mockup (build-time items)

- `<html lang>`, `<title>`, and meta description per locale. The artifact wrapper supplies these in the mockup.
- Real `<form>` submit: server errors need the same `aria-invalid` + focus treatment, and the success state needs a real heading/route.
- Cal.com popup: it's third party. Check its focus trap and Esc, or link to a page instead of opening a popup.
- Case-study pages: image alt text rules (describe what the screenshot proves, not what it shows).
- 400% zoom / 320px reflow (1.4.10): not checked yet. Long Icelandic compounds in `h1`/`h2` are the risk; they need `hyphens: auto` with `lang="is"` or manual `&shy;`.

## 6. Before launch

- [ ] VoiceOver macOS (Safari) + iOS: full read-through in IS and EN
- [ ] TalkBack (Chrome Android): symptom picker + work order
- [ ] Windows High Contrast (forced colours) screenshot pass
- [ ] axe in CI on built pages (`@axe-core/playwright`), failing on any violation
- [ ] Lighthouse accessibility = 100 on `/` and `/en`
