"use client";

import { useEffect, useRef } from "react";
import { FILM } from "@/content/film.generated";
import { CinemaFilm, type CinemaBlock, type PortraitCut } from "@/components/film/CinemaFilm";
import { PB, psegs } from "@/components/film/portrait";
import type { FilmSegment } from "@/components/film/engine";
import s from "@/app/contact/contact.module.css";

/**
 * Contact "consultation pavilion" (design/IMMERSIVE_PLAN.md §10): a quiet arrival from the terrace to
 * a lit pavilion by the sea at dusk; then the camera rests and the guided brief has the stage. Nothing
 * moves while the visitor is writing.
 */
const SEGMENTS: Record<string, FilmSegment> = {
  "contact-arrive": {
    id: "contact-arrive",
    base: "/assets/cinematic/contact-arrive",
    frames: FILM["contact-arrive"].frames,
    videoFrames: FILM["contact-arrive"].videoFrames,
    fps: FILM["contact-arrive"].fps,
  },
};
export const CONTACT_BLOCKS: CinemaBlock[] = [
  { id: "terrace", kind: "hold", still: "terrace" },
  { id: "arrive", kind: "seg", seg: "contact-arrive" },
  // arriving rests at the start of the brief (on phones it is a form that scrolls like a page)
  { id: "brief", kind: "hold", still: "pavilion", stops: [0.02] },
];

/** Portrait cut (phones): the same arrival filmed at 9:16, from the terrace to the pavilion at dusk. */
const P_SEGMENTS = psegs(["contact-arrive"]);
const PORTRAIT: PortraitCut | undefined = P_SEGMENTS
  ? { segments: P_SEGMENTS, stills: { terrace: `${PB}/contact-arrive-start`, pavilion: `${PB}/contact-arrive-end` } }
  : undefined;

export function ContactFilm({ children }: { children: React.ReactNode }) {
  const wrap = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onBrief = (e: Event) => wrap.current?.style.setProperty("--brief", String((e as CustomEvent<number>).detail));
    window.addEventListener("omni:brief", onBrief);
    return () => window.removeEventListener("omni:brief", onBrief);
  }, []);
  useEffect(() => {
    // The brief is pinned while it is on stage. Focusing a field (Tab, a tap, the error focus) makes the
    // browser scroll toward the field's place in the page, which could carry the brief off stage: if
    // focus lands in it while the page is outside the brief's range, bring the page back onto it.
    const brief = wrap.current?.querySelector<HTMLElement>('[data-film-block="brief"]');
    if (!brief) return;
    const onFocus = () =>
      requestAnimationFrame(() => {
        if (wrap.current?.querySelector("[data-film]")?.getAttribute("data-film") !== "on") return;
        // only the pinned brief (wide screens); on phones the form scrolls like a page
        if (brief.offsetHeight < window.innerHeight * 2) return;
        const top = brief.getBoundingClientRect().top + window.scrollY;
        const end = top + brief.offsetHeight - window.innerHeight;
        if (window.scrollY < top || window.scrollY > end) window.scrollTo({ top: Math.min(Math.max(window.scrollY, top + 8), end - 8), behavior: "instant" });
      });
    brief.addEventListener("focusin", onFocus);
    return () => brief.removeEventListener("focusin", onFocus);
  }, []);
  useEffect(() => {
    // Every "Contact Us" leads to the form (owner, 2026-11-15): arriving at the top of /contact, the page
    // glides briskly down to the brief after a short beat. A hash link, a restored scroll position or any
    // touch, wheel or key from the visitor leaves the page alone.
    if (window.location.hash || window.scrollY > 40) return;
    const target = () => {
      const el = document.getElementById("brief");
      if (!el) return null;
      const pad = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
      return el.getBoundingClientRect().top + window.scrollY - pad;
    };
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let stopped = false;
    const stop = () => {
      stopped = true;
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
    const inputs = ["wheel", "touchstart", "keydown", "pointerdown"] as const;
    for (const e of inputs) window.addEventListener(e, stop, { passive: true, capture: true });
    const timer = window.setTimeout(() => {
      if (stopped || window.scrollY > 40) return;
      const from = window.scrollY;
      const dur = reduced ? 0 : 1100;
      const t0 = performance.now();
      const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
      const step = (now: number) => {
        const to = target();
        if (stopped || to === null) return;
        const t = dur ? Math.min(1, (now - t0) / dur) : 1;
        window.scrollTo({ top: from + (to - from) * ease(t), behavior: "instant" });
        if (t < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, reduced ? 0 : 450);
    return () => {
      stop();
      for (const e of inputs) window.removeEventListener(e, stop, { capture: true });
    };
  }, []);
  return (
    <div ref={wrap} className={s.answers}>
      <CinemaFilm
        blocks={CONTACT_BLOCKS}
        segments={SEGMENTS}
        stills={{ terrace: "/assets/cinematic/s08-terrace", pavilion: "/assets/cinematic/contact-arrive-end" }}
        label="Contact us"
        portrait={PORTRAIT}
      >
        {children}
      </CinemaFilm>
    </div>
  );
}
