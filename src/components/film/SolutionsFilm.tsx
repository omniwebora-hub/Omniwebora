"use client";

import { useEffect, useRef, useState } from "react";
import { FILM } from "@/content/film.generated";
import { ROOMS } from "@/content/gallery";
import { solutionBySlug, type SolutionSlug } from "@/content/solutions";
import { FilmEngine, smoothstep, type EngineKind, type FilmBlock, type FilmSegment } from "./engine";
import { useFilmMode } from "./FlatOnly";
import { WebDisplay } from "@/components/displays/WebDisplay";
import { PhoneApp } from "@/components/displays/PhoneApp";
import { OpsDisplay } from "@/components/displays/OpsDisplay";
import { FlowDisplay } from "@/components/displays/FlowDisplay";
import { CampaignDisplay } from "@/components/displays/CampaignDisplay";
import { PlatformDisplay } from "@/components/displays/PlatformDisplay";
import s from "./SolutionsFilm.module.css";

/**
 * Solutions gallery film (design/IMMERSIVE_PLAN.md §9–11). A sticky camera stage behind server-rendered
 * chapters, driven by the shared FilmEngine: camera moves scrub Higgsfield clips, rooms rest on sharp
 * stills while the camera dollies toward a display carrying the real, interactive interface.
 */

type SegId = "sol-enter" | "sol-web-mobile" | "sol-mobile-ops" | "sol-ops-auto" | "sol-auto-mkt" | "sol-mkt-ent" | "sol-finale";
/** The clip that arrives at each room; its last frame is the room's hold still and display rect. */
export const ARRIVE: Record<SolutionSlug, SegId> = {
  "web-development": "sol-enter",
  "mobile-apps": "sol-web-mobile",
  "custom-software": "sol-mobile-ops",
  "business-automation": "sol-ops-auto",
  "digital-marketing": "sol-auto-mkt",
  "enterprise-platforms": "sol-mkt-ent",
};
/** Interface design width (px) on each display, and corner radius as a share of the display width. */
export const DESIGN: Record<SolutionSlug, { w: number; r?: number }> = {
  "web-development": { w: 1100 },
  "mobile-apps": { w: 390, r: 0.13 },
  "custom-software": { w: 1200 },
  "business-automation": { w: 1200 },
  "digital-marketing": { w: 1100 },
  "enterprise-platforms": { w: 1500 },
};

const seg = (id: SegId): FilmSegment => ({ id, base: `/assets/cinematic/${id}`, frames: FILM[id].frames, videoFrames: FILM[id].videoFrames, fps: FILM[id].fps });
const SEGMENTS = Object.fromEntries([...Object.values(ARRIVE), "sol-finale" as const].map((id) => [id, seg(id)]));
/** The six lit window bays of the facade in the finale's last frame, in room order ([x, y, w, h]). */
const BAYS = [0.211, 0.336, 0.459, 0.583, 0.707, 0.832].map((x) => [x, 0.192, 0.081, 0.484] as const);
const STILLS = { gallery: "/assets/cinematic/s00-gallery", ...Object.fromEntries(ROOMS.map((r) => [r.slug, `/assets/cinematic/${ARRIVE[r.slug]}-end`])), finale: "/assets/cinematic/sol-finale-end" };
const SCREEN = Object.fromEntries(ROOMS.map((r) => [r.slug, FILM[ARRIVE[r.slug]].screenEnd as readonly number[]])) as Record<SolutionSlug, readonly number[]>;
const srcSet = (b: string) => `${b}-1280.webp 1280w, ${b}-1920.webp 1920w, ${b}-2560.webp 2560w`;
const SIZES = "(min-aspect-ratio: 16/9) 100vw, 178vh";
const solutionShort = Object.fromEntries(ROOMS.map((r) => [r.slug, solutionBySlug(r.slug)!.short])) as Record<SolutionSlug, string>;

type Block = FilmBlock & { room?: SolutionSlug };
const BLOCKS: Block[] = [
  { id: "intro", kind: "hold", still: "gallery" },
  ...ROOMS.flatMap((r): Block[] => [
    { id: `to-${r.slug}`, kind: "seg", seg: ARRIVE[r.slug] },
    { id: r.slug, kind: "hold", still: r.slug, room: r.slug },
  ]),
  { id: "to-finale", kind: "seg", seg: "sol-finale" },
  { id: "outro", kind: "hold", still: "finale" },
];

