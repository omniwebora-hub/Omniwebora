import type { SolutionSlug } from "./solutions";
import { H01_TRACK } from "./cinematic.generated";

/**
 * Geometry of the Higgsfield-rendered hero world (see docs/ART_DIRECTION.md).
 *
 * The plate is a 16:9 frame fitted to the hero like `object-fit: cover`. Everything layered on
 * top of it (logo on the core, service panels) is positioned relative to the tracked centre of
 * the glass cube, in "u" units where 1u = 1% of the plate height. Panel placements were measured
 * from the client's target composition (reference/02_INTENDED_TARGET.png).
 */

export const PLATE_ASPECT = 16 / 9;

/** Cube centre and height at rest (first frame of the push-in), normalised to the plate. */
export const CUBE_REST = { x: H01_TRACK[0][0], y: H01_TRACK[0][1], h: H01_TRACK[0][2] };

export const STILLS = {
  hero: [
    { src: "/assets/cinematic/h00-hero-1280.webp", w: 1280 },
    { src: "/assets/cinematic/h00-hero-1920.webp", w: 1920 },
    { src: "/assets/cinematic/h00-hero-2560.webp", w: 2560 },
  ],
  heroPortrait: [
    { src: "/assets/cinematic/h00-hero-portrait-720.webp", w: 720 },
    { src: "/assets/cinematic/h00-hero-portrait-1100.webp", w: 1100 },
  ],
  /** Where the cube sits inside the portrait crop (fractions of the crop). */
  portraitCube: { x: 0.503, y: 0.463, h: 0.323 },
  colonnade: [
    { src: "/assets/cinematic/d01-colonnade-1280.webp", w: 1280 },
    { src: "/assets/cinematic/d01-colonnade-2400.webp", w: 2400 },
  ],
};

export const srcSet = (list: { src: string; w: number }[]) => list.map((s) => `${s.src} ${s.w}w`).join(", ");

export type HeroPanel = {
  slug: SolutionSlug;
  /** Which side of the crystal the card stands on (the opening lays the cards out per screen). */
  side: "left" | "right";
  /** One line under the name. */
  tagline: string;
};

/** The six services as glass cards around the crystal on Home's first screen (HomeOpening). */
export const heroPanels: HeroPanel[] = [
  { slug: "web-development", side: "left", tagline: "Credible, fast, easy to book" },
  { slug: "mobile-apps", side: "left", tagline: "Android and iOS apps" },
  { slug: "custom-software", side: "left", tagline: "ERP and CRM on one record" },
  { slug: "business-automation", side: "right", tagline: "Routine work runs itself" },
  { slug: "digital-marketing", side: "right", tagline: "Meta Ads and SEO" },
  { slug: "enterprise-platforms", side: "right", tagline: "Departments working as one" },
];
