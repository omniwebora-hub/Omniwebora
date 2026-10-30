# Immersive site plan: one building, one camera

Status: APPROVED direction (2026-10-29), refined below in §7–§9. Pilot in progress. Supersedes the "static interior pages" approach. The home hero + push-in film stay exactly as they are.

## 1. The idea
The whole site is **one Omniwebora building**, the same ivory-marble, brass and glass architecture, same golden-hour light, filmed by one continuous camera. Every page is a **wing of the building**, and moving between pages is the camera walking from one wing to the next. Nothing is a separate "page"; everything is a place.

| Route | Place in the building | What the camera does as you scroll |
|---|---|---|
| Home | **The Atrium** (existing hero) | Push in to the cube (existing) → **passes through the glass core** → emerges at the mouth of the Gallery → brief fly-past of the six alcoves → pull back out over the whole building (existing closing shot) → CTA |
| Solutions | **The Gallery**: a long colonnade with six lit alcoves | Trucks along the gallery, stopping at each alcove. Each alcove holds a physical sculpture for one solution; a glass panel slides out with the real, working demo |
| Industries | **The Rooms**: doorways off the gallery into six working rooms built in the same materials (hotel front desk, school library, clinic reception, restaurant pass, logistics bay, office) | Walks through doorway after doorway; each room is one industry |
| Concept Lab | **The Studio** on the lower floor: long glass worktables | Descends the stair; camera settles top-down over the tables; the three demos live on the table surfaces, bigger and more polished |
| Pricing | **The Model Room**: an architectural scale-model table | Camera rises over the model as it grows: one pavilion (websites) → a building (software) → a campus (enterprise). The real price tiers ride on top as HTML |
| About | **The Library / Mezzanine** (uses the existing studio-table still) | Slow editorial dolly past shelves and the studio table; who we are, how we work (the seven stages live here) |
| Contact | **The Terrace at dusk**: the waterfront outside the atrium | Camera steps out onto the terrace; calm light; the guided brief sits on a glass lectern |

Navigation becomes: **Home · Solutions · Industries · Concept Lab · Pricing · About · Contact**. `/approach` merges into About; `/work` redirects to Concept Lab. Old URLs keep working via redirects.

## 2. Continuity between pages
- Every page's opening clip **starts on the same "hub" frame** (the atrium seen from the gallery mouth) and ends inside its own wing. Clicking a nav link dissolves to that hub frame (≈ 0.6 s, View Transitions API), the new page opens on it, and scrolling continues the walk. It reads as one camera.
- Each page **ends on a doorway frame** that matches the next page's opening ("Next: Industries →"), so reading top to bottom also flows to the next wing.
- Generation rule for continuity: every keyframe uses the hero keyframe (H00) plus its neighbour as image references; every clip uses **first-frame + last-frame** anchors, so camera moves join exactly.

## 3. How it is built (same technique as the landing page)
- **Scroll-scrubbed video** on desktop: Higgsfield clips → frame sequences on canvas, GSAP ScrollTrigger, reverse works, camera-matched HTML overlays (the method already proven on the hero).
- **Real content stays HTML**: headings, prices, forms and demos sit on glass panels in the scene; crawlable, accessible, keyboard-operable.
- **Mobile**: no scrubbing; each chapter shows a short, muted 720p loop or a still, with the same content stacked. Reduced motion: stills only.
- **Budget control**: each chapter's frames load only when you approach it; ~2–4 MB per desktop page, a fraction on mobile.

## 4. Home is slimmed down
Keep: hero, push-in, closing pull-back. Add: "through the core" transition and a 6-beat gallery fly-past (one line per solution, links to Solutions). **Remove from Home:** friction slider, evolution selector, industries strip, Concept Lab teaser ("See the thinking in action"), process explorer, scope picker. Each moves to its proper wing (or is dropped).

## 5. Higgsfield asset list and credits (budget 300–400)
| Wing | Stills (keyframes) | Clips (scroll-scrubbed) |
|---|---|---|
| Home | core-interior frame, gallery-mouth hub frame | through-the-core (H01 end → hub), gallery fly-past |
| Solutions | gallery establishing + 6 alcoves | arrival + 5 alcove-to-alcove moves |
| Industries | doorway + 6 rooms | arrival + 5 room-to-room moves |
| Concept Lab | stair + studio tables | descent |
| Pricing | model at 3 scales | 2 rising moves |
| About | library mezzanine | 1 dolly |
| Contact | terrace dusk | atrium → terrace |
Total ≈ 24 stills (~4 credits each) + ≈ 21 clips (~10–12 each), plus retries ≈ **350–390 credits**.

