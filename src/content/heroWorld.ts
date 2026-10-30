import type { SolutionSlug } from "./solutions";
import { H01_FRAMES, H01_TRACK } from "./cinematic.generated";

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

export const SEQUENCE = {
  frames: H01_FRAMES,
  track: H01_TRACK,
  /** Large set for wide screens, medium set otherwise. Frames are fNNN.webp. */
  path: (size: "lg" | "md", i: number) => `/assets/cinematic/h01/${size}/f${String(i).padStart(3, "0")}.webp`,
};

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
  end: "/assets/cinematic/h01-end-2560.webp",
  pullback: [
    { src: "/assets/cinematic/r01-pullback-1280.webp", w: 1280 },
    { src: "/assets/cinematic/r01-pullback-2400.webp", w: 2400 },
  ],
  colonnade: [
    { src: "/assets/cinematic/d01-colonnade-1280.webp", w: 1280 },
    { src: "/assets/cinematic/d01-colonnade-2400.webp", w: 2400 },
  ],
};

export const srcSet = (list: { src: string; w: number }[]) => list.map((s) => `${s.src} ${s.w}w`).join(", ");

export type HeroPanel = {
  slug: SolutionSlug;
  /** Centre offset from the cube, in u. */
  dx: number;
  dy: number;
  /** Size in u. */
  w: number;
  h: number;
  side: "left" | "right";
  /** How much faster than the cube the node grows during the push-in (it is nearer the lens). */
  depth: number;
  /** One line under the name (kept short: the node is a label, the preview opens on hover). */
  tagline: string;
};

/**
 * The six services as a constellation around the glass core (owner, 2026-10-30: the four big cards
 * read as clumsy). Three nodes each side on a gentle arc, clear of the crystal and its gold ring,
 * each wired to the core. Offsets are squeezed per aspect ratio in CSS (--sq/--sqy).
 */
export const heroPanels: HeroPanel[] = [
  { slug: "web-development", dx: -31, dy: -17, w: 18, h: 5.6, side: "left", depth: 2.2, tagline: "Credible, fast, easy to book" },
  { slug: "mobile-apps", dx: -37, dy: 0, w: 18, h: 5.6, side: "left", depth: 2.6, tagline: "Android and iOS apps" },
  { slug: "custom-software", dx: -31, dy: 17, w: 18, h: 5.6, side: "left", depth: 2.4, tagline: "ERP and CRM on one record" },
  { slug: "business-automation", dx: 26, dy: -17, w: 18, h: 5.6, side: "right", depth: 2.2, tagline: "Routine work runs itself" },
  { slug: "digital-marketing", dx: 30, dy: 0, w: 18, h: 5.6, side: "right", depth: 2.6, tagline: "Meta Ads and SEO" },
  { slug: "enterprise-platforms", dx: 26, dy: 17, w: 18, h: 5.6, side: "right", depth: 2.4, tagline: "Departments working as one" },
];

/** The edge of a node that faces the core (nodes grow outward from it, so text never reaches the crystal). */
export const innerEdge = (p: HeroPanel) => p.dx + (p.side === "left" ? p.w / 2 : -p.w / 2);
