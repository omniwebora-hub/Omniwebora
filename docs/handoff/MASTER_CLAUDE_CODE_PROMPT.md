# OMNIWEBORA — CINEMATIC WEBSITE RESCUE & HIGGSFIELD-LED REBUILD

You are Claude Code acting as an elite multidisciplinary digital studio: creative director, cinematic art director, WebGL/Three.js engineer, motion designer, frontend architect, technical SEO specialist, conversion designer, and QA engineer. You own the work from auditing the existing site to producing a polished, working result. Implement, preview, compare, iterate, test, and document; don't stop at a plan or a mockup.

## 0. FIRST: STUDY THESE REFERENCES IN THIS ORDER

- `reference/02_INTENDED_TARGET.png` = **SOURCE OF TRUTH.** This is the visual result the client expects for the opening viewport. Observe layout, spatial relationships, architecture, actual richness of material, illumination and detail.
- `reference/01_CURRENT_FAILED_RESULT.jpg` = **FAILED IMPLEMENTATION.** Diagnose why it feels flat, generic, washed-out and visually unlike the target. Use only as a before image, never as the art-direction reference.
- Inspect the current repository and working application before making any changes. Preserve routes, functional components, form integrations, content and other useful work.

Crucial: these two reference files ARE AVAILABLE in this handoff folder; view them with your image-reading/browser tools rather than just reading their filenames. If integrated into a different directory, locate them in the provided handoff. Do not claim the reference files are inaccessible without checking.

## 1. NON-NEGOTIABLE DESIGN OBJECTIVE

Recreate the art direction and visual balance of reference 02 as closely as practicable in the initial desktop viewport. It should look like a spectacular real-world rendered architecture showcase brought to life, NOT a generic SaaS landing page or shallow CSS imitation of futuristic 3D.

The reference contains:
- A luxury futuristic waterfront / high-rise architectural atrium, tall cream-white arches and columns, hints of city skyline, plants, sunlit water, sophisticated built environment, architectural scale and believable depth.
- Directional warm golden-hour light, soft haze, physically plausible polished stone reflections, glass refraction, gold specular highlights, elegant contrast and subtle blue ambient fill. The palette is pale ivory / navy / deep glass-blue / warm champagne gold, not flat white / neon-yellow / washed-out powder-blue.
- On the LEFT ~40–43%: elegant editorial serif heading, exactly the large readable headline **“Ideas we bring”** on one line at desktop if width permits, with **“to life.”** on the next in warm gold. An understated eyebrow “OUR WORK” (or an equivalent truthful label if this is the Home route), a concise believable business intro, navy rounded “Start a Project” CTA and refined outlined “View Our Process” CTA. Align copy with intentional whitespace. Text must be real, accessible HTML, not AI-rasterized text.
- On the RIGHT ~55–60%: the visual star. A complex, transparent geometric cube / glass crystal with layered nested cubic geometry, a credible deep-navy illuminated center bearing the REAL Omniwebora identity if logo artwork is available, sophisticated blue core lighting and criss-crossed crystal edges. Dynamic elegant gold energy ribbons orbit and wrap the central object, with restrained bloom. This is not a single simple opaque blue diamond.
- The object sits above a MULTI-TIER high-end circular pedestal: polished dark marble/metal and brass/gold edge rings, realistic specular reflection, physical grounding and perspective.
- Four beautifully art-directed FLOATING SEMITRANSPARENT GLASS PANELS arranged around the cube, matching the screenshot balance: top-left Websites with visually credible browser website previews; bottom-left Mobile Apps with rich device screenshots; top-right Business Software with a realistic dashboard/chart screenshot; bottom-right AI & Automation with a sophisticated AI/automation visual. Each panel looks like slightly tilted glass with light catching the edge, visual content, shadows, depth, and spatial relationship to the cube. Cards are clickable and accessible, and their text/UI must be HTML instead of garbled generated lettering.
- A slim polished top navigation with Omniwebora logo at far left, centered site links, search only if useful and functional, and dark “Let’s Talk” CTA at far right. Below the hero, credibility metrics ONLY if confirmed by client; never invent 20+, 10+, 100%, testimonials or portfolio examples just because the target image depicts them. If metrics are unverified use beautifully laid out nonnumeric offerings or defer metrics until client confirmation.