## 6. Order of work (with review gates)
1. **Pilot: Solutions gallery** (≈ 90 credits): hub frame, gallery, 6 alcoves, 6 clips, built end to end with one demo per alcove. Review in the browser before spending more.
2. Home continuation (through-the-core + fly-past), then nav transitions.
3. Industries → Pricing → Concept Lab → About → Contact.
4. Mobile/reduced-motion versions, performance pass, tests.

## 7. Refinements (owner review, 2026-10-29)
**Hero is untouchable.** Its quality is the floor for every other scene.

**Home is a business story, not a tour.** Five beats, joined by the same scroll-scrubbed camera:
1. *Arrival*: existing hero + push-in (unchanged).
2. *From idea to working system*: the camera passes through the glass core; a single business need (for example "bookings arrive by phone, chat and email") resolves on screen into one connected system.
3. *What we build*: three families only (Websites & apps · Business software · AI, cloud & enterprise), each a short cinematic beat with a route into Solutions.
4. *Beyond launch*: the seven brochure stages as one continuous camera line, ending in "Maintain · Scale".
5. *Project invitation*: existing closing pull-back + CTA.
Removed from Home: "See the thinking in action", busy-work slider, evolution selector, industries strip, process explorer, scope picker.

**Solutions are product experiences, not sculptures.** Each alcove of the gallery is a *working setting* filmed frontally so real HTML interfaces sit exactly on its display surfaces:
| Solution | Setting | Real interface on top | Customer need → demonstration → relevance → next step |
|---|---|---|---|
| Websites | Display wall in a sunlit alcove | Responsive site that steps desktop → tablet → phone as you scroll; working form, catalogue, booking | "Visitors can't tell what you do or how to book" → live site → enquiries reach you → Discuss a website |
| Mobile apps | Stone counter with a phone stand | Phone journey (onboarding → book → confirm) | Customers on the move → working app → fewer calls → Plan an app |
| Business software | Operations room with a wide wall display and desk | Operations console: orders, stock, billing, customers sharing one record | Spreadsheets and retyping → one system → fewer errors, one view → Map your workflow |
| AI & automation | Quiet desk with a review screen | Trigger → classify → rules → exception → human approval → audit | Repetitive routing → automation with oversight → time back, checked → Explore an automation |
| Cloud & integrations | Plant/technical room seen through glass | System map with data paths, failure and recovery | Tools that don't agree → integrations → one source of truth → Discuss an integration |
| Enterprise | Mezzanine overlooking several rooms | Layered platform across departments | Many departments, many systems → one platform → governance and scale → Discuss enterprise scope |

**Route transitions are context-aware, not literal walks.** Every page has its own arrival shot that keeps the light direction and materials of the building; nav clicks use a short View Transition dissolve. Direct links, refresh, back/forward and deep links (`/solutions#business-software`) work on their own. Frame matching between clips is a production goal, verified in the browser at every join.

## 8. Technique for every immersive page
A sticky full-viewport "camera" canvas behind the page. Content sections scroll over it; each section marks which clip it scrubs (`data-film-seg`) and, between clips, the camera holds on the last frame (a sharp still). HTML interfaces are positioned in the plate's coordinate space (same cover-fit maths as the hero) so they stay locked to the screens in the footage. Mobile: stills (and optional short loops) with the same content stacked; reduced motion: stills only.

## 9. Pilot (current)
Gallery entrance → Websites → (transition) → Business software, on `/solutions`. Assets: 3 keyframes (gallery entrance, websites alcove, operations room) + 2 clips (entrance → websites, websites → software). Remaining four solutions keep their current pages until the pilot is approved.

### 9.1 How the pilot is built
| Chapter (`data-film-block`) | Scroll length (desktop) | Camera | On screen |
|---|---|---|---|
| `intro` | 115svh | Hold on S00 gallery entrance | H1, lede, "Scroll to enter" |
| `enter` | 135svh | Scrub clip S10 (gallery → websites alcove) | One caption line |
| `web` | 300svh | Hold on S10's last frame; 2.5D dolly toward the display, then back | Live `ResponsiveBrowser` on the display, stepping desktop → tablet → phone; story panel (need → on the wall → why it matters → CTA) |
| `move` | 135svh | Scrub clip S11 (alcove → operations room, pillar wipe) | One caption line |
| `ops` | 300svh | Hold on S11's last frame; dolly toward the wall display | Live `ModuleConsole`, stepping CRM → Inventory → Billing (visitor can override; Teams by click) |
| `outro` | 100svh | Hold on the operations room | Links to the other four solutions |

Then the compare table and CTA as normal sections. Code: `src/components/film/{SolutionsFilm,frames,FlatOnly}.tsx`, `src/app/solutions/{page.tsx,chapters.module.css}`, builder `scripts/cinematic/build_film.py` → `src/content/film.generated.ts` (frame counts and measured display rectangles). State is a pure function of scroll position, so reverse scrolling, refresh mid-page and deep links (`#websites`, `#business-software`) all reconstruct correctly.

