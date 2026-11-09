"use client";

import { CinemaFilm, type CinemaBlock, type PortraitCut, type Rect } from "@/components/film/CinemaFilm";
import { PB, psegs } from "@/components/film/portrait";
import { FILM } from "@/content/film.generated";
import type { FilmSegment } from "@/components/film/engine";

/**
 * About in two pages (owner, 2026-11-06: "single page, if not, no more than 2"): the studio, where we
 * introduce ourselves; then the camera walks through the drafting room (no words, it glides through)
 * and out to the dusk pavilion, where we invite the visitor to start.
 */
type SegId = "about-in" | "about-out";
const meta = (id: SegId) => (FILM as unknown as Record<string, { frames: number; videoFrames: number; fps: number } | undefined>)[id] ?? { frames: 0, videoFrames: 0, fps: 24 };
const seg = (id: SegId): FilmSegment => ({ id, base: `/assets/cinematic/${id}`, ...meta(id) });
// The way out starts on the terrace, so it dissolves in from the drafting table over a quarter of the move.
const SEGMENTS = { "about-in": seg("about-in"), "about-out": { ...seg("about-out"), fade: 0.25 } };
export const STUDIO_BLOCKS: CinemaBlock[] = [
  { id: "studio", kind: "hold", still: "studio" },
  { id: "in", kind: "seg", seg: "about-in" },
  // a wordless pause on the drafting table: the page glides through it
  { id: "table", kind: "hold", still: "table" },
  { id: "out", kind: "seg", seg: "about-out" },
  { id: "meet", kind: "hold", still: "pavilion", dolly: [0.45, 0.25, 0.42, 0.46] },
];

/** Portrait cut (phones): the same walk filmed at 9:16; the pavilion lifted so it clears the words. */
const P_SEGMENTS = psegs(["about-in", "about-out"]);
const P_PAVILION = { dolly: [0.3, 0.33, 0.5, 0.3] as Rect, frame: { x: 0.5, y: 0.36, w: 1, h: 0.36 }, dollyHold: true };
const PORTRAIT: PortraitCut | undefined = P_SEGMENTS
  ? {
      segments: P_SEGMENTS,
      stills: { studio: `${PB}/about-in-start`, table: `${PB}/about-in-end`, pavilion: `${PB}/about-out-end` },
      blocks: { meet: P_PAVILION },
    }
  : undefined;

export function StudioFilm({ children }: { children: React.ReactNode }) {
  return (
    <CinemaFilm
      blocks={STUDIO_BLOCKS}
      segments={SEGMENTS}
      stills={{ studio: "/assets/cinematic/about-in-start", table: "/assets/cinematic/about-in-end", pavilion: "/assets/cinematic/about-out-end" }}
      label="About Omniwebora"
      portrait={PORTRAIT}
    >
      {children}
    </CinemaFilm>
  );
}