Visually compare your FIRST ACTUAL BROWSER SCREENSHOT with the intended reference at ~1440x800 and ~1440x900. The discrepancy in atmosphere, material realism, layout balance and content richness must be addressed before building elaborate lower-page sections. Do not conceal mismatches with blur, grain, excessive fog, bloom, CSS gradients or a big blank background.

## 2. NEW PRODUCTION STRATEGY: HIGGSFIELD FIRST FOR CINEMATIC ASSETS

The previous image-generation flow failed. STOP relying on it. I will connect Higgsfield to Claude Code. Before generating:
1. Check the actually connected Higgsfield MCP/CLI capabilities and installed Higgsfield skills. Discover the available current image models, video models, Cinema Studio / camera controls, image-to-video, reference-image, first/last-frame, edit, upscale and asset download functions. Only use functions truly available; do not invent model/tool names. If MCP is not visible, inspect whether the authenticated Higgsfield CLI is available and report exactly what is missing. Do not install a different image provider or pretend generations succeeded.
2. Look for existing usable assets in the repository or Higgsfield asset history before creating duplicates. Check credit balance/cost if available. Avoid pointless regenerations; get approval for a high-cost batch, do not silently exhaust credits. An already approved affordable proof-of-concept may be produced first.
3. Upload/reference `reference/02_INTENDED_TARGET.png` in Higgsfield using the supported upload/reference workflow. A path in the local repo is NOT automatically a remote URL; confirm successful import. Use it as the principal STYLE + COMPOSITION reference, not as a web background image.
4. Lock a visual bible (colors, camera lens language, lighting direction, architecture, material, core geometry, panel proportions, continuity rules), then create ONE high-quality widescreen HERO KEYFRAME. Review against target. Correct it before scaling to more generations.
5. Produce a clean architectural environment plate, central-object look-development frames / masks if useful, and a small number of cinematic motion segments from carefully approved image anchors. Reuse source frames / reference Elements / consistent seeds / first-last-frame conditioning when supported. This site is ONE continuous designed world; never generate visually unrelated scenes.
6. Use the proper model for each job: image model for locked keyframes, image-to-video / cinematic video model for controlled camera movement, editing/upscale if needed. Choose based on verified quality and current available tools. When direct 3D asset export isn't supported, don't falsely claim a generated video is a `.glb` model.
7. Download/save FINAL media locally in `public/assets/cinematic/`, optimize and integrate with application. No remote temporary expiration URLs in production. Maintain `assets/ASSET_MANIFEST.md` mapping shot ID → source reference → model/tool → prompt → generation/job ID if available → local file → scene → accepted/rejected → optimization details. Keep rejected outputs out of the production bundle.

### Art-direction prompt for the hero keyframe (adapt to chosen Higgsfield model)

“Ultra-premium architectural technology brand environment, wide cinematic composition, elegant futuristic white limestone and ivory marble waterfront atrium at golden hour, monumental tall archways and columns, high-end contemporary glass architecture, distant sparkling waterfront skyline, delicate interior plants, pale champagne sunlight entering from rear left, physically plausible warm reflections on polished marble floor, subtle atmospheric haze, sophisticated editorial luxury commercial lighting, dimensional depth, exquisitely realistic materials. On right-central area, a suspended intricate transparent multi-shell cubic crystal and deep sapphire-glass core, luminous fine electric-blue edge details, refined thin gold light trails curling around it, mechanically convincing tiered circular black marble and burnished brass display pedestal underneath. Surrounding right-half crystal, four delicate, suspended, richly detailed transparent glass display planes positioned upper-left, lower-left, upper-right, lower-right with subtle visible thumbnail imagery but NO legible synthetic text. Reserve left 42 percent as calm, beautifully lit negative space for real webpage headline and CTA overlays. Composition and spatial relationships strongly match supplied target image. High-end archviz meets award-winning luxury digital agency visual identity, photoreal, crisp details, dynamic but restrained, realistic reflections, no cheap video game look. Landscape 16:9 or wider, web-hero safe areas, no visible watermark, no typography, no fake logos, no illegible labels, no excessive glowing fog, no featureless empty room, no flat minimal vector shapes, no generic SaaS gradients, no cartoon or plastic materials.”