**Fallback** (below 1024px, portrait, or reduced motion): no stage; each chapter shows its sharp keyframe and the full interactive component inline, stacked.

**Removed from `/solutions`** for the pilot: CapabilityMap hero, goal filter, "each one in a sentence" list, sample combinations (components kept in the repo).


## 10. Phase 2 direction (owner, 2026-10-29) and status
**Owner facts:** six services only (Website building, Mobile apps, Custom software ERP & CRM, Business automation, Digital marketing (Meta Ads, SEO), Enterprise platforms); no money on the site (Website plans Basic / Standard / Premium, details pending); Work section removed; How We Work personalised; company details pending; every demonstration general to any business. See `content/FACT_REGISTER.md` O01–O05.

**Benchmarks:** Solutions = technical benchmark (done), Home = visual benchmark, Pricing = interaction benchmark. Each page gets its own idea in the same building and light; no page repeats another's camera language.

| Route | Idea (distinct per page) | Camera language | Status |
|---|---|---|---|
| Solutions | Six working rooms, each display running a purpose-built interface (`src/components/displays/*`), then out to the waterfront terrace: the facade's six lit windows are links back into their rooms | Lateral trucks with occlusion wipes, crane up, float-out finale | **Built** (11 clips, 9 keyframes) |
| Home | Hero (protected) → *product wall*: one business idea becomes a phone app, a tablet site and a working system across three displays → the six services as the lit facade → *beyond launch*: sunset → night on the terrace while the seven stages advance → protected closing pull-back | Push-in (existing), frontal hold with display choreography, time-of-day scrub | Keyframes H02 / S08n generated |
| Pricing | *Scope atelier*: an architectural model on a studio table grows Basic → Standard → Premium as you scroll; plan cards ride beside it; other services shown as "commissions" | Locked-off camera, the subject transforms | P01 generated; P02 / P03 generating |
| Concept Lab | *Innovation studio*: top-down over a long glass table; three devices run the demos | Overhead glide | L01 generated |
| Contact | *Consultation pavilion* at dusk by the sea; the guided brief sits in the calm half of the frame | Slow arrival, then still | C01 generating |
| Industries, About | Working environments; studio and craft | to be designed | not started |

**Performance (Gate 1, measured):** `qa/perf/*` (scroll-bench, seek-bench, join-check, wheel-over-screen). Video scrubbing + eased progress + idle-time decoder warm-up + bounded media; see `reports/HANDOFF.md` for numbers.

### 10.1 Status (2026-10-30)
| Route | Idea | Status |
|---|---|---|
| Home | Hero (protected) → through the core → product wall (one booking across phone, tablet, schedule) → terrace facade, six windows link to the rooms → sunset to night as the seven stages advance → protected pull-back | **Built** |
| Solutions | Six working rooms, purpose-built display interfaces, terrace finale | **Built** |
| Industries | Dusk city panorama across the bay, panned; six districts as example use cases, card on the side away from its district | **Built** |
| How We Work | *The planning table*: top-down over a glass table (L01); the left tablet asks what you do, the laptop what you want, the right tablet writes the seven stages for your business as you scroll; shared with the full planner below and handed to the brief | **Built** (still only; an establishing clip can be added when generation is available) |
| Pricing | Scope atelier: the scale model grows Basic → Standard → Premium | **Built** |
| About | Studio worktable → top-down drafting table (questions → wireframe → working screen) → out to the pavilion | **Built** |
| Contact | Terrace → along the terrace at dusk → brief beside the lit pavilion | **Built** (C4 scene feedback not built) |
| Concept Lab | Removed by the owner | Redirects to /solutions |

**Page-to-page:** a short dissolve (React `<ViewTransition>`, `globals.css` "Page transitions"), with the header held in place; reduced motion and unsupported browsers swap pages instantly. Every page opens at its top; deep links (`/solutions#slug`) land in their room.

**Copy over scenes (owner rule):** minimal copy, white type on a feathered left-edge shade; it fades in and out with its chapter, so it never slides across the next scene's displays or labels. Forms (the Contact brief) are the only cards over imagery.

### 10.2 Status (2026-10-30, late)
Every route is a scene now: Home ("Ideas we bring to life", design/HOME_SCRIPT.md), Solutions gallery and the six solution rooms (RoomFilm), Industries (city panorama, closing invitation inside the film), How We Work (studio → crane → planning table → working together → questions → send), Pricing (scale model → every other service → drivers → scope guide → questions), About (studio → drafting table → pavilion chapters), Contact (terrace → pavilion; the scene answers the brief), thank-you and 404 (single scenes), and the footer (the building at night, revealed in place, living loop). Words never travel across a scene: they appear and dissolve in place. Phones and reduced motion get stacked chapters with stills and the full interactive tools.
