# OMNIWEBORA — MASTER IMPLEMENTATION DIRECTIVE FOR CLAUDE CODE

**Mode:** Execute as an autonomous principal creative director, technical lead, immersive-web engineer, conversion strategist, SEO architect, and QA owner. **Deliver functioning source code and a running local website, not just a plan or UI mock.** Work in the supplied project directory. Do not assume any existing files; inspect first. Treat this brief as the authoritative desired outcome, subject to evidence about existing project constraints.

## 0. Project mission and acceptance philosophy

Build a bespoke, premium, visually spectacular, fast, SEO-ready, conversion-oriented website for **Omniwebora**, a digital solutions studio. The client-provided visual reference is at `reference/omniwebora-visual-reference.png`. Study it closely before producing layouts. The reference is a **creative direction**, not a background image or a pixel-perfect screenshot to paste. The delivered hero must be an **authentic real-time interactive 3D scene** (Three.js / React Three Fiber or justified comparable stack) combining deliberate lighting, geometry, depth, glass materials, organic motion, scroll choreography, responsive interface layers and meaningful interactions. The visitor must feel they are exploring a crafted digital environment, not watching a decorative video behind ordinary text.

Desired standard: custom studio-level craft comparable to an ambitious USD $10k bespoke agency project. This is a **quality bar, not a claim about the actual budget**. Function, clarity, originality, narrative, maintainability, accessibility, SEO, and conversion are equally important as spectacle.

**No AI slop.** Reject generic SaaS templates; random purple gradients; undifferentiated cards; emojis as icons; stock-design robots everywhere; gratuitous particles; massive boxed sections; broken interactions; a plain image as the entire hero; one screen followed by empty generic sections; and fake testimonials, fabricated portfolio projects or unsupported trust metrics.

Build an auditable, runnable project end-to-end. Make reasonable reversible decisions without continuously requesting approval. Reserve unknown business claims, branding rights and production credentials for client confirmation. Never mark a task complete that has not actually been executed or verified.

## 1. What is known vs not yet verified

Known FROM THE PROVIDED VISUAL ONLY:
- Brand shown: **Omniwebora**. Spelling must be consistent.
- Top-level navigation shown: Home, About Us, Services, Our Work, Contact Us; primary CTA "Let's Talk".
- Our Work design direction: refined architectural atrium, porcelain/ivory stone, midnight navy, electric cobalt, champagne-gold rim lighting; sculptural prismatic central glass cube; holographic floating service panels; long shadows and a futuristic, reassuring high-end tone.
- Four depicted service categories: **Websites**, **Mobile Apps**, **Business Software**, **AI & Automation**.
- Headline style: expressive editorial serif headline "Ideas we bring to life." with a gold-accent line and smaller, readable descriptive copy; CTAs "Start a Project" and "View Our Process".
- Metrics shown within visual: 20+ Projects Delivered; 10+ Industries Served; 100% Client-Focused; Continuous Innovation. **These are screenshot claims, NOT independently confirmed. Hide from published live copy unless approved or clearly label internally as `verificationRequired`.** Do not invent equivalents.

Not yet known: actual address, phone, company legal name, actual domain, service pricing, guaranteed outcomes, project names, logos/clients, case study outcomes, founder identities, public reviews, certifications, location, actual testimonials, exact project count, legal privacy details. Keep all uncertain details in a structured `content/site.ts` / `site-config.ts` with TODO flags. Never invent them on public pages. No fabricated social proof. Use carefully written capability-led provisional content that does not assert unverified facts.

## 2. Read and use design/3D skills; inspect repository

First inspect the existing repository, assets, lockfile, package manager, scripts, existing designs, deployment targets and all instructions. Do not destroy or overwrite existing work. Use `git status` and preserve existing changes. If repo is empty, scaffold carefully.

