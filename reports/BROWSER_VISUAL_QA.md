# Browser and visual QA

Production build, headless Chromium (Playwright) plus the in-app browser, 2026-10-29.

## Coverage
- Every route at 1440×900 and 390×844, full page (`MSYS_NO_PATHCONV=1 node qa/shoot.mjs http://localhost:3200 --routes=… --sizes=1440x900,390x844 --full --tag=g1`): one H1, no horizontal overflow, no console or HTTP errors on any route. Contact sheets: `qa/screenshots/g1-top-grid0.jpg`, `g1-top-grid1.jpg`, `g1-mobile-grid.jpg`.
- Hero and film at 1440×800, 1440×900, 1920×1080, 1366×768, 768×1024, 390×844, 360×800 (`qa/film.mjs`), including scrubbing to 0.2/0.5/0.8/1.0 and reversing to 0 (progress returns to 0.000; panels and copy restored).
- Reduced motion: film off, hero not pinned, links work (e2e).
- Keyboard: skip link, mega-menu (Escape returns focus), search (Ctrl+K), arrow keys in every tab interface (`src/lib/tabKeys.ts`), all demos operable with buttons/radios/checkboxes.
- Accessibility: axe (WCAG 2.2 A/AA) on 16 routes × desktop + mobile, plus the hero with a focused panel: **0 violations**. Lighthouse accessibility 100 on all measured pages.
- Automated suites: Playwright 72 passed, 8 skipped (device-specific by design); Vitest 33/33.

## Design critique per route (score 1–5: content · credibility · craft · distinctiveness · interaction · conversion · a11y · performance)
| Route | Signature | Scores | Notes |
|---|---|---|---|
| Home | Protected atrium hero + push-in film; six capability chapters; friction→connected slider; evolution; Concept Lab demo; seven stages; scope picker; pull-back CTA | 5·5·5·5·5·5·5·4 | Mobile LCP is the open item (see PERFORMANCE_AUDIT) |
| Solutions | Six-layer capability map + goal filter + compare table | 4·5·4·5·4·4·5·5 | |
| Web development | Responsive browser canvas (container queries, 4 working states) + 6 plans | 5·5·5·5·5·5·5·5 | |
| Mobile apps | Perspective phone journey + systems strip | 5·5·5·5·5·4·5·5 | Pricing honestly explained via software tiers |
| Custom software | Module console with shared-record tracing + 3 tiers | 5·5·4·5·5·5·5·5 | |
| AI & automation | Dark page; deterministic runner with human review + audit trail | 5·5·5·5·5·4·5·5 | |
| Cloud & integrations | Dark page; topology tracing + outage/recovery simulation | 4·5·5·5·5·4·5·5 | |
| Enterprise | Layer explorer + department filter + 4 tiers + 17-row matrix | 5·5·4·5·4·5·5·5 | |
| Industries | Workstation reconfigures per context; regulated-sector caution | 4·5·4·4·4·4·5·5 | |
| Approach | Seven-stage rail with HTML artefacts on the studio table | 5·5·5·5·5·4·5·5 | |
| Pricing | Scope desk (3 tracks, all 13 tiers in HTML) + drivers + scope guide | 5·5·4·5·5·5·5·5 | |
| Work | Calm statement of how case studies will be shown; routes to Concept Lab | 4·5·4·4·3·4·5·5 | Intentionally quiet until real case studies exist |
| Concept Lab | Three working demos with reset | 5·5·4·5·5·4·5·5 | |
| About | Artefact desk on the Higgsfield studio table; 22 service lines; principles | 4·5·5·5·4·4·5·5 | Team section waits for real bios |
| Contact | Guided brief with live summary; real delivery tested | 5·5·5·5·5·5·5·5 | |

No route scores ≤ 2.

## Defects found and fixed during QA
Navy-on-navy header on dark pages; contrast of gold annotation chips; scrollable tables not keyboard-focusable; heading-order jumps; contact layout shift; over-long titles; first-paint delay caused by a filter animation on the LCP image; stray `undefined` class; tablist containing a checkbox; `role="grid"` without grid keyboard support (now a table); prohibited `aria-label` on spans/paragraphs.

## Not tested
Real Safari/iOS and Firefox (only Chromium available here); a physical low-end Android device; real-network field metrics.


---

## Phase 3: cinematic site, 2026-10-30 (supersedes the route table above)
Method: every film chapter screenshotted at 1440×900 on the hardware GPU path (`qa/page-film.mjs`: holds at 25 % and 70 %, camera moves at 50 %), targeted shots with `qa/spot-shots.mjs`, every route at 390×844 and 1440×900 (`qa/shoot.mjs`), interaction scripts `qa/plan-table.mjs` and `qa/route-transitions.mjs`. Screens reviewed by eye against the owner's feedback (no boxes over scenes, nothing overlapping, all text clearly readable).

| Route | Signature | Result |
|---|---|---|
| Home | Hero → core → product wall → facade → dusk/night stages → pull-back | Pass after fixes (feathered shade; "Beyond launch" box removed; copy fades instead of crossing the window labels) |
| Solutions | Six rooms + finale | Pass (phone centred on the website wall; minimal copy) |
| Industries | City panorama with six districts | Pass after fix (blank strip at districts 1–2; card now takes the free side) |
| How We Work | Planning table (new) | Pass: choose on the devices, plan written per stage, shared with the planner, hand-off to the brief |
| Pricing | Growing scale model | Pass (shade no longer shows a hard edge) |
| About | Studio → drafting table → pavilion | Pass after fixes (grey band from over-framing; sketch no longer under the copy; tablet fully used) |
| Contact | Terrace → pavilion, brief card | Pass |
| Phones (all routes) | Stacked chapters with stills, full components inline | Pass: one H1, no horizontal overflow, no console or HTTP errors |

Defects found and fixed this pass: hard-edged copy shade; copy sliding over displays/labels while leaving a chapter; camera framing beyond the plate (About); Industries panning beyond the panorama; overlays blinking at hold-to-hold joins; header hidden during the page dissolve; pages opening part-way down after navigation (missing `data-scroll-behavior`); intro copy on How We Work referring to the table on phones.

Not tested: real Safari/iOS and Firefox (scroll-driven copy fades and view transitions are progressive: without support the copy scrolls and pages swap instantly).
