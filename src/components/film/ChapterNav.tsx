"use client";

import { useEffect, useRef, useState } from "react";
import { runningFilms, type FilmEngine } from "./engine";
import s from "./ChapterNav.module.css";

/**
 * Chapter buttons (owner, 2026-11-04: "button type to go next and next"): on every film page, Previous
 * and Next step from one chapter (or one step of a chapter) to the next. The page scrolls there itself,
 * eased, so the camera plays the move between chapters instead of cutting; any wheel, touch or key
 * from the visitor takes over at once. After the film's last chapter, Next goes on to the page's next
 * step (the footer). The buttons leave with the film.
 */
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

export function ChapterNav() {
  const [film, setFilm] = useState<FilmEngine | null>(null);
  const [state, setState] = useState({ show: false, first: true, last: false, n: 0, at: 0 });
  const [typing, setTyping] = useState(false);
  const anim = useRef(0);

  // Out of the way while the visitor is typing (the contact brief): never over a field or the keyboard.
  useEffect(() => {
    const field = (t: EventTarget | null) => t instanceof HTMLElement && t.matches("input, textarea, select, [contenteditable]");
    const onIn = (e: FocusEvent) => setTyping(field(e.target));
    const onOut = () => setTyping(false);
    document.addEventListener("focusin", onIn);
    document.addEventListener("focusout", onOut);
    return () => {
      document.removeEventListener("focusin", onIn);
      document.removeEventListener("focusout", onOut);
    };
  }, []);

  useEffect(() => {
    const pick = () => setFilm(runningFilms.values().next().value ?? null);
    pick();
    window.addEventListener("omni:films", pick);
    return () => window.removeEventListener("omni:films", pick);
  }, []);

  useEffect(() => {
    if (!film) return;
    let raf = 0;
    const read = () => {
      raf = 0;
      const y = window.scrollY;
      const stops = film.stops();
      const at = stops.filter((v) => v <= y + 8).length;
      const show = y < film.end() - window.innerHeight * 1.15;
      const next = { show, first: y <= (stops[0] ?? 0) + 8, last: at >= stops.length, n: stops.length, at };
      setState((p) => (p.show === next.show && p.first === next.first && p.last === next.last && p.at === next.at && p.n === next.n ? p : next));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [film]);

  // The visitor's own scrolling always wins over a running glide.
  useEffect(() => {
    const stop = (e: Event) => {
      if (e.type === "keydown" && (e.target as HTMLElement | null)?.closest?.("[data-chapter-nav]")) return;
      cancelAnimationFrame(anim.current);
      anim.current = 0;
    };
    const opts = { passive: true, capture: true } as const;
    for (const t of ["wheel", "touchstart", "keydown", "pointerdown"]) window.addEventListener(t, stop, opts);
    return () => {
      cancelAnimationFrame(anim.current);
      for (const t of ["wheel", "touchstart", "keydown", "pointerdown"]) window.removeEventListener(t, stop, opts);
    };
  }, []);

  const glide = (to: number) => {
    cancelAnimationFrame(anim.current);
    const from = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    to = Math.max(0, Math.min(max, to));
    const dist = Math.abs(to - from);
    if (dist < 2) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // longer moves take a little longer, so a camera move plays at a calm pace
    const dur = reduce ? 0 : Math.min(2600, 900 + (dist / window.innerHeight) * 380);
    const t0 = performance.now();
    const step = (now: number) => {
      const t = dur ? Math.min(1, (now - t0) / dur) : 1;
      window.scrollTo({ top: from + (to - from) * ease(t), behavior: "instant" });
      anim.current = t < 1 ? requestAnimationFrame(step) : 0;
    };
    anim.current = requestAnimationFrame(step);
  };

  const go = (dir: 1 | -1) => {
    if (!film) return;
    const y = window.scrollY;
    const stops = film.stops();
    if (dir > 0) {
      const to = stops.find((v) => v > y + 8);
      if (to !== undefined) return glide(to);
      // past the last chapter: on to the page's next step
      // (never backwards: on wide screens the footer is revealed from under the page, so its box can
      // already sit in the viewport while the film is still on screen)
      const after = document.querySelector<HTMLElement>("[data-next-step]");
      glide(Math.max(film.end(), after ? after.getBoundingClientRect().top + y - window.innerHeight * 0.3 : 0));
    } else {
      const back = stops.filter((v) => v < y - 8);
      glide(back.length ? back[back.length - 1] : 0);
    }
  };

  if (!film) return null;
  return (
    <nav className={s.nav} data-chapter-nav data-show={state.show && !typing ? "true" : undefined} aria-label="Chapters">
      <button type="button" className={s.prev} onClick={() => go(-1)} disabled={state.first} aria-label="Previous chapter">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 14.5 12 8.5l6 6" />
        </svg>
      </button>
      <span className={s.count} aria-hidden="true">
        {String(Math.max(1, state.at)).padStart(2, "0")}
        <i>/</i>
        {String(state.n).padStart(2, "0")}
      </span>
      <button type="button" className={s.next} onClick={() => go(1)} aria-label={state.last ? "Continue to the next page step" : "Next chapter"}>
        <span>{state.last ? "Continue" : "Next"}</span>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 9.5l6 6 6-6" />
        </svg>
      </button>
    </nav>
  );
}