Important: ideally generate the environment/background separately from the layered DOM UI, and generate component-specific rendered assets as needed. The composition must remain consistent while allowing real HTML headings and functional panels. If full composite generations produce fake UI, rebuild these elements as frontend layers and generate clean plates/inpaint the fake lettering. Use an actual vector asset for the logo, never trust the video model to write it correctly.

### Continuity constraints across ALL shots

Preserve the same architectural room, columns, window/skyline geometry, time of day, sun direction, pedestal design, glass cube silhouette, gold orbit motifs, blue core and brand proportions. Camera movement should be precise and physically plausible: slow dolly-in, gentle truck-right, arc orbit, macro push-through, parallax reveal. NO unexplained scene teleport, hard cut into a different building, morphing logo, changing object count, warping windows, rubbery pedestal, random sparks or catastrophic geometry drift. Use image-to-video with start/end anchors and short shot durations where possible; inspect the final frames for match cuts and visual integrity.

## 3. THE INTERACTIVE HERO — REQUIRED FIRST-PAINT QUALITY

This is not a single background JPG and not just a fullscreen MP4 with buttons painted on top.

Build an immersive COMPOSITED scene:
- Higgsfield-generated premium background/architectural visual plates and/or short animated background shot(s) for high-frequency material realism and photographic believability.
- Real HTML typography, navbar, CTAs and service-card labels, usable with keyboard/touch/screen readers. Use actual website/device/dashboard mini-previews made from code or approved imagery, not default Lucide icons as the primary graphic content.
- A central object with spatial movement and interactive response: use performant Three.js / React Three Fiber, shaders, existing quality 3D assets or selectively depth-layered camera-matched material. The goal is visual excellence, not “Three.js at any cost.” If a simple procedural cube looks worse than the reference, discard that design and use a better technically honest hybrid of professionally rendered imagery/video with genuine layered interactions and an accessible interactive overlay.
- Volumetric-looking gold orbital ribbons, warm glints and subtle blue pulses that seem to wrap AROUND the cube (correct foreground/background occlusion), not flat gold CSS zigzags. A restrained postprocessing strategy, no overpowering bloom.
- Floating cards have nuanced perspective, translucent refractive feel, thin warm edge glints, rich thumbnails, micro-parallax, subtle hover lift and genuinely functional service links. They must feel like components suspended within the architecture, not four solid white boxes pasted over the video.
- The gold-and-dark pedestal must have visual mass and realistic depth. Do not replace with three flat white concentric outlines.
- On first load, after stable content paint, a ~1–2 second graceful cinematic reveal: architectural light wakes → gold ribbons sweep → cube layers assemble or illuminate → cards arrive in staggered depth → headline/CTA reveal. No long intro gate or unskippable loading video. LCP-friendly poster first.
- On cursor movement, restrained object parallax and pointer-dependent gold orbit response; service hotspots/cards react and reveal a useful detail or navigate. User input MUST have a visible genuine result. Avoid aggressive pointer chasing, UI jitter or layout shift.

Desktop ~1440x800/900 should feel immediately recognizable against the target image. Header, headline, CTA, four service panels, glass core and pedestal must ALL be visible. Preserve sensible safe areas and dynamic browser-height layouts.

## 4. SCROLL-DIRECTED CINEMATIC STORYBOARD (NOT A PAGE OF RANDOM SECTIONS)

Use GSAP + ScrollTrigger (verify compatibility); consider Lenis ONLY if it adds value and doesn't sabotage accessibility, browser navigation or performance. The user controls camera progress. Provide genuine reverse-scrubbing where feasible: scrolling back naturally reconstructs the prior scene. Each chapter has a clear business message and CTA. Build a deliberate master motion timeline with viewport progress and pinned scenes, without obnoxious scroll hijacking or excessively long empty stretches.

