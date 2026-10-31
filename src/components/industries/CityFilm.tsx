"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { industries } from "@/content/industries";
import { solutionBySlug } from "@/content/solutions";
import { FilmEngine, smoothstep } from "@/components/film/engine";
import { useFilmMode } from "@/components/film/FlatOnly";
import s from "./CityFilm.module.css";

/**
 * Industries, "the city outside" (design/IMMERSIVE_PLAN.md §10): from the terrace, a wide dusk
 * panorama of the city across the bay. As you scroll the camera pans across it and each district
 * lights up as an industry, with an example of the system it runs on. Example use cases, not clients.
 * 2.5D: one still, panned, so the markers stay locked to their buildings.
 */
const PANO = { src: "/assets/cinematic/i01-city", aspect: 3840 / 1648 };
/** District anchor (x, y as fractions of the panorama) for each industry, in pan order. */
const SPOTS: Record<string, [number, number]> = {
  "retail-ecommerce": [0.07, 0.5],
  hospitality: [0.205, 0.38],
  education: [0.38, 0.56],
  healthcare: [0.545, 0.5],
  logistics: [0.72, 0.52],
  "professional-services": [0.9, 0.42],
};

export function CityFilm({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const film = useFilmMode();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!film) return;
    const el = root.current!;
    const stage = el.querySelector<HTMLElement>("[data-stage]")!;
    const track = el.querySelector<HTMLElement>("[data-track]")!;
    const n = industries.length;
    const introEl = el.querySelector<HTMLElement>("[data-city-intro]");
    let last = -1;
    const engine = new FilmEngine({
      root: el,
      stage,
      layer: track,
      blocks: [{ id: "city", kind: "hold" }],
      segments: {},
      kind: "video",
      onFrame: ({ p, geo }) => {
        const imgW = geo.H * PANO.aspect;
        const range = Math.max(0, imgW - geo.W);
        // Continuous position along the districts: overview → each industry → overview.
        const f = Math.min(1, Math.max(0, (p - 0.08) / 0.84)) * n;
        const i = Math.min(n - 1, Math.floor(f));
        const k = smoothstep(0.5, 1, f - i);
        // The pan never leaves the panorama; districts near its left edge are framed where they are.
        const at = (j: number) => {
          const x = SPOTS[industries[Math.min(n - 1, Math.max(0, j))].id][0] * imgW;
          return Math.min(range, Math.max(0, x - geo.W * 0.62));
        };
        const x = at(i) + (at(i + 1) - at(i)) * (i + 1 < n ? k : 0);
        const intro = smoothstep(0, 0.08, p);
        engine.set(track, "transform", `translate3d(${(-x * intro).toFixed(1)}px, 0, 0)`);
        // 0 = intro, 1…n = districts, n + 1 = the closing invitation (camera rests on the last district)
        const st = p < 0.06 ? 0 : p > 0.93 ? n + 1 : i + 1;
        // The opening words stay where they are and dissolve before the first district appears.
        if (introEl) {
          const o = 1 - smoothstep(0.012, 0.05, p);
          engine.set(introEl, "opacity", o.toFixed(3));
          const gone = o < 0.01 ? "true" : "false";
          if (introEl.dataset.gone !== gone) introEl.dataset.gone = gone;
        }
        // Which half the district is in (kept for styling hooks; the words sit in the water below).
        const activeX = st > 0 ? SPOTS[industries[i].id][0] * imgW - x * intro : geo.W;
        const side = activeX < geo.W * 0.5 ? "right" : "left";
        if (el.dataset.side !== side) el.dataset.side = side;
        if (st !== last) {
          last = st;
          setStep(st);
        }
      },
    });
    return () => engine.destroy();
  }, [film]);

  const closing = step === industries.length + 1;
  const active = step > 0 && !closing ? industries[step - 1] : null;
  return (
    <div ref={root} className={s.film} data-film={film ? "on" : "off"}>
      <div className={s.stage} data-stage aria-hidden={film ? undefined : true}>
        <div className={s.track} data-track>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={s.pano} src={`${PANO.src}-2560.webp`} srcSet={`${PANO.src}-1920.webp 1920w, ${PANO.src}-2560.webp 2560w`} sizes="240vh" alt="" />
          {film &&
            industries.map((ind, i) => (
              <Link
                key={ind.id}
                href={`#${ind.id}`}
                className={s.spot}
                data-spot={SPOTS[ind.id][0]}
                data-on={step === i + 1 ? "true" : undefined}
                style={{ left: `${SPOTS[ind.id][0] * 100}%`, top: `${SPOTS[ind.id][1] * 100}%` }}
              >
                <span className={s.pin} aria-hidden="true" />
                <span className={s.spotLabel}>{ind.name}</span>
              </Link>
            ))}
        </div>
        {film && closing && (
          <aside className={s.card} key="closing" aria-live="polite">
            <p className={s.kicker}>Your business</p>
            <h3>Talk about your workflow.</h3>
            <p className={s.context}>Your business may not fit any of these neatly. Tell us how work moves today and we will suggest what to build first.</p>
            <p className={s.links}>
              <Link href="/contact">Talk about your workflow</Link>
              <Link href="/solutions">Explore the solutions</Link>
            </p>
          </aside>
        )}
        {film && active && (
          <aside className={s.card} key={active.id} aria-live="polite">
            <p className={s.kicker}>Example use case · {String(step).padStart(2, "0")} of 06</p>
            <h3>{active.name}</h3>
            <p className={s.context}>{active.context}</p>
            <ul className={s.modules}>
              {active.modules.map((m) => (
                <li key={m.name}>
                  <b>{m.name}</b>
                  <span>{m.sample}</span>
                </li>
              ))}
            </ul>
            <p className={s.links}>
              {active.solutions.map((sl) => (
                <Link key={sl} href={`/solutions#${sl}`}>
                  {solutionBySlug(sl)!.short}
                </Link>
              ))}
            </p>
          </aside>
        )}
      </div>
      <div className={s.chapters}>{children}</div>
    </div>
  );
}
