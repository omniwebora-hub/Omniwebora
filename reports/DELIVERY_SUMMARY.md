# Delivery summary

Status on 2026-10-29: **implemented and tested locally; not deployed; not committed** (git has no commits). Launch is gated by the owner items in `reports/CONTENT_APPROVAL_CHECKLIST.md`.

## What was built
1. **Cinematic home hero (Phase 1, protected).** Higgsfield-rendered atrium plate matching the client's target, real SVG logo on the glass core, four glass service panels with HTML interface previews, CSS intro reveal, and a GSAP ScrollTrigger push-in (56-frame canvas sequence, camera-matched logo and panels, reversible). Stacked mobile composition; reduced-motion and Save-Data fallbacks.
2. **Source-led content.** The 8-page brochure read visually; every fact traced in `content/FACT_REGISTER.md`; all 13 price bands exact; seven-stage process; 22 service lines; unverifiable claims withheld.
3. **New information architecture** with Solutions mega-menu: `/solutions` + 6 solution pages, `/industries`, `/approach`, `/pricing`, `/work`, `/concept-lab`, `/about`, `/contact`, `/thank-you`, `/privacy`; 308 redirects from old URLs.
4. **One signature interaction per route**: capability map + goal filter; responsive browser canvas; phone journey; module console; automation runner with human review; topology map with outage recovery; enterprise layer explorer; industry workstation; seven-stage artefact explorer; pricing desk + scope guide; artefact desk; guided brief studio; three Concept Lab demos with reset. Home adds friction→connected slider, evolution selector, scope picker.
5. **Guided project brief** with live summary, prefill from solution pages and the scope guide, real submission, honest errors; delivery verified end-to-end via webhook.
6. **SEO**: unique titles/descriptions, canonicals, OG, Organization/WebSite/BreadcrumbList/Service/FAQPage JSON-LD, sitemap, staging-safe robots.
7. **Cleanup**: failed R3F engine, 6 3D packages and the MuAPI setup removed after reference checks (`reports/ASSET_AND_MODEL_CLEANUP.md`).

## Test outcomes (final build)
| Check | Result |
|---|---|
| `npm run build` | ✓ 23 static pages + `/api/inquiry` |
| TypeScript / ESLint | ✓ / ✓ |
| Vitest | ✓ 33/33 (content honesty, exact pricing, asset integrity, inquiry) |
| Playwright e2e + axe (desktop 1440×900 + Pixel 7) | ✓ 72 passed, 8 device-specific skips, 0 axe violations on 16 routes |
| Real delivery (`qa/form-delivery.mjs`) | ✓ success → payload + `/thank-you`; failure → honest error |
| Lighthouse | interior mobile 99–100; home desktop 93–96; home mobile 83–86 (LCP ≈ 4.1 s simulated, open item); a11y 100; CLS 0 everywhere |

Details: `reports/BROWSER_VISUAL_QA.md`, `reports/PERFORMANCE_AUDIT.md`, `reports/SEO_AUDIT.md`, `reports/FORM_DELIVERY_TEST.md`. Screenshots: `qa/screenshots/` (gitignored; regenerate with the QA scripts).

## Media
Higgsfield (≈ 45 credits; 555 remain): hero keyframe, push-in video, pull-back, colonnade, studio table (accepted); Kling dolly, Kling idle loop (rejected); two Nano Banana jobs failed and were refunded. See `assets/ASSET_MANIFEST.md`.

## Run locally
`npm install && npm run dev`, or `npm run build && npm start`. See README.

## Unresolved / blockers
- Owner confirmations: logo files, legal/contact details, domain, current prices and inclusions, case studies, privacy text, enquiry mailbox/CRM (checklist).
- Mobile home LCP above 2.5 s in lab simulation; measure field data after deployment.
- Not tested on real Safari/iOS/Firefox or a physical low-end Android device.
- Revoke the exposed MuAPI key (local files only).
