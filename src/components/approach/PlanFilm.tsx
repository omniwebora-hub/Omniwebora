"use client";

import Link from "next/link";
import { FILM } from "@/content/film.generated";
import { stages } from "@/content/approach";
import { MAX_WANTS, planFor, TRADES, WANTS } from "@/content/planner";
import { CinemaFilm, plateRect, type CinemaBlock, type Rect } from "@/components/film/CinemaFilm";
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
/** Pushed in right of centre, large enough that the device always starts clear of the copy. */
const FRAME = { x: 0.66, y: 0.54, w: 0.55, h: 0.62 };
const OPEN = { x: 0.5, y: 0.5, w: 0.85, h: 0.85 };
export const PLAN_BLOCKS: CinemaBlock[] = [
  // Eye level in the studio, then the camera cranes up until it looks straight down on the table.
  { id: "studio", kind: "hold", still: "studio" },
  { id: "rise", kind: "seg", seg: "plan-arrive" },
  { id: "table", kind: "hold", still: "table" },
  { id: "trade", kind: "hold", still: "table", dolly: LEFT, frame: FRAME },
  { id: "wants", kind: "hold", still: "table", dolly: LAPTOP, frame: FRAME },
  { id: "stages", kind: "hold", still: "table", dolly: RIGHT, frame: FRAME, steps: stages.length },
  // Working together and the usual questions: close on open marble below the devices (bottom right,
  // then bottom left), so the words never sit on a screen.
  { id: "together", kind: "hold", still: "table", dolly: [0.7, 0.72, 0.25, 0.25], frame: OPEN },
  { id: "faq", kind: "hold", still: "table", dolly: [0.04, 0.72, 0.25, 0.25], frame: OPEN },
  { id: "send", kind: "hold", still: "table" },
];
const ALL = PLAN_BLOCKS.filter((b) => b.kind === "hold" && b.id !== "studio").map((b) => b.id).join(" ");
const FILMS = FILM as unknown as Record<string, { frames: number; videoFrames: number; fps: number } | undefined>;
const SEGMENTS = { "plan-arrive": { id: "plan-arrive", base: "/assets/cinematic/plan-arrive", ...(FILMS["plan-arrive"] ?? { frames: 0, videoFrames: 0, fps: 24 }) } };
const design = (w: number, r: Rect) => ({ width: w, height: (w * r[3] * 9) / (r[2] * 16) });

export function PlanFilm({ children }: { children: React.ReactNode }) {
  return (
    <CinemaFilm
      blocks={PLAN_BLOCKS}
      segments={SEGMENTS}
      stills={{ studio: "/assets/cinematic/l02-table-eye", table: "/assets/cinematic/l01-lab" }}
      label="The planning table"
      overlays={(a) => {
        const stage = a.block === "stages" ? a.step : a.block === "send" ? stages.length - 1 : -1;
        return (
          <>
            <div className={`${f.overlay} ${s.device}`} data-show={ALL} style={plateRect(LEFT)}>
              <div className={f.overlayInner} data-design={720} style={design(720, LEFT)}>
                <TradeScreen focus={a.block === "trade"} />
              </div>
            </div>
            <div className={`${f.overlay} ${s.device}`} data-show={ALL} style={plateRect(LAPTOP)}>
              <div className={f.overlayInner} data-design={1000} style={design(1000, LAPTOP)}>
                <WantsScreen focus={a.block === "wants"} />
              </div>
            </div>
            <div className={`${f.overlay} ${s.device}`} data-show={ALL} style={plateRect(RIGHT)}>
              <div className={f.overlayInner} data-design={720} style={design(720, RIGHT)}>
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

/** The closing action: send the plan once there is one, otherwise simply get in touch. */
export function PlanCta() {
  const { trade, wants } = usePlanner();
  const send = useSendPlan();
  return planFor(trade, wants).ready ? (
    <button type="button" className="btn btn-primary btn-small" onClick={() => send(trade, wants)}>
      Send this plan with my brief
    </button>
  ) : (
    <Link href="/contact" className="btn btn-primary btn-small">
      Contact us
    </Link>
  );
}
