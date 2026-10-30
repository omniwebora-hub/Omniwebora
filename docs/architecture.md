# Architecture

## Stack (pinned in `package.json`)
| Package | Version | Why |
|---|---|---|
| next | 16.4.3 | App Router, static generation, metadata API, route handler for `/api/inquiry`, `next/font`, `next/image`, `next/og` |
| react / react-dom | 19.3.1 | |
| gsap | 3.15.0 | ScrollTrigger for the home push-in film and the closing pull-back (code-split, loaded only where used) |
| zod | 4.6.7 | One inquiry schema shared by client and server |
Dev: TypeScript 5.9, ESLint 9 (next config), Vitest 5, Playwright 1.64 + axe-core.

## Layout of `src/`
- `app/`: routes (`/`, `/solutions`, `/solutions/[slug]`, `/industries`, `/approach`, `/pricing`, `/work`, `/concept-lab`, `/about`, `/contact`, `/thank-you`, `/privacy`), `api/inquiry/route.ts`, `sitemap.ts`, `robots.ts`, `opengraph-image.tsx`, `fonts/` (self-hosted Newsreader display cut + OFL).
- `content/`: the data layer every page renders from: `solutions.ts`, `pricing.ts`, `approach.ts`, `industries.ts`, `principles.ts`, `navigation.ts`, `site.ts` (verification flags), `heroWorld.ts` + `cinematic.generated.ts` (hero geometry and camera track), `searchIndex.ts`. Provenance: `content/FACT_REGISTER.md`.
- `components/hero/`: protected home hero (`Hero.tsx` server-rendered; `HeroCinema.tsx` client enhancement: GSAP ScrollTrigger timeline, canvas frame sequence, camera-matched logo and panels, pointer parallax).
- `components/home/`: home chapters (friction→connected, evolution, industries, Concept Lab teaser, stages, scope picker).
- `components/solutions/`: capability map, solution template, and one signature interaction per solution (responsive browser, phone journey, module console, automation runner, topology map, layer explorer).
- `components/pricing/`: pricing desk, scope guide, tier list. `components/demos/`: Concept Lab demos. `components/approach/`, `about/`, `industries/`, `contact/` (brief studio).
- `components/previews/`: HTML interface previews (`ServicePreview`, `LazyPreview`).
- `components/layout/`: header (mega-menu, search dialog, mobile menu), footer, logo, breadcrumbs (+ BreadcrumbList JSON-LD).
- `lib/`: `seo.ts` (metadata + JSON-LD helpers), `inquiry/*` (schema, options, sanitize, rate limit, transport), `analytics.ts` (consent-free facade; Plausible only if configured), `tabKeys.ts` (ARIA tabs keyboard), `utm.ts`.

## Rendering model
All pages are statically generated. Readable content (copy, prices, links) is server-rendered HTML; interactive pieces are small client components (React state, no global store). Decorative interface previews below the fold mount on demand. The home film runs only for desktop, fine motion-allowed visitors; everyone else gets the still and stacked layouts.

## Media
Higgsfield-rendered stills and the push-in frames live in `public/assets/cinematic/` (see `assets/ASSET_MANIFEST.md`), produced by `scripts/cinematic/build_assets.py`. No runtime calls to any generation service.

## Inquiry pipeline
`BriefStudio` → `POST /api/inquiry` → same-origin check → size limit → Zod → honeypot + min fill time → rate limit → transport (Resend or webhook; 503 when unconfigured) → client navigates to `/thank-you` only on acknowledgement. Verified with `qa/form-delivery.mjs`.

## Testing
`npm test` (content honesty, pricing exactness, asset integrity, inquiry schema/transport), `npx playwright test` (routes/SEO, navigation, hero/film, reduced motion, mobile, brief + API, pricing, Concept Lab, keyboard, axe on all routes). QA scripts in `qa/`.
