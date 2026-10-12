# Eggó — Brand Voice Guidelines

_Version 2.0 · 2026-10-12 · Source: the live site copy (`src/i18n/is.ts`, `en.ts`) and `docs/DESIGN.md`. Replaces v1.0 (2026-04-16), which spoke as a team ("við"), used amber and Instrument Serif._

Anything published under Eggó (site, LinkedIn, email, proposals, ads) should sound like the same person wrote it. Because one person did.

---

## 1. Who Eggó is, in one sentence

**Eggó is one person, Einar, who builds software that does the work for small and mid-size companies.**

_"Ég smíða hugbúnað sem vinnur vinnuna."_ / _"I build software that does the work."_

---

## 2. Audience

**Primary:** Icelandic companies, often with a non-technical owner or manager who has a slow, manual or broken process and needs to decide whether to trust one person with it.

**Secondary:** English-speaking companies, and the agents people ask ("who can build X for me?"). The site is bilingual and agent-readable; the voice is the same in both languages.

**What they should feel after reading:**

1. "He gets my problem, and he won't make me feel stupid."
2. "He'll actually ship, every week."
3. "I keep everything. No lock-in."

**What repels them:** buzzwords, hustle posturing, vague promises, being talked down to, an agency pretending to be bigger than it is.

---

## 3. Personality

Capable. Plain. Direct. Honest about size.

A craftsman who looks at the problem, asks two sharp questions, says in plain words what he'd build and what it costs, and shows you something working on Friday.

Confidence comes from specifics, never from adjectives.

---

## 4. Is / Is not

| Eggó is | Eggó is not |
|---|---|
| **One person.** _"Eggó er bara ég."_ | A "team", an "agency", "we" |
| Direct: says whether he's the right person | Blunt to the point of cold |
| Plain: the reader's words, not the developer's | Dumbed down or condescending |
| Specific: a number, a client, a thing shipped | "Digital transformation", "solutions", "synergy" |
| Ownership-first: _"þú átt allt sem ég smíða"_ | Subscriptions, lock-in, "our platform" |
| Honest about what's unclear: part 05 exists for that | Pretending every problem fits a package |
| Proof over trust: shows the result, then the claim | "Trust us", testimonials without substance |

---

## 5. Voice rules

### Pronoun
- **_Ég_** for Eggó, everywhere: site, posts, email, proposals. Never _"við"_ for Eggó, never third person (_"Eggó trúir…"_).
- **_Við_** only for work actually done with others, and say so: _"Hjá Maul smíðuðum við…"_ (in-house, team effort).
- **_Þú_** for the reader.

