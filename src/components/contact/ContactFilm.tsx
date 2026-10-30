"use client";

import { useEffect, useRef } from "react";
import { FILM } from "@/content/film.generated";
import { CinemaFilm, type CinemaBlock } from "@/components/film/CinemaFilm";
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
  { id: "brief", kind: "hold", still: "pavilion" },
];

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
        const top = brief.getBoundingClientRect().top + window.scrollY;
        const end = top + brief.offsetHeight - window.innerHeight;
        if (window.scrollY < top || window.scrollY > end) window.scrollTo({ top: Math.min(Math.max(window.scrollY, top + 8), end - 8), behavior: "instant" });
      });
    brief.addEventListener("focusin", onFocus);
    return () => brief.removeEventListener("focusin", onFocus);
  }, []);
  useEffect(() => {
    // Arriving with intent (a service, a plan, or a hand-off from Pricing / How We Work): straight to the brief.
    const q = new URLSearchParams(window.location.search);
    if (window.location.hash || !["service", "plan", "from"].some((k) => q.has(k))) return;
    const r = requestAnimationFrame(() => document.getElementById("brief")?.scrollIntoView({ behavior: "instant", block: "start" }));
    return () => cancelAnimationFrame(r);
  }, []);
  return (
    <div ref={wrap} className={s.answers}>
      <CinemaFilm
        blocks={CONTACT_BLOCKS}
        segments={SEGMENTS}
        stills={{ terrace: "/assets/cinematic/s08-terrace", pavilion: "/assets/cinematic/contact-arrive-end" }}
        label="Contact us"
      >
        {children}
      </CinemaFilm>
    </div>
  );
}
