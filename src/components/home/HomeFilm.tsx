"use client";

import { FILM } from "@/content/film.generated";
import { ROOMS } from "@/content/gallery";
import { stages } from "@/content/approach";
import { solutionBySlug } from "@/content/solutions";
import { CinemaFilm, plateRect, type CinemaBlock, type Rect } from "@/components/film/CinemaFilm";
import type { FilmSegment } from "@/components/film/engine";
import { PhoneApp } from "@/components/displays/PhoneApp";
import { IdeaTablet, IdeaWide } from "@/components/displays/IdeaWall";
import f from "@/components/film/SolutionsFilm.module.css";
import s from "./HomeFilm.module.css";

/**
 * Home, "Ideas we bring to life" (design/HOME_SCRIPT.md): one film from the first frame. On the
 * terrace by the bay the Omniwebora building exists only as a drawing (Innovate), becomes a study
 * model (Design), is built (Build) and comes alive at golden hour, its six lit bays the six services
 * (Transform). The camera walks in through the centre bay to the product wall (one idea → app,
 * website, one system), back out as the evening falls and the seven stages advance, and ends on the
 * building at night with the invitation.
 */
type SegId = "home-design" | "home-build" | "home-launch" | "home-enter" | "home-facade" | "home-night";
const FILMS = FILM as unknown as Record<string, { frames: number; videoFrames: number; fps: number } | undefined>;
const seg = (id: SegId): FilmSegment => ({ id, base: `/assets/cinematic/${id}`, ...(FILMS[id] ?? { frames: 0, videoFrames: 0, fps: 24 }) });
const SEGMENTS = Object.fromEntries((["home-design", "home-build", "home-launch", "home-enter", "home-facade", "home-night"] as SegId[]).map((id) => [id, seg(id)]));
const STILLS = {
  draw: "/assets/cinematic/k1-draw",
  model: "/assets/cinematic/home-design-end",
  built: "/assets/cinematic/home-build-end",
  lit: "/assets/cinematic/home-launch-end",
  wall: "/assets/cinematic/home-core-end",
  terrace: "/assets/cinematic/home-facade-end",
  night: "/assets/cinematic/home-night-end",
};
const WALL = (FILM["home-core"] as { screensEnd?: readonly (readonly number[])[] }).screensEnd as unknown as Rect[];
/** The six arched bays: the same in the drawing and in the finished building (measured on both). */
const BAYS = [0.211, 0.336, 0.459, 0.583, 0.707, 0.832].map((x) => [x, 0.192, 0.081, 0.484] as Rect);

export const HOME_BLOCKS: CinemaBlock[] = [
  { id: "arrive", kind: "hold", still: "draw" },
  { id: "innovate", kind: "hold", still: "draw" },
  { id: "to-design", kind: "seg", seg: "home-design" },
  { id: "design", kind: "hold", still: "model" },
  { id: "to-build", kind: "seg", seg: "home-build" },
  { id: "build", kind: "hold", still: "built" },
  { id: "to-launch", kind: "seg", seg: "home-launch" },
  { id: "launch", kind: "hold", still: "lit" },
  { id: "enter", kind: "seg", seg: "home-enter" },
  { id: "idea", kind: "hold", still: "wall", steps: 4, dollySteps: [null, WALL[0], WALL[1], WALL[2]], frame: { x: 0.5, y: 0.36, w: 0.62, h: 0.44 } },
  { id: "to-terrace", kind: "seg", seg: "home-facade" },
  { id: "evening", kind: "hold", still: "terrace" },
  { id: "dusk", kind: "seg", seg: "home-night" },
  { id: "launched", kind: "hold", still: "night" },
  { id: "invite", kind: "hold", still: "night" },
];

export function HomeFilm({ children }: { children: React.ReactNode }) {
  return (
    <CinemaFilm
      blocks={HOME_BLOCKS}
      segments={SEGMENTS}
      stills={STILLS}
      label="Ideas we bring to life"
      className={s.home}
      overlays={(a) => {
        const step = a.block === "idea" ? a.step : 0;
        const stage = a.block === "dusk" ? Math.min(6, Math.floor(a.p * 7)) : a.block === "launched" ? 6 : -1;
        return (
          <>
            {/* The product wall: three displays, one booking. */}
            {[
              { r: WALL[0], d: 390, ui: <PhoneApp step={step === 0 ? 0 : step === 1 ? 3 : 4} go={() => undefined} />, radius: "10% / 5%" },
              { r: WALL[1], d: 640, ui: <IdeaTablet step={step} /> },
              { r: WALL[2], d: 1200, ui: <IdeaWide step={step} /> },
            ].map((w, i) => (
              <div key={i} className={`${f.overlay} ${s.screen}`} data-show="idea" style={{ ...plateRect(w.r), borderRadius: w.radius }}>
                <div className={f.overlayInner} data-design={w.d} style={{ width: w.d, height: (w.d * w.r[3] * 9) / (w.r[2] * 16) }}>
                  {w.ui}
                </div>
              </div>
            ))}

            {/* The six services as the facade's lit windows. */}
            {ROOMS.map((r, i) => {
              const sol = solutionBySlug(r.slug)!;
              return (
                <a key={r.slug} href={`/solutions#${r.slug}`} className={`${f.overlay} ${s.bay}`} data-show="innovate launch" style={plateRect(BAYS[i])}>
                  <span className={s.glow} aria-hidden="true" />
                  <span className={s.label}>
                    <small>0{i + 1}</small> {sol.short === "Websites" ? "Websites" : sol.short}
                  </span>
                  <span className={s.pitch}>{sol.pitch}</span>
                </a>
              );
            })}

            {/* Beyond launch: the seven stages advance as the evening falls. */}
            <ol className={`${f.overlay} ${s.timeline}`} data-show="dusk launched" aria-label="Seven stages">
              {stages.map((st, i) => (
                <li key={st.id} data-state={i < stage ? "done" : i === stage ? "now" : undefined}>
                  <span>0{i + 1}</span>
                  {st.name}
                </li>
              ))}
            </ol>
          </>
        );
      }}
    >
      {children}
    </CinemaFilm>
  );
}