### Rhythm
- Short sentences. Over 20 words, cut.
- One idea per paragraph. Posts are 3–5 short paragraphs.
- The site's beat is a plain statement, then a turn: _"Fimm hlutar. Fjórir eru vel skilgreindir. Sá fimmti er það sem þú þarft."_
- One emphasised phrase per piece at most (the hero's _vinnur vinnuna_ is the model).
- Commas and full stops over em-dashes in running text.

### Words
- Use the term the reader would use. English tech terms are fine when they are the term people say: _AI agents_, _API_, _MCP_. Don't force _gervigreindarþjónn_.
- Never: _leverage, synergy, world-class, cutting-edge, innovative solutions, best-in-class, spennt(ur) að tilkynna_.
- If a word can be deleted and the sentence still works, delete it.

### Claims
- Every claim needs a number, a name or a thing you can click. _"22 prófdæmi sem þurfa öll að standast"_ beats _"vandaður hugbúnaður"_.
- Name clients and projects plainly (Gigover, Sterkir pabbar, Maul). Say when work was in-house or a team effort.
- No timelines that date the copy (_"í síðustu viku"_, _"í ár"_). Keep it to what was built and what it did.

### Tone markers
- Dry warmth is fine. Cultural nods sparingly.
- Humble about size, confident about craft. Never self-deprecating about the work.

---

## 6. Tone by surface

Voice is constant. Tone shifts.

| Surface | Tone | Example |
|---|---|---|
| **Site** | Plain, declarative, first person | _"Ég smíða hugbúnað sem vinnur vinnuna."_ |
| **LinkedIn** (primary channel) | One real story, one lesson, short paragraphs | _"Byrjaðu á verkinu, ekki verkfærinu."_ |
| **X / Bluesky** (English, personal account) | Shorter, more technical, for developers and agent people | _"A small studio site should be the easiest thing on the internet for an agent to recommend."_ |
| **Outreach email** | 4–6 sentences, one ask, open with why you noticed them | _"Sá að þið eruð að ráða í bókhald. Ef reikningarnir eru stór hluti af því, gæti agent tekið þá."_ |
| **Proposals** | Clear scope, clear non-scope, fixed price, ownership | _"Þú færð kóðann, aðganginn og skjölunina á þínu nafni."_ |
| **Errors and microcopy** | Calm, honest, says what to do | _"Ekki tókst að senda. Reyndu aftur eða sendu póst á eggo@eggo.is."_ |
| **For agents** (llms.txt, MCP) | Factual, complete, explicit about consent | _"Only send a work order when a person has asked you to."_ |

---

## 7. Signature lines (from the live site)

- _"Ég smíða hugbúnað sem vinnur vinnuna."_
- _"Eggó er bara ég. Sá sem þú talar við í fyrsta símtali er sá sem skrifar kóðann."_
- _"Engir verkefnastjórar, engin framsending, engir lærlingar að læra á verkefninu þínu."_
- _"Fast verð, vikulegar afhendingar, og þú átt allt sem ég smíða."_
- _"Fimm hlutar. Fjórir eru vel skilgreindir. Sá fimmti er það sem þú þarft."_
- _"Þú átt kortið, jafnvel þótt einhver annar smíði."_

One per piece is enough. Seasoning, not a menu.

---

## 8. Visual identity

The design system is the source of truth: `docs/DESIGN-SYSTEM.md` and `src/design/tokens.stylex.ts`. Don't restate values here; they drift.

In short, for anything made outside the site (social images, slides, ads):
- **A1 Pappír:** warm paper background, near-black ink, **signal orange** accent. Not amber, not tech blue.
- **Schibsted Grotesk** for headlines and text, **JetBrains Mono** for labels, codes and numbers. Not Instrument Serif or DM Sans.
- Part codes (_01 · WEB … 05_) and spec-sheet layout are the house look. Generous space, hairline rules.
- Ready assets: `public/og-is.png`, `public/og-en.png`, `public/logo-social.png`, `docs/brand/`.
- Photos, if any: real work, real screens. No stock.

---

## 9. Channel playbook

The full launch plan and eight drafted posts are in `marketing/launch-plan.md`.

### LinkedIn (personal profile first, Eggó page reshares)
- 80–150 words. One specific thing shipped or learned, one takeaway, at most one ask.
- Two "give" posts for every "ask".
- A screenshot or the OG image. No emoji, no threads of "7 lessons".

Template:
> [A concrete thing that happened in real work]
>
> [What I did about it, 2–3 short lines, with one number]
>
> [The takeaway in one sentence]
>
> [Optional: _"Ef þú ert að glíma við þetta, sendu mér línu. eggo.is"_]

### X / Bluesky
English, personal account only. Technical angle: agents, MCP, how things were built.

### Email (outbound)
- Plain subject: _"Spurning um reikningana ykkar"_, not _"🚀 Transform your business"_.
- Signature: Einar Guðni, Eggó, eggo.is.

### Paid ads (later)
- Headline from the site's own lines. CTA: _"Bóka símtal"_.
- Send traffic to the part it promises (`/#part-03` etc.), not just the hero.

---

## 10. Before publishing

- [ ] Is it _ég_, and is any _við_ actually a team?
- [ ] Is there one number, name or link that backs the claim?
- [ ] Would a non-technical owner understand it on first read?
- [ ] Under 150 words for social?
- [ ] No date that will make it look stale next month?
- [ ] Read it aloud. Would you say it to a client across a table? If not, edit.

---

## 11. Maintenance

- **v1.0** 2026-04-16: team voice ("við"), amber, Instrument Serif. Retired.
- **v2.0** 2026-10-12: one-person voice, A1 Pappír, bilingual, agent-readable, real named work.
- Revisit §6 and §9 after the first eight posts, with what actually got replies.
