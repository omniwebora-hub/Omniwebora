# Preservation map (Gate 0)

Tags: **PROTECT** = keep visuals, timings and source; only targeted fixes. **ADAPT** = keep mechanism, change content/scope. **REPLACE** = rebuild per governance.

| Component / asset | Files | Tag | Notes |
|---|---|---|---|
| Hero plate, panels, logo-on-core, intro reveal | `src/components/hero/Hero.tsx`, `Hero.module.css`, `public/assets/cinematic/h00-*` | PROTECT | Copy-only edits allowed (lede, secondary CTA, factual strip) per content blueprint H01. Panel geometry, timings and art untouched. |
| Scroll film (H01 push-in) | `src/components/hero/HeroCinema.tsx`, `src/content/heroWorld.ts`, `src/content/cinematic.generated.ts`, `public/assets/cinematic/h01/**` | PROTECT | Scrub length, frame pipeline, camera-matched track, reverse behaviour unchanged. |
| Film hand-off (heading rising over last frame) | `ServicesShowcase.module.css` overlap rules | ADAPT | Mechanism kept; heading re-pointed to the six-capability chapter. |
| Services showcase sticky stage | `ServicesShowcase.tsx`, `ShowcaseObserver.tsx` | ADAPT | 4 → 6 capability chapters (brochure p.1/p.8 families). |
| Interface previews (HTML) | `src/components/previews/*` | ADAPT | Add Cloud & Integrations and Enterprise previews. |
| Closing pull-back (R01) | `FinalInquiry.tsx`, `PullbackMotion.tsx`, `r01-*` | PROTECT visuals / ADAPT copy | Copy → H10 ("Tell us what you're trying to build."), CTAs → contact + pricing. |
| Inquiry API, schema, transport, rate limit | `src/app/api/inquiry/route.ts`, `src/lib/inquiry/*` | ADAPT | Extend fields (situation, budget band, structured brief); keep honest 503. |
| Header search (⌘K) | `Header.tsx` | ADAPT | Keep search; add Solutions mega-menu and new IA. |
| Process timeline (5 phases) | `ProcessThread.tsx`, `src/content/process.ts` | REPLACE | Brochure has 7 stages. |
| Work concepts + "Case studies are on their way" | `WorkConcepts.tsx`, `HomeSections.tsx` | REPLACE | Concept Lab with live demos; `/work` dignified gateway. |
| "Why work with us" principles | `HomeSections.tsx` (`PrinciplesSection`) | REPLACE | Friction → connected workflow interaction. |
| `/services*` pages | `src/app/services/**` | REPLACE | `/solutions/*` with 301 redirects from old URLs. |
| `/process` | `src/app/process/page.tsx` | REPLACE | `/approach`, 301 redirect. |
| About, Contact pages | `src/app/about`, `src/app/contact` | REPLACE | Unique artefact desk; guided brief studio. |
| Logo (three-loop mark) | `public/brand/omniwebora-mark.svg`, `Logo.tsx` | PROTECT | Owner instruction: "The logo whatever is there already is fine." Brochure shows a different circular mark → logged as BRAND_APPROVAL_REQUIRED, not changed. |
| Higgsfield raw media | `assets/higgsfield/raw/` (gitignored) | PROTECT | Source of every shipped frame. |

## 2026-10-30: owner changed the hero brief
The owner asked for the hero to be redone ("clumsy, not giving the effect of a digital agency; keep the theme"). Kept: the atrium plate, the push-in film (H01), headline, CTAs, light. Changed: the four tilted service cards became six service nodes wired into the crystal core (`heroWorld.ts` `heroPanels`, `Hero.tsx`, `Hero.module.css`), the word on the core was removed (the mark stays), and the end of the push-in now hands its exact frame to the Home film (veil and mark fade out at the end; `HomeFilm.module.css` `.afterHero`). The closing pull-back is unchanged.