declare global {
  interface Window {
    __filmStats?: { snapshot: () => unknown; reset: () => void };
  }
}

export function SolutionsFilm({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const film = useFilmMode();
  const [active, setActive] = useState<{ block: string; step: number }>({ block: "intro", step: 0 });
  const [override, setOverride] = useState<{ key: string; value: string | number } | null>(null);

  useEffect(() => {
    if (!film) return;
    const el = root.current!;
    const stage = el.querySelector<HTMLElement>("[data-stage]")!;
    const camera = el.querySelector<HTMLElement>("[data-camera]")!;
    const layer = el.querySelector<HTMLElement>("[data-media-layer]")!;
    const veil = el.querySelector<HTMLElement>("[data-veil]")!;
    const screens = Object.fromEntries(Array.from(el.querySelectorAll<HTMLElement>("[data-screen]")).map((n) => [n.dataset.screen!, n]));
    const bayEls = Array.from(el.querySelectorAll<HTMLElement>("[data-bay]"));
    const kind: EngineKind = new URLSearchParams(window.location.search).get("engine") === "frames" ? "frames" : "video";

    let scaled = { W: 0, pw: 0 };
    let last = { block: "", step: -1 };
    const engine = new FilmEngine({
      root: el,
      stage,
      layer,
      blocks: BLOCKS,
      segments: SEGMENTS,
      kind,
      onFrame: ({ block: b, next, p, moving, geo }) => {
        const room = (b as Block).room;
        if (geo.W !== scaled.W || geo.pw !== scaled.pw) {
          scaled = { W: geo.W, pw: geo.pw };
          for (const r of ROOMS) screens[r.slug]?.style.setProperty("--s", String((SCREEN[r.slug][2] * geo.pw) / DESIGN[r.slug].w));
        }

        // A room is phased by scroll: interface fades onto the blank display → camera dollies in →
        // steps play → camera dollies out → interface fades off before the next camera move.
        const leaving = next?.kind === "seg";
        const lit = room ?? "";
        const shown = room ? smoothstep(0, 0.05, p) * (leaving ? 1 - smoothstep(0.95, 1, p) : 1) : lit ? 1 : 0;
        for (const [k, n] of Object.entries(screens)) {
          const o = k === lit ? shown : 0;
          engine.set(n, "opacity", o.toFixed(3));
          const on = o > 0.01 ? "true" : "false";
          const live = o > 0.5 ? "true" : "false";
          if (n.dataset.on !== on) n.dataset.on = on;
          if (n.dataset.live !== live) n.dataset.live = live;
        }
        if (room) {
          const [x, y, w, h] = SCREEN[room];
          const e = smoothstep(0.05, 0.3, p) * (1 - smoothstep(0.72, 0.95, p));
          const share = geo.W < 1280 ? 0.54 : 0.58;
          const z = Math.min((share * geo.W) / (w * geo.pw), (0.66 * geo.H) / (h * geo.ph));
          const tx = geo.W * (geo.W < 1280 ? 0.655 : 0.635) - geo.px - z * (x + w / 2) * geo.pw;
          const ty = geo.H * 0.52 - geo.py - z * (y + h / 2) * geo.ph;
          engine.set(camera, "transform", `translate3d(${(tx * e).toFixed(1)}px, ${(ty * e).toFixed(1)}px, 0) scale(${(1 + (z - 1) * e).toFixed(4)})`);
        } else engine.set(camera, "transform", "none");

        // Finale: the facade's six windows light up as links back into their rooms.
        const bays = b.id === "outro" ? smoothstep(0.02, 0.12, p) : 0;
        for (const n of bayEls) engine.set(n, "opacity", bays.toFixed(3));
        const baysOn = bays > 0.5 ? "true" : "false";
        if (el.dataset.bays !== baysOn) el.dataset.bays = baysOn;

        engine.set(veil, "opacity", b.id === "intro" ? "1" : b.id === BLOCKS[1].id ? (1 - smoothstep(0, 0.3, p)).toFixed(3) : "0");

        // Steps: React only when the step actually changes.
        const n = room ? ROOMS.find((r) => r.slug === room)!.steps.length : 1;
        const step = room ? Math.min(n - 1, Math.floor(Math.min(1, Math.max(0, (p - 0.3) / 0.42)) * n)) : 0;
        if (b.id !== last.block || step !== last.step) setActive({ block: b.id, step });
        if (b.id !== last.block) el.dataset.block = b.id;
        last = { block: b.id, step };
        if (!moving) el.dataset.progress = p.toFixed(3);
      },
    });
    el.dataset.engine = kind;
    window.__filmStats = { snapshot: () => engine.snapshot(), reset: () => engine.reset() };
    return () => {
      engine.destroy();
      camera.style.transform = "";
      delete window.__filmStats;
    };
  }, [film]);

  const key = `${active.block}:${active.step}`;
  const stepOf = (slug: SolutionSlug) => (active.block === slug ? active.step : 0);
  const ov = <T,>(slug: SolutionSlug, fallback: T) => (override?.key === key && active.block === slug ? (override.value as T) : fallback);
  const pick = (value: string | number) => setOverride({ key, value });
  const room = ROOMS.find((r) => r.slug === active.block);

  // Each display shows a purpose-built interface for its device; scroll picks the step, a click
  // picks one too (until the film moves on).
  const step = (slug: SolutionSlug) => ov<number>(slug, stepOf(slug));
  const ui: Record<SolutionSlug, React.ReactNode> = {
    "web-development": <WebDisplay step={step("web-development")} go={pick} />,
    "mobile-apps": <PhoneApp step={step("mobile-apps")} go={pick} />,
    "custom-software": <OpsDisplay step={step("custom-software")} go={pick} />,
    "business-automation": <FlowDisplay step={step("business-automation")} go={pick} />,
    "digital-marketing": <CampaignDisplay step={step("digital-marketing")} go={pick} />,
    "enterprise-platforms": <PlatformDisplay step={stepOf("enterprise-platforms")} />,
  };


  return (
    <div ref={root} className={s.film} data-film={film ? "on" : "off"}>
      <div className={s.stage} data-stage aria-hidden={film ? undefined : true}>
        <div className={s.plate}>
          <div className={s.camera} data-camera>
            {Object.entries(STILLS).map(([k, b], i) =>
              i === 0 || film ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={k} className={s.still} data-still={k} src={`${b}-1920.webp`} srcSet={srcSet(b)} sizes={SIZES} alt="" decoding="async" fetchPriority={i === 0 ? "high" : "low"} style={i ? { opacity: 0 } : undefined} />
              ) : null,
            )}
            <div className={s.media} data-media-layer />
            {film &&
              ROOMS.map((r) => {
                const [, , w, h] = SCREEN[r.slug];
                const d = DESIGN[r.slug];
                return (
                  <div key={r.slug} className={s.screen} data-screen={r.slug} style={{ ...rect(SCREEN[r.slug]), borderRadius: d.r ? `${d.r * 100}% / ${((d.r * w * 16) / (h * 9)) * 100}%` : undefined }}>
                    <div className={s.screenInner} style={{ width: d.w, height: d.w / ((w * 16) / (h * 9)) }}>
                      {ui[r.slug]}
                    </div>
                  </div>
                );
              })}
            {film &&
              ROOMS.map((r, i) => (
                <a key={r.slug} href={`#${r.slug}`} className={s.bay} data-bay style={{ ...rect(BAYS[i]), opacity: 0 }}>
                  <span className={s.bayGlow} aria-hidden="true" />
                  <span className={s.bayLabel}>
                    <small>0{i + 1}</small> {r.slug === "web-development" ? "Websites" : solutionShort[r.slug]}
                  </span>
                </a>
              ))}
          </div>
        </div>
        <span className={s.veil} data-veil />
      </div>
      <div className={s.chapters}>{children}</div>
      {film && room && (
        <ol className={s.steps} aria-hidden="true" data-block={active.block}>
          {room.steps.map((label, i) => (
            <li key={label} data-on={i === active.step ? "true" : undefined}>
              {label}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

const rect = ([x, y, w, h]: readonly number[]) => ({ left: `${x * 100}%`, top: `${y * 100}%`, width: `${w * 100}%`, height: `${h * 100}%` }) as React.CSSProperties;
