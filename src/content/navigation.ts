import { solutions } from "./solutions";

/** Each service's room in the Solutions gallery (thumbnail in the menu). */
const ROOM_STILL: Record<string, string> = {
  "web-development": "s01-web",
  "mobile-apps": "s03-mobile",
  "custom-software": "s02-ops",
  "business-automation": "s04-auto",
  "digital-marketing": "s07-marketing",
  "enterprise-platforms": "s06-enterprise",
};

export type NavItem = { label: string; href: string; description?: string; image?: string };
export type NavGroup = NavItem & { children?: NavItem[] };

/** Intent-based primary navigation (docs/governance/02_FINAL_CONTENT_AND_SITEMAP.md §1). */
export const primaryNav: NavGroup[] = [
  {
    label: "Solutions",
    href: "/solutions",
    // Each service opens its own room in the Solutions gallery (owner request, 2026-10-29).
    children: solutions.map((s) => ({ label: s.name, href: `/solutions#${s.slug}`, description: s.pitch, image: `/assets/cinematic/${ROOM_STILL[s.slug]}-1280.webp` })),
  },
  { label: "Industries", href: "/industries" },
  { label: "How We Work", href: "/approach" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
];

export const primaryCta: NavItem = { label: "Contact Us", href: "/contact" };
