# HANDOFF: Omniwebora website rebuild (read this first in a new session)

Last updated: 2026-10-29. Written so a fresh Claude Code session can continue without the previous chat.

## 0. Governing documents (in priority order)
1. `docs/governance/04_CLAUDE_CODE_GOVERNOR_MASTER_PROMPT.md`: the current master contract (gated: baseline → content lock → design → Higgsfield → build → SEO/a11y → QA → delivery).
2. `docs/governance/01_SOURCE_TRUTH_AND_DECISION_REGISTER.md`, `02_FINAL_CONTENT_AND_SITEMAP.md`, `03_MOTION_AND_VISUAL_SYSTEM.md`, `05_SCREENSHOT_AUDIT_AND_ACCEPTANCE_MATRIX.md`.
3. Earlier directives (superseded where they conflict): `docs/handoff/MASTER_CLAUDE_CODE_PROMPT.md` (Higgsfield hero rebuild) and the user's "critical creative direction correction" (restrained, credible, 80% architectural/editorial, 20% tech motion; no sci-fi). Oldest brief archived in `docs/handoff/archive/`.
4. Source of business truth: `reference/brochure/omniwebora_brochure_8pages.pdf` (rendered pages in `reference/brochure/pages/page-1..8.png`). Visual target: `reference/02_INTENDED_TARGET.png` (= `reference/target_hero/*`). Failed old hero: `reference/01_CURRENT_FAILED_RESULT.jpg`.
5. Owner instructions given in chat: **"The logo whatever is there already is fine"** (keep the three-loop mark; do not switch to the brochure's circular mark). Use **Higgsfield only** (no MuAPI). Never invent clients, metrics, testimonials, contact details. Preserve the approved hero, scroll film and closing pull-back.

## 1. Stack and commands
- Next.js 16.4.3 (App Router, Turbopack, static generation), React 19.3, TypeScript, CSS Modules, GSAP 3.15 (ScrollTrigger), Zod 4. Runtime deps: `gsap next react react-dom zod` only.
- Tests: Vitest (`tests/unit`), Playwright + axe (`tests/e2e`, runs `next start -p 3100` itself; needs `npm run build` first).
- Commands: `npm run dev` (3000) · `npm run build` · `npm start` · `npm run typecheck` · `npm run lint` · `npm test` · `npx playwright test`.
- Launch configs (`.claude/launch.json`): `omniwebora-dev` (3000), `omniwebora-prod` (`npm start -p 3200`). Use `preview_start` with these names; stop the prod server before `npm run build` (Windows file locks).
- QA scripts: `node qa/film.mjs [url] --sizes=1440x900 --steps=0.2,0.5,1 [--scan] [--reduced] --tag=x` (hero/film/scan screenshots) and `MSYS_NO_PATHCONV=1 node qa/shoot.mjs [url] --routes=/,/pricing --sizes=1440x900,390x844 --full --tag=x` (all routes; **MSYS_NO_PATHCONV=1 is required in Git Bash**). Screenshots → `qa/screenshots/` (gitignored).
- Lighthouse is installed only in the session scratchpad (not the repo). To re-run: `npm i lighthouse@13` in a temp dir; `CHROME_PATH` = Playwright chromium (`~/AppData/Local/ms-playwright/chromium-1248/chrome-win64/chrome.exe`). Reports go to `qa/lighthouse/*-final.report.{json,html}`.
- ffmpeg is not installed globally; for asset work install `ffmpeg-static` in a temp dir and pass `FFMPEG=<path>` to `scripts/cinematic/build_assets.py`.
- Git: branch `master`, **no commits yet**. Nothing has been committed, pushed or deployed. Do not commit unless the user asks.

## 2. Phase 1: hero rebuild (DONE, user-approved, PROTECT)
- Higgsfield (claude.ai MCP connector, tool prefix `mcp__7185dc62-...__`) generated:
  - H00 hero keyframe (GPT Image 2.5, job `a4c1fd66-3fbd-4f9c-a919-c51ccb7a6bab`), R01 pull-back (`0a40cbcc-643a-43a1-9bc4-972d5b166eb9`), D01 colonnade (`e0b0bcfa-0896-4389-97e6-95c52c8616bc`), A01 studio table for About (`6a9896a2-232b-461e-bbea-21d13dcd67b9`).
  - H01 push-in video (MiniMax H3, `2608f30c-c7cb-49d0-803a-fe1fb193a555`, accepted). Rejected: Kling dolly (`877879d3-…`, cube geometry drift) and Kling idle loop (`b224cf86-…`, camera panned).
  - Uploaded target reference media id `97522e60-52fe-4929-b094-c6db5bf7111c`. Credits: ≈ 600 → ≈ 549 (all cheap stills + three ~10-credit clips).
- Raw downloads: `assets/higgsfield/raw/` (gitignored, re-downloadable). Pipeline: `scripts/cinematic/build_assets.py` → `public/assets/cinematic/*.webp`, 56-frame sequence `public/assets/cinematic/h01/{lg,md}/fNNN.webp`, and `src/content/cinematic.generated.ts` (per-frame cube track).
- Hero implementation: `src/components/hero/Hero.tsx` (+ `Hero.module.css`): cover-fitted 16:9 "plate" computed with container units; logo on the cube core is real SVG; four glass panels positioned relative to the tracked cube (`src/content/heroWorld.ts`); CSS-only intro reveal (LCP-safe "dawn" overlay instead of a filter on the LCP image). `HeroCinema.tsx`: GSAP ScrollTrigger scrubs one timeline over the sticky hero (`--film-length: 115vh`), canvas frame sequence with adjacent-frame cross-blend, camera-matched logo + panels, staged frame loading (coarse frames after load, the rest on first scroll), pointer parallax, `data-film`, `data-frames`, `data-progress` attributes for tests. Film only for `(min-width:1024px) and (min-aspect-ratio:5/4) and (prefers-reduced-motion:no-preference)`; mobile = stacked layout with portrait crop.
- Film hand-off: the section after the hero (`ServicesShowcase`) has a negative top margin in film mode so its heading rises over the last frame.
- Closing scene: `src/components/sections/FinalInquiry.tsx` + `PullbackMotion.tsx` (R01 image, scrubbed scale-down).
- Fonts: Newsreader display cut self-hosted (`src/app/fonts/newsreader-display-500-latin.woff2`, 24 KB, OFL in `src/app/fonts/Newsreader-OFL.txt`), Hanken Grotesk via next/font/google.
- Phase 1 measured (before Phase 2 changes): Lighthouse desktop home 95 (LCP 1.46 s, TBT ~0, CLS 0); mobile home 86 (LCP 4.06 s simulated, TBT ~75 ms, CLS 0); interior 93–95; a11y 100. e2e 47/47 at that time.

## 3. Cleanup already done (audited, project-local only)
Inventory with byte sizes: `reports/removed_inventory.txt`. Summary:
- Removed the failed R3F engine (`src/components/3d/*`, old HeroStage/HeroFallback/PanelVignette, `lib/heroStore.ts`, `lib/quality.ts`) and deps `three @react-three/fiber @react-three/drei @react-three/postprocessing postprocessing @types/three`.
- Removed MuAPI: `.mcp.json` (only had muapi), `scripts/launch-claude-with-muapi.ps1`, `MUAPI_KEY` from `.env.example`. **NOT removed (secrets, user must act): a plaintext MuAPI key in `.claude/settings.local.json` and `.env.local` → tell the user to revoke/rotate it and delete those lines.**
- Removed obsolete QA probes (`qa/interact.mjs`, `probe.mjs`, `states.mjs`), old Lighthouse reports and screenshots, superseded docs (`docs/design-direction.md`, `interaction-storyboard.md`, `asset-manifest.md`, `qa-report.md`).
- Phase 2 removals: old `/services*` and `/process` routes, `InquiryForm`, `ContactForm`, `HomeSections`, `ProcessThread`, `WorkConcepts`, `illustrations/*` (ServiceArt, ConceptArt), `content/services.ts`, `content/process.ts`, `content/work.ts`, `PreviewFrame`. 308 redirects added in `next.config.ts` for old URLs.

## 4. Phase 2: governance rebuild (IMPLEMENTED; QA IN PROGRESS)
### Gate docs written
`reports/BASELINE_AUDIT.md`, `reports/PRESERVATION_MAP.md`, `reports/CONTENT_DECISIONS.md`, `content/FACT_REGISTER.md` (F01–F26 with brochure page refs), `content/CONTENT_MATRIX.md`, `design/EXPERIENCE_SYSTEM.md`, `design/ROUTE_STORYBOARDS.md`.

### Content layer (`src/content/`)
- `solutions.ts`: six families (`web-development`, `mobile-apps`, `custom-software`, `ai-automation`, `cloud-integrations`, `enterprise-platforms`) with H1, lede, needs, brochure capabilities, scope questions, FAQs, CTA, `inquiry` value, `preview` kind; `heroCategories` (the 4 hero labels from the approved design); `brochureServices` (22 lines, p.6); `evolution` (p.3).
- `pricing.ts`: all 13 tiers exact (p.2 web ×6, p.5 software ×3, p.4 enterprise ×4), `enterpriseMatrix` (17 rows), `PRICE_DRIVERS` (p.7), `PRICING_DISCLAIMER` (p.8, verbatim), `formatInr`/`formatBand` (Indian grouping: ₹1,00,000; lakh notation). Only legible inclusions; `withheld` counts garbled bullets.
- `approach.ts`: seven stages Discover→Scale (p.7) with typical deliverables and artefact kind.
- `industries.ts`: 6 contexts (professional services marked as editorial proposal; healthcare caution).
- `principles.ts`: 4 proposed principles (About). `navigation.ts`: Solutions (mega) · Industries · How We Work · Work (Work, Concept Lab) · Pricing · About + "Start a Project". `searchIndex.ts`, `site.ts` (`brochureTagline: "Innovate. Build. Transform."`).

### Routes (all static except `/api/inquiry`)
`/` · `/solutions` · `/solutions/[slug]` ×6 · `/industries` · `/approach` · `/pricing` · `/work` · `/concept-lab` · `/about` · `/contact` · `/thank-you` (noindex) · `/privacy` (draft, noindex) · 404.

### Components (each route has its own signature interaction)
- Home (`src/app/page.tsx`): Hero (protected) → `ServicesShowcase` (now 6 solutions, heading "What can we build together?") → `home/HomeChapters.tsx`: `FrictionChapter` (WorkflowShift slider: disconnected→connected), `EvolutionChapter` (EvolutionSelector), `IndustriesChapter`, `ConceptChapter` (live ApprovalDemo), `ProcessChapter` (StageExplorer compact), `InvestmentChapter` (ScopePicker) → `FinalInquiry` (protected visual; CTAs "Start Your Project" / "Explore Pricing").
- Solutions: `solutions/CapabilityMap.tsx` (+ `GoalFilter`), `SolutionTemplate.tsx` (shared lower sections; tone light/dark), `ResponsiveBrowser` (web), `PhoneJourney` (mobile), `ModuleConsole` (software), `AutomationRunner` (AI, dark), `TopologyMap` (cloud, dark), `LayerExplorer` (enterprise); `pricing/TierList.tsx` on web/software/enterprise pages.
- Pricing: `pricing/PricingDesk.tsx` (tablist tracks, all tiers in HTML, `#websites|#software|#enterprise` deep links, enterprise matrix), `pricing/ScopeGuide.tsx` (rule-based match to brochure tiers, never a computed price; hands summary to contact via `sessionStorage["omni:scope"]` and `/contact?from=pricing`), FAQPage JSON-LD.
- Concept Lab: `demos/CommerceDemo.tsx`, `BookingDemo.tsx`, `ApprovalDemo.tsx` (shared `demo.module.css`, `labs.module.css`), each labelled "Illustrative demonstration · Not client work", with Reset.
- Approach: `approach/StageExplorer.tsx` (7-stage rail, HTML artefacts, arrow keys).
- About: `about/ArtefactDesk.tsx` on the A01 studio-table still (4 artefacts ↔ 4 principles), 22-line capability index, stages, audiences.
- Industries: `industries/IndustryWorkstation.tsx`.
- Contact: `contact/BriefStudio.tsx` (steps: need → situation/timing/budget → details → review; live summary aside; prefill from `?service=` incl. legacy values and from the scope guide; posts JSON to `/api/inquiry` with `brief` summary; navigates to `/thank-you` only on `res.ok && body.ok`; otherwise shows the server message, e.g. 503 `transport_unconfigured`).
- Shared: `lib/tabKeys.ts` (arrow-key tabs), header mega-menu (`layout/Header.tsx`, closes on Escape/outside click/route change), footer (`layout/Footer.tsx`).
- Inquiry backend extended: `lib/inquiry/options.ts` (8 services, situations, timelines, brochure budget bands, `SHOW_BUDGET_FIELD = true`), `schema.ts` (+`situation`, `brief`), `transport.ts` (brief in email, escaped). Still honest 503 when no transport env vars.
- Analytics events (no provider configured): `nav_service_click`, `pricing_track_select`, `scope_guide_complete`, `contact_start`, `contact_submit_success`, `demo_open`, `project_cta_click`, plus legacy ones (`src/lib/analytics.ts`).

### Verified so far in Phase 2
- `npm run build` ✓ (23 static pages), `tsc` ✓, `eslint` ✓, unit tests 33/33 ✓.
- `qa/shoot.mjs` on all 17 routes at 1440×900 and 390×844: one H1 each, no horizontal overflow, no console/HTTP errors. Full-page screenshots: `qa/screenshots/g1-*` (**not yet visually reviewed**).
- Playwright: 63 passed, **9 failed**, 8 skipped (device-specific). Failing (seen): contact brief "no fake success" flow (desktop+mobile), pricing scope-guide → contact hand-off (desktop+mobile), axe on `/about` (mobile); four more not captured in the truncated output. Status of the fixes is tracked in §6.

## 5. Open items for the owner (do not invent)
Final logo approval (brochure circular mark vs site three-loop mark; user currently says keep site mark) · legal name, email/phone/address, domain · whether brochure prices and plan names are current, GST/hosting/domain inclusion · approved case studies/testimonials · mailbox/CRM for enquiries (`RESEND_API_KEY` + `INQUIRY_TO_EMAIL` + `INQUIRY_FROM_EMAIL`, or `INQUIRY_WEBHOOK_URL`) · approved privacy text (`site.privacyPolicyApproved`) · `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_ALLOW_INDEXING=true` on the production domain only · rotate the exposed MuAPI key.

## 6. Progress log (append below)
- 2026-10-29: Handoff written. Next: diagnose and fix the 9 failing e2e tests → visual review of `g1-*` screenshots and fixes → Lighthouse on new routes → write Gate 7 reports (`DELIVERY_SUMMARY`, `CONTENT_APPROVAL_CHECKLIST`, `ASSET_AND_MODEL_CLEANUP`, `SEO_AUDIT`, `PERFORMANCE_AUDIT`, `FORM_DELIVERY_TEST`, `BROWSER_VISUAL_QA`) and `assets/ASSET_MANIFEST.md`; update README and CLAUDE.md.
- 2026-10-29 (later): Fixed the 9 e2e failures. 4 were test bugs (clicking text spans that sit under transparent radio/checkbox inputs → now `getByRole(...).check()`; a `role="alert"` locator that also matched Next's route announcer → filtered by text). 5 were real a11y defects: white-on-gold annotation chips (now #7a5b28) on /about and /approach artefacts, and horizontally scrolling tables without keyboard access (now `tabIndex=0 role="region" aria-label`) on /solutions, /pricing, /solutions/enterprise-platforms and the booking demo. Also fixed: navy-on-navy header on the dark pages (/solutions/ai-automation, /solutions/cloud-integrations added to `DARK_HERO_ROUTES` in Header.tsx). Result: build ✓, tsc ✓, eslint ✓, unit 33/33, e2e all passing (8 device-specific skips). Visual review of all routes at 1440 and 390 done (contact grids in `qa/screenshots/g1-top-grid*.jpg`, `g1-mobile-grid.jpg`).
- 2026-10-29 (later): Lighthouse fixes: contact CLS 0.241 → 0 (BriefStudio server-rendered as the Suspense fallback; URL prefill via `BriefStudioFromUrl`); home weight 994 → 713 KiB (`cv-auto` on new home chapters, lighter evolution background); heading-order fixed on /approach and /solutions. Scores: interior mobile 99–100, home mobile 83–86 (LCP ≈ 4.1 s simulated), home desktop 93–96. e2e 72 passed / 8 skipped; unit 33/33. NEW: `qa/form-delivery.mjs` proves real delivery through a local webhook (success → payload incl. structured brief → /thank-you; webhook 500 → honest error). Next: Gate 7 reports + asset manifest + README.
- 2026-10-29 (final for this session): Gate 7 delivered. Written: `reports/DELIVERY_SUMMARY.md`, `CONTENT_APPROVAL_CHECKLIST.md`, `ASSET_AND_MODEL_CLEANUP.md`, `SEO_AUDIT.md`, `PERFORMANCE_AUDIT.md`, `FORM_DELIVERY_TEST.md`, `BROWSER_VISUAL_QA.md`, `assets/ASSET_MANIFEST.md`; README, CLAUDE.md and `docs/architecture.md` rewritten; stale docs corrected. Titles shortened to ≤ ~60 chars. Final build: build ✓, tsc ✓, eslint ✓, Vitest 33/33, Playwright 72 passed / 8 skipped / 0 failed, `qa/form-delivery.mjs` 2/2. Higgsfield balance 555.

## 7. Where to pick up next
1. Owner items in `reports/CONTENT_APPROVAL_CHECKLIST.md` (logo files, contact/legal, domain, price confirmation, privacy text, mailbox/CRM, MuAPI key rotation). When answers arrive: edit `src/content/site.ts` / `pricing.ts` and flip the `verified` / `confirmed` flags; set env vars; re-run all tests.
2. Optional performance work if field data shows mobile home LCP > 2.5 s (see `reports/PERFORMANCE_AUDIT.md` "next steps").
3. Cross-browser check on real Safari/iOS and Firefox (only Chromium was available).
4. Commit (only when the user asks): suggested first commit includes everything except gitignored raw media/screenshots/lighthouse HTML.


### 2026-10-29: Phase 3 Solutions pilot (IMPLEMENTED, awaiting owner review)
- Plan: `design/IMMERSIVE_PLAN.md` §7–§9 (§9.1 is the as-built chapter table).
- Higgsfield: 3 keyframes (S00/S01/S02, GPT Image 2.5 4K) and 2 clips (S10/S11, MiniMax H3), all accepted first time with no retries. Balance went from 555 to 518.25, so **36.75 credits** were used. Ledger: `assets/ASSET_MANIFEST.md`.
- Code:
  - `src/components/film/SolutionsFilm.tsx`: sticky stage, chapters, dolly, steps.
  - `src/components/film/frames.ts`: FrameSet.
  - `src/components/film/FlatOnly.tsx`: `useFilmMode` and the mobile fallback.
  - `src/app/solutions/page.tsx` and `chapters.module.css`.
  - `scripts/cinematic/build_film.py` writes `src/content/film.generated.ts`.
  - `ResponsiveBrowser` and `ModuleConsole` gained `embedded` and controlled props.
- QA:
  - `node qa/solutions-film.mjs` scrubs forward and back at 1440×900, 1100×760, 1920×1080 and 390×844, plus `--reduced`. It reports no console errors, no 4xx and no overflow.
  - `node qa/solutions-interact.mjs`: the wall UIs are clickable, the user override works, and the `#business-software` deep link and refresh land on the lit console.
  - Screenshots are in `qa/screenshots/solutions/`.
- Tests: `npm run check` green (tsc, eslint, Vitest 33/33, build); Playwright 72 passed / 8 skipped.
- NOT done (waiting for pilot approval): the other four solution rooms, the Home 5-beat narrative, the other wings and nav transitions.

### 2026-10-29: Phase 3 / Gate 1 performance and Gate 3 start (IN PROGRESS, session hit its usage limit)
Owner feedback: the hero is smooth; Solutions had small jumps at the room joins, and the interface "pops" onto the board.

**Root causes (measured, not guessed):**
- Earlier QA ran on SwiftShader (software rendering). Real Chrome on this laptop uses the Intel UHD iGPU (`qa/perf/gpu-check.mjs`).
- v0 drew the raw scroll position with no easing (the hero uses GSAP `scrub: 0.6`). Its 64 sparse frames gave visible steps.
- Chrome kept re-decoding discarded `<img>` frames: 1.2–1.8 s of `Decode LazyPixelRef` per run, worst frames 66–83 ms (`qa/perf/results/v0-baseline-*.json`).
- The join flash: a timed 0.35 s still crossfade showed the previous room. The CDP screencast captured it (`qa/perf/joins_solutions_motion_before/strip-enter-web.png`).
- Other GPU-side stalls: hardware decoder start-up and first upload of each 2560px still.

**Fixes (built, running on :3200):**
- `src/components/film/engine.ts` (FilmEngine) runs one eased rAF loop (τ 0.16 s) that idles when settled. It caches layout, writes styles only on change, and never re-renders React per tick.
- Camera moves now use short-GOP H.264 scrubbing at 158 frames per clip: `v1600.mp4` / `v1280.mp4`, CRF 25, keyint 8, from `build_film.py`. `qa/perf/seek-bench.mjs` measured ~5 ms p50 seeks on the Intel iGPU. `?engine=frames` gives the ImageBitmap windowed fallback.
- Media loads one segment at a time in idle time and is released when distant. Stills use srcset plus `will-change: opacity`.
- Joins are fully scroll-driven. The still is swapped while the clip covers it; the interface fades in over the first 5% of a hold; the dolly runs 5–30% in and 72–95% out. Camera-move chapters went from 135 to 170svh.
- Verified with `qa/perf/join-check.mjs --motion` plus `join_diff.py`: there is no flash at either join after the fix (`qa/perf/joins_solutions_motion_after/strips.png`).
- The full benchmark matrix (1920/1440/1100, CPU 4×, cold cache, headed 128 Hz, frames vs video) was still running into `qa/perf/results/*.json` and `matrix.log`. Ignore `v0-baseline-*-headed.json`: it ran on the new build.

**Gate 3 (six rooms): generated so far** (reference = H00 plus a room still):
- Keyframes accepted (GPT Image 2.5, 4K), saved in `assets/higgsfield/raw/`:
  - S03 Mobile niche `24a8e902-d7b8-4748-97ab-317aa95f34bc`
  - S04 AI study `ec18cd04-2cb0-4046-9732-ffb4ea8753d2`
  - S05 Cloud glass room `3ef46034-f16c-4af2-909f-4933e7757799`
  - S06 Enterprise mezzanine `2541bc16-25c7-4131-9adb-60ebd65d66bc`
- Clips submitted (MiniMax H3, 6 s; download with `jobs_wait`):
  - web→mobile `c74608e8-ad32-42a2-9b15-95f055440893`
  - mobile→ops `a383fef7-f45f-4641-8b32-4043e8d44047`
  - ops→ai `7010091e-31a8-4a92-bac0-a403e52bf6dd`
- NOT yet submitted (rate limit 429; max 3 concurrent): ai→cloud (start S04, end S05, truck right past the bookshelf) and cloud→enterprise (start S05, end S06, crane up to the mezzanine).
- New room order: Websites → Mobile → Business software → AI → Cloud → Enterprise. S11 (web→ops) is superseded.

**Next:**
1. Download the clips and add the segments to `build_film.py`.
2. Add embedded and controlled-step props to PhoneJourney, AutomationRunner, TopologyMap and LayerExplorer, like ModuleConsole.
3. Turn SolutionsFilm into a ROOMS config and add the per-room copy.
4. Point the nav mega-menu at the room anchors: `/solutions#websites`, `#mobile-apps`, `#business-software`, `#ai-automation`, `#cloud-integrations`, `#enterprise-platforms`.
5. Then Gates 4–10 (Home, Industries, Concept Lab, Pricing, About, Contact).

### 2026-10-29 (later): owner facts, six-room gallery, performance, display interfaces
**Owner facts applied** (`content/FACT_REGISTER.md` O01–O05):
- Six services only: Digital Marketing added, Cloud removed, AI renamed Business Automation, with redirects for the old slugs.
- No currency anywhere. A unit test enforces this outside the fictional demo shops.
- Website plans are Basic / Standard / Premium, details pending, in `src/content/pricing.ts` and `components/pricing/PlanBoard.tsx`.
- The brief's "plan in mind" replaces budget bands.
- `/work` is deleted and redirects to Concept Lab. The nav is Solutions · Industries · How We Work · Concept Lab · Pricing · About.
- Home is slimmed to hero → services → stages → closing.
- How We Work has a personalised `JourneyPlanner` covering business model × wants → seven stages → brief.

**Gate 1 performance** (Intel UHD iGPU, which real Chrome uses here; earlier QA was SwiftShader):
- Engine `src/components/film/engine.ts`, eased τ 0.16 s.
- Short-GOP H.264 scrubbing, `v1600`/`v1280` per segment, 158 frames, CRF 25, keyint 8.
- Media is prepared in idle time and released when distant.
- Joins are scroll-driven; there are no timed fades, which were the "jump" the owner saw.
- Interfaces on the walls never scroll themselves, so the wheel always moves the page.
- Measured on six rooms:
  - Slow pass: 0.5–0.8% frames over budget.
  - Fast pass: 0.2%, zero long animation frames.
  - Reversal: 0.2%.
  - Image decode during scroll fell from 1.8–2.4 s to 0.08–0.3 s.
  - Seeks: p95 6.6 ms.
  - Zero blank or fallback frames.
  - Decoded media stays at or under 41 MB.
- Tools:
  - `qa/perf/scroll-bench.mjs`
  - `seek-bench.mjs`
  - `join-check.mjs --motion` + `join_diff.py`
  - `wheel-over-screen.mjs`

**Solutions gallery** (`src/components/film/SolutionsFilm.tsx`, `src/content/gallery.ts`, `src/app/solutions/page.tsx`):
- Order: gallery entrance → Websites → Mobile (redesigned smartphone S03b) → Custom software → Business automation (S04) → Digital marketing (S07 campaign studio) → Enterprise (S06 mezzanine) → finale out to the terrace (S08, clip S17).
- In the finale, the facade's six lit windows are links back into the rooms.
- Display interfaces live in `src/components/displays/` (WebDisplay, PhoneApp, OpsDisplay, FlowDisplay, CampaignDisplay, PlatformDisplay). They are designed at display resolution with general, any-business content.
- The detail pages and the mobile layout keep the full demos in `src/components/solutions/*`.
- Rebuild only changed clips with `ONLY=id1,id2 FFMPEG=… python scripts/cinematic/build_film.py`.

**Higgsfield job IDs (this phase):**
- Keyframes:
  - S03 `24a8e902` (superseded)
  - S03b `694c932f`
  - S04 `ec18cd04`
  - S05 `3ef46034` (unused: cloud removed)
  - S06 `2541bc16`
  - S07 `2e575f4b`
  - S08 `46a477a5`
  - S08n `3d87175e`
  - H02 `1c281dee`
  - P01 `48ecb4a2`
  - P02 `73740f1f`
  - P03 `93dbc900`
  - L01 `362a692d`
  - C01 `04e08202`
- Clips:
  - S12 `c74608e8`, S13 `a383fef7` (superseded)
  - S12b `317bcd90`, S13b `4e2e35a0`
  - S14 `7010091e`
  - S15 `e4afc822`
  - S16 `da49600a`
  - S17 `bc64a134`
- Balance went from 437 to about 366 before the Pricing/Contact images.

**Next:** Home film (H02 product wall + facade + S08→S08n time-of-day), Pricing scope atelier (P01→P02→P03), Concept Lab overhead studio (L01), Contact pavilion (C01), then Industries and About.

### 2026-10-29 (evening): every page cinematic; owner revisions
**Owner revisions applied:**
- Content on every display is general (any business). The fictional brands and one-sector examples are gone.
- The phone room was regenerated as an unmistakable smartphone (S03b plus clips S12b/S13b).
- Every board now runs a purpose-built interface for its device (`src/components/displays/*`).
- Legibility pass: all chapter copy sits on solid cards (no text on imagery). Sizes and contrast went up, and the displays use the site's Hanken Grotesk.
- Concept Lab is removed: route, nav, footer, sitemap and the demo components. `/concept-lab` and `/work` redirect to `/solutions`.
- Pricing: Basic / Standard / Premium apply to Website only. Every other service shows "Quoted on your requirements" cards, built from that service's scope questions.
- "Start a Project" is now "Contact Us" everywhere, including the protected hero's button label.
- Solutions menu: a 3×2 grid with a thumbnail of each room. Every item opens its exact room (`/solutions#slug`). "Walk the gallery from the start" scrolls to the top even when you are already on /solutions.
- Landing hero is slower and smoother: film length 115vh → 175vh, GSAP scrub 0.6 → 1.1.

**Pages built on the reusable `CinemaFilm`** (`src/components/film/CinemaFilm.tsx`: blocks + clips + stills + plate-space overlays, `data-show` fades, `dolly` / `dollySteps` / `frame`):
- Home (`components/home/HomeFilm.tsx`):
  - hero end → through the glass core (H10) → product wall (one booking #1042 across phone, tablet and wide schedule; storyboard strip)
  - → out to the terrace (H11), where the six lit windows link to the rooms
  - → sunset to night (H12) while the seven stages advance
  - → protected FinalInquiry
- Pricing (`components/pricing/PricingFilm.tsx`):
  - the scale model grows Basic → Standard → Premium (P01, P10, P11), with plan cards and a scale indicator
  - then PlanBoard (other services quoted on requirements), scope guide and FAQ
- Contact (`components/contact/ContactFilm.tsx`): terrace → along the terrace at dusk (C10) → the brief card beside the lit pavilion.
- Industries (`components/industries/CityFilm.tsx`, uses FilmEngine directly):
  - a 2.5D pan across a 21:9 dusk city panorama (I01)
  - six district markers, each with an example-use-case card
- About (`components/about/StudioFilm.tsx`): top-down drafting table (A10). Discovery notes, then a pencil wireframe on the paper (multiply blend), then the live booking screen on the tablet.

**QA:**
- `node qa/page-film.mjs <base> / /pricing /contact /industries /about`. Set `MSYS_NO_PATHCONV=1` in Git Bash.
- 0 console errors / 4xx on every page.
- Unit tests 33/33.
- Playwright: all pass after the Home showcase test was replaced with a Home-film test.

**Higgsfield (this round):**
- Keyframes:
  - S03b `694c932f`, S08 `46a477a5`, S08n `3d87175e`
  - H02 `1c281dee`
  - P01 `48ecb4a2`, P02 `73740f1f`, P03 `93dbc900`
  - L01 `362a692d` (now unused)
  - C01 `04e08202`, I01 `7e0ad822`, A10 `3391be01`
  - Uploaded hero end frame: media `3b1d617b`
- Clips:
  - S12b `317bcd90`, S13b `4e2e35a0`, S17 `bc64a134`
  - H10 `13c98689`, H11 `22405644`, H12 `94769c42`
  - P10 `a4cb7781`, P11 `b7c4dfd4`
  - C10 `0894ebdf`

**Pending from the owner:**
- Website plan inclusions (Basic / Standard / Premium).
- Company details: location, contact email, legal name.
- Confirmation of the Digital Marketing capability lines.

### 2026-10-29 (late): owner feedback on legibility, menu, About
- **No boxes over scenes.** Film chapter copy is minimal: kicker, title, one story line ("On the wall" / "On the table") and the action. It is white type on a soft left-edge shade (`chapters.module.css` "Minimal chapter copy").
  - Closing texts over the pool (Solutions finale, Home services) use dark ink with a light halo and a shapeless glow, kept below the window labels.
  - Gold-on-image kickers are gone.
  - The Contact brief stays a white card (it is a form).
- **Solutions mega-menu:** `.nav ul { display:flex }` was overriding the grid. It is now a 3×2 grid with each room's picture above its name; every item goes to `/solutions#slug`.
- **Website wall:** the phone is centred and the enquiry card sits to its right.
- **About** is now continuous: studio worktable (A01) → clip about-in (`85d672fc`) → top-down drafting table with sketch → app → clip about-out (`f1256b5c`) → dusk pavilion with a "Contact us" invitation.
- **Industries cards:** the same minimal treatment, showing two module lines.

### 2026-10-30: finished the owner's open feedback, How We Work film, page transitions (session 4)
The owner's instructions were recovered from the previous transcript (`~/.claude/projects/…/2aba53c0-….jsonl`, user turns and queued messages). Done this session:

**Owner feedback, verified in screenshots at 1440×900 (`qa/page-film.mjs`, `qa/spot-shots.mjs`):**
- **No boxes over scenes.**
  - The left-edge shade behind chapter copy (`chapters.module.css` `.panelWrap::before`) is now feathered top and bottom. Before, its straight edges showed as a dark box sliding in and out between chapters.
  - Home "Beyond launch" was a dark card. It is now white type on a feathered shade (`HomeFilm.module.css` `.nightWrap`).
- **Copy no longer crosses the scenes.**
  - Chapter copy fades with its chapter: in over the last 60% of entry, out over the first 30% of exit. The fade uses CSS scroll-driven animations: `view-timeline: --chapter` on `.hold`/`.outro`, and keyframes `chapterCopy`/`homeCopy`.
  - It is wrapped in `@supports (animation-timeline: view())`. Without that support the copy simply scrolls, as before.
  - This fixed "Six services, one building" sliding over the window labels, and similar overlaps on every film page.
- **The camera never frames past the edge of a plate.**
  - `CinemaFilm` `zoomTo` now clamps the camera position. A grey band had appeared on About when the camera pushed in to the paper.
  - About's drafting-table chapter has its own `frame`, so the sketch sits clear of the copy.
  - The About tablet's empty lower half now shows a booking summary (`IdeaWall.tsx` `IdeaTablet` step 3).
- **Industries pan bug.** The panorama was allowed to pan 30% of the viewport beyond its left edge, showing the navy background. The pan is now clamped at the edge.
  - The card takes the side away from its district, set through `data-side` on the film root. The shade follows the card.
- **No blink at hold-to-hold joins.** `CinemaFilm` now carries an overlay across a join when it was already showing in the previous hold.

**How We Work is cinematic ("the planning table").** Built from the unused Higgsfield still L01 (top-down glass table, two tablets and a laptop). No new generation was needed.
- Chapters, all film-only except the first: `table` (wide), `trade` (push to the left tablet: what you do), `wants` (laptop: up to three), `stages` (right tablet: the seven stages written for your business, advancing with the scroll), `send` (wide, with a CTA).
- The table and the full planner below share one selection:
  - `src/content/planner.ts` holds TRADES, WANTS and `planFor()`.
  - `src/components/approach/plannerState.tsx` holds `PlannerProvider`, `usePlanner` and `useSendPlan`.
- The full planner, `JourneyPlanner`, now uses both. On phones and with reduced motion the page is the intro plus the full planner.
- Files: `src/components/approach/PlanFilm.{tsx,module.css}`, `src/app/approach/page.tsx`.
- QA: `node qa/plan-table.mjs` runs choose → plan → shared planner → brief hand-off. **7/7 PASS.**

**Page transitions.**
- `<ViewTransition default="page">` from React 19.3 wraps the page content in `layout.tsx`.
- The page you leave fades and eases slightly forward (260 ms). The next fades in (420 ms).
- The header is its own transition layer, so it stays on top.
- Reduced motion turns the transition off. Browsers without the API swap the page as before.
- **Bug fixed along the way.** `<html>` lacked `data-scroll-behavior="smooth"`, so Next's scroll-to-top on navigation ran as a smooth scroll and overshot: pages opened 1000–5500 px down. The attribute is now set.
- QA: `node qa/route-transitions.mjs` checks four nav hops, back, and the mega-menu deep link. **PASS:** every page opens at 0 and a transition ran each time.

**Tests:**
- build ✓, tsc ✓, eslint ✓, Vitest 33/33.
- Playwright: **68 passed / 8 skipped / 0 failed**, including axe on every route.
- The site-search e2e test now retries Ctrl+K until hydration; the shortcut works, but the test pressed it too early.
- `qa/shoot.mjs`: all 10 routes at 390×844 and 1440×900 have one H1 and no overflow.

**Scroll benchmark** (`qa/perf/scroll-bench.mjs`, Intel iGPU):
- /approach: frames over budget 0.1% / 0% / 0.1% (slow, fast, reverse); no LoAF.
- /about: 0.8% / 0.9% / 0.5%; 1–2 non-blocking LoAFs; 0 blank or fallback frames.

**Higgsfield (important for the next session).**
- The connector that generated everything (tool prefix `mcp__7185dc62-…`, with generate_image, generate_video and jobs_wait) was **not attached** to this session.
- The connector that was attached, "Higgsfield AI" (`claude-mcp.higgsfield.ai`, prefix `mcp__00515886-…`), can only import Claude Motion videos and read the balance. It cannot generate.
- The owner turned a connector on mid-session. Connector changes load on the next turn, so check `session_connectors_status` first.
- Balance: 246.25 credits.

**Next:**
1. If generation is available, give How We Work its own establishing shot and one camera move into the table. Keep the same chapters; the clip goes in as a `seg` before `trade`.
2. Contact "C4" (owner directive phase 2): subtle scene feedback as the brief fills in. Not built.
3. Owner items are unchanged (`reports/CONTENT_APPROVAL_CHECKLIST.md`): website plan details, company details, Digital Marketing lines, mailbox.

### 2026-10-30 (later): owner review: hero, transitions, text motion, scenic continuation (session 4, part 2)
**Higgsfield CLI set up** (owner request): `npm i -g @higgsfield/cli` (v1.2.2), `higgsfield auth login` (owner signed in), workspace `db034276-…` selected, 246.25 credits. Skills installed with `npx skills add higgsfield-ai/skills` into `.agents/skills/` (symlinked in `.claude/skills/`). Generate with `higgsfield generate create <model> … --wait` (e.g. `minimax_h3`, `kling3_0`, `seedance_2_5`, `gpt_image_2_5`). Nothing generated yet this session.

**Hero** (owner: "clumsy… keep the theme, make it a tech-solution feel"): six service nodes on an orbit around the crystal, each wired into the core (gold wires with travelling light, a glowing port at each node); hover/focus opens the room's live preview above the node; nodes size to their text and grow outward from the crystal (anchored at their inner edge, `innerEdge()`); taglines hide under 1366 px. Mobile: two-column node grid. The push-in, parallax and camera-matched growth are unchanged.

**Hero → Home film** (owner: "the same crystal comes again without any transition"): the Home film now overlaps the hero's last viewport, stays invisible while it rises, and appears on the exact last frame (same focal point and over-scan as the hero plate), so the camera simply carries on into the crystal. The arrive copy fades in only after the cut.

**Text motion** (owner: "text going up is weird… let it vanish or something"): all chapter copy now dissolves in place: during a chapter's entry/exit it is moved against the scroll by exactly the scroll distance while it fades (`chapterCopy`, `homeCopy`). Industries intro dissolves in place too.

**Industries cards** (owner: "near the marked one, on the water, not over the buildings"): the card sits on the water below its marker with a leader line, follows the marker during the pan, dissolves between districts.

**Home stages** (owner: image 4 "not good"): the boxed chips became a light rail across the water (gold line, seven nodes, done/now states).

**Scenic continuation** (owner: "static pages after the scenic animation all look bad… everything continuous"): `src/components/sections/Scenic.tsx` wraps everything below the film on Industries, How We Work, Pricing, About and Solutions. A scene from the page's film stays behind (settling slowly as you scroll); sections are frosted sheets with open scenery between; CTA bands sit on the scene; the film's last frame **crossfades** into the scene (the scenic layer starts one viewport early with its backdrop held still and fading in). Footer: the night terrace behind a navy gradient.

**Tests:** build ✓, tsc ✓, eslint ✓, Vitest 33/33, Playwright all passing on re-run (the hero node click test now retries a click that lands during hydration). Axe had flagged text on translucent sheets (axe ignores the scene behind): sheets are now 0.93 / 0.84 opaque and CTA bands use a feathered shade.

**Not done:** new Higgsfield footage (CLI is ready). Candidates: a How We Work establishing move into the planning table; a dedicated detail-page treatment for `/solutions/[slug]` (those pages are still the earlier static layout).
Final run this pass: Playwright **68 passed / 8 skipped / 0 failed**, Vitest 33/33. The axe spec now waits for finite load-in animations to finish before scanning (`settle()` in `tests/e2e/a11y.spec.ts`); a disabled "Next" in the phone demo got readable contrast.

### 2026-10-30 (night): new Home, scenic chapters everywhere, footer scene (session 4, part 3)
Owner: "I don't like the scene… remove the crystal… one continuous meaningful story… more scenes… the white sheets scrolling up are bad: make the scene itself portray it… footer too… Industries got worse, fix only the intro text."
- **Home rebuilt from scratch** (`design/HOME_SCRIPT.md`): one CinemaFilm from the first frame. The Omniwebora building on the terrace is first a luminous drawing (hero, H1), becomes a study model, is built, and lights up at golden hour; its six bays are the six services (links into their rooms). Then in through the centre bay (H11 reversed) to the product wall, back out, sunset → night with the stage rail, and the invitation at night. Crystal hero, push-in film, FinalInquiry and PullbackMotion removed (files deleted; heroWorld.ts kept for the unit test).
- **No content sheets**: the Scenic wrapper is gone. Sections that films now tell are `flat-only` (phones/reduced motion). New in-place chapters: About (what we solve, six services, seven stages, who we work with, then the invitation), How We Work (working together, questions, then send), Pricing (every other service, eight drivers, scope guide on a form card, questions). Industries closes inside its film ("Talk about your workflow"). `FilmOnly`/`FlatOnly` keep interactive tools single in the DOM.
- **Footer**: a scene. Wide screens: `main` lifts away to reveal the sticky footer underneath (it never scrolls up); a seamless Higgsfield night loop plays only while revealed (`FooterScene.tsx`).
- **Industries**: card placement reverted to the earlier side-card version; the intro is pinned (sticky) and dissolved by the engine (JS), no CSS scroll timeline.
- CinemaFilm dolly now only pushes in (`z ≥ 1`); bug where a large dolly target zoomed out and showed an edge.
- Tests: Playwright 67 passed / 7 skipped / 0 failed; flat-layout tools are tested with reduced motion; Home film test walks every chapter. `qa/plan-table.mjs` 5/5, `qa/route-transitions.mjs` PASS, `qa/shoot.mjs` all routes ok at 390 and 1440.
- Not done: `/solutions/[slug]` detail pages are still the earlier layout; Contact "C4".

### 2026-10-30 (late night): the rest (session 4, part 4)
- **Solution pages** (`/solutions/[slug]`) are films in their gallery room (`src/components/solutions/RoomFilm.tsx`): intro (H1) → "On the wall" (camera pushes onto the display, the live interface plays its steps; clicks hold) → situations → capabilities → page extra (website plans / rules-AI-people / what marketing will not promise) → scope questions → questions → next step. Reading chapters push in ~1.5× on a view computed from the room's display so the display always sits right of the words. Phones/reduced motion: stacked chapters plus the full interactive demo (`flat-only`). `SolutionTemplate` deleted; `ARRIVE`/`DESIGN` exported from SolutionsFilm.
- **How We Work** opens at eye level in the studio (new still L02) and cranes up onto the planning table (clip L10) before the table chapters.
- **Contact "C4"**: the brief announces its progress (`omni:brief` event); ContactFilm eases the camera toward the lit pavilion and warms its glow (visual feedback only).
- **Thank-you and 404**: a single scene each (`SceneHero`): the lit pavilion; the building as a drawing.
- Tests: Playwright 67 passed / 7 skipped / 0 failed; Vitest 33/33; `qa/shoot.mjs` all 15 routes ok at 390 and 1440 (404 page returns 404 by design).
- Credits: 169.25 left.

### 2026-10-30 (latest, cut short by the usage limit): words in place, nav (session 4, part 5)
Owner: "I hate the way texts move up on scroll… nav bar looks bad… Solutions click should go to the start, hover shows a small text list… remove the 'Step inside' pills… after Home, direct users to Solutions… form boxes occupy the screen."
- DONE: words never scroll. Each `.hold` runs on 100svh under the next (`margin-bottom:-100svh`); the engine measures reading length without the overlap and marks exactly one `[data-current]` chapter; CSS crossfades the current chapter's words in place (timed, not scroll-linked). All scroll-driven copy animations removed. Chapter titles are statement-size. Camera-move pills hidden. Scope-guide card and Contact brief card smaller, translucent, appear in place.
- DONE: header. Solutions is a link to /solutions (start of the gallery); hover/focus shows a small dark list of the six rooms (names only). Over film/scene pages on wide screens the header has no band: white type on a feathered top shade (`html:has([data-film="on"],[data-scene])`).
- NOT DONE: Home's final chapter pointing to Solutions; update e2e tests that used the old mega-menu (see failures below); screenshot review of the new text behaviour on every page.

### 2026-10-30 (session 4, part 6): Home → Solutions walk-in, no boxes, no words over displays
Finishes part 5's open items and the owner's "text boxes occupying the screen" / "direct users to Solutions".
- **Home ends in Solutions.** The last chapter ("invite") is now "Walk through the six rooms" (Explore Solutions / Contact us). After it, a `handoff` chapter: the camera pushes into the centre bay of the night building, the Solutions gallery's first frame (s00) fades in, and finishing the scroll opens `/solutions` (which starts on that same corridor). Generic `handoff: { href, still }` on a CinemaBlock (`CinemaFilm.tsx`); it fires only on the visitor's own wheel/touch/keys (a Back-button scroll restore glides through it and must not bounce). `/solutions` is prefetched one chapter early. QA: `node qa/home-handoff.mjs` (frames, URL, Back stays on Home).
- **Engine: the last chapter ends when the scene does** (`engine.ts` measure): its words now go just before the sticky stage starts to scroll away (previously the footer rose under live words, e.g. Contact). `.hold:last-child` keeps its full `--hold` reading length.
- **Contact brief on the scene, no card**: white type on a feathered dusk shade (left), glass chips, translucent fields, ivory primary button; the summary aside is one line under the steps. Chapter is 175svh, the brief is sticky and stays put. Short windows: details on one row, smaller title. QA: `node qa/brief-shots.mjs` (each step at 1440×900 and 1366×768).
- **Bug fixed: hash jumps landed short** (html `scroll-padding-top` = header): `#brief` and Pricing `#others` now target an offset anchor inside the chapter, so "Start the brief", "Every other service" and intent links land on the chapter. Arriving on `/contact` with `?service=`, `?plan=` or `?from=` goes straight to the brief.
- **Pricing scope guide** is in the chapter's own column on the shade (no right-hand card; `.tool`/`.toolWrap` removed); two questions side by side, then the two short ones, the answer as one line + hand-off. Fits without inner scrolling at 1280×720 … 1920×1080. Plan scale overlay: names with a fine line, no boxes.
- **Words never over a display**: gallery rooms use `.panel.beside` (column ends at the display's left edge, computed from plate geometry: `50vw − 0.16 × max(100vw, 16/9·100svh)`); solution pages' intro / live demo / next step put the words *below* the display (`.panelWrap.low`). Other reading chapters narrowed to 40vw. How We Work "together"/"faq" now push onto open marble (no device behind the words). QA: `node qa/overlap-check.mjs /solutions/<slug>` → all clear except a 10 px brush of the phone stand on Mobile's intro.
- **Nav**: test rewritten for the link + hover list; dead dropdown state removed from `Header.tsx`; the list shows on hover or keyboard focus (`:focus-visible`), so a mouse click doesn't leave it open over the next page.
- Tests: tsc ✓, eslint ✓, build ✓, Vitest 33/33, Playwright **67 passed / 7 skipped / 0 failed**. E2E film tests bring a chapter on stage first (`toChapter()` in `site.spec.ts`).
- Not done / for review: Pricing "Eight things we look at first" is still eight short columns (readable, but dense); enterprise display is cropped at the right in its reading chapters (pre-existing framing).

### 2026-10-30 (session 4, part 7): owner review: no auto-jump, next step on every page, phones, contact
- **No automatic page change.** Home's walk-in hand-off removed (the generic `handoff` option stays in `CinemaFilm` but is unused). Instead **every page ends with a "Next" step** at the top of the footer scene (`NextStep.tsx`): "Walk through the six rooms → Explore Solutions"; on Solutions pages, "Tell us what you're building → Contact us". Home's last chapter is the Contact invitation again.
- **Home "One idea" strip**: browser-default `dd` indent removed, columns top-aligned (text was ragged and at different heights).
- **Pricing plan names** (Basic / Standard / Premium overlay): dark ink with a light halo, readable on the bright marble.
- **Scope guide removed** from Pricing (film, flat, FAQ entry, e2e test, component files). Brief wording "From your plan" (How We Work hand-off still works).
- **Contact brief stays put**: chapter 400svh (about three screens of scrolling before it leaves). **Bug fixed**: focusing a field in the pinned brief made the browser scroll the page and the brief vanished (caused the flaky e2e brief tests); `ContactFilm` now keeps the page on the brief when focus lands in it.
- **Phones (and reduced motion): no white cards.** Each chapter is a tall picture fading into deep navy, words in white on the fade and the dark ground below; Home's services list is a calm left-aligned list (name in the display face, one line under it, no underlines); Contact brief white-on-dark like desktop; Industries intro and Solutions outro on dark; inline demos sit on their own light "screen" surface; footer shade deeper on phones. Review shots: `node qa/mobile-shots.mjs` → `qa/screenshots/mobile/`.
- **Owner facts (O06)**: public email **info@omniwebora.com** (footer, Contact). Every brief is addressed to it (`INQUIRY_INBOX` in `transport.ts`; `.env.example` updated). Delivery still needs `RESEND_API_KEY` + `INQUIRY_FROM_EMAIL` (verified sending domain) or `INQUIRY_WEBHOOK_URL`; until then the error message offers **"Email it to info@omniwebora.com instead"** (a ready-filled mailto with the whole brief). **WhatsApp**: link component ready (`ContactLinks.tsx`, `wa.me`), shown once `NEXT_PUBLIC_WHATSAPP_NUMBER` is set; the owner has not given the number.
- **Logo**: the owner sent a new logo image in chat, but it is not on disk; it needs to be saved into the project (e.g. `public/brand/omniwebora-logo.png`) before it can be cut out and placed.
- Tests: tsc ✓, eslint ✓, build ✓, Vitest 33/33, Playwright **65 passed / 7 skipped / 0 failed** (twice), axe clean on all routes (desktop + mobile).
