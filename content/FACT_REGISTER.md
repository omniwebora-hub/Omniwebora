# Fact register

Source: `reference/brochure/omniwebora_brochure_8pages.pdf` (8 scanned pages, read visually; renders in `reference/brochure/pages/`). Status labels follow `docs/governance/01_SOURCE_TRUTH_AND_DECISION_REGISTER.md`.

| # | Fact | Source | Status | Used on |
|---|---|---|---|---|
| F01 | Company name "Omniwebora" | p.1–8 | VERIFIED_FROM_BROCHURE | all |
| F02 | Tagline "Innovate. Build. Transform." | p.1 (every page header) | VERIFIED_FROM_BROCHURE | About, footer |
| F03 | Positioning: "Your technology partner for a digital future" | p.1 | VERIFIED_FROM_BROCHURE (paraphrased, not quoted as a slogan) | About |
| F04 | "Custom Solutions • Scalable Platforms • Lasting Support" | p.1 | VERIFIED_FROM_BROCHURE | Home hero strip |
| F05 | Service families: Software, Web, Mobile, AI, Cloud, Automation, Enterprise Solutions | p.1, p.8 | VERIFIED_FROM_BROCHURE | Solutions IA (six families) |
| F06 | 22 service lines (Web Development … Digital Transformation) | p.6 | VERIFIED_FROM_BROCHURE; availability of each line today = CLIENT_CONFIRMATION_REQUIRED | About capability index, Solutions |
| F07 | "We build solutions for": web, Android, iOS, SaaS, ERP, CRM, billing, inventory, hotel/PMS, school/college, hospital/healthcare, restaurant, custom business apps, AI-powered apps | p.3 | VERIFIED_FROM_BROCHURE as advertised capability, **not** case studies | Industries, Solutions |
| F08 | Solution evolution: Website → Web App → Mobile App → Business Software → AI → Enterprise Platform | p.3 | VERIFIED_FROM_BROCHURE (conceptual spectrum, not a pipeline) | Home H04 |
| F09 | "₹1L+ projects can move beyond traditional websites into complete software applications and business platforms based on your requirements" | p.3 | VERIFIED_FROM_BROCHURE | Pricing, Custom software |
| F10 | Website plans: Starter ₹10K–₹15K; Business ₹15K–₹25K; Professional ₹25K–₹35K; Advanced Web Application ₹35K–₹50K; Business Pro (E-commerce) ₹50K–₹80K; Enterprise Web Solution ₹80K–₹1L | p.2 | VERIFIED_FROM_BROCHURE; currency of bands = CLIENT_CONFIRMATION_REQUIRED | Pricing A, Web development |
| F11 | Website plan audiences ("For individuals, startups & small businesses", …) | p.2 | VERIFIED_FROM_BROCHURE | Pricing A |
| F12 | Website plan inclusions: only clearly legible items are published (see `src/content/pricing.ts`). Garbled bullets (e.g. "Modern US design", "CaA & & chitwayy", "SIL configuration", "Google Gags: Tangem") are **withheld** | p.2 | Legible = VERIFIED_FROM_BROCHURE; garbled = CLIENT_CONFIRMATION_REQUIRED | Pricing A |
| F13 | "Most popular" badge on Professional; "Domain included" on Professional | p.2 | CLIENT_CONFIRMATION_REQUIRED (popularity is a sales claim; domain inclusion is a commercial commitment). **Not published.** | — |
| F14 | Software tiers: Custom Business Application ₹1L–₹3L ("For growing business"); Advanced Business Platform ₹3L–₹5L ("For expanding organisations"); Digital Business Ecosystem ₹5L–₹15L ("For large organisations"), with fully legible inclusions | p.5 | VERIFIED_FROM_BROCHURE | Pricing B, Custom software |
| F15 | Enterprise tiers: Enterprise Business System ₹10L–₹15L (Small to medium); Enterprise Digital Platform ₹15L–₹30L (Growing enterprises); Large-Scale Technology Platform ₹30L–₹50L (Large enterprises); Custom Enterprise Ecosystem ₹50L+ (Tailored & scalable solutions) | p.4 | VERIFIED_FROM_BROCHURE | Pricing C, Enterprise |
| F16 | Enterprise capability matrix (17 rows: Website … Dedicated Tech Team, values ✓ / Selected / Optional / Advanced / Enterprise / Custom / Dedicated / Available / —) | p.4 | VERIFIED_FROM_BROCHURE (fully legible) | Pricing C, Enterprise |
| F17 | Pricing drivers: requirements, number of modules, users, platforms, integrations, infrastructure, security requirements, long-term support | p.7 | VERIFIED_FROM_BROCHURE | Pricing, scope guide |
| F18 | Disclaimer: "All prices are indicative starting ranges. Final quotation will be provided after understanding project requirements and technical scope." | p.8 | VERIFIED_FROM_BROCHURE | Pricing, every price block |
| F19 | Process: Discover → Design → Develop → Integrate → Deploy → Maintain → Scale | p.7 | VERIFIED_FROM_BROCHURE | Approach, Home H08 |
| F20 | Website → Application → Enterprise Platform; ₹10K → ₹50L+ | p.7 | VERIFIED_FROM_BROCHURE | Pricing hero |
| F21 | "Why choose": Expert Team, Flexible Engagement Models, On-Time Delivery, Long-Term Support | p.7 | CLIENT_CONFIRMATION_REQUIRED ("Expert team" and "On-time delivery" are unverifiable performance claims). **Not published as claims.** "Flexible engagement" and "long-term support" appear only as options to discuss. | — |
| F22 | "Ready to build your digital future? … Contact us for a custom project proposal" | p.8 | VERIFIED_FROM_BROCHURE | Contact |
| F23 | Contact details (email, phone, address), legal name, founders, team, years, clients, results | — | **Absent from brochure** → CLIENT_CONFIRMATION_REQUIRED. Nothing published. | — |
| F24 | Brochure logo is a circular blue/teal/purple loop; site uses a three-loop blue mark | p.1–8 | BRAND_APPROVAL_REQUIRED. Owner said on 2026-10-29: "The logo whatever is there already is fine" → site mark kept. | Header, footer, hero |
| F25 | Brochure artwork shows "01/12", "02/12" (12-page pagination) but only 8 pages supplied | p.1–2 | Noted; nothing inferred about missing pages | — |
| F26 | Earlier hero figures "20+ projects, 10+ industries, 100% client-focused" | old target image only | UNVERIFIED; **never published** (unit test enforces) | — |