**CHAPTER 0 — ARRIVAL / THE PROMISE (first viewport)**
- View exactly inspired by intended target: high-end ivory atrium, skyline, camera at flattering wide angle, central crystal turning subtly, warm late-afternoon sun, panels floating around the hub, pedestal glowing at ground contact.
- Text: “Ideas we bring / to life.” Real HTML, editable.
- Motion: subtle 3D drift, orbiting light ribbons, occasional glass glints, small depth movement, premium microinteraction. User can immediately click Start a Project.

**CHAPTER 1 — APPROACH / ENTER THE CORE (next ~1–1.5 viewport scroll)**
- As user scrolls, text recedes elegantly, camera glides towards the cube, crystal expands, geometric shells rotate at different rates, reflections shift, gold ribbons create a natural visual guide. Four cards shift at different parallax depths and move outward to make room.
- The shot must transition from the *same* atrium. Use camera-matched keyframes / Higgsfield clips with controlled motion, not unrelated cuts.
- Transition must feel like entering an interactive architectural installation.

**CHAPTER 2 — WEBSITES / DIGITAL SHOWCASE**
- The camera follows the gold orbit into the Websites panel. The glass plane opens into a gorgeous, crisp, responsive website/device composition with real readable browser chrome and polished preview imagery. Smooth 3D tilt/parallax and an elegant reveal of “Websites that make a lasting impression” plus a meaningful service explanation.
- A clear “Explore Web Development” / “Start a Website Project” action routes to functioning content. No fake work claims or unlinked CTA.

**CHAPTER 3 — MOBILE + BUSINESS SOFTWARE / CONNECTED PRODUCTS**
- Transition from the website plane through a physically motivated camera move to a floating phone stack; rich app-preview screen animations and depth. Shift via a gold light path into business software dashboards: refined charts, data grids, process lines or transparent glass display tiles.
- Explain what Omniwebora can offer, not generic filler. Do not invent case studies, user counts or clients. Treat mock product screens as conceptual capability demonstrations and label them accurately.

**CHAPTER 4 — AI & AUTOMATION / INTELLIGENCE IN MOTION**
- Follow the moving gold light trail as it becomes a network of connected nodes / process flow, interacting with glass screens and the hub. Visualize a workflow before and after automation in a sophisticated way.
- Avoid the clichéd stock robot head, neon cyberpunk tunnel, random glowing brain, fake terminal output or binary rain. Intelligent visual storytelling > tech clichés.
- Give visitors functional next-step CTA to discuss automation.

**CHAPTER 5 — REASSEMBLY / WORK, PROCESS & CONVERSION**
- Pull back to a spectacular composed hero-world shot: four service systems rejoin around the Omniwebora core, gold trails settle into elegant loops; a genuine work/process section or honestly labeled concepts gives credibility. End on a concise high-value project invitation with visible contact form / CTA.
- Continue into well-crafted normal-flow About, Services, Work (actual verified projects only, otherwise capabilities/placeholder excluded from public indexing as appropriate), Process, Contact and footer. Do not sacrifice discoverability/conversion for a decorative scroll sequence.

Create a scene map in `docs/STORYBOARD.md`: chapter, visible content, camera path, source media files, corresponding actual page section, scroll range, interaction and fallback. Motion must be motivated by business discovery, not just spinning geometry.

## 5. HOW TO MAKE HIGGSFIELD CLIPS WORK AS SCROLL ANIMATIONS

Do not simply place several auto-playing 8-second videos on a page and call that “scroll-driven 3D.” Build reliable scrubbing and seamless visual continuity:

