/**
 * Business facts and verification gates.
 *
 * Anything that is not independently confirmed by the client carries `verified: false`
 * and MUST NOT be rendered on public pages. See docs/content-verification.md.
 */

export type Verifiable<T> = { value: T; verified: boolean; source: string; todo?: string };

export const site = {
  name: "Omniwebora",
  /** Shown in titles and the OG card. Provisional positioning, written by us. */
  tagline: "Websites, apps, ERP & CRM, automation, marketing and enterprise platforms",
  /** Brochure tagline (p.1), VERIFIED_FROM_BROCHURE. */
  brochureTagline: "Innovate. Build. Transform.",
  description:
    "Omniwebora builds websites and mobile apps, custom ERP & CRM software, business automation, digital marketing (Meta Ads and SEO) and enterprise platforms, shaped around how your business works.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  allowIndexing: process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true",
  locale: "en",

  legalName: {
    value: "",
    verified: false,
    source: "unknown",
    todo: "Confirm registered company name for footer and privacy policy.",
  } satisfies Verifiable<string>,

  /** Owner, 2026-10-30 (FACT_REGISTER O06). Every brief is delivered here. */
  contactEmail: {
    value: "info@omniwebora.com",
    verified: true,
    source: "Owner, 2026-10-30",
  } satisfies Verifiable<string>,

  /**
   * WhatsApp (owner asked for a link, 2026-10-30). International number, digits only, e.g. "9198…".
   * Empty until the owner gives the number: nothing is rendered without it.
   */
  whatsapp: {
    value: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "") ?? "",
    verified: Boolean(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER),
    source: "Owner (number pending)",
  } satisfies Verifiable<string>,

  phone: { value: "", verified: false, source: "unknown" } satisfies Verifiable<string>,
  address: { value: "", verified: false, source: "unknown" } satisfies Verifiable<string>,

  /** Only verified profiles are rendered. */
  social: [] as { label: string; href: string; verified: boolean }[],

  logo: {
    value: "/brand/omniwebora-mark.svg",
    verified: false,
    source: "Vector redraw of the mark shown in the client's visual reference",
    todo: "Replace with the official logo files and confirm usage rights.",
  } satisfies Verifiable<string>,

  /**
   * Figures shown in the client's visual reference. NOT verified: never rendered
   * until `verified` is flipped to true by the client.
   */
  metrics: [
    { value: "20+", label: "Projects delivered", verified: false, source: "visual reference" },
    { value: "10+", label: "Industries served", verified: false, source: "visual reference" },
    { value: "100%", label: "Client-focused", verified: false, source: "visual reference" },
    { value: "Continuous", label: "Innovation", verified: false, source: "visual reference" },
  ],

  caseStudiesPublished: false,
  privacyPolicyApproved: false,
} as const;

export const publishedMetrics = site.metrics.filter((m) => m.verified);
