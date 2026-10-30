# Performance audit

Measured locally with Lighthouse 13 against `next start` (production build), Playwright's Chromium, 2026-10-29. Mobile = Lighthouse default (simulated slow 4G, 4× CPU); desktop = `--preset=desktop`. Local measurements, not field data; re-measure on the real host/CDN.

## Results (final build)
| Page | Perf | A11y | Best practices | LCP | TBT | CLS | Weight |
|---|---|---|---|---|---|---|---|
| Home, desktop | 93–96 | 100 | 100 | 1.35–1.59 s | 0–7 ms | 0 | 1.4–1.7 MB (film frames load after paint, desktop only) |
| Home, mobile (3 runs) | 83 / 86 | 100 | 100 | 4.1 s | 83–99 ms | 0 | 713 KB |
| Solutions | 100 | 100 | 100 | 0.91 s | 68 ms | 0 | 418 KB |
| Web development | 100 | 100 | 100 | 0.91 s | 68 ms | 0 | 495 KB |
| AI & automation | 99 | 100 | 100 | 0.91 s | 140 ms | 0 | 323 KB |
| Pricing | 99 | 100 | 100 | 0.91 s | 131 ms | 0 | 320 KB |
| Contact | 99 | 100 | 100 | 0.91 s | 135 ms | 0 | 295 KB |
| Concept Lab | 99 | 100 | 100 | 0.91 s | 148 ms | 0 | 326 KB |
| Approach | 100 | 100 | 100 | 0.91 s | 67 ms | 0 | 359 KB |
| About | 100 | 100 | 100 | 0.91 s | 71 ms | 0 | 441 KB |
| Industries | 100 | 100 | 100 | 0.90 s | 70 ms | 0 | 292 KB |

Reports: `qa/lighthouse/*-final.report.{html,json}`.

## Targets
- CLS ≤ 0.1: **met everywhere** (contact was 0.241 before the fix below).
- LCP ≤ 2.5 s: **met on every interior page and on desktop home; not met on mobile home (≈ 4.1 s simulated).** Root cause: on a fast local server the HTML, image and scripts all arrive at once and React hydration runs before the first frame; Lighthouse's simulation then places that work on the LCP path. The LCP image itself loads in ~120 ms with `fetchpriority=high`. Measure with field data (CrUX/RUM) after deployment before further work.
- INP ≤ 200 ms: TBT (lab proxy) 0–148 ms; no long interaction handlers.

## What was done
- Removed Three.js/R3F (~900 KB of JS); GSAP is code-split and loaded only for the film and pull-back.
- Hero: LCP is a pre-sized WebP with `srcset`/`fetchpriority=high`; the intro "light" effect animates an overlay's opacity instead of a filter on the LCP image (filters delayed the first paint).
- Display font: one static 24 KB Newsreader display instance instead of the 129 KB variable font.
- Film frames: 56 frames, 1440 px or 960 px by viewport; 8 coarse frames after `load`, the rest on first scroll; adjacent-frame cross-blend; canvas DPR capped at 1.5; never on mobile, reduced motion or Save-Data.
- Interface previews below the fold mount only when their slot is visible and near the viewport (`LazyPreview`); the hero's four panel previews mount after hydration.
- `content-visibility: auto` on below-the-fold home chapters.
- Contact: the brief is server-rendered as the Suspense fallback, so the form no longer pops in (CLS 0.241 → 0).
- Evolution preview backdrop swapped from a 200 KB still to an already-cached one.

## Possible next steps (if field data shows mobile LCP > 2.5 s)
Defer hydration of below-the-fold home chapters (e.g. lazy client components behind IntersectionObserver), split the home into fewer client islands, or serve the hero still through a CDN with AVIF.


## Film pages, 2026-10-30 (`qa/perf/scroll-bench.mjs`, Intel UHD iGPU, 1440×900, 60 Hz budget)
| Page | Frames over budget, slow / fast / reverse | Long animation frames | Notes |
|---|---|---|---|
| /approach (new, stills only) | 0.1 % / 0 % / 0.1 % | 0 | 2.5D camera on one still; interfaces re-render only on step change |
| /about (two clips) | 0.8 % / 0.9 % / 0.5 % | 1–2, ≤ 9 ms blocking | seeks p95 13–15 ms; 0 blank / fallback frames; 16 MB decoded media |

Page transitions add a 260 ms fade-out and a 420 ms fade-in of the page layer (GPU-composited snapshots); navigation measured 0.7–1.0 s end to end on the local server including the transition.