Use these sources as guidance AFTER examining their licensing/security and current compatibility:
- Official Anthropic `frontend-design`: `https://github.com/anthropics/skills/tree/main/skills/frontend-design`; install project-specific if missing (example: `npx skills add anthropics/skills --skill frontend-design -a claude-code`).
- Independent community Three.js skills: `https://github.com/cesartevisual/threejs-skills`, especially `threejs-web`, `threejs-r3f`, `threejs-animation`, `threejs-interaction`, `threejs-shaders`, `threejs-performance`, `threejs-accessibility`, `threejs-testing`. You may install a targeted subset after reviewing their content; treat these as **third-party, not official Three.js** documentation.
- A custom project skill is already bundled at `.claude/skills/immersive-3d-web/SKILL.md`; explicitly read and apply it.
- Primary technical truth sources: `https://threejs.org/docs/`, `https://r3f.docs.pmnd.rs/`, `https://gsap.com/docs/`, `https://nextjs.org/docs`, `https://developers.google.com/search/docs`.

Do not blindly execute remote installer code. Verify dependency versions and APIs from official sources instead of hallucinating package exports or shader syntax. Add only justified dependencies. Record chosen versions and reasons.

**Produce brief internal design documentation before coding**: `docs/design-direction.md`, `docs/interaction-storyboard.md`, and `docs/architecture.md`, then proceed directly with implementation. These must guide work rather than substitute for it. Choose one coherent creative direction and elevate it through iteration.

## 3. Visual thesis and art direction

**Concept name: THE ORIGIN ENGINE** — ideas born as light become interconnected working digital products. Think luxury architecture fused with precision optics and quiet high-tech sophistication. Signature: a luminous kinetic architectural prism/cube suspended within an open panoramic atrium; dynamic gold data routes link it to four glass service worlds. The scene should not look like a video-game HUD or stock 3D asset showcase. It should look composed by an art director, with intentional light, negative space, restraint, texture, and hierarchy.

Visual direction:
- Midnight navy / deep ink `#0C2349`, signal cobalt `#1467C5`, porcelain `#FAF8F3`, glass mist `#E7EFF7`, antique champagne gold `#B59258`, desaturated graphite `#4D5B70`. Treat values as starting design tokens; tune them against the reference and contrast needs.
- No flat purple/blue-gradient wallpaper. Develop an architecture-inspired horizon and bespoke spatial composition using actual geometric depth, layers, perspective, warm light shafts, realistic materials and restrained art-directed bloom.
- Typography: a distinctive editorial serif for display with strong controlled line breaks and a restrained modern sans for labels/body. Choose production-licensed web fonts deliberately; optimize font loading and ensure fallback quality. Avoid default Inter everywhere.
- Organic forms with structural geometry; generous breathing room; visual editorial rhythm; precise interactions; gold used sparingly for emphasis rather than coating everything.
- Screenshot is primarily a **desktop visual reference**. Adapt intelligently; do not shrink the entire desktop artboard onto a phone.

Design principles: first 3 seconds communicate what Omniwebora does; next 15 seconds demonstrate differentiated capability; every journey offers a clear next step. The page must still make sense with motion disabled.

## 4. Hero: fully specified immersive real-time scene

At desktop >= 1024px, construct a split scene:
- **Left ~43%**: semantic HTML foreground content, elegantly staggered editorial headline, useful positioning description, "Start a Project" CTA linking to working contact/project inquiry, "View Our Process" CTA linking to working process section/page. Keep readability and contrast excellent.
- **Right ~57%**: carefully framed REAL R3F 3D composition, with central multi-layered transparent refractive-looking geometric engine — an actual volumetric object with polished bevels, internal luminous core, edge highlighting, rotating translucent shells and an understated gold energy orbit. Optimize expensive physical transmission with a measured shader/material strategy; avoid full-scene ray tracing.
- Four service satellites/panels spatially arranged around the central engine: Websites (top-left), Business Software (top-right), Mobile Apps (bottom-left), AI & Automation (bottom-right). The plates look optically suspended; render their **readable text and CTA affordances using accessible HTML positioned over or adjacent to 3D**, not tiny in-canvas inaccessible text.
- Thin animated service connection strands and occasional motion impulses imply data flowing from idea to outcome; use curves / instancing/shader effects with a purposeful map, not random noise.
- Architectural world: cinematic atrium hints, sunlight through tall arched structures, horizon glow, elegant plinth and visual depth. This can be lightweight custom geometry with a few art-directed optimized textures; not a single static hero backdrop and not a heavyweight downloaded architectural scene.
- The central object is a company-wide navigation metaphor: services animate together when idle; when users select a service the system gently reorients to that capability, focus transitions, one panel highlights, corresponding service explainer appears, and a real anchor/page link is offered.
- Pointer movement produces subtle damped parallax (small amplitude, never nausea). Hover adds optical focus, controlled highlight and contextual label. No constant heavy mouse tracking re-renders.
- On load: compelling staged reveal in 1–2.5 seconds after main text is visible; avoid blank-screen preload. SSR semantic heading remains visible before WebGL. Visual scene loads progressively with a beautiful authored non-animated fallback.
- Preserve right-side usable space; no clipping of main composition at typical 1366x768, 1440x900, 1920x1080. Text must never overlap service tiles.
- On touch: tap accessible service tabs, no reliance on hover; on mobile use a simplified scene or high-quality authored fallback with service accordion/cards below.
- Provide a visual-state machine: INTRO -> IDLE -> HOVER_SERVICE -> ACTIVE_SERVICE -> SCROLL_TRANSITION -> SETTLE; plus REDUCED_MOTION and NO_WEBGL capability modes. Animations must transition predictably, be interruptible, and clean up on unmount.

