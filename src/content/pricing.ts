/**
 * Plans and proposals. Website plans: Basic, Standard, Premium and Professional, priced in pounds by the
 * owner (2026-11-10, FACT_REGISTER O08). Their inclusions will be supplied by the owner (PENDING_OWNER).
 * Every other service is scoped per project and quoted in a written proposal.
 */
import type { SolutionSlug } from "./solutions";

export const PRICING_STATUS = {
  source: "Owner instruction, 2026-10-29; website plan prices 2026-11-10",
  confirmed: false,
  pending: "Plan inclusions for Basic, Standard, Premium and Professional; whether other services use named plans.",
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

export type PlanLevel = "basic" | "standard" | "premium" | "professional";
/** `price`: the owner's figure for the plan, in pounds (2026-11-10, O08), shown under its name. */
export type Plan = { id: PlanLevel; name: string; position: string; price: string };

/** Prices as the owner gave them; positions are relative only (inclusions are PENDING_OWNER). */
export const WEBSITE_PLANS: Plan[] = [
  { id: "basic", name: "Basic", position: "A focused starting point", price: "£399" },
  { id: "standard", name: "Standard", position: "More pages and features", price: "£999" },
  { id: "premium", name: "Premium", position: "A complete, connected website", price: "£1,999" },
  { id: "professional", name: "Professional", position: "The most complete website plan", price: "£4,999" },
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
