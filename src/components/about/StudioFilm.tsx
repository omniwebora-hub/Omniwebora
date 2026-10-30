"use client";

import { FILM } from "@/content/film.generated";
import { CinemaFilm, plateRect, type CinemaBlock, type Rect } from "@/components/film/CinemaFilm";
import type { FilmSegment } from "@/components/film/engine";
import { IdeaTablet } from "@/components/displays/IdeaWall";
import f from "@/components/film/SolutionsFilm.module.css";
import s from "./StudioFilm.module.css";

/**
 * About, "the studio and craft" (design/IMMERSIVE_PLAN.md §10): seen from above, a drafting table with
 * a sheet of paper and a tablet. As you scroll, discovery notes appear on the paper, a wireframe is
 * sketched, and the same screen comes to life on the tablet: how projects take shape.
 */
const PAPER: Rect = [0.18125, 0.224, 0.2896, 0.5407];
const TABLET: Rect = [0.5135, 0.25, 0.2, 0.4926];
type SegId = "about-in" | "about-out";
// Until a segment is built its chapter simply cuts between the stills on either side.
const meta = (id: SegId) => (FILM as unknown as Record<string, { frames: number; videoFrames: number; fps: number } | undefined>)[id] ?? { frames: 0, videoFrames: 0, fps: 24 };
const seg = (id: SegId): FilmSegment => ({ id, base: `/assets/cinematic/${id}`, ...meta(id) });
// The way out starts on the terrace, so it dissolves in from the drafting table over a quarter of the move.
const SEGMENTS = { "about-in": seg("about-in"), "about-out": { ...seg("about-out"), fade: 0.25 } };
export const STUDIO_BLOCKS: CinemaBlock[] = [
  { id: "studio", kind: "hold", still: "studio" },
  { id: "in", kind: "seg", seg: "about-in" },
  // Framed right of centre and large enough that the paper starts clear of the copy on the left.
  { id: "craft", kind: "hold", still: "table", steps: 4, dollySteps: [null, PAPER, PAPER, TABLET], frame: { x: 0.66, y: 0.54, w: 0.52, h: 0.87 } },
  { id: "out", kind: "seg", seg: "about-out" },
  // On the dusk pavilion the camera eases to a different view for each part of the story.
  { id: "solve", kind: "hold", still: "pavilion", dolly: [0.45, 0.25, 0.42, 0.46] },
  { id: "breadth", kind: "hold", still: "pavilion", dolly: [0.24, 0.3, 0.42, 0.42] },
  { id: "way", kind: "hold", still: "pavilion", dolly: [0.5, 0.36, 0.4, 0.42] },
  { id: "who", kind: "hold", still: "pavilion", dolly: [0.34, 0.3, 0.42, 0.44] },
  { id: "meet", kind: "hold", still: "pavilion" },
];

export function StudioFilm({ children }: { children: React.ReactNode }) {
  return (
    <CinemaFilm
      blocks={STUDIO_BLOCKS}
      segments={SEGMENTS}
      stills={{ studio: "/assets/cinematic/about-in-start", table: "/assets/cinematic/about-in-end", pavilion: "/assets/cinematic/about-out-end" }}
      label="How projects take shape"
      overlays={(a) => (
        <>
          <div className={`${f.overlay} ${s.paper}`} data-show="craft" style={plateRect(PAPER)}>
            <div className={f.overlayInner} data-design={700} style={{ width: 700, height: (700 * PAPER[3] * 9) / (PAPER[2] * 16) }}>
              <Sketch step={a.step} />
            </div>
          </div>
          <div className={`${f.overlay} ${s.tablet}`} data-show="craft" style={plateRect(TABLET)}>
            <div className={f.overlayInner} data-design={640} style={{ width: 640, height: (640 * TABLET[3] * 9) / (TABLET[2] * 16) }}>
              {a.step >= 3 ? <IdeaTablet step={3} /> : <div className={s.off} />}
            </div>
          </div>
        </>
      )}
    >
      {children}
    </CinemaFilm>
  );
}

/** Pencil on paper: notes at Discover, a wireframe at Design. Multiply-blended so it reads as drawn. */
function Sketch({ step }: { step: number }) {
  return (
    <div className={s.sheet} data-away={step >= 3 ? "true" : undefined}>
      <p className={s.hand} data-on={step >= 1 ? "true" : undefined}>
        Who books, and how?
        <br />
        What happens after?
        <br />
        What must never be retyped?
      </p>
      <svg viewBox="0 0 700 600" className={s.wire} data-on={step >= 2 ? "true" : undefined} aria-hidden="true">
        <rect x="60" y="230" width="580" height="300" rx="10" />
        <line x1="60" y1="275" x2="640" y2="275" />
        <rect x="90" y="300" width="250" height="60" rx="6" />
        <rect x="90" y="380" width="160" height="40" rx="6" />
        <rect x="380" y="300" width="230" height="200" rx="8" />
        <line x1="90" y1="450" x2="330" y2="450" />
        <line x1="90" y1="475" x2="290" y2="475" />
        <path d="M500 230 C 520 190, 580 180, 610 200" />
        <text x="520" y="175">booking!</text>
      </svg>
      {step >= 3 && <span className={s.stamp}>Approved</span>}
    </div>
  );
}
