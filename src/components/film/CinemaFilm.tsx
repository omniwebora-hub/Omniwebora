"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FilmEngine, smoothstep, type EngineKind, type FilmBlock, type FilmFrame, type FilmSegment } from "./engine";
import { useFilmMode, usePhoneFilm, usePortraitCut } from "./FlatOnly";
import s from "./SolutionsFilm.module.css";
import c from "./chapters.module.css";

/**
 * CinemaFilm: the reusable scroll film for any page (Home, Pricing, Contact …).
 * A page declares its chapters (blocks), the clips that join them, the hold stills, and overlays that
 * sit in plate coordinates. The shared FilmEngine eases the camera, scrubs clips, warms and releases
 * media and keeps joins scroll-driven. React renders only when a chapter or step changes.
 *
 * Overlays: any element inside `overlays` with `data-show="blockA blockB"` fades in on those chapters
 * (first 5 % of the chapter, and out over the last 5 % when a camera move follows). Blocks may set
 * `dolly: [x, y, w, h]` (fractions of the plate) to push the camera toward that rectangle, or
 * `dollySteps` to glide between several rectangles step by step.
 */
export type Rect = readonly [number, number, number, number];
export type CinemaBlock = FilmBlock & {
  steps?: number;
  dolly?: Rect;
  dollySteps?: (Rect | null)[];
  /** Where a dolly frames its target: centre (x, y) and max share of the viewport (w, h). */
  frame?: { x: number; y: number; w: number; h: number };
  /** Portrait windows (phone film): the plate x (fraction) to keep in the middle of the screen. */
  focus?: number;
  /** Hold the dolly for the whole chapter (a fixed framing, e.g. a portrait cut's subject lifted into
   *  the upper screen); give the neighbouring chapters the same one so nothing moves at the joins. */
  dollyHold?: boolean;
};
/** Which footage is on screen: the 16:9 landscape cut, or a film's 9:16 portrait cut on tall screens. */
export type Cut = "landscape" | "portrait";
export type Active = { block: string; step: number; p: number; cut: Cut };
/**
 * A film's portrait cut (owner, 2026-11-03): the same scenes re-composed and filmed for a 9:16 frame.
 * Clips and stills replace the landscape ones on tall screens; `blocks` gives each chapter its portrait
 * camera (dolly / dollySteps / frame in portrait plate fractions). Landscape-only framing (focus pans,
 * landscape dollies) is dropped in the portrait cut.
 */
export type PortraitCut = {
  segments: Record<string, FilmSegment>;
  /** still key → base path (…-720/-1080/-1440.webp). */
  stills: Record<string, string>;
  blocks?: Record<string, Partial<CinemaBlock>>;
};
/** Per-frame hook for page-specific direct DOM writes (index of the current block and its progress). */
/** Per-frame page hook. On landscape screens it may return a sideways camera shift (px) for this frame. */
export type FrameHook = (f: { index: number; block: CinemaBlock; p: number; shown?: number; geo: FilmFrame["geo"] }) => number | void;

