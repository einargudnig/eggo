# Eggó: framework & hosting migration

Status: **decided 2026-10-11.** Bun + Vite + TanStack Router (with the TanStack Start plugin for prerendering and server functions), StyleX, TypeScript 7, Oxlint/Oxfmt, on Cloudflare Workers. The proof is on `redesign`; see §0. The rest of this file is the reasoning and the inventory that the full port still has to cover.

## 0. Decision and proof results

**Why this stack:** agents are the main authors, so everything is `.tsx` and machine-checked. Routes, links, URL params and server calls are typed by TanStack; design tokens by StyleX; copy by the dictionaries; and house rules by an Oxlint plugin. Astro was the better fit for a static site but its `.astro` templates sit outside TS 7 and Oxlint's JSX rules.

**What the proof covers:** bar (IS/EN link, theme switch), hero with both diagrams, the parts section with phone part nav and carousel, and the work order as a server function. `/` and `/en` are prerendered.

**Verified:**
- `bun run check` in ~1.2s: TS 7 (`tsc`, 0.2s for the app), type-aware Oxlint + 3 house rules (16 rule tests), Oxfmt, WCAG contrast read from the token file.
- `bun run test:e2e`: 29 Playwright tests. axe has 0 violations on `/` and `/en` × light/dark × desktop/phone, plus keyboard paths, form errors and focus, theme persistence, `/de` → 404, no hydration errors, no horizontal overflow.
- Type safety probes: removing an English string, or adding part `06`, fails `tsc` at every place that needs updating.

**Found by the new checks (all fixed):**
- Prerender reported 200 for a page whose component threw (uncompiled StyleX call). `scripts/verify-prerender.ts` now fails the build on that.
- Form cell and chip borders on the contact section were 2.1:1 (WCAG 1.4.11 needs 3:1). The mockup had the same gap; `contactRule` is now 3.8/3.5.
- Visually-hidden labels in off-screen carousel cards widened the page to 1838px, so phones zoomed out. Cards are now positioned; a layout test guards it.
- Unlayered reset CSS overrode StyleX fonts on buttons. The reset now lives in `@layer reset`.

**Cost to accept:** client JS is ~128 KB gzipped (React + TanStack Router/Start ≈ 112 KB, page code 16 KB). That breaks the 50 KB budget in `DESIGN.md` §6; the new budget is **≤ 150 KB gz** for the homepage, checked in CI before launch. Astro would have been near 10 KB.

**Still to port:** `/afhverju` (content is in `master` history), PostHog events, Cal.com (the booking CTAs point at `#samband` until then), self-hosted fonts, OG/favicon wiring, sitemap. Live on Cloudflare since 2026-10-11: eggo.is DNS is on Cloudflare (`infra/dns.ts`), the Worker serves the apex and www 301s to it, mail stays on Spacemail, and the form sends from `vefur@eggo.is` via Resend.

---

## 1. Current state

**Stack on `master`:** Astro 6 (static pages + one server route), Tailwind v4 via Vite, deployed on **Vercel** (`@astrojs/vercel`, `vercel.json`).

**Unmerged branch: `migrate/cloudflare-workers` (2026-07-27):**

- Swaps to `@astrojs/cloudflare` 13.x and bumps Astro 6.0.2 → 6.4.8.
- Adds `wrangler.jsonc` and `alchemy.run.ts` (Alchemy `^0.93`).
- Reads the Resend key from `cloudflare:workers`, with `nodejs_compat` enabled.
- Verified on a preview Worker, but it never went live. DNS is unchanged.
- It also contains `feat: ship server errors to the life-os log hub` (`src/lib/hub-log.ts`, `src/middleware.ts`).
- Vault: `claude-breadcrumbs/2026-07-28_vercel-to-cloudflare-migration.md`. Resume doc: `~/CLOUDFLARE_MIGRATION.md`.
- The untracked `.alchemy/` and `.wrangler/` dirs on `master` are leftovers from that work.

### Inventory: everything that must survive the move

| Thing | Where | Notes |
|---|---|---|
| Homepage | `src/pages/index.astro` | gets redesigned anyway |
| Manifesto | `src/pages/afhverju.astro` | content kept, URL kept |
| Contact API | `src/pages/api/send.ts` | Resend → `eggo@eggo.is` |
| PostHog | `src/layouts/Layout.astro` | EU host. Events: `cta_clicked`, `booking_opened`, `contact_submitted`, `manifesto_scrolled`, `discovery_call_booked` |
| Cal.com popup | Layout + `data-cal-*` attrs | namespace `discovery` |
| Vercel Analytics | `@vercel/analytics/astro` | drop if leaving Vercel |
| Sitemap | `@astrojs/sitemap` | must emit IS + EN with `hreflang` |
| SEO/OG | Layout head | per-page/per-locale OG in the new build |
| Theme no-flash script | Layout head | rewritten for the new theming (`DESIGN.md` §6) |
| Env vars | `RESEND_API_KEY`, `PUBLIC_POSTHOG_KEY`, `PUBLIC_POSTHOG_HOST`, `PUBLIC_CAL_LINK` | |
| Static assets | `public/` | favicon/OG get redone with the new brand |
| Error logging | branch only (`hub-log.ts`) | decide whether to carry it over |

### Known issues to fix in the move (not before)