1. Design a shot list with clear SAME-WORLD start/end keyframes: H00 establishing hero, H01 push-in, W01 websites portal, M01 mobile stack, B01 dashboard, A01 automation network, R01 pullback. Generate fewer excellent clips rather than dozens of mediocre ones.
2. For each shot, specify subject, location, camera path, lens feel, duration (say 3–6s if supported), first/last composition, prohibited movement, negative requirements. Prefer image-to-video anchored to generated approved keyframes; use supported Cinema Studio camera controls only where actually available.
3. After generating, inspect frame zero, midpoint and last frame, and compare to adjacent shots. Regenerate/edit when the cube mutates, arches shift, lights jump or continuity fails. No AI-looking morph artifacts.
4. Decide per scene between (A) optimized image sequence under scroll control, (B) carefully tested video scrubbing with frame seeking when it works reliably, or (C) layered media plus GSAP DOM/WebGL transforms for lightweight transitions. Prioritize deterministic bidirectional playback, responsiveness and low bandwidth over blindly seeking a highly compressed video on every scroll event.
5. If using sequences: extract frames using available tooling, compress as AVIF/WebP when supported, choose effective sampling rate, preload immediate frames, lazy-load upcoming chapter, implement canvas renderer with DPR cap and requestAnimationFrame scheduling, handle resize and discontinuous progress, provide poster fallback. Avoid preloading hundreds of large images on initial page load.
6. If using video scrubbing: choose delivery codec/encoding/keyframe interval suited to seeking, implement smoothing, preload intelligently, measure on Safari and mobile, and switch to sequences/layered approach if frame updates stutter. Videos must not block page scrolling or produce black frames.
7. Use GSAP ScrollTrigger timelines for DOM text, card motion, core transforms, media progress and scroll transitions; map to chapter progress in one orchestrated timeline. Avoid fighting simultaneous animations. Dispose resources, cancel listeners and avoid memory leaks.
8. Add graceful reduced-motion, keyboard navigation and non-WebGL alternatives. On low-end/mobile, choose a curated animated or static alternative that still feels premium. Never force huge desktop video sequences onto mobile data.

Example shot prompt for image-to-video (adapt it to supported tool):
“Use the supplied approved hero keyframe as the visual source and beginning composition. Cinematic controlled 5-second continuous dolly-in toward the suspended layered transparent sapphire crystal at center-right, with very subtle 8-degree orbital shift clockwise, realistic parallax between foreground glass cards and tall cream marble architectural arches, gold light filaments naturally circling the cube, highly stable rigid cube geometry, same champagne-gold sunset lighting, same pedestal and skyline, premium architectural product-commercial photography, 35mm lens feeling, smooth stabilized motion, no people, no scene changes, no text generation, no logos, no geometry morph, no jumping camera, maintain composition and frame-to-frame identity. The final frame must be suitable for matching the next clip and still reserve readable UI overlay regions where necessary.”

Never promise perfect bidirectional video scrubbing without actual browser testing. A composited, optimized animation that runs smoothly beats a poorly seeking 4K clip.

## 6. DETAILED UI / DESIGN REQUIREMENTS

- Typography: art-directed high-contrast editorial serif for the two-line hero; premium restrained sans for nav/paragraph/controls. Use well-licensed fonts, preferably self-hosted or optimized. Control line breaks across screen widths. No default-looking huge black text.
- Colors: near-black sapphire/navy ~#071A39, blue accents ~#1677D2, burnished gold ~#B28A47, warm ivory ~#F7F3EC, delicate frosted glass, lighting-driven variations. Treat as starting values, match screenshot rather than slavish hex codes.
- Grid: desktop split composition 40/60, hero full viewport with safe text area. Four 3D-positioned cards arranged around central cube, maintaining silhouette and not colliding with logo/nav/headline/CTA. The right half should not look like a four-column SaaS feature grid.
- Nav: Home, About Us, Services, Our Work, Contact Us, Let’s Talk; functional anchors/pages, sticky behavior when appropriate. Avoid decorative search unless it truly searches site content.
- Page continuity: the site's lower sections should preserve the luxurious architectural/glass language in restrained forms. Alternating motion and breathing room, thoughtful page transitions, clear information architecture.
- Mobile: completely redesign composition intentionally; do not squish all four panels and the cube into 390 px. Hero retains one hero object, prominent headline, single primary CTA, and condensed accessible service navigation. Allow tap to explore each service. Lighten animation assets/resolution.
- Critical branding: if official logo exists, use it. If only screenshot exists, reconstruct a clean interim vector mark based on permitted supplied reference without creating inconsistent fake brand identity. Never put AI-rendered wordmarks in production assets.
- No cookie-cutter bento-grid everywhere, stock-looking fake dashboards, bland line icons replacing actual previews, excessive gradients, random rounded giant cards, or AI-written marketing clichés. Make each section feel custom designed.
- Include semantic headings, microcopy and truthful proof. Current known scope only: websites, mobile apps, business software, AI & automation. Design content modules so client quotations, case studies and pricing can be added later without redesign.

