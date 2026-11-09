"use client";

import { FILM } from "@/content/film.generated";
import { stages } from "@/content/approach";
import { MAX_WANTS, planFor, TRADES, WANTS } from "@/content/planner";
import { CinemaFilm, plateRect, type CinemaBlock, type PortraitCut, type Rect } from "@/components/film/CinemaFilm";
import { PB, pscreens, psegs } from "@/components/film/portrait";
import { quadMatrix, type Quad } from "@/components/film/perspective";
import { usePlanner, useSendPlan } from "./plannerState";
import f from "@/components/film/SolutionsFilm.module.css";
import x from "@/components/displays/displays.module.css";
import s from "./PlanFilm.module.css";

/**
 * How We Work, "the planning table" (design/IMMERSIVE_PLAN.md §10): seen from above, a glass table
 * with two tablets and a laptop. The table is the planner: the camera pushes in to the left tablet
 * (what you do), the laptop (what you want), then the right tablet, where the seven stages advance
 * as you scroll, written for your business. Between devices it eases back to the whole table.
 * The selection is shared with the full planner below (PlannerProvider).
 */
const [LEFT, LAPTOP, RIGHT] = FILM["l01-lab"].screens as unknown as [Rect, Rect, Rect];
/** Each device framed in the upper middle of the screen; its chapter's words sit in a band below it
 *  (owner, 2026-11-06: "left side content is overlapping the tab"). */
const FRAME = { x: 0.5, y: 0.41, w: 0.62, h: 0.56 };
const OPEN = { x: 0.5, y: 0.5, w: 0.85, h: 0.85 };
export const PLAN_BLOCKS: CinemaBlock[] = [
  // Eye level in the studio, then the camera cranes up until it looks straight down on the table.
  { id: "studio", kind: "hold", still: "studio" },
  { id: "rise", kind: "seg", seg: "plan-arrive" },
  { id: "table", kind: "hold", still: "table" },
  { id: "trade", kind: "hold", still: "table", dolly: LEFT, frame: FRAME },
  // the laptop's keyboard sits below its screen: frame the screen higher so the keyboard clears the words
  { id: "wants", kind: "hold", still: "table", dolly: LAPTOP, frame: { x: 0.5, y: 0.28, w: 0.5, h: 0.32 } },
  { id: "stages", kind: "hold", still: "table", dolly: RIGHT, frame: FRAME, steps: stages.length },
  // Working together: close on open marble below the devices, so the words never sit on a screen.
  { id: "together", kind: "hold", still: "table", dolly: [0.7, 0.72, 0.25, 0.25], frame: OPEN },
];
/**
 * Eye level (page 1): the laptop and the two tablets on the table show the planner's three screens
 * (owner, 2026-11-06: "they are blank, fill them with some content"), each mapped onto its screen in
 * perspective. Corners measured with scripts/cinematic/measure_screens.py on l02-table-eye and on the
 * portrait cut's first frame (TL, TR, BR, BL; plate fractions).
 */
const EYE: Record<"land" | "port", { ref: [number, number]; quads: [Quad, Quad, Quad] }> = {
  land: {
    ref: [1600, 900],
    quads: [
      [[0.19688, 0.76667], [0.31211, 0.73056], [0.37578, 0.81528], [0.24609, 0.8625]],
      [[0.41875, 0.49722], [0.53711, 0.47917], [0.56523, 0.63403], [0.44297, 0.66389]],
      [[0.77617, 0.63611], [0.87305, 0.68333], [0.79531, 0.72361], [0.69766, 0.67292]],
    ],
  },
  port: {
    ref: [900, 1600],
    quads: [
      [[0.06319, 0.68867], [0.25694, 0.67266], [0.34653, 0.72305], [0.13056, 0.74414]],
      [[0.32292, 0.54688], [0.55486, 0.53789], [0.59375, 0.62148], [0.35278, 0.63555]],
      [[0.72569, 0.65703], [0.87222, 0.64297], [0.99931, 0.68008], [0.85069, 0.69531]],
    ],
  },
};
/** Each device's interface size (tablets 4:3, laptop 16:10). */
const EYE_SIZE: [number, number][] = [
  [720, 540],
  [1000, 625],
  [720, 540],
];
const eyeMatrix = (cut: "land" | "port", i: number) => quadMatrix(EYE_SIZE[i][0], EYE_SIZE[i][1], EYE[cut].quads[i], ...EYE[cut].ref);

