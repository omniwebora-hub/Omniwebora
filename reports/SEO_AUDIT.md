# SEO audit

Measured on the production build (`next start`) on 2026-10-29, by fetching each route's HTML and with Lighthouse.

## Per-route metadata (all 17 routes)
- Exactly one `<h1>` per route; unique `<title>` and meta description (asserted by `tests/e2e/site.spec.ts`).
- Canonical URL on every route (`alternates.canonical`, resolved against `NEXT_PUBLIC_SITE_URL`).
- Open Graph + Twitter card tags on every route; site OG image from `src/app/opengraph-image.tsx`.
- Titles shortened to ≤ ~60 characters including the " | Omniwebora" suffix (solutions, industries, approach, pricing, contact, home were 63–87 before this audit).
- Descriptions are 150–182 characters; Google may truncate those above ~160. Acceptable; trim when copy is client-approved.

## Structured data (JSON-LD, verified facts only)
| Type | Where | Notes |
|---|---|---|
| Organization + WebSite | every page | Name, URL, description. Logo/email/sameAs are added automatically only when `site.ts` marks them `verified`. No address, rating or review. |
| BreadcrumbList | every interior page | Emitted by `Breadcrumbs`. |
| Service | `/solutions/*` (6) | `name`, `description`, `url`, `provider`. |
| FAQPage | `/pricing` | Five genuine Q&As, also visible on the page. |

## Crawling and indexing
- `robots.txt`: staging-safe, `Disallow: /` unless `NEXT_PUBLIC_ALLOW_INDEXING=true`; then `Allow: /`, `Disallow: /api/`, sitemap link.
- `<meta name="robots">`: `noindex, follow` on staging; `/privacy` (unapproved draft) and `/thank-you` are always `noindex`.
- `sitemap.xml`: 15 indexable routes (home, solutions + 6 solution pages, industries, approach, pricing, work, concept-lab, about, contact); excludes `/privacy` (until approved) and `/thank-you`.
- Old URLs: `/services`, `/services/{websites,mobile-apps,business-software,ai-automation}`, `/process` → **308 permanent** redirects to the new routes (tested).
- Lighthouse SEO 61–69: the only failing audit is `is-crawlable` (the deliberate staging `noindex`). One desktop run also reported `robots-txt` because Lighthouse's fetch timed out; the file itself is valid. Expect 100 once indexing is enabled on the production domain.

## Content and intent
- Each solution page targets one buyer intent with unique H1/H2s, brochure-sourced capabilities, scope questions, FAQs and internal links to related solutions, pricing and the brief.
- All prices are crawlable HTML (hidden tab panels remain in the DOM).
- Illustrative content is labelled in the UI and the metadata; no doorway pages.

## Before launch
Set `NEXT_PUBLIC_SITE_URL` to the real domain and `NEXT_PUBLIC_ALLOW_INDEXING=true` (production only); approve and publish the privacy notice (`site.privacyPolicyApproved`); add verified logo/contact/social facts to `src/content/site.ts`; submit the sitemap in Search Console.
