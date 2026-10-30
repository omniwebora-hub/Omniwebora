import { stages } from "@/content/approach";
import { solutionBySlug, type SolutionSlug } from "@/content/solutions";

/**
 * "How we work, for you": the visitor says what they do and what they want, and the seven brochure
 * stages are rewritten in their terms. Wording is illustrative of a typical engagement (EDITORIAL), not
 * a commitment; the brief it produces is editable on the Contact page.
 * Shared by the planning table (PlanFilm) and the full planner (JourneyPlanner).
 */

/** Business models, not industries: every business recognises itself in at least one. */
export const TRADES = [
  { id: "products", label: "We sell products", things: "orders and stock", people: "customers and your team", systems: "payments, stock records and accounts" },
  { id: "services", label: "We provide services", things: "enquiries and jobs", people: "clients and your team", systems: "your inbox, calendar and invoicing" },
  { id: "bookings", label: "We take bookings or appointments", things: "bookings and schedules", people: "customers and front-line staff", systems: "calendars, reminders and billing" },
  { id: "projects", label: "We run projects or field work", things: "jobs, tasks and approvals", people: "clients, field staff and managers", systems: "spreadsheets, messaging and invoicing" },
  { id: "operations", label: "We manage people, stock or operations", things: "records, stock and approvals", people: "every team involved", systems: "the tools each team already uses" },
  { id: "group", label: "We run several departments or locations", things: "shared customers, products and people", people: "every department and location", systems: "the systems each department relies on" },
  { id: "other", label: "Something else", things: "the work that matters most", people: "your customers and team", systems: "the tools you already use" },
] as const;
export type TradeId = (typeof TRADES)[number]["id"];

export const WANTS: { id: string; label: string; service: SolutionSlug; design: string; build: string }[] = [
  { id: "online", label: "Look credible and be easy to contact", service: "web-development", design: "the pages people read first and the quickest way to reach you", build: "a responsive website with enquiry and contact flows" },
  { id: "book", label: "Take bookings or orders online", service: "web-development", design: "a booking or ordering flow with as few steps as possible", build: "booking or ordering on the website, connected to your records" },
  { id: "app", label: "Give customers or staff an app", service: "mobile-apps", design: "the one or two journeys the app must do perfectly", build: "an Android / iOS app and the backend it relies on" },
  { id: "system", label: "Run the business from one system", service: "custom-software", design: "the records each team shares and who may change them", build: "ERP / CRM modules on one data model" },
  { id: "automate", label: "Stop doing repetitive work by hand", service: "business-automation", design: "which steps run automatically and where a person approves", build: "automated workflows with an audit trail" },
  { id: "grow", label: "Reach more of the right customers", service: "digital-marketing", design: "who the customer is and the action that counts as success", build: "Meta Ads campaigns and search optimisation, with tracking" },
  { id: "unify", label: "Bring several departments together", service: "enterprise-platforms", design: "how departments share customers, products and people", build: "a phased platform across departments" },
];

export const MAX_WANTS = 3;

const list = (xs: string[]) => (xs.length < 2 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`);

function nextStep(have: SolutionSlug[]) {
  const order: [SolutionSlug, string][] = [
    ["digital-marketing", "campaigns that bring the right customers in"],
    ["business-automation", "automating a routine task"],
    ["mobile-apps", "an app for your most frequent journey"],
    ["custom-software", "bringing records into one system"],
    ["enterprise-platforms", "connecting departments on one platform"],
  ];
  return order.find(([k]) => !have.includes(k))?.[1] ?? "new modules or more users";
}

/** The plan for a selection: per-stage lines in the visitor's terms, the services involved, and a brief summary. */
export function planFor(trade: TradeId | null, wants: string[]) {
  const t = TRADES.find((x) => x.id === trade);
  const picked = WANTS.filter((w) => wants.includes(w.id));
  const services = [...new Set(picked.map((w) => w.service))].map((x) => solutionBySlug(x)!);
  if (!t || picked.length === 0) return { ready: false as const, trade: t, picked, services, lines: Object.fromEntries(stages.map((st) => [st.id, st.summary])) as Record<string, string> };
  const lines: Record<string, string> = {
    discover: `We start with how ${t.things} reach you today, who handles them, and what ${t.people} find frustrating.`,
    design: `We sketch ${list(picked.map((w) => w.design))}, and you react to screens before anything is built.`,
    develop: `We build ${list(picked.map((w) => w.build))} in small pieces you can try as we go.`,
    integrate: `We connect what has to talk to each other: ${t.systems}, where your project needs it.`,
    deploy: `We release carefully, check everything with real ${t.things}, and hand over access.`,
    maintain: `If you want ongoing support, we keep it updated, fix issues and watch how ${t.people} use it.`,
    scale: `When the business grows, we plan the next step together${services.length < 6 ? `, for example ${nextStep(services.map((x) => x.slug))}` : ""}.`,
  };
  const summary = [`Business: ${t.label}`, `Wants: ${picked.map((w) => w.label.toLowerCase()).join("; ")}`, `Services: ${services.map((x) => x.name).join(", ")}`].join("\n");
  return { ready: true as const, trade: t, picked, services, lines, summary };
}