- **`send.ts` interpolates `name`/`message` into email HTML unescaped.** Anyone can inject markup into the email you receive. Escape it or send plain text.
- There's no server-side email validation or rate limiting on the contact endpoint.
- Mail is sent `from: onboarding@resend.dev`. Verify `eggo.is` in Resend and send from your own domain.
- Error messages from the API are Icelandic-only. They need to be localised.

---

## 2. Requirements for the new stack

1. **Static-first:** every marketing page is prerendered HTML. Only the contact endpoint (and maybe a demo agent later) runs on the server.
2. **i18n routing:** `/` (is) and `/en` (en), translated slugs, `hreflang`, and typed dictionaries.
3. **Content:** case studies in MD/MDX per locale, with frontmatter (title, year, type, stack, cover).
4. **Minimal JS:** originally under 50KB on the homepage. Revised to ≤ 150 KB gz with the chosen stack (see §0).
5. **View Transitions:** cross-page plus the theme toggle.
6. **Room for live AI demos:** a streaming endpoint (e.g. a small agent that answers questions about Eggó). Optional, but the stack shouldn't fight it.
7. **Familiarity:** low context-switch cost relative to daily work at Maul (React Router v7).
8. **Hosting:** commercial use is allowed. Vercel Hobby is formally non-commercial (per the July migration notes), which matters for a paid consultancy site.

## 3. Candidates

| | **React Router v7** (framework mode) | **TanStack Start** | **Next.js** | **Astro 7** (stay) |
|---|---|---|---|---|
| Static prerender | ✅ `prerender` in config | ✅ static prerender | ✅ SSG | ✅ default |
| i18n routing | manual (`/:lang?` prefix routes) | manual | built-in-ish via middleware | ✅ built-in `i18n` config |
| MDX content | via Vite plugin | via Vite plugin | ✅ mature | ✅ content collections (best in class) |
| JS shipped | full React hydration per page | full React hydration | RSC reduces it, still a runtime | ✅ zero by default, islands |
| Cloudflare Workers | ✅ first-class (Vite plugin) | ✅ | ⚠️ OpenNext. The July migration hit blockers on the Next apps | ✅ adapter already done on branch |
| Familiarity (Maul = RR7) | ✅✅ | ✅ (similar mental model) | ✅ | ➖ |
| Streaming AI endpoint | ✅ resource routes | ✅ server functions | ✅ route handlers | ✅ server endpoints |
| Risk | low | medium (younger) | medium (hosting friction off Vercel) | low |

### Honest read

- **Astro still fits a marketing site best on paper** (zero JS, content collections, built-in i18n, and the Cloudflare branch is already done). The main argument against it is context switching, not capability. Weigh that before migrating for its own sake.
- **React Router v7** is the strongest "move" option: you use it at Maul every day, it prerenders, it deploys cleanly to Workers, and resource routes cover the contact and AI-demo endpoints. The cost is shipping React on every page. That's fine within budget if the components are kept light.
- **TanStack Start** is a good choice if you want to learn it. It isn't needed for this site.
- **Next.js** is least attractive given the plan to leave Vercel and the OpenNext blockers already hit.

## 4. Hosting

- The default plan is **Cloudflare Workers** (static assets + one Worker for `/api/*`), consistent with the July decision across personal projects.
- `wrangler deploy` must work on its own. Alchemy is optional on top, per the July rule.
- **DNS is the risk.** `eggo.is` carries live business mail (MX). Move nameservers only after every MX/SPF/DKIM/DMARC record has been copied and verified. This is a separate step from the site cutover.
- Analytics: PostHog stays. Drop `@vercel/analytics`, and optionally add Cloudflare Web Analytics.

## 5. Plan (once the framework is chosen)

1. **Decide** the framework (§3) and close or rebase `migrate/cloudflare-workers` accordingly. If you stay on Astro, merge it first as the baseline.
2. **Scaffold** in a fresh branch: routing with `/` + `/en`, theming tokens, fonts self-hosted and subset, and a layout with the no-flash theme script.
3. **Port the funnel:** PostHog events (same names, so dashboards continue), Cal.com popup, and the contact endpoint with the fixes from §1.
4. **Build pages** from the chosen design direction: homepage, `/verk`, case study template, `/afhverju`, 404, all in both locales.
5. **SEO parity:** titles and descriptions per locale, `hreflang`, sitemap, robots, OG images, and redirects for any changed URLs (`/afhverju` stays; `/en/why` is new).
6. **Verify:** Lighthouse perf ≥ 95 and a11y = 100, axe in CI with zero violations (`ACCESSIBILITY.md` §6), `bun run check` and `bun run test:e2e` green, 320px Icelandic headings, no-JS render, form end to end, PostHog events firing.
7. **Cut over:** deploy the preview Worker, then point the domain. Do the DNS/MX move separately, with a rollback ready.
8. **Clean up:** remove Vercel config and project, and `.alchemy/` / `.wrangler/` leftovers if unused.

## 6. Open questions

- Is the context-switch argument strong enough to leave Astro, given the Cloudflare branch already works?
- Is a live AI demo on the site in scope? If yes, it nudges toward RR7 or TanStack, which have React and streaming everywhere.
- Should the life-os error logging come along?
- When should the `eggo.is` nameserver/MX move happen: before, with, or after the relaunch?
