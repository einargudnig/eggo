# Eggó launch plan: search, agents, social

_Drafted 2026-10-12. The site is live on Cloudflare with real work rows, llms.txt, Markdown mirrors, JSON-LD, a sitemap, a work-order API and an MCP server._

Voice: `.claude/brand-voice-guidelines.md` (v2.0, "ég", A1 Pappír). Clients named below (Gigover, Sterkir pabbar, Maul) are fine to name publicly.

---

## 1. Search Console and other search engines (≈30 min, needs your logins)

**Google Search Console**
1. search.google.com/search-console → Add property → **Domain** → `eggo.is`. Google shows a TXT value.
2. Add it to `infra/dns.ts`:
   ```ts
   { id: "GoogleSiteVerification", name: "@", type: "TXT", content: "google-site-verification=…" },
   ```
3. `bun run deploy --yes`, then click Verify. DNS lives in Alchemy, so don't add the record by hand in the Cloudflare dashboard. The next deploy would remove it.
4. Sitemaps → submit `https://eggo.is/sitemap.xml`.
5. URL inspection → request indexing for `https://eggo.is/` and `https://eggo.is/en`.
6. After about a week, check Pages (both indexed, `/` canonical for IS and `/en` for EN) and Enhancements (no structured-data errors).

**Bing Webmaster Tools.** This matters more than it looks, because Bing's index feeds ChatGPT search, Copilot and DuckDuckGo.
1. bing.com/webmasters → Import from Google Search Console. One click once GSC is verified.
2. Submit the sitemap there too.

**Local listings**
- **Google Business Profile**: a service-area business in Reykjavík, with the address hidden. Category "Software company". Link to eggo.is. This is what answers "hugbúnaðarstofa Reykjavík" on Maps.
- **Já.is**: a free listing. Icelandic buyers still look there.

## 2. Agent discovery (≈1 hour)

These steps are already done in code and verified live:
- `/llms.txt`, `/llms-full.txt`, `/index.md`, `/en.md`, generated from the same dictionaries as the page, so they never drift.
- robots.txt welcomes every crawler, AI ones included, and sets `Content-Signal: search=yes, ai-input=yes, ai-train=yes`. **Decide on `ai-train`.** I set it to yes because being known is the point of a studio site. Change it to no in `public/robots.txt` if you'd rather not.
- JSON-LD (ProfessionalService + Person + WebSite + the five services) and canonical, hreflang and OG tags.
- `POST /api/work-order` (self-describing on GET) and an MCP server at `https://eggo.is/mcp` with `get_studio_info` and `send_work_order`. Tested with the official MCP Inspector.

Still to do (each needs an account):
1. **Official MCP Registry** (registry.modelcontextprotocol.io). Publish with `mcp-publisher` under the namespace `is.eggo/studio`, verified by a DNS TXT record (add it to `infra/dns.ts`). Most MCP clients and directories pull from here.
2. **Smithery, PulseMCP, mcp.so**: submit the remote URL. Each takes about 5 minutes.
3. **llms.txt directories** (llmstxt.site, directory.llmstxt.cloud): submit `https://eggo.is/llms.txt`.
4. **Monthly check**: ask ChatGPT, Claude and Perplexity "hugbúnaðarstofa í Reykjavík sem smíðar AI agents" and "who builds AI agents for small companies in Iceland". Note whether Eggó shows up.

Watch: the API and MCP endpoint send email with no rate limit, the same exposure as the form. If spam shows up (the subject says `(api)` or `(mcp)`), add a Cloudflare rate-limit binding in `alchemy.run.ts`.

## 3. Social accounts

| Channel | Why | Setup |
|---|---|---|
| **LinkedIn, personal (primary)** | Icelandic B2B decisions happen here, and people trust a person over a page | Headline: "Eggó: frá vandamáli að lausn sem virkar". Featured: eggo.is. Add Eggó as your current role |
| **LinkedIn, Eggó company page** | Makes the role clickable and adds credibility. Don't post there first; reshare your own posts | Logo `public/logo-social.png`, banner from `docs/brand/og-is.png` |
| **Facebook page** | Many Icelandic small businesses only exist on Facebook. It's where they'll check you're real | Same assets. Post less often, mostly reshares |
| X / Bluesky (optional) | The developer and agent crowd, for English posts like #6 below | Use your existing personal account. Don't create an Eggó one |

Skip Instagram and TikTok for now: the work isn't visual enough to sustain them.

**Handles:** try `eggo.is`, or `eggohugbunadur` as a fallback. Use the same one everywhere.
**When they exist:** add the URLs to `sameAs` in `structuredData()` in `src/content/agent.ts` so search engines and agents tie the profiles to the site.