export function CinemaFilm({
  blocks,
  segments,
  stills,
  overlays,
  children,
  label,
  className,
  onFrame,
  phone = true,
  portrait,
}: {
  blocks: CinemaBlock[];
  segments: Record<string, FilmSegment>;
  /** still key → base path (…-1280/-1920/-2560.webp are expected). */
  stills: Record<string, string>;
  overlays?: (a: Active) => React.ReactNode;
  children: React.ReactNode;
  label?: string;
  /** Extra class on the root (e.g. Home's hand-off from the hero). */
  className?: string;
  /** Called on every rendered frame (after the overlays), e.g. to drive an opening by scroll. */
  onFrame?: FrameHook;
  /** Run the film on phones and tablets too (portrait framing; reduced motion stays stacked). */
  phone?: boolean;
  /** The portrait cut, shown on screens taller than wide. */
  portrait?: PortraitCut;
}) {
  const root = useRef<HTMLDivElement>(null);
  const hook = useRef(onFrame);
  useEffect(() => {
    hook.current = onFrame;
  }, [onFrame]);
  const desktop = useFilmMode();
  const phoneFilm = usePhoneFilm();
  const film = desktop || (phone && phoneFilm);
  const tall = usePortraitCut();
  const cut: Cut = film && tall && portrait ? "portrait" : "landscape";
  // The portrait cut swaps footage and each chapter's camera; everything else is the same film.
  const cutBlocks = useMemo(
    () =>
      cut === "portrait"
        ? blocks.map((b) => ({ ...b, focus: undefined, dolly: undefined, dollySteps: undefined, frame: undefined, ...portrait?.blocks?.[b.id] }))
        : blocks,
    [cut, blocks, portrait],
  );
  const cutSegments = cut === "portrait" ? portrait!.segments : segments;
  const cutStills = cut === "portrait" ? portrait!.stills : stills;
  const [active, setActive] = useState<Active>({ block: blocks[0].id, step: 0, p: 0, cut: "landscape" });

  useEffect(() => {
    if (!film) return;
    const el = root.current!;
    const stage = el.querySelector<HTMLElement>("[data-stage]")!;
    const camera = el.querySelector<HTMLElement>("[data-camera]")!;
    const layer = el.querySelector<HTMLElement>("[data-media-layer]")!;
    const veil = el.querySelector<HTMLElement>("[data-veil]")!;
    const shows = Array.from(el.querySelectorAll<HTMLElement>("[data-show]")).map((n) => ({ n, ids: n.dataset.show!.split(" ") }));
    const kind: EngineKind = new URLSearchParams(window.location.search).get("engine") === "frames" ? "frames" : "video";
    let last = { block: "", step: -1 };
    let scaled = { W: 0, pw: 0 };

    let fr = { x: 0.62, y: 0.53, w: 0.6, h: 0.7 };
    const zoomTo = (r: Rect, geo: { W: number; H: number; pw: number; ph: number; px: number; py: number }) => {
      const [x, y, w, h] = r;
      // never wider than the plate: a dolly only ever pushes in
      const z = Math.max(1, Math.min((fr.w * geo.W) / (w * geo.pw), (fr.h * geo.H) / (h * geo.ph)));
      const tx = geo.W * fr.x - geo.px - z * (x + w / 2) * geo.pw;
      const ty = geo.H * fr.y - geo.py - z * (y + h / 2) * geo.ph;
      // Never frame past the edge of the plate: the scaled plate must still cover the whole viewport.
      const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
      return { z, tx: clamp(tx, geo.W - geo.px - z * geo.pw, -geo.px), ty: clamp(ty, geo.H - geo.py - z * geo.ph, -geo.py) };
    };

    // Chapter buttons rest on each step of a multi-step chapter, mid-step (where its camera has settled).
    const blocks = cutBlocks.map((b) =>
      b.kind === "hold" && (b.steps ?? 1) > 1 && !b.stops ? { ...b, stops: Array.from({ length: b.steps! }, (_, k) => 0.12 + (0.76 * (k + 0.5)) / b.steps!) } : b,
    );
    const engine = new FilmEngine({
      root: el,
      stage,
      layer,
      blocks,
      segments: cutSegments,
      kind,
      aspect: cut === "portrait" ? 9 / 16 : 16 / 9,
      onFrame: ({ index, block, next, p, shown, moving, geo }) => {
        const b = block as CinemaBlock;
        const prev = index > 0 ? blocks[index - 1] : undefined;
        // Interfaces designed at a fixed width are scaled to their display (only on layout change).
        if (geo.W !== scaled.W || geo.pw !== scaled.pw) {
          scaled = { W: geo.W, pw: geo.pw };
          el.querySelectorAll<HTMLElement>("[data-design]").forEach((d) => d.style.setProperty("--s", String(d.parentElement!.offsetWidth / Number(d.dataset.design))));
        }
        const leaving = next?.kind === "seg";
        const fadeIn = smoothstep(0, 0.05, p);
        const fadeOut = leaving ? 1 - smoothstep(0.95, 1, p) : 1;
        for (const { n, ids } of shows) {
          // An overlay that was already up in the previous hold stays up across the join (no blink).
          const carried = prev?.kind === "hold" && ids.includes(prev.id);
          const o = ids.includes(b.id) ? (b.kind === "seg" ? 1 : (carried ? 1 : fadeIn) * fadeOut) : 0;
          engine.set(n, "opacity", o.toFixed(3));
          const on = o > 0.01 ? "true" : "false";
          const live = o > 0.5 ? "true" : "false";
          if (n.dataset.on !== on) n.dataset.on = on;
          if (n.dataset.live !== live) n.dataset.live = live;
        }

        // Portrait: pan the plate so the chapter's subject stays mid-screen (eased across camera moves).
        let pan = 0;
        if (cut === "landscape" && geo.W / geo.H < 1.25 && geo.pw > geo.W) {
          const focusOf = (i: number) => blocks[i]?.focus ?? 0.5;
          let fx = b.focus ?? 0.5;
          if (b.kind === "seg") {
            let a = index - 1;
            while (a > 0 && blocks[a].kind === "seg") a--;
            let c = index + 1;
            while (c < blocks.length - 1 && blocks[c].kind === "seg") c++;
            fx = focusOf(a) + (focusOf(c) - focusOf(a)) * smoothstep(0, 1, p);
          }
          const room = (geo.pw - geo.W) / 2;
          pan = Math.max(-room, Math.min(room, (0.5 - fx) * geo.pw));
        }
        // The page's hook runs before the camera is placed, so it can frame its chapter (landscape).
        const asked = hook.current?.({ index, block: b, p, shown, geo });
        if (typeof asked === "number" && geo.W / geo.H >= 1.25) {
          const room = (geo.pw - geo.W) / 2;
          pan = Math.max(-room, Math.min(room, asked));
        }

        // Portrait (phones): a camera push frames its subject centred in the upper part of the screen,
        // above the chapter's words.
        fr = geo.W / geo.H < 1.25 ? { x: 0.5, y: 0.36, w: 0.92, h: 0.46 } : (b.frame ?? { x: 0.62, y: 0.53, w: 0.6, h: 0.7 });
        const steps = b.steps ?? 1;
        const step = Math.min(steps - 1, Math.floor(Math.min(1, Math.max(0, (p - 0.12) / 0.76)) * steps));

        // Camera: a single dolly, or a glide between per-step targets (2.5D, the plate is frontal).
        let t = pan ? `translate3d(${pan.toFixed(1)}px, 0, 0)` : "none";
        if (b.dolly) {
          const e = b.dollyHold ? 1 : smoothstep(0.05, 0.3, p) * (1 - smoothstep(0.72, 0.95, p));
          const { z, tx, ty } = zoomTo(b.dolly, geo);
          t = `translate3d(${(tx * e).toFixed(1)}px, ${(ty * e).toFixed(1)}px, 0) scale(${(1 + (z - 1) * e).toFixed(4)})`;
        } else if (b.dollySteps) {
          // Continuous position along the step track, eased between neighbouring targets.
          const f = Math.min(1, Math.max(0, (p - 0.12) / 0.76)) * steps;
          const i = Math.min(steps - 1, Math.floor(f));
          const k = smoothstep(0.55, 1, f - i);
          const pose = (r: Rect | null) => (r ? zoomTo(r, geo) : { z: 1, tx: pan, ty: 0 });
          const a = pose(b.dollySteps[i] ?? null);
          const c = pose(b.dollySteps[Math.min(steps - 1, i + 1)] ?? null);
          const out = 1 - smoothstep(0.9, 1, p);
          const z = 1 + ((a.z + (c.z - a.z) * k) - 1) * out;
          const tx = (a.tx + (c.tx - a.tx) * k) * out + pan * (1 - out);
          const ty = (a.ty + (c.ty - a.ty) * k) * out;
          t = `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, 0) scale(${z.toFixed(4)})`;
        }
        engine.set(camera, "transform", t);

        // Copy on these pages always sits on solid cards, so the imagery is never veiled.
        engine.set(veil, "opacity", "0");

        if (b.id !== last.block || step !== last.step || b.kind === "seg") {
          // Camera moves report progress so overlays can follow them (throttled to 2 % steps).
          const pr = b.kind === "seg" ? Math.round(p * 50) / 50 : 0;
          setActive((prev) => (prev.block === b.id && prev.step === step && prev.p === pr && prev.cut === cut ? prev : { block: b.id, step, p: pr, cut }));
        }
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
  }, [film, cut, cutBlocks, cutSegments]);

  const keys = Object.keys(cutStills);
  // Portrait stills are 720 / 1080 / 1440 px wide (files named by width); landscape 1280 / 1920 / 2560.
  const W3 = cut === "portrait" ? ([720, 1080, 1440] as const) : ([1280, 1920, 2560] as const);
  return (
    <div
      ref={root}
      className={[s.film, phone ? `${s.phoneFilm} ${c.phoneFilm}` : "", className ?? ""].filter(Boolean).join(" ")}
      data-film={film ? "on" : "off"}
      data-cut={film ? cut : undefined}
      aria-label={label}
    >
      <div className={s.stage} data-stage aria-hidden={film ? undefined : true}>
        <div className={s.plate}>
          <div className={s.camera} data-camera>
            {keys.map((k, i) =>
              i === 0 || film ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={`${cut}-${k}`}
                  className={s.still}
                  data-still={k}
                  src={`${cutStills[k]}-${W3[1]}.webp`}
                  srcSet={W3.map((w) => `${cutStills[k]}-${w}.webp ${w}w`).join(", ")}
                  sizes={cut === "portrait" ? "max(100vw, 56.25vh)" : "(min-aspect-ratio: 16/9) 100vw, 178vh"}
                  alt=""
                  decoding="async"
                  fetchPriority={i === 0 ? "high" : "low"}
                  style={i ? { opacity: 0 } : undefined}
                />
              ) : null,
            )}
            <div className={s.media} data-media-layer />
            {film && overlays?.({ ...active, cut })}
          </div>
        </div>
        <span className={s.veil} data-veil />
      </div>
      <div className={s.chapters}>{children}</div>
    </div>
  );
}

/** Style helper: position an overlay in plate coordinates. */
export const plateRect = ([x, y, w, h]: Rect) => ({ left: `${x * 100}%`, top: `${y * 100}%`, width: `${w * 100}%`, height: `${h * 100}%` }) as React.CSSProperties;