Avoid: generic floating smartphone mockups, stock robot art, incoherent lighting, hover elements that cannot be clicked, fake perspective on flat picture. Build custom authored objects from actual geometry/material/shaders and service-specific UI elements.

## 5. Scroll journey — narrative, NOT a pile of templates

Build an intentional sequence with at most a few signature heavy 3D moments, while the rest of the website stays fast and highly readable.

**Homepage sections** (all with working route/anchor semantics):
1. **Hero — The Origin Engine.** Clear positioning, compelling real-time environment, primary CTA.
2. **What We Build — Four Product Worlds.** Four service chapters presented as an editorial gallery with one coherent 3D motif, real explanatory copy, clear benefit, technical outcomes, and a service CTA. No jargon-only claims.
3. **From Vision to Launch — Process.** Discovery -> Strategy/Architecture -> Design & Prototype -> Engineering -> Launch & Iterate. Animate a single gold progress thread/camera movement synchronized with readable DOM sections. Clarify this as the proposed methodology, not a verified company-exclusive workflow unless approved.
4. **Selected Work / Our Approach.** A beautiful honest gallery structure: if approved case studies are available, use them; otherwise display "Projects and case studies coming soon" or editorial capability examples explicitly labeled **illustrative concepts** with no fake client names/outcomes. Ensure the section is still useful, not blank.
5. **Differentiation / Why Work With Us.** Concrete process-level strengths supported by the implementation brief (responsive experiences, tailored tools, integrated automation, practical delivery), written as provisional capability descriptions, not unverified awards or client-count claims.
6. **Inquiry / Contact — Let's Build What's Next.** High-conviction conversion section, brief project inquiry, optional service selection, no fake social proof.
7. **Footer** with service page links, work, process, contact, legitimate legal links and social profiles only if verified.

**Full pages/routes:** `/` (Home), `/about`, `/services`, `/services/websites`, `/services/mobile-apps`, `/services/business-software`, `/services/ai-automation`, `/work`, `/process`, `/contact`, `/privacy` (draft, flagged for legal review). If content is thin or unconfirmed, favor strong substantive explanation over empty SEO doorways. Consider `/work/[slug]` only when real case studies are supplied. Create real navigation and accessible mobile menu. Provide appropriate breadcrumbs on interior pages. No dead links. Any unapproved/legal-placeholder route must not masquerade as verified policy; offer a clearly marked prelaunch draft / configurable publishing gate.

Distinctive page treatments, not a cloned homepage hero on every page. Services pages should emphasize problem -> solution -> deliverables -> workflow -> qualified CTA, with honest, illustrative capabilities where needed.

## 6. Motion direction and interaction contract

Use GSAP/ScrollTrigger when justified, with React-safe cleanup (`@gsap/react` or equivalent), and R3F `useFrame` with refs for frequent visual updates. Animate the 3D camera and object state with damping; do not set React state at 60fps. Scroll-linked 3D needs a synchronized deterministic timeline, graceful interruptions and resize recalculations. Do not hijack default scrolling. Avoid stacked sticky-scrolling traps or a scroll library unless evidence demonstrates benefit. Give each interactive element a clear hover/focus/pressed state and real action.

