> Updated 2026-10-29 for the governance rebuild. Facts and their sources: `content/FACT_REGISTER.md`; owner checklist: `reports/CONTENT_APPROVAL_CHECKLIST.md`.

# Content handoff: where to edit what

All copy lives in typed files under `src/content/`. Pages read from them, so changing a value updates every place it
appears. The TypeScript build fails if a required field is missing.

| What | File | Notes |
|---|---|---|
| Business facts, verification flags, metrics, logo path | `src/content/site.ts` | Set `verified: true` **only** after client approval. Unverified items never render |
| Navigation and header CTA | `src/content/navigation.ts` | |
| Services (all copy, SEO titles/descriptions, hero explainer, 3D tint) | `src/content/services.ts` | `metaTitle` ≤ 60 chars, `metaDescription` ≤ 170 (unit-tested) |
| Process stages | `src/content/approach.ts` | Seven stages from the brochure (p.7); deliverables marked as typical |
| Work: illustrative concepts | `src/content/work.ts` | Always rendered with an "Illustrative concept, not a client project" badge |
| Principles ("Why work with us") | `src/content/principles.ts` | Provisional capability statements |
| Site search entries | `src/content/searchIndex.ts` | Generated from pages, solutions, stages and industries |
| Form options (services, timeline, hidden budget ranges) | `src/lib/inquiry/options.ts` | `SHOW_BUDGET_FIELD` is `false` until the client defines ranges and currency |
| Privacy notice (draft) | `src/app/privacy/page.tsx` | Flip `site.privacyPolicyApproved` after legal review (this also adds it to the sitemap and allows indexing) |

## Image alt text
Every illustration is decorative and paired with real text, so it uses `aria-hidden`. If photography or case-study
screenshots are added, give each a specific `alt` describing what it shows ("Booking screen showing three available
time slots"), not "image of website".

## Adding real case studies
1. Set `site.caseStudiesPublished = true`.
2. Add a `caseStudies` collection (title, client with permission, problem, constraints, approach, results, images).
3. Create `src/app/work/[slug]/page.tsx` with `generateStaticParams`, and replace the concepts on `/work` and the home
   "Selected work" section.
4. Only publish measured results the client has approved in writing.

## Moving to a CMS later
The content files are plain typed objects, so they map directly to CMS models (Sanity, Contentful, Payload, etc.).
Keep the `verified` flags as fields so the publishing gate survives the move.
