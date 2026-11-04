"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FILM } from "@/content/film.generated";
import { ROOMS } from "@/content/gallery";
import { solutionBySlug, type SolutionSlug } from "@/content/solutions";
import { FilmEngine, smoothstep, type EngineKind, type FilmBlock, type FilmSegment } from "./engine";
import { useFilmMode, usePhoneFilm, usePortraitCut } from "./FlatOnly";
import { PB, pscreen, psegs } from "./portrait";
import c from "./chapters.module.css";
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
/**
 * The portrait cut (phones and other tall screens): the gallery and its rooms filmed again at 9:16,
 * each room's display measured in its own frame. Used only once every clip is built.
 */
const P_SEGMENTS = psegs([...Object.values(ARRIVE), "sol-finale"]);
const P_SCREEN = Object.fromEntries(ROOMS.map((r) => [r.slug, pscreen(ARRIVE[r.slug])])) as Record<SolutionSlug, readonly number[] | undefined>;
const PORTRAIT_OK = !!P_SEGMENTS && ROOMS.every((r) => P_SCREEN[r.slug]);
const P_STILLS = { gallery: `${PB}/s00-gallery`, ...Object.fromEntries(ROOMS.map((r) => [r.slug, `${PB}/${ARRIVE[r.slug]}-end`])), finale: `${PB}/sol-finale-end` };
const W_LAND = [1280, 1920, 2560] as const;
const W_TALL = [720, 1080, 1440] as const;
const srcSet = (b: string, ws: readonly number[]) => ws.map((w) => `${b}-${w}.webp ${w}w`).join(", ");
const solutionShort = Object.fromEntries(ROOMS.map((r) => [r.slug, solutionBySlug(r.slug)!.short])) as Record<SolutionSlug, string>;

