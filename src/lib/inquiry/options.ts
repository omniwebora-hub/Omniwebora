/** Shared between the client brief studio and the server schema. */
export const serviceOptions = [
  { value: "website", label: "Website" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "mobile", label: "Mobile app" },
  { value: "custom-software", label: "Custom software (ERP / CRM)" },
  { value: "business-automation", label: "Business automation" },
  { value: "digital-marketing", label: "Digital marketing (Meta Ads, SEO)" },
  { value: "enterprise", label: "Enterprise platform" },
  { value: "not-sure", label: "Not sure yet" },
] as const;

export const situationOptions = [
  { value: "new", label: "Something new" },
  { value: "improve", label: "Improve what exists" },
  { value: "integrate", label: "Connect tools" },
  { value: "automate", label: "Automate tasks" },
  { value: "scale", label: "Scale or maintain" },
] as const;

export const timelineOptions = [
  { value: "asap", label: "As soon as possible" },
  { value: "1-3-months", label: "In 1–3 months" },
  { value: "3-6-months", label: "In 3–6 months" },
  { value: "exploring", label: "Just exploring" },
] as const;

/** Optional plan preference. No amounts are shown anywhere (owner instruction, 2026-10-29). */
export const SHOW_BUDGET_FIELD = true;
export const budgetOptions = [
  { value: "basic", label: "Basic" },
  { value: "standard", label: "Standard" },
  { value: "premium", label: "Premium" },
  { value: "not-sure", label: "Not sure yet" },
] as const;

export const LIMITS = {
  name: { min: 2, max: 100 },
  email: { max: 200 },
  company: { max: 120 },
  message: { min: 20, max: 4000 },
  brief: { max: 2000 },
  attr: { max: 200 },
  bodyBytes: 16_384,
  minFillMs: 3000,
} as const;
