# Omniwebora website

Marketing and lead site for Omniwebora: six services (Website building, Mobile applications, Custom software: ERP & CRM, Business automation, Digital marketing, Enterprise platforms). Next.js 16 App Router, statically generated. On wide screens every page is a scroll-driven film in one building (Higgsfield footage, scrubbed by `src/components/film/engine.ts`) with live interfaces on its displays; on phones and with reduced motion the same chapters are stacked scenes.

**Start with `reports/HANDOFF.md`** (state, decisions, open owner items). Business facts: `content/FACT_REGISTER.md` (every claim on the site traces to it). Business source: `reference/brochure/`.

## Requirements
Node.js ≥ 20.9 (developed on 22.19), npm 10.

## Commands
```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build (all pages static except /api/inquiry)
npm start            # serve the production build
npm run typecheck
npm run lint
npm test             # Vitest unit tests
npm run test:e2e     # Playwright + axe (run `npm run build` first; first time: npx playwright install chromium)
```

## Project map
| Path | What it is |
|---|---|
| `src/app/` | Routes: `/`, `/solutions` (+ six detail pages), `/industries`, `/approach` (How We Work), `/pricing`, `/about`, `/contact`, `/privacy`, `/thank-you`, `POST /api/inquiry` |
| `src/components/film/` | The film system: `engine.ts` (eased scroll, video scrubbing, joins), `CinemaFilm.tsx` (chapters, stills, overlays), shared chapter styles |
| `src/components/<page>/` | Each page's film and tools (`HomeFilm`, `PricingFilm`, `ContactFilm`, `RoomFilm`, …) |
| `src/components/displays/` | The live interfaces shown on the walls (website, phone app, operations console, …) |
| `src/content/` | All copy and data (services, pricing, navigation, site facts). `film.generated.ts` is generated, do not edit by hand |
| `public/assets/cinematic/` | Optimised footage (short-GOP MP4) and stills (WebP) |
| `scripts/cinematic/` | Asset pipeline (`build_film.py` builds clips, stills and display rectangles into `film.generated.ts`) |
| `qa/` | Browser QA scripts (screenshots, overlap checks, performance benches) |
| `tests/` | Vitest unit tests and Playwright end-to-end + accessibility tests |
| `docs/`, `design/`, `reports/` | Briefs, design notes, audits and the running handoff log |

QA helpers (against a production server, e.g. `npm start -- -p 3200`; in Git Bash prefix route arguments with `MSYS_NO_PATHCONV=1`):
- `node qa/page-film.mjs http://localhost:3200 / /pricing`: every chapter of a film page at 1440×900.
- `node qa/mobile-shots.mjs`: full-page phone screenshots of every route.
- `node qa/brief-shots.mjs`: each step of the contact brief.
- `node qa/overlap-check.mjs /solutions/web-development`: words vs wall displays, numerically.

## Environment variables
Copy `.env.example` to `.env.local` (and set the same in Vercel). Never commit real values.

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical origin of the deployed site |
| `NEXT_PUBLIC_ALLOW_INDEXING` | `true` only on the approved production domain; otherwise every page is `noindex` and robots.txt disallows all |
| `RESEND_API_KEY`, `INQUIRY_FROM_EMAIL` | Email delivery of project briefs via Resend (sender on a verified domain) |
| `INQUIRY_TO_EMAIL` | Inbox for briefs; defaults to info@omniwebora.com |
| `INQUIRY_WEBHOOK_URL` | Alternative: POST briefs as JSON to a CRM/automation webhook |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp number (digits, with country code); empty = no WhatsApp link |
| `INQUIRY_DEV_LOG` | `1` in development only: log briefs to the server console |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Optional cookieless analytics; empty = nothing is sent |

Without a transport the brief says plainly it was not sent (HTTP 503) and offers a ready-filled email to info@omniwebora.com instead; it never pretends to succeed.

## Deployment
Hosted on Vercel (framework preset Next.js, no extra settings). The only server code is `POST /api/inquiry`; its rate limiter is in-memory per instance (`src/lib/inquiry/rateLimit.ts`), so back it with a shared store if abuse becomes a concern. Before going live on the real domain, complete `reports/CONTENT_APPROVAL_CHECKLIST.md` and set `NEXT_PUBLIC_ALLOW_INDEXING=true` there only.

## Previous landing page (v1)
The first home page (a crystal "Omniwebora" core on a terrace with a push-in film) was replaced by the current story film. Its rendered media is kept in `public/assets/cinematic/` (`h00-hero-*`, `h01/`, `h01-end-*`, `r01-pullback-*`) and described in `src/content/heroWorld.ts`, so it can be rebuilt if wanted. The original v1 component code predates this repository.