const ALL = PLAN_BLOCKS.filter((b) => b.kind === "hold" && b.id !== "studio").map((b) => b.id).join(" ");
const FILMS = FILM as unknown as Record<string, { frames: number; videoFrames: number; fps: number } | undefined>;
const SEGMENTS = { "plan-arrive": { id: "plan-arrive", base: "/assets/cinematic/plan-arrive", ...(FILMS["plan-arrive"] ?? { frames: 0, videoFrames: 0, fps: 24 }) } };
const design = (w: number, r: Rect, ar = 16 / 9) => ({ width: w, height: (w * r[3]) / (r[2] * ar) });
/**
 * Portrait cut (phones): eye level at the table, then the camera cranes up over the same three devices,
 * re-arranged for the tall frame: the two tablets side by side above the laptop, open marble below for
 * the words. Each device is brought into the upper part of the screen on its chapter; the closing
 * chapters rest on the whole table, their words on the marble.
 */
const P_SEGMENTS = psegs(["plan-arrive"]);
const P_SCREENS = pscreens("plan-arrive");
const P_FRAME = { x: 0.5, y: 0.33, w: 0.84, h: 0.38 };
const PORTRAIT: PortraitCut | undefined =
  P_SEGMENTS && P_SCREENS?.length === 3
    ? {
        segments: P_SEGMENTS,
        stills: { studio: `${PB}/plan-arrive-start`, table: `${PB}/plan-arrive-end` },
        blocks: {
          trade: { dolly: P_SCREENS[0], frame: P_FRAME },
          wants: { dolly: P_SCREENS[1], frame: P_FRAME },
          stages: { dolly: P_SCREENS[2], frame: P_FRAME },
        },
      }
    : undefined;

export function PlanFilm({ children }: { children: React.ReactNode }) {
  return (
    <CinemaFilm
      blocks={PLAN_BLOCKS}
      segments={SEGMENTS}
      stills={{ studio: "/assets/cinematic/l02-table-eye", table: "/assets/cinematic/l01-lab" }}
      label="The planning table"
      portrait={PORTRAIT}
      overlays={(a) => {
        const stage = a.block === "stages" ? a.step : -1;
        const tall = a.cut === "portrait" && P_SCREENS;
        const [LEFT_R, LAPTOP_R, RIGHT_R] = tall ? P_SCREENS : [LEFT, LAPTOP, RIGHT];
        const ar = tall ? 9 / 16 : 16 / 9;
        return (
          <>
            {/* Page 1, eye level: a preview of the three screens (the same ones used on the table). */}
            <div className={f.overlay} data-show="studio" style={plateRect([0, 0, 1, 1])} aria-hidden="true">
              <div className={f.overlayInner} data-design={EYE[tall ? "port" : "land"].ref[0]} style={{ width: EYE[tall ? "port" : "land"].ref[0], height: EYE[tall ? "port" : "land"].ref[1] }}>
                {[<TradeScreen key="t" focus={false} />, <WantsScreen key="w" focus={false} />, <PlanScreen key="p" stage={0} />].map((ui, i) => (
                  <div
                    key={i}
                    className={s.eye}
                    inert
                    style={{ width: EYE_SIZE[i][0], height: EYE_SIZE[i][1], transform: eyeMatrix(tall ? "port" : "land", i) }}
                  >
                    {ui}
                  </div>
                ))}
              </div>
            </div>
            <div className={`${f.overlay} ${s.device}`} data-show={ALL} style={plateRect(LEFT_R)}>
              <div className={f.overlayInner} data-design={720} style={design(720, LEFT_R, ar)}>
                <TradeScreen focus={a.block === "trade"} />
              </div>
            </div>
            <div className={`${f.overlay} ${s.device}`} data-show={ALL} style={plateRect(LAPTOP_R)}>
              <div className={f.overlayInner} data-design={1000} style={design(1000, LAPTOP_R, ar)}>
                <WantsScreen focus={a.block === "wants"} />
              </div>
            </div>
            <div className={`${f.overlay} ${s.device}`} data-show={ALL} style={plateRect(RIGHT_R)}>
              <div className={f.overlayInner} data-design={720} style={design(720, RIGHT_R, ar)}>
                <PlanScreen stage={stage} />
              </div>
            </div>
          </>
        );
      }}
    >
      {children}
    </CinemaFilm>
  );
}

