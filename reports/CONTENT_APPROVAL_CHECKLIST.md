# Content approval checklist (owner)

Nothing below is published as fact until the owner confirms it. Where to change it once confirmed is listed in the last column.

| # | Item | Current state on the site | Needed from the owner | Where |
|---|---|---|---|---|
| 1 | **Logo** | Existing three-loop mark kept (owner: "the logo whatever is there already is fine"). Brochure uses a circular loop mark. | Confirm final mark and supply official SVG/PNG files and usage rules. | `public/brand/`, `src/components/layout/Logo.tsx`, `site.logo.verified` |
| 2 | Legal business name | Not shown; footer shows "Omniwebora". | Registered company name. | `src/content/site.ts` → `legalName` |
| 3 | Contact details | None published (brochure has none). | Public email, phone, address (if any), service area. | `site.ts` → `contactEmail`, `phone`, `address` (set `verified: true`) |
| 4 | Domain | `NEXT_PUBLIC_SITE_URL` unset → localhost; site is `noindex`. | Production domain. | env vars |
| 5 | **Prices** (13 tiers) | Shown exactly as in the brochure, labelled "indicative starting ranges… pending confirmation". | Confirm the ranges and plan names are current; currency/GST treatment; whether hosting, domain, support are included. | `src/content/pricing.ts` (`PRICING_STATUS.confirmed`) |
| 6 | Plan inclusions | Only legible brochure bullets shown; counts of illegible bullets disclosed per tier (website plans). | Clean list of inclusions per website plan. | `pricing.ts` → `includes`, remove `withheld` |
| 7 | "Most popular" / "Domain included" (Professional Website) | Not shown. | Confirm if true and wanted. | `pricing.ts` |
| 8 | "Expert team", "On-time delivery" (brochure p.7) | Not shown (unverifiable claims). | Evidence or approval to state them. | About page |
| 9 | Service lines (22) | Listed on About as "from the brochure… availability being confirmed". | Which are offered today; priorities. | `src/content/solutions.ts` → `brochureServices` |
| 10 | Case studies, client logos, testimonials, results | None. `/work` explains the policy; Concept Lab shows labelled illustrations. | Permissioned case studies with verified outcomes. | `/work`, `site.caseStudiesPublished` |
| 11 | Team / founders | No team section. | Real bios and photos, if desired. | About page |
| 12 | Industries | Six contexts shown as possible solution areas (professional services marked as an editorial example). | Which sectors are strategic; any sector they must not imply. | `src/content/industries.ts` |
| 13 | Enquiry delivery | Not connected (honest 503). Webhook path verified locally. | Resend account + verified sender domain + recipient inbox, or CRM webhook URL. | env: `RESEND_API_KEY`, `INQUIRY_TO_EMAIL`, `INQUIRY_FROM_EMAIL` or `INQUIRY_WEBHOOK_URL` |
| 14 | **Privacy notice** | Draft, `noindex`, linked from the form. | Legally reviewed text with controller identity, purposes, retention, processors, contact. Then set `site.privacyPolicyApproved = true`. | `src/app/privacy/page.tsx`, `site.ts` |
| 15 | Analytics | None sends data. | Whether to enable Plausible (cookieless) and on which domain. | `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` |
| 16 | Enterprise sales process | Enterprise enquiries use the same brief. | Separate route or contact for enterprise? | contact page |
| 17 | Editorial copy | All headlines and explanatory text are proposals (see `content/CONTENT_MATRIX.md`). | Review tone and claims, especially About principles and solution FAQs. | `src/content/*`, page files |
| 18 | **Security** | A plaintext MuAPI key exists in `.claude/settings.local.json` and `.env.local` (gitignored). | Revoke/rotate it in MuAPI and delete both lines. | local files |