## 4. Posts

Cadence: one post a week on LinkedIn (Tue–Thu morning), two "give" posts for every "ask". Each one gets a screenshot or the OG image. No emoji, no "spennt að tilkynna".

**Assets.** `bun run video:render` writes everything to `video/out/`, in the shipped Minimal look (white, Public Sans, the pine accent, the drawn wordmark):
- Videos: `<video>-<lang>-<format>.mp4`, `feed` (4:5, LinkedIn and Facebook feed) and `story` (9:16, stories and reels). Silent, 15–30 s, readable without sound. Post the video natively (not a YouTube link) with the text below it.
- Images: `images/<image>-<lang>.png`, 1080×1350 feed posts, plus `banner-linkedin` (1584×396) and `banner-facebook` (1640×624) headers. `bun run video:render -- image-` renders only these.

| Post | Video | Image |
|---|---|---|
| 1 Launch | `launch-is-feed` | `launch-is` |
| 2 Gigover assistant | `gigover-assistant-is-feed` | `gigover-assistant-is` |
| 3 The quietest bug | `gigover-product-is-feed` | `gigover-product-is` |
| 4 Ask | `picker-is-feed` (the symptom picker, played once) | `cta-is` |
| 5 Sterkir pabbar | `sterkir-pabbar-is-feed` | `sterkir-pabbar-is` |
| 6 Agents | `agents-is-feed`; `agents-en-feed` for X/Bluesky | `agents-is` |
| 7 Maul | `maul-verification-is-feed` | `maul-verification-is` |
| 8 Undefined | none; use the image | `picker-is` |
| 9 Prices | none; use the image | `prices-is` |
| 10 Nothing is too small | `small-is-feed` | `small-is` |
| 11 How I work | none; use the image | `process-is` |

`life-os` has a video and an image but no post; use it for an English developer post on X/Bluesky. Headers: `banner-linkedin-is` on the LinkedIn profile and company page, `banner-facebook-is` on the Facebook page, `public/logo-social.png` as the avatar.

### Post 1: Launch (week 1)

> Eggó er komið í loftið.
>
> Eggó smíðar lausnir sem spara tíma: vefsíður, innri kerfi, AI agents og tengingar á milli kerfa.
>
> Og fimmta hlutinn, sem er óskilgreindur. Hann er fyrir vandamálin sem passa ekki í neinn flokk ennþá. Þar byrjum við á að kortleggja.
>
> Fast verð, eitthvað sem virkar í hverri viku, og þú átt allt.
>
> eggo.is

### Post 2: Start from the job, not the tool (week 2) · Gigover

> Gigover vildi AI aðstoðarmann inni í kerfinu sínu. Upphaflega planið var dýrt líkan með vefleit, keyrt í gegnum bakenda sem enginn hafði tíma til að breyta.
>
> Fyrsta spurningin mín var: hvað þarf aðstoðarmaðurinn að vita? Svarið var kerfið sjálft og verklag í verkefnastjórnun. Hvorugt er á vefnum.
>
> Svo vefleitin fór út. Ódýrara líkan, kostnaðarþak á hvern notanda, og 22 prófdæmi sem þurfa öll að standast áður en ný útgáfa fer í loftið.
>
> Byrjaðu á verkinu, ekki verkfærinu.

### Post 3: The quietest bug (week 3) · Gigover

> Bjóðandi hlóð upp tilboði og sá „tókst“. Verkkaupinn fékk aldrei neitt.
>
> Bakendinn sendi villuna inni í svari sem leit út fyrir að hafa tekist. Vefurinn trúði því.
>
> Ég mátti ekki breyta bakendanum, svo ég lét vefinn hætta að trúa: ein sameiginleg villumeðhöndlun fyrir allar 55 aðgerðirnar sem breyta gögnum.
>
> Verstu villurnar eru þær sem enginn sér. Ef eitthvað „virkar“ hjá ykkur en fólk kvartar samt, byrjið þar.

### Post 4: An ask (week 4)

> Ég er með pláss fyrir eitt nýtt verkefni í haust.
>
> Ef þú ert með eitthvað sem ætti að ganga sjálft (reikninga sem þarf að slá inn, Excel-skjal sem bara ein manneskja skilur, kerfi sem tala ekki saman), sendu mér línu.
>
> Fyrsta samtalið er frítt. Ég segi þér hreinskilnislega hvort og hvernig ég get leyst það.
>
> eggo.is

### Post 5: Build for whoever maintains it (week 5) · Sterkir pabbar