/** Left tablet: how the business works (one choice). */
function TradeScreen({ focus }: { focus: boolean }) {
  const { trade, setTrade } = usePlanner();
  return (
    <div className={`${x.screen} ${s.tablet}`} data-focus={focus ? "true" : undefined}>
      <header className={s.bar}>
        <b>
          <span className={s.n}>1</span> What you do
        </b>
        <span>{trade ? "Chosen" : "Pick one"}</span>
      </header>
      <div className={s.options} role="group" aria-label="How does your business work?">
        {TRADES.map((t) => (
          <button key={t.id} type="button" aria-pressed={trade === t.id} onClick={() => setTrade(t.id)}>
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Laptop: what the visitor wants (up to three). */
function WantsScreen({ focus }: { focus: boolean }) {
  const { wants, toggleWant } = usePlanner();
  return (
    <div className={`${x.screen} ${s.laptop}`} data-focus={focus ? "true" : undefined}>
      <header className={s.bar}>
        <b>
          <span className={s.n}>2</span> What you want
        </b>
        <span>
          {wants.length} of {MAX_WANTS} chosen
        </span>
      </header>
      <div className={s.wants} role="group" aria-label="What do you want? Choose up to three">
        {WANTS.map((w) => {
          const on = wants.includes(w.id);
          return (
            <button key={w.id} type="button" aria-pressed={on} disabled={!on && wants.length >= MAX_WANTS} onClick={() => toggleWant(w.id, !on)}>
              {w.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Right tablet: the seven stages in the visitor's terms, advancing with the scroll. */
function PlanScreen({ stage }: { stage: number }) {
  const { trade, wants } = usePlanner();
  const send = useSendPlan();
  const plan = planFor(trade, wants);
  const i = Math.max(0, stage);
  const st = stages[i];
  return (
    <div className={`${x.screen} ${s.tablet} ${s.plan}`}>
      <header className={s.bar}>
        <b>
          <span className={s.n}>3</span> Your project, step by step
        </b>
        <span>{plan.ready ? "Written for you" : "Typical project"}</span>
      </header>
      <ol className={s.track} aria-label="Seven stages">
        {stages.map((x, k) => (
          <li key={x.id} data-state={k < i ? "done" : k === i && stage >= 0 ? "now" : undefined}>
            {x.name}
          </li>
        ))}
      </ol>
      <div className={s.stage} key={`${st.id}-${plan.ready}`}>
        <p className={s.stageNum}>
          0{i + 1} · {st.name}
        </p>
        <p className={s.stageLine}>{plan.lines[st.id]}</p>
      </div>
      <footer className={s.foot}>
        {plan.ready ? (
          <>
            <ul className={s.services} aria-label="Services in your plan">
              {plan.services.map((sv) => (
                <li key={sv.slug}>{sv.short}</li>
              ))}
            </ul>
            <button type="button" className={s.send} onClick={() => send(trade, wants)}>
              Use this plan in my brief
            </button>
          </>
        ) : (
          <p className={s.hint}>Choose what you do and what you want, and every stage is rewritten for your business.</p>
        )}
      </footer>
    </div>
  );
}
