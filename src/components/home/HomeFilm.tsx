"use client";

import { FILM } from "@/content/film.generated";
import { PORTRAIT } from "@/content/portrait.generated";
import { ROOMS } from "@/content/gallery";
import { stages } from "@/content/approach";
import { solutionBySlug } from "@/content/solutions";
import { CinemaFilm, plateRect, type CinemaBlock, type PortraitCut, type Rect } from "@/components/film/CinemaFilm";
import type { FilmSegment } from "@/components/film/engine";
import { PhoneApp } from "@/components/displays/PhoneApp";
import { IdeaTablet, IdeaWide } from "@/components/displays/IdeaWall";
import f from "@/components/film/SolutionsFilm.module.css";
import { BAY, BAY_X, HomeOpening, openingDriver } from "./HomeOpening";
import s from "./HomeFilm.module.css";

/**
 * Home, "Ideas we bring to life" (design/HOME_SCRIPT.md): one film from the first frame. It opens on
 * the glass crystal (the owner's reference): the camera pushes in, then flies into its core and comes
 * out on the drawing of the building. On the
 * terrace by the bay the Omniwebora building exists only as a drawing (Innovate), becomes a study
 * model (Design), is built (Build) and comes alive at golden hour, its six lit bays the six services
 * (Transform). The camera walks in through the centre bay to the product wall (one idea → app,
 * website, one system), back out as the evening falls and the seven stages advance, and ends on the
 * building at night with the invitation.
 */
