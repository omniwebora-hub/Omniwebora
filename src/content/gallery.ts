/**
 * The Solutions gallery: one room per service (owner's six services, 2026-10-29), in film order.
 * "need" lines come from content/solutions.ts; the room copy is EDITORIAL_PROPOSAL. No outcomes,
 * figures or client claims. Each room's id is the service slug, so /solutions#<slug> opens that room.
 */
import type { SolutionSlug } from "./solutions";

export type Room = {
  slug: SolutionSlug;
  title: string;
  onWall: string;
  why: string;
  /** Scroll steps the interface plays through during the hold (visitor can override). */
  steps: string[];
  /** Hold length in film mode; rooms deliberately differ in pace. */
  hold: string;
  /** Hold still (keyframe) for the stacked mobile / reduced-motion layout. */
  flat: string;
};

export const ROOMS: Room[] = [
  {
    slug: "web-development",
    title: "Visitors should see what you do, and how to book, in seconds.",
    onWall:
      "A working site: send an enquiry, browse the catalogue, pick a booking slot. As you scroll it reflows from desktop to tablet to phone, the way a responsive build should.",
    why: "Enquiries arrive with the details you need, from whichever screen your customer happens to use.",
    steps: ["Desktop", "Tablet", "Phone"],
    hold: "300svh",
    flat: "s01-web",
  },
  {
    slug: "mobile-apps",
    title: "Put the one thing customers do most in their pocket.",
    onWall:
      "A booking app on the phone stand: open it, choose a service, pick a time, confirm. Scroll to play the journey, or tap through it yourself.",
    why: "The booking is made in under a minute and lands in the same records your team already works from.",
    steps: ["Open", "Choose", "Time", "Confirm", "Done"],
    hold: "330svh",
    flat: "s03-mobile",
  },
  {
    slug: "custom-software",
    title: "When the business runs on spreadsheets, give it one system.",
    onWall: "An operations console where customers, stock and billing share one record. Scroll through the modules, or pick one yourself.",
    why: "Every team works from the same customer, order and stock figures, without retyping them between tools.",
    steps: ["CRM", "Inventory", "Billing"],
    hold: "290svh",
    flat: "s02-ops",
  },
  {
    slug: "business-automation",
    title: "Let routine work move by itself, with people still in charge.",
    onWall:
      "An enquiry arrives, is classified and routed, waits for a person to approve, then the action is taken and logged. Scroll to follow one, or run your own.",
    why: "Requests stop waiting in inboxes, and every automated step is on record for anyone to check.",
    steps: ["Receive", "Classify", "Route", "Review", "Action"],
    hold: "330svh",
    flat: "s04-auto",
  },
  {
    slug: "digital-marketing",
    title: "Bring the right people to what you have built.",
    onWall:
      "A campaign planner: choose what the ad should lead to and who sees it, check the tracking a campaign needs, then write how the page appears in search.",
    why: "You can see which campaigns bring enquiries, not only impressions, because tracking is set up before the spend starts.",
    steps: ["Meta Ads", "Tracking", "SEO"],
    hold: "270svh",
    flat: "s07-marketing",
  },
  {
    slug: "enterprise-platforms",
    title: "Many departments, one coordinated platform.",
    onWall: "The layers of one platform. Scroll to walk through Sales, Finance and Operations, or select any layer and department yourself.",
    why: "Customers, products and people are shared once, with access, audit and reporting handled in one place.",
    steps: ["Platform", "Sales", "Finance", "Operations"],
    hold: "300svh",
    flat: "s06-enterprise",
  },
];
