# Eggó: agent guide

Eggó's site: a one-person software studio. Icelandic first (`/`), English mirror (`/en`).
Design and accessibility decisions live in `docs/`; the code enforces them. When a check fails, fix the cause, don't silence the rule.

## Stack

Bun · Vite 8 · TanStack Router (+ Start plugin for prerender and server functions) · React 19 · StyleX · TypeScript 7 · Oxlint · Oxfmt · Cloudflare Workers.
TanStack ships its own agent docs: read `node_modules/@tanstack/react-start/skills/react-start/SKILL.md` first, then only the sub-skill you need (`node_modules/@tanstack/router-core/skills/`, `node_modules/@tanstack/start-client-core/skills/`). Your memory of Start's API is probably out of date (it moved from Vinxi to a Vite plugin in 2025); trust the installed docs.

## Before you say you're done

```
bun run check      # types (tsc, ~0.3s) · oxlint (type-aware + house rules) · oxfmt · lint-rule tests · contrast
bun run test:e2e   # builds, prerenders, then axe + keyboard + layout tests on desktop and phone
```

## Deploying

`alchemy.run.ts` (Alchemy v2, Effect-based beta; versions pinned) owns the Worker, its env and secrets. Secrets come from `.env` at deploy time.

```
bun run deploy                                      # stage prod → eggo.einargudni.workers.dev
bun alchemy deploy --stage <name> -y                # throwaway copy
PLAYWRIGHT_BASE_URL=<url> bun x playwright test     # run the suite against a deployed copy
```

`wrangler.jsonc` only serves local dev and `vite preview`: keep its compatibility date, flags and asset handling in step with `alchemy.run.ts`.

## Where things live

| Need | Go to | Rule |
|---|---|---|
| Colour, type size, spacing, motion | `src/design/tokens.stylex.ts` | Only place raw values are allowed. Colours are `light-dark(light, dark)` pairs. `bun run contrast` checks every pair. |
| Breakpoints | `src/design/media.stylex.ts` | Use `media.phone` etc. as style keys. |
| Shared styles (label, focus ring, sr-only) | `src/design/primitives.ts` | Compose `ui.*` instead of re-declaring. |
| Any visible or screen-reader text | `src/i18n/is.ts` then `src/i18n/en.ts` | Icelandic is the source. A missing English key is a type error. Proper nouns go in `src/content/brand.ts`. |
| The five parts (01–05) | `src/content/parts.ts` | Per-part data is `Record<PartId, …>`; adding a part errors everywhere it's missing. |
| Server-side work | `src/server/*` via `createServerFn` + a `zod/mini` schema | Validate input with the same schema on client and server. Read env from `cloudflare:workers`, never `process.env` at module scope. |
| Routes | `src/routes/`, language via `/{-$lang}` | `src/routeTree.gen.ts` is generated; don't edit. |

## House lint rules (`lint/eggo-plugin.ts`, tests beside it)

- `eggo/no-raw-design-values`: no raw colours anywhere in `stylex.create`, no raw lengths on padding/margin/gap/inset.
- `eggo/no-literal-copy`: no text with letters in JSX or in `aria-label`/`title`/`alt`/`placeholder`.
- `eggo/no-half-aria-patterns`: no `role="tab|tablist|tabpanel|menu…"`. Use buttons with `aria-current`/`aria-pressed`.

New rule: add it to the plugin with RuleTester cases in `lint/eggo-plugin.test.ts`, and point its message at the doc section it enforces.

## StyleX gotchas

- Everything StyleX must be inside `stylex.create` / `defineVars` / `keyframes` calls. Helper objects defined outside (even spread into `create`) are not compiled and crash at render.
- Parent-state styling: `stylex.when.ancestor(":hover")` plus `stylex.defaultMarker()` on the parent, or a `data-*` attribute selector.
- `src/styles/global.css` holds only document resets, inside `@layer reset`. Unlayered CSS beats StyleX.
- Visually-hidden text (`ui.srOnly`) is absolutely positioned. Inside a scroll container, the card must be `position: relative`, or the page widens and phones zoom out.

## Accessibility (docs/ACCESSIBILITY.md)

Target WCAG 2.2 AA. Decoration is `aria-hidden`. Focus follows any action that moves the viewport. Part codes ("03 · AGT") are visual; screen readers get the name.