## 7. TECHNICAL DELIVERY / SEO / CRO

Use the existing project stack when sound, or select a maintainable SEO-capable framework such as modern Next.js App Router + TypeScript, React, Tailwind or refined CSS, GSAP/ScrollTrigger, and React Three Fiber only if valuable. Verify installed versions. Server-render/index critical content and do not hide all meaningful service copy inside canvas/video. No unnecessary providers or massive animation dependencies.

Must include:
- Real accessible project inquiry form with validation, success/error handling and an actual configurable server-side delivery method or clearly documented environment configuration. Never claim lead submissions succeed when they go nowhere. Spam protection/honeypot and secure handling of any secrets.
- Unique page titles, concise meta descriptions, canonical URLs, OG/Twitter images, JSON-LD Organization/ProfessionalService (only verifiable properties), sitemap.xml, robots.txt, alt text, semantic H1–H3, page-level service-specific intent, sensible URL structure, structured internal links, mobile nav, 404.
- Clean visible conversion strategy: hero CTA, appropriate service-specific CTAs, process proof, end-of-story inquiry, low-friction contact; realistic nonfictitious content. Analytics events implemented behind configurable analytics integration or clearly documented instrumentation, not fake analytics.
- Accessibility WCAG-aligned focus states, color contrast, descriptive links, reduced-motion behavior, usable keyboard navigation, no trapped scrolling, screen reader labels for interactive service panels. Videos decorative and muted by default; no unsolicited audio.
- Sensible media and render budgets. Optimize for mobile: responsive poster/format, preloading only first critical visual, AVIF/WebP backgrounds where appropriate, compressed MP4/WebM if video used, lazy loading for all later shots, canvas DPR clamps, intersection cleanup and adaptive quality. Aim Core Web Vitals LCP <= 2.5s, CLS <= 0.1, INP <= 200ms on realistic test conditions where achievable; run tests and report actual metrics rather than fabricate scores.
- Privacy and security: no client keys shipped, no API keys embedded in generated assets, no hardcoded external generation endpoint requests from browser at runtime, no unlicensed stock assets, and no third-party models included in client distribution.

## 8. CLEAN UP FAILED IMAGE-GENERATION STACK SAFELY

I explicitly want to remove unnecessary prior generation tooling/models installed for the FAILED attempt, and use Higgsfield as the only media-generation service for new work. But do this with an audit, NOT destructive blind cleanup:

1. Inventory existing repo: package.json, lockfile, Python requirements/venvs, `.mcp.json`, `.claude/`, skills, MCP settings, scripts, generation API clients, local model downloads/weights, generated images/video, hidden build directories. Search references in code; determine what is still actually used.
2. Identify obsolete media-generation tools (e.g., unused MuAPI adapters, abandoned image-generation prompts/scripts/SDKs, downloaded model weights or caches, unused generation service configurations). Only remove when they are clearly project-local, unused, and safe to eliminate. Record what they were and why removed.
3. DO NOT remove essential app dependencies, the actual brand/target images, working integration code, SEO assets, authenticated Higgsfield configuration, client data, credentials from external/global environments, unrelated projects or users' local installations. Do not delete `.env` or secrets silently. Do not globally uninstall anything without explicit permission. Keep backups or use reversible version-control changes; never run `rm -rf` on broad unknown directories.
4. Remove dead imports, scripts, unused dependency entries and affected lockfile entries; rerun installs/build/tests to verify nothing broke. Use `docs/CLEANUP_REPORT.md` with removed items, kept items and rationale.
5. Higgsfield is an authoring/build-time tool only. Final published website must use locally optimized media, and its runtime must not require Higgsfield MCP, billing, tokens or a generation API.