> Sterkir pabbar þurftu vef sem þjálfarinn gæti uppfært sjálfur. Hann er ekki forritari og á ekki GitHub-aðgang.
>
> Það útilokaði helminginn af tólunum sem forritarar velja fyrir sjálfa sig. Hann fékk vefumsjón sem hann skráir sig inn í með tölvupósti, og forsíðu með engu JavaScript sem opnast strax í símanum.
>
> Besta tæknin er sú sem sá sem tekur við getur notað.

### Post 6: Your site has a new reader (week 6) · eggo.is itself

> Það les fleira en fólk vefsíðuna þína.
>
> Fólk er farið að spyrja ChatGPT og Claude „hver getur smíðað X fyrir mig?“. Ef agentinn getur ekki lesið vefinn þinn ertu ekki með.
>
> Á eggo.is getur agent lesið allt efnið sem hreinan texta, og ef manneskja biður hann um það getur hann sent mér verkbeiðni beint.
>
> Ég get skoðað vefinn þinn með augum agents og sagt þér hvað vantar. Sendu mér slóðina.

English version for X/Bluesky:

> eggo.is has two audiences now: people, and the agents they ask.
>
> /llms.txt, every page as Markdown, schema.org data, and an MCP server at eggo.is/mcp. If someone asks their agent to get in touch, it can send me a work order directly.
>
> A small studio site should be the easiest thing on the internet for an agent to recommend.

### Post 7: Proof over trust (week 7) · Maul (in-house, say so)

> „Agentinn sagði að þetta virkaði.“ Prófin stóðust líka. En enginn hafði opnað síðuna.
>
> Hjá Maul smíðuðum við tól sem lætur agent nota innra kerfið í vafra eins og manneskja og skila sönnunum.
>
> Fyrsta skrefið var að skrifa kort af öllu sem kerfið gerir. Bara það að skrifa kortið fann fimm raunverulegar villur, áður en nokkurt próf var til.
>
> Kortlagning er vanmetnasta verkfærið í hugbúnaði.

### Post 8: The undefined part (week 8)

> „Eitthvað er að, en ég veit ekki alveg hvað.“
>
> Þetta er algengasta setningin í fyrstu símtölum og hún er góð byrjun. Þess vegna er fimmti hlutinn hjá Eggó óskilgreindur.
>
> Við byrjum á viku af kortlagningu: hver gerir hvað, hvert tíminn fer, hvar hlutir týnast. Stundum verður kortið að kerfi eða tengingu. Stundum er lausnin að hætta að gera eitthvað.
>
> Þú átt kortið, jafnvel þótt einhver annar smíði.

### Post 9: Prices on the page (week 9)

> Flestar hugbúnaðarstofur gefa ekki upp verð. Ég geri það.
>
> Vefsíða frá 199.900 kr. Tenging frá 249.900 kr. AI agent frá 299.900 kr. Innra kerfi frá 399.900 kr. Og vika af kortlagningu á 289.900 kr. ef þú veist ekki enn hvað þarf.
>
> Þetta eru viðmið, ekki verðskrá. Hvert verk fær fast verð áður en ég byrja, og það er alltaf hægt að semja: minna umfang, verkið í áföngum eða greiðslum dreift.
>
> Þú átt að vita hvað hlutirnir kosta áður en þú hringir.

### Post 10: Nothing is too small (week 10)

> Sum bestu verkin taka einn dag.
>
> Áminning sem fer sjálf út þegar reikningur er kominn á eindaga. Pantanir úr vefversluninni sem rata sjálfar í bókhaldið. Samantekt vikunnar í pósthólfinu á mánudagsmorgni.
>
> Ekkert af þessu er stórt kerfi. Allt sparar það tíma í hverri viku, og lítil verk fá líka fast verð.
>
> Hvað er það litla sem tefur þig?

### Post 11: How I work (week 11)

> Fjögur skref, engir tímar sem tikka.
>
> Spjall, ókeypis: þú lýsir vandanum og ég segi hreinskilnislega hvort ég get hjálpað. Fast verð, skriflega. Smíði, með einhverju nýju til að prófa í hverri viku. Afhending: kóði, aðgangar og skjölun á þínu nafni.
>
> Ekkert læst inni hjá mér. Ef þú vilt skipta um forritara á morgun geturðu það.

### After week 11

Repeat the rhythm. A good post is one specific thing shipped or learned, under 150 words, with one claim you can back up. New work rows on the site make new posts. For new clients, ask at handover whether you can name them.

## 5. Order of operations

1. GSC + Bing + sitemap (tonight's work makes this a 15-minute job)
2. LinkedIn profile update → Post 1
3. Google Business Profile, Já.is, Eggó LinkedIn page, Facebook page → add the URLs to `sameAs`
4. MCP Registry + directories
5. Posts 2–11, one a week
