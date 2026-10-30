> Updated 2026-10-29. The authoritative fact list is now `content/FACT_REGISTER.md`; pricing comes from the brochure (`src/content/pricing.ts`).

# Content verification register

Single source of truth in code: `src/content/site.ts`. Anything with `verified: false` is not rendered publicly.

## Known only from the client's visual reference
| Item | Value | Status | Where used |
|---|---|---|---|
| Brand name | Omniwebora | Treated as confirmed (consistent spelling) | Everywhere |
| Navigation | Home, About Us, Services, Our Work, Contact Us; CTA "Let's Talk" | Used | Header |
| Service categories | Websites, Mobile Apps, Business Software, AI & Automation | Used | Hero, services |
| Service taglines | "Modern & scalable web experiences", "Engaging and user-friendly apps", "Custom systems for real growth", "Smarter workflows with AI" | Used (descriptive, not factual claims) | Hero panels |
| Headline | "Ideas we bring to life." | Used | Hero |
| CTAs | Start a Project, View Our Process | Used | Hero |
| Logo | Interlinked cobalt mark + wordmark | **Provisional vector redraw**; replace with official file | Header, footer, OG, favicon |
| Metrics | 20+ projects, 10+ industries, 100% client-focused, continuous innovation | **verificationRequired: hidden** | Not rendered |

## Written by us, provisional (needs client review)
- All long-form copy: solution pages, approach stages, principles, about page. Written as capability and methodology
  descriptions ("we design…", "typically includes…"), with no outcomes, client names, numbers or awards.
- Process uses the brochure's seven stages (Discover → Design → Develop → Integrate → Deploy → Maintain → Scale); deliverables are labelled as
  our *proposed* methodology.
- Concept Lab: three **live illustrative demonstrations**, each visibly labelled "Illustrative demonstration · Not client work". `/work` publishes no case studies until permissioned ones exist.
- Audience: founders, small/midsize companies and operations teams. This is a strategic assumption.

## Unknown, intentionally absent
Legal name, address, phone, public email, social profiles, founders/team, testimonials, client logos, case studies,
certifications, awards, pricing, response-time promises, locations served, privacy-policy legal text.

## Pre-launch gates
- [ ] Official logo files (SVG) and usage permission
- [ ] Approve or remove each metric in `site.ts → metrics`
- [ ] Contact email / lead destination and transport credentials
- [ ] Legal privacy policy (current `/privacy` is a flagged draft, `noindex`)
- [ ] Production domain → `NEXT_PUBLIC_SITE_URL`, then `NEXT_PUBLIC_ALLOW_INDEXING=true`
- [ ] Real case studies (enables `/work/[slug]`)
- [ ] Review all provisional copy
