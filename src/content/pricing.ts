/**
 * Plans and proposals. OWNER INSTRUCTION (2026-10-29): no amounts anywhere on the site. Website plans are
 * named Basic / Standard / Premium; their inclusions will be supplied by the owner (PENDING_OWNER).
 * Other services are scoped per project. Nothing here is a price, a formula or a promise.
 */
import type { SolutionSlug } from "./solutions";

export const PRICING_STATUS = {
  source: "Owner instruction, 2026-10-29",
  confirmed: false,
  pending: "Plan inclusions for Basic, Standard and Premium; whether other services use named plans.",
} as const;

export const PRICING_NOTE =
  "Every project receives a written proposal once we understand your requirements. Plan details are being finalised: ask us and we will share the current plan sheet.";

/** What shapes a proposal (brochure p.5 lists these as the factors behind the final quotation). */
export const PRICE_DRIVERS = [
  { id: "requirements", label: "Project requirements", body: "What the product must do on day one, and what can wait for a later phase." },
  { id: "modules", label: "Number of modules", body: "Each module (bookings, inventory, billing, CRM…) adds screens, rules and tests." },
  { id: "users", label: "Users and roles", body: "More roles mean more permissions, views and edge cases to design and check." },
  { id: "platforms", label: "Platforms", body: "Web only, or web plus Android and iOS apps sharing one backend." },
  { id: "integrations", label: "Integrations", body: "Payments, accounting, messaging or existing systems that must exchange data reliably." },
  { id: "infrastructure", label: "Infrastructure", body: "Hosting, environments, backups and how much traffic or data the system must handle." },
  { id: "security", label: "Security requirements", body: "Access control, audit trails and any sector-specific obligations." },
  { id: "support", label: "Support and maintenance", body: "Ad-hoc help after launch, or an ongoing arrangement for updates and improvements." },
] as const;

export type PlanLevel = "basic" | "standard" | "premium";
export type Plan = { id: PlanLevel; name: string; position: string };

/** Relative positioning only; inclusions are PENDING_OWNER and must not be invented. */
export const WEBSITE_PLANS: Plan[] = [
  { id: "basic", name: "Basic", position: "A focused starting point" },
  { id: "standard", name: "Standard", position: "More pages and features" },
  { id: "premium", name: "Premium", position: "The most complete website plan" },
];

export type Offer = { service: SolutionSlug; label: string; plans: Plan[] | null };
export const OFFERS: Offer[] = [
  { service: "web-development", label: "Website Building", plans: WEBSITE_PLANS },
  { service: "mobile-apps", label: "Mobile Applications", plans: null },
  { service: "custom-software", label: "Custom Software: ERP & CRM", plans: null },
  { service: "business-automation", label: "Business Automation", plans: null },
  { service: "digital-marketing", label: "Digital Marketing", plans: null },
  { service: "enterprise-platforms", label: "Enterprise Platforms", plans: null },
];
