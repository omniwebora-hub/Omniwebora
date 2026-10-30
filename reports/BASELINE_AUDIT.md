# Baseline audit (Gate 0)

Recorded 2026-10-29, at the start of the governance directive (`docs/governance/04_CLAUDE_CODE_GOVERNOR_MASTER_PROMPT.md`).

## Repository
- Git: branch `master`, **no commits yet** (every file is untracked). Nothing has been committed or pushed by Claude.
- Stack: Next.js 16.4.3 (App Router, Turbopack, static generation), React 19.3, TypeScript 5.9, CSS Modules, GSAP 3.15 (ScrollTrigger), Zod 4. Tests: Vitest (unit), Playwright + axe-core (e2e/a11y). No CMS, no database.
- Runtime dependencies at baseline: `gsap`, `next`, `react`, `react-dom`, `zod`. (Three.js / R3F / postprocessing were removed earlier in this session; see `reports/ASSET_AND_MODEL_CLEANUP.md`.)
- Hosting/deploy config: none in repo. Nothing has been deployed.
- Form backend: `POST /api/inquiry`: Zod validation, honeypot, minimum fill time, same-origin check, per-instance rate limit, delivery via Resend or webhook when env vars exist; otherwise an honest HTTP 503 `transport_unconfigured`. `.env.local` has no transport configured.
- Analytics: privacy-first facade (`src/lib/analytics.ts`), forwards to Plausible only if `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` is set (it is not).
- Higgsfield: connected as a claude.ai MCP connector (tools `generate_image`, `generate_video`, `media_upload`, `models_explore`, `balance`, …). Balance at baseline ≈ 558 credits (600 at session start). MuAPI MCP config and launcher were removed earlier this session.

## Routes at baseline
`/`, `/about`, `/services`, `/services/[websites|mobile-apps|business-software|ai-automation]`, `/work`, `/process`, `/contact`, `/privacy`, `/api/inquiry`, `/sitemap.xml`, `/robots.txt`, `/opengraph-image`, 404.

## Quality at baseline (measured, production build)
- Typecheck, lint: clean. Unit tests 29/29. e2e 46/47: one test needed updating after staged frame loading (asserted >10 frames before any scroll).
- Lighthouse (local, simulated mobile): home 86 (LCP 4.06 s, TBT ~75 ms, CLS 0); interior pages 93–95; desktop home 95. Accessibility 100 everywhere. SEO 66–69 only because staging `noindex` is deliberate.

## Visual baseline vs. supplied screenshots (`reference/current_screenshots/`)
The supplied screenshots are of this same build. Confirmed in the browser:
| Area | State |
|---|---|
| Home hero (atrium plate, sapphire cube, four glass panels, real logo) | Good; matches intended target. **Protect.** |
| Scroll film (H01 push-in, camera-matched logo/panels, reverse scroll) | Good; tested both directions. **Protect.** |
| Closing pull-back atrium (R01) | Good. **Protect, refine copy/CTAs.** |
| Services showcase (sticky stage, 4 services) | Works, but only 4 of the brochure's 6 capability families. Extend to 6. |
| Process (navy timeline, 5 phases) | Weak; wrong stage model (brochure has 7). Replace. |
| "Case studies are on their way" | Weak placeholder. Replace with Concept Lab. |
| "Why work with us" (4 text columns) | Weak. Replace with friction → connected workflow interaction. |
| About / Services heroes (same colonnade, big headline) | Repetitive. Give each route its own identity. |
| Services index (4 white cards) | Weak. Replace with `/solutions` capability map. |
| Contact (generic two-column form) | Functional but generic. Replace with guided brief. |
| Header (5 links) / Footer (sparse) | No path to pricing, industries or deeper solutions. Rebuild. |

## Content baseline
Content was written without the brochure: no pricing, 5-phase process, 4 services. The brochure (`reference/brochure/`, all 8 pages read visually) now governs; see `content/FACT_REGISTER.md`.