## 9. EXECUTION ORDER AND REAL QUALITY GATES

**Phase A — Audit:** Inspect existing app, assets, dependencies, current screenshot and target. Create concise plan, gap analysis and `docs/REFERENCE_GAP_ANALYSIS.md`. Inventory cleanup candidates. Verify Higgsfield connection/tool catalog/credits.

**Phase B — Visual bible:** Create `docs/ART_DIRECTION.md`, target desktop geometry map, style tokens, cinematography rules and shot list. Choose Higgsfield models only after checking actual tools. Start with one reference-conditioned keyframe and compare to target.

**Phase C — HERO FIRST:** Replace the bad initial hero with the intended architecture, detailed translucent crystal, sophisticated lit pedestal, four rich glass panels and carefully positioned authentic text. Do NOT proceed to elaborate scroll pages until the above-the-fold screenshot is convincingly close to target.

**Phase D — Scroll film:** Generate/reuse only the additional approved motion assets necessary for chapters 1–5; optimize and build the deterministic GSAP motion pipeline. Make it responsive and reverse-scroll functional. Match clip transitions. Add meaningful interactive service navigation.

**Phase E — Full site:** Integrate verified About, Services, Work/Capabilities, Process, Contact, footer, forms, metadata, conversions and site-wide motion system. Preserve and improve useful existing code.

**Phase F — Verify:** Run development server, open in real browser, compare at 1440×800/900, 1920×1080, tablet, 390×844 and 360×800. Capture real screenshots and, if feasible, short clips of actual scrolling. Test normal/reverse scroll, refresh halfway, direct route, mobile tap, keyboard, reduced motion, slow network, video failures, form validation, CTA and nav. Run lint, typecheck, tests, production build, Lighthouse or equivalent measurement, fix issues. Iterate until hero feels materially comparable to target. `docs/QA_REPORT.md` must contain factual results and blockers.

**Phase G — Handoff:** State exact files changed, which media truly generated with which Higgsfield tools, where optimized assets live, how to run locally, what was removed from old generation stack, what integrations need client credentials, measurements and remaining content to obtain from the client.

## 10. ACCEPTANCE CRITERIA — DO NOT DECLARE DONE UNLESS TRUE

[ ] First-viewport actual screenshot recognizably reproduces target reference, not failed first screenshot.
[ ] Luxurious believable architectural scenery, physical daylight/reflection, dimensional crystal, gold orbital glow, rich glass cards and multi-tier reflective pedestal are visible.
[ ] All important hero copy, CTA, nav and service labels are real browser text; logo is clean and legible.
[ ] 3D/pointer interactions respond genuinely and don't block usability.
[ ] Scroll moves a meaningful camera-led story through the SAME world, with careful transitions rather than unrelated images or random auto-play videos.
[ ] Generated shots are verified and stored locally; no fake claims of successful image/video generation.
[ ] Motion is smooth enough on desktop and has a beautiful low-bandwidth/mobile/reduced-motion fallback.
[ ] All routes, buttons, service links, nav and inquiry functionality are real, tested and credible.
[ ] SEO metadata, accessibility and responsive layouts are implemented.
[ ] Existing useful code remains intact; obsolete generation stack is cleaned only after safe audit.
[ ] No fabricated statistics, work samples, testimonials or client details.
[ ] Production build and QA run, with honest report and final screenshots.

Your mandate is the final functioning website, not an inspirational mood board or a PDF plan. Prioritize correcting the actual visible result. Do not ask me repetitive questions about already-provided design direction. Where client facts are missing, use truthful neutral copy and configurable content rather than inventing them. Execute with taste and restraint. Begin by inspecting both reference images and the current project, and tell me the concrete visual differences you found before implementing the rebuild.