Motion hierarchy:
- Primary: hero engine rotations and service-to-core transitions.
- Secondary: gold path pulses, lighting temperature shifts, editorial section entrances.
- Tertiary: buttons, underlines, restrained texture movement.

Implement `prefers-reduced-motion`, pause when tab hidden/offscreen, stop/reduce expensive rendering for inactive scenes, clamp DPR and postprocessing. Respect keyboard navigation and touch. All panel behaviors need plain DOM equivalents and focus handling. Avoid content shifting during hydration.

## 7. Technical architecture

Unless existing repo dictates otherwise, use a stable, production-appropriate stack:
- Next.js App Router + TypeScript + React with server-rendered metadata/content. Pick compatible stable versions and pin package manager lockfile.
- CSS Modules and/or carefully configured Tailwind; prefer authored styles and CSS tokens, not an off-the-shelf component-heavy visual design.
- Three.js, `@react-three/fiber` compatible with installed React version, `@react-three/drei`, and GSAP/ScrollTrigger; optional simple custom GLSL materials only where helpful. Check package compatibility before installation (for React 19, R3F v9 is the established stable track; don't blindly install alpha APIs).
- Dynamically import heavy WebGL scene on client; no server-side WebGL. Keep SEO and essential content in SSR/static HTML. Use `next/image` or equivalent for raster assets; modern responsive source sets; `next/font` or self-hosted licensed fonts.
- Code splitting, suspense/loading fallback, asset budget, safe error boundary, WebGL capability detection + context-loss recovery, mobile performance adaptation.
- Content and unknown business claims driven from single typed configuration rather than scattered hard-coded guesses; component separation for `3d/`, `sections/`, `layout/`, `content/`, `lib/`, `app/`, tests.
- Source accessibility, metadata and analytics instrumentation must be independent of WebGL.
- No external runtime dependency on MuAPI. Generated visual assets must be downloaded locally, optimized, and served by the site. MuAPI is an authoring tool, not something every visitor must call.

Use animations and shaders wisely. Laptops should not spin fans unnecessarily. Add runtime graphics-quality profiles (high/standard/low) based on hardware signals and explicit user selection only if genuinely beneficial, with stable automatic fallback.

## 8. MuAPI MCP / media pipeline — OPTIONAL production assets, NOT the hero engine

MuAPI hosted endpoint: `https://api.muapi.ai/mcp`. The project-provided `.mcp.json` uses the variable `MUAPI_KEY`; do not alter it to include a literal token. Confirm with `claude mcp list`, `/mcp` and an actual harmless discovery call before relying on MuAPI. If unconnected, document and continue with procedurally authored 3D and locally crafted CSS/SVG assets. Never falsely report connection success.

MuAPI upstream source: `https://github.com/SamurAIGPT/muapi-mcp-server`. Discover live model/tool catalog first: `search_models`; if applicable use `muapi_image_generate`, `muapi_image_edit`, `muapi_video_generate`, `muapi_video_from_image`, `muapi_predict_result`, etc., based on actual exposed schemas. Do not assume a given model is available. Media jobs are asynchronous: poll and verify completed outputs before using. Check balance and estimate generation volume before spending significant credits. Do not access account top-up, key creation or deletion without explicit user consent.

Where MuAPI helps: optional bespoke atmospheric texture plates, material studies, OG/social image, editorial secondary illustrations, one subtle pre-rendered secondary vignette only if it improves storytelling, or carefully art-directed thumbnail assets. **Never substitute a generated image/video for the required real-time 3D hero**. Avoid obvious AI artifacts or inconsistent lighting. Optimize and locally store approved generations, add usage/provenance notes (`docs/asset-manifest.md`) and ensure rights/terms for commercial use are reviewed. Any provider-hosted temporary URL should be downloaded and not hotlinked into production.

Never print, log, commit, embed in source, or send the user-provided MuAPI secret in design documents or browser code. Use only environment-variable references. Exclude `.env*` except safe examples from Git. If a secret appears in logs/commits, treat as an incident and request rotation.

## 9. Messaging, content, conversion

Audience hypotheses: founders, small/midsize companies, established operations seeking custom digital products and workflow automation. Mark these as strategic assumptions until customer research. Do not claim niche focus without confirmation.

Proposed positioning (refine after page design): "We turn ambitious ideas into digital products that feel effortless." The imagery can keep the reference's "Ideas we bring to life" motif; ensure above-fold copy immediately answers **what does the company do?** Suggested functional supporting line: "Websites, mobile apps, business software and AI automation designed around the way your business works." Avoid unverifiable superlatives, fake statistics, client testimonials, ambiguous "award-winning" claims.

Primary conversion throughout: **Start a Project** / **Let's Talk**. Secondary conversions: Explore Services, View Our Process, See Our Work. Every route should have one primary intent and a consistent CTA progression. Build a working brief-form experience at `/contact` including name, business email, company (optional), interested service, project description, approximate timeline, optional budget range (only if strategically appropriate), privacy agreement, validation and informative success/failure states. Make fields low-friction. Accessibility-first labels, errors and focus state. Capture UTM/source fields with consent and appropriate disclosure.

Form processing: implement real server-side validation (e.g. Zod), input length caps, sanitization/escaping appropriate to target, honeypot, reasonable abuse protection/rate limiting, bot mitigation if available. Integrate a real configured provider for lead notifications/storage (e.g. Resend + optional database) through server-only environment variables. If credentials are missing, make the limitation obvious in developer docs and do not fake successful submissions. Unit/integration tests may use a stubbed transport but production must fail safely and clearly until a real transport is configured. No public secret leakage. Include anti-spam, privacy and consent review checklist.

Tracking: propose minimal, consent-aware privacy-respecting event names (`view_service`, `start_project`, `submit_inquiry`, `inquiry_success`, `click_process`, `view_work`) and only activate configured real analytics. Never invent conversions or dashboards. Define measurement instructions (`docs/measurement-plan.md`).

## 10. SEO and information architecture

No canvas-only SEO content. Render text, heading structure and links in semantic SSR HTML. Every indexable URL has a unique title, description, canonical, one coherent H1, useful original copy, internal linking, appropriate descriptive anchor text, social metadata, OG image, robots directives and sitemap membership. Static `robots.txt`/dynamic route sitemap, correct 404. Structured data: `Organization`, `WebSite`, and service-appropriate types only with verified facts; never inject fake ratings/reviews or invented address. Add `FAQPage` markup only if actual visible FAQ content and eligibility justify it, not as a ranking trick.

Avoid keyword stuffing and misleading geo pages. Draft specific metadata, headings and conversion copy for the four core services. Create page-specific image alt descriptions and a CMS/content handoff document for edits. Staging site should be `noindex` and production indexed only after domain/business approvals. Validate actual HTML response and crawler discoverability. Do not claim guaranteed SEO rankings.

## 11. Performance / accessibility targets and fallbacks

Measure rather than claim. Initial quality targets under representative mobile test conditions: LCP <= 2.5s, INP <= 200ms, CLS <= 0.1; Lighthouse performance/SEO/accessibility best effort at >=90 where practical, with traceable results and optimization until bottlenecks are addressed. Core Web Vitals are operational targets, not a promise until measured. Prioritize meaningfully fast first contentful/interactive text; the 3D cinematic moment is progressive enhancement.

Optimizations: defer scene initialization until HTML paints, limit DPR (~1 to 1.75 after profiling), avoid enormous textures/geometry counts, dispose GL resources, use instancing where useful, minimize state updates, quality adapt, compress images, preload only essential assets, self-host subsetted fonts, pause off-screen render, avoid giant autoplay video, avoid large shader compile stalls. Design for good midrange devices, not only a developer's GPU. Document baseline and final bundle weights, trace timings and typical FPS by viewport.

Fallbacks MUST remain art-directed: reduced-motion static composition plus accessible tabs; no-WebGL elegant CSS/SVG hero; low-power/mobile may use simplified 3D or authored still + functioning content. Do not interpret the reference as permission to render illegible tiny UI on a phone. Confirm contrast >= WCAG AA for relevant text, keyboard operability, visible focus states, logical headings, accessible nav/dialog/forms, valid ARIA, tap target size, skip navigation and no flash/strobe.

## 12. Mandatory QA, screenshots, iterative critique

Use browser automation if available (e.g. Playwright) to actually boot, visit and interact with the site. Test at minimum: 1920x1080; 1440x900; 1366x768; 768x1024; 390x844; 360x800. Take and inspect screenshots, preferably at initial render, after animation settles, mid-page, key service hover/selection, and contact form. Fix visually measured issues, not just TypeScript errors.

Verify:
- Actual WebGL 3D scene exists and visibly changes as the user interacts (not just image/video).
- 3D is smooth, readable and composed at intended viewports; no text overlap, no horizontal overflow.
- All nav links, 4 service selectors, process CTA, project CTA, work links, back navigation, footer, keyboard focus, mobile menu and form operate.
- With JavaScript/WebGL failure, critical content and navigation still work to the extent possible; reduced-motion behavior is appropriate.
- No incorrect SEO titles, duplicate H1, missing route content, unsupported claims, missing alt text, console errors, network 404s, hydration warnings, uncaught WebGL errors or leaking credentials.
- Working local run, lint, typecheck, tests, production build. Clearly distinguish verified tests from planned ones.
- UX review: above-fold message clarity, CTA prominence, scroll logic, hierarchy, polish, visual originality, brand consistency and restrained motion. Every section should look purposely designed.

Before declaring completion, do **at least two genuine visual review/repair passes** if browser tools are accessible. Save screenshot evidence under an appropriate ignored local path (or explicitly tracked screenshots folder, based on project conventions). Write `docs/qa-report.md` with failures found, fixes and unresolved items. If the environment cannot render screenshots, disclose that limitation and provide exact manual QA commands instead of falsely claiming visual verification.

## 13. Workflow, operational constraints and output contract

Work in milestones, execute continuously, do not stop after a design explanation:

**A — Inspect & establish**: repo state, project instructions, business facts and unknowns, skill availability, MuAPI visibility, dependencies, visual reference. Create concise `docs/design-direction.md`, `docs/interaction-storyboard.md`, `docs/architecture.md`, `docs/content-verification.md`.

**B — Foundation**: scaffold/preserve Next.js, site tokens, shared layout/nav/footer, content configuration, routes, safe SEO defaults, responsive semantic hero shell, asset pipeline.

**C — Immersive hero**: actual geometry, materials, lighting, composition, motion states, accessible services overlay, CTAs, fallback. Tune screenshot by screenshot.

**D — Complete site**: pages, elegant section transitions, services, process, work with honest content treatment, about, lead capture/contact; functional navigation.

**E — SEO/conversion/accessibility**: metadata, sitemap/robots, schema only if verified, contact pipeline integration or clear credential blocker, analytics hooks, mobile and assistive tech.

**F — Test/optimize/deliver**: verify runtime, build and routes, interactions, WebGL, screenshots, test results, performance budgets, reports, installation instructions, deployment readiness.

Make pragmatic progress even if media tooling or paid APIs are unavailable; do not block the entire website on a generative media provider. Do not spend credits recklessly. Do not publish, pay for services or deploy to a production domain without authorization. Do not replace confirmed client branding with speculative variants.

Provide a final report with:
- Repo location, actual files changed, exact run commands, local development URL if server truly started.
- What was implemented, with clear evidence especially for 3D vs static/video.
- Desktop/mobile screenshots or precise reason unavailable.
- Routes and clickable features; typecheck/lint/test/build results with pass/fail, not guessed.
- Verified vs unverified content and required client approvals.
- MuAPI tool connection status and generated assets with any consumed credits if known; do not reveal key.
- Environment variable names needed for production and how contact leads will be delivered.
- Performance/accessibility/SEO issues remaining, prioritized.
- Concise list of next improvements that truly need client input.

**DO NOT STOP AT A PLAN. BEGIN CODING AFTER YOUR BRIEF INSPECTION. BUILD THE COMPLETE BEST-EFFORT WEBSITE, RUN IT, TEST IT, AND REPORT THE TRUTH.**