type Block = FilmBlock & { room?: SolutionSlug };
const BLOCKS: Block[] = [
  { id: "intro", kind: "hold", still: "gallery" },
  ...ROOMS.flatMap((r): Block[] => [
    { id: `to-${r.slug}`, kind: "seg", seg: ARRIVE[r.slug] },
    // the room's interface plays its steps by itself while the visitor rests (steps run over p 0.3–0.72)
    { id: r.slug, kind: "hold", still: r.slug, room: r.slug, autoplay: true, stops: r.steps.map((_, k) => 0.3 + (0.42 * (k + 0.5)) / r.steps.length) },
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
  const desktop = useFilmMode();
  const phone = usePhoneFilm();
  const film = desktop || phone;
  const tall = usePortraitCut();
  const cut = film && tall && PORTRAIT_OK ? "portrait" : "landscape";
  const screenRects = useMemo(() => (cut === "portrait" ? (P_SCREEN as Record<SolutionSlug, readonly number[]>) : SCREEN), [cut]);
  const ar = cut === "portrait" ? 9 / 16 : 16 / 9;
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
    const SCREEN = screenRects;
    const engine = new FilmEngine({
      root: el,
      stage,
      layer,
      blocks: BLOCKS,
      segments: cut === "portrait" ? P_SEGMENTS! : SEGMENTS,
      kind,
      aspect: cut === "portrait" ? 9 / 16 : 16 / 9,
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
        if (cut === "portrait") {
          // Portrait cut: each room was filmed for the tall frame, so the camera only settles its display
          // in the upper part of the screen (above the words), a little closer where it is small;
          // between rooms it eases from one framing to the next while the clip plays.
          const poseOf = (blk: Block | undefined) => {
            if (!blk?.room) return { cx: 0.5, cy: 0.5, z: 1, y: 0.5 };
            const [x, y, w, h] = SCREEN[blk.room];
            return { cx: x + w / 2, cy: y + h / 2, z: Math.max(1, Math.min(1.35, (0.92 * geo.W) / (w * geo.pw), (0.34 * geo.H) / (h * geo.ph))), y: 0.29 };
          };
          let f = poseOf(b as Block);
          if (b.kind === "seg") {
            const i = BLOCKS.indexOf(b as Block);
            const a = poseOf(BLOCKS[i - 1]);
            const z = poseOf(BLOCKS[i + 1]);
            const k = smoothstep(0, 1, p);
            const mix = (u: number, v: number) => u + (v - u) * k;
            f = { cx: mix(a.cx, z.cx), cy: mix(a.cy, z.cy), z: mix(a.z, z.z), y: mix(a.y, z.y) };
          }
          const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
          const tx = clamp(geo.W / 2 - geo.px - f.z * f.cx * geo.pw, geo.W - geo.px - f.z * geo.pw, -geo.px);
          const ty = clamp(geo.H * f.y - geo.py - f.z * f.cy * geo.ph, geo.H - geo.py - f.z * geo.ph, -geo.py);
          engine.set(camera, "transform", `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, 0) scale(${f.z.toFixed(4)})`);
        } else if (geo.W / geo.H < 1.25) {
          // Portrait (phones): keep each room's wall screen mid-screen; push in where the screen is small
          // enough to stay whole (the phone on its stand), eased between rooms across the clips.
          const focusOf = (blk: Block | undefined) => {
            if (!blk?.room) return { x: 0.5, z: 1 };
            const [x, , w, h] = SCREEN[blk.room];
            return { x: x + w / 2, z: Math.max(1, Math.min(2.2, (0.9 * geo.W) / (w * geo.pw), (0.5 * geo.H) / (h * geo.ph))) };
          };
          let f = focusOf(b as Block);
          if (b.kind === "seg") {
            const i = BLOCKS.indexOf(b as Block);
            const a = focusOf(BLOCKS[i - 1]);
            const z = focusOf(BLOCKS[i + 1]);
            const k = smoothstep(0, 1, p);
            f = { x: a.x + (z.x - a.x) * k, z: a.z + (z.z - a.z) * k };
          }
          const sw = geo.pw * f.z;
          const tx = Math.max(geo.W - geo.px - sw, Math.min(-geo.px, geo.W / 2 - geo.px - f.x * sw));
          const ty = (geo.H - geo.ph * f.z) / 2 - geo.py;
          engine.set(camera, "transform", `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, 0) scale(${f.z.toFixed(4)})`);
        } else if (room) {
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
  }, [film, cut, screenRects]);

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
    <div ref={root} className={`${s.film} ${s.phoneFilm} ${c.phoneFilm}`} data-film={film ? "on" : "off"} data-cut={film ? cut : undefined} data-gallery>
      <div className={s.stage} data-stage aria-hidden={film ? undefined : true}>
        <div className={s.plate}>
          <div className={s.camera} data-camera>
            {Object.entries(cut === "portrait" ? P_STILLS : STILLS).map(([k, b], i) => {
              const ws = cut === "portrait" ? W_TALL : W_LAND;
              return i === 0 || film ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={`${cut}-${k}`} className={s.still} data-still={k} src={`${b}-${ws[1]}.webp`} srcSet={srcSet(b, ws)} sizes={cut === "portrait" ? "max(100vw, 56.25vh)" : "(min-aspect-ratio: 16/9) 100vw, 178vh"} alt="" decoding="async" fetchPriority={i === 0 ? "high" : "low"} style={i ? { opacity: 0 } : undefined} />
              ) : null;
            })}
            <div className={s.media} data-media-layer />
            {film &&
              ROOMS.map((r) => {
                const [, , w, h] = screenRects[r.slug];
                const d = DESIGN[r.slug];
                return (
                  <div key={r.slug} className={s.screen} data-screen={r.slug} style={{ ...rect(screenRects[r.slug]), borderRadius: d.r ? `${d.r * 100}% / ${((d.r * w * ar) / h) * 100}%` : undefined }}>
                    <div className={s.screenInner} style={{ width: d.w, height: d.w / ((w * ar) / h) }}>
                      {ui[r.slug]}
                    </div>
                  </div>
                );
              })}
            {film &&
              cut === "landscape" &&
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