## Owner instructions (chat, 2026-10-29), which override the brochure where they conflict

| # | Fact | Source | Status | Used on |
|---|---|---|---|---|
| O01 | The only services are: Website building; Mobile application; Custom software (ERP & CRM); Business automation; Digital marketing (Meta Ads, SEO); Enterprise platform. Cloud & Integrations is **not** a service; "AI & Automation" becomes Business automation. | Owner | OWNER_STATED | Solutions (six rooms), nav, footer, brief, About |
| O02 | No explicit money anywhere. Website plans are named **Basic / Standard / Premium**; inclusions to follow from the owner. Other services: written proposal. Supersedes F09, F10, F14 and every brochure price band (no longer published). | Owner | OWNER_STATED; plan inclusions = PENDING_OWNER | Pricing, Website detail, brief "plan in mind" |
| O03 | The "Our work" section is removed entirely (no previous projects will be published). How We Work stays and is personalised to what the visitor's business does and wants. | Owner | OWNER_STATED | Nav, /work (redirects to Concept Lab), /approach |
| O04 | Company location and details will be provided later. | Owner | PENDING_OWNER | none until supplied |
| O05 | Content on every demonstration is general (any business), never one sector or one fictional brand. | Owner | OWNER_STATED | All display interfaces |
| O06 | Public contact email: info@omniwebora.com. Every brief sent from the site goes to it. WhatsApp contact wanted; number pending. | Owner, 2026-10-30 | OWNER_STATED; WhatsApp number = PENDING_OWNER | Footer, Contact, brief delivery |
| E-DM | Digital marketing capability lines (Meta Ads planning and management, targeting, creative coordination, pixel and conversion tracking, technical / on-page / local SEO, reporting) | Editorial | EDITORIAL_PROPOSAL, owner to confirm | Digital marketing |

## Obvious scan typos corrected silently in display (meaning unchanged)
"Database See Solutions" → "Database Solutions" (p.6); "Edocation Management" → "Education Management" (p.6); "From websilt to complex business platforms" → "From websites to complex business platforms" (p.3).

## Editorial (not from brochure), marked EDITORIAL_PROPOSAL in the content layer
All page headlines and explanatory copy from `docs/governance/02_FINAL_CONTENT_AND_SITEMAP.md`, the four studio principles on About, the "typical deliverable" per process stage, industry module examples, and every Concept Lab dataset (ILLUSTRATIVE_DEMO).