type SegId = "home-push" | "home-dive" | "home-design" | "home-build" | "home-launch" | "home-enter" | "home-facade" | "home-night";
const FILMS = FILM as unknown as Record<string, { frames: number; videoFrames: number; fps: number } | undefined>;
const seg = (id: SegId): FilmSegment => ({ id, base: `/assets/cinematic/${id}`, ...(FILMS[id] ?? { frames: 0, videoFrames: 0, fps: 24 }) });
const SEGMENTS = Object.fromEntries((["home-push", "home-dive", "home-design", "home-build", "home-launch", "home-enter", "home-facade", "home-night"] as SegId[]).map((id) => [id, seg(id)]));
const STILLS = {
  hero: "/assets/cinematic/h00-hero",
  core: "/assets/cinematic/home-push-end",
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
const BAYS = BAY_X.map((x) => [x, BAY.y, BAY.w, BAY.h] as Rect);

export const HOME_BLOCKS: CinemaBlock[] = [
  // 00: the crystal on the golden-hour terrace; the camera pushes in, holds, flies into the core and
  // comes out on the drawing (focus: the plate x kept mid-screen on phones)
  { id: "arrive", kind: "hold", still: "hero", focus: 0.72 },
  { id: "push", kind: "seg", seg: "home-push" },
  { id: "core", kind: "hold", still: "core", focus: 0.57 },
  { id: "dive", kind: "seg", seg: "home-dive" },
  { id: "innovate", kind: "hold", still: "draw", focus: 0.55 },
  { id: "to-design", kind: "seg", seg: "home-design" },
  { id: "design", kind: "hold", still: "model", focus: 0.55 },
  { id: "to-build", kind: "seg", seg: "home-build" },
  { id: "build", kind: "hold", still: "built", focus: 0.55 },
  { id: "to-launch", kind: "seg", seg: "home-launch" },
  { id: "launch", kind: "hold", still: "lit", focus: 0.55 },
  { id: "enter", kind: "seg", seg: "home-enter" },
  { id: "idea", kind: "hold", still: "wall", steps: 4, dollySteps: [null, WALL[0], WALL[1], WALL[2]], frame: { x: 0.5, y: 0.36, w: 0.62, h: 0.44 } },
  { id: "to-terrace", kind: "seg", seg: "home-facade" },
  { id: "evening", kind: "hold", still: "terrace" },
  { id: "dusk", kind: "seg", seg: "home-night" },
  { id: "launched", kind: "hold", still: "night" },
  { id: "invite", kind: "hold", still: "night" },
];

/**
 * The portrait cut (owner, 2026-11-03): every Home scene re-composed and filmed at 9:16 for tall screens
 * (keyframes and clips in assets/higgsfield/raw/portrait, built by scripts/cinematic/build_portrait.py).
 * The product wall is composed in depth (phone in front, tablet behind, display on the wall), so the
 * camera can bring each one up to full width. Used only once every Home clip has been built.
 */
const PSEG = PORTRAIT.segments as unknown as Record<string, { frames: number; videoFrames: number; fps: number; screensEnd?: number[][] } | undefined>;
const PIDS: SegId[] = ["home-push", "home-dive", "home-design", "home-build", "home-launch", "home-enter", "home-facade", "home-night"];
const PB = "/assets/cinematic/portrait";
/** The portrait wall's three displays as [phone, tablet, wide] (told apart by their shape). */
const PWALL = ((): Rect[] | null => {
  const r = PSEG["home-enter"]?.screensEnd;
  if (!r || r.length < 3) return null;
  const px = (q: number[]) => (q[2] * 9) / (q[3] * 16); // pixel aspect of a rect on the 9:16 plate
  const s = [...r].sort((a, b) => px(a) - px(b));
  return [s[0], s[1], s[2]] as unknown as Rect[];
})();
const PORTRAIT_CUT: PortraitCut | undefined =
  PWALL && PIDS.every((id) => PSEG[id])
    ? {
        segments: Object.fromEntries(PIDS.map((id) => [id, { id, base: `${PB}/${id}`, ...PSEG[id]! }])),
        stills: {
          hero: `${PB}/h00-hero`,
          core: `${PB}/home-push-end`,
          draw: `${PB}/k1-draw`,
          model: `${PB}/home-design-end`,
          built: `${PB}/home-build-end`,
          lit: `${PB}/home-launch-end`,
          wall: `${PB}/home-enter-end`,
          terrace: `${PB}/home-facade-end`,
          night: `${PB}/home-night-end`,
        },
        // every step frames one display in the upper screen (the idea on the wall, then the app, the
        // website, the schedule), so the words below never cover a screen
        blocks: { idea: { steps: 4, dollySteps: [PWALL[2], PWALL[0], PWALL[1], PWALL[2]] } },
      }
    : undefined;

/** The opening's per-frame driver (the mark rides the crystal; the cards clear on the first scroll). */
const DRIVE = openingDriver({ arrive: "arrive", push: "push", core: "core", dive: "dive" });

export function HomeFilm({ children }: { children: React.ReactNode }) {
  return (
    <CinemaFilm
      onFrame={DRIVE}
      phone
      blocks={HOME_BLOCKS}
      segments={SEGMENTS}
      stills={STILLS}
      label="Ideas we bring to life"
      className={s.home}
      portrait={PORTRAIT_CUT}
      overlays={(a) => {
        const wall = a.cut === "portrait" && PWALL ? PWALL : WALL;
        // pixel aspect of the plate: an interface keeps its display's shape on either cut
        const ar = a.cut === "portrait" ? 9 / 16 : 16 / 9;
        const step = a.block === "idea" ? a.step : 0;
        const stage = a.block === "dusk" ? Math.min(6, Math.floor(a.p * 7)) : a.block === "launched" ? 6 : -1;
        return (
          <>
            {/* 00: the mark in the crystal's core and the six services around it. */}
            <HomeOpening />

            {/* The product wall: three displays, one booking. */}
            {[
              { r: wall[0], d: 390, ui: <PhoneApp step={step === 0 ? 0 : step === 1 ? 3 : 4} go={() => undefined} />, radius: "10% / 5%" },
              { r: wall[1], d: 640, ui: <IdeaTablet step={step} /> },
              { r: wall[2], d: 1200, ui: <IdeaWide step={step} /> },
            ].map((w, i) => (
              <div key={i} className={`${f.overlay} ${s.screen}`} data-show="idea" style={{ ...plateRect(w.r), borderRadius: w.radius }}>
                <div className={f.overlayInner} data-design={w.d} style={{ width: w.d, height: (w.d * w.r[3]) / (w.r[2] * ar) }}>
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
