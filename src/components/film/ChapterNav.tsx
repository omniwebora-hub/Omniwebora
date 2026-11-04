"use client";

import { useEffect, useRef, useState } from "react";
import { runningFilms, type FilmEngine, type FilmStop } from "./engine";
import s from "./ChapterNav.module.css";

/**
 * How a film page moves (owner, 2026-11-04: "button type to go next and next"; "it should be easy to
 * scroll, not keep swiping"):
 * - One gesture, one chapter. Scrolling stays native, but when the visitor stops between chapters the
 *   page finishes the move: on to the next chapter, or back to the start of the one they scrolled
 *   into from below. A small flick or a wheel turn is enough; a long fling still travels far.
 * - The steps of a chapter play by themselves while the visitor rests (the product wall, a room's
 *   interface, the seven stages), a short pause on each; any touch or scroll stops them.
 * - Previous / Next buttons step chapter by chapter; after the last one, Next goes on to the page's
 *   next step. The page glides, eased, so the camera plays the move instead of cutting.
 * The visitor's own wheel, touch or key always takes over at once. Nothing settles while they write
 * (a form field has focus, or the chapter is a form: `data-free-scroll`) or once the film has ended.
 */
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
/** Pause on each step of a chapter before the next one plays (ms). */
const STEP_PAUSE = 2600;

export function ChapterNav() {
  const [film, setFilm] = useState<FilmEngine | null>(null);
  const [state, setState] = useState({ show: false, first: true, last: false, n: 0, at: 0 });
  const [typing, setTyping] = useState(false);
  const typingRef = useRef(false);
  /** `expect`: where the running glide last put the page; `at`: where the last glide ended (its
   *  trailing scroll event is ours, not the visitor's). */
  const anim = useRef({ raf: 0, gliding: false, expect: -1, at: -1, onEnd: null as null | (() => void) });
  const navRef = useRef<{ next: () => void; prev: () => void } | null>(null);

  // Out of the way while the visitor is typing (the contact brief): never over a field or the keyboard.
  useEffect(() => {
    const field = (t: EventTarget | null) => t instanceof HTMLElement && t.matches("input, textarea, select, [contenteditable]");
    const onIn = (e: FocusEvent) => {
      typingRef.current = field(e.target);
      setTyping(typingRef.current);
    };
    const onOut = () => {
      typingRef.current = false;
      setTyping(false);
    };
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
    const a = anim.current;
    const H = () => window.innerHeight;
    const chapters = (stops: FilmStop[]) => stops.filter((x) => x.step === 0);
    /** Past the film's last chapter: the page's next step (never backwards: on wide screens the footer is
     *  revealed from under the page, so its box can already sit in the viewport). */
    const onward = () => {
      const after = document.querySelector<HTMLElement>("[data-next-step]");
      return Math.max(film.end(), after ? after.getBoundingClientRect().top + window.scrollY - H() * 0.3 : 0);
    };
    const live = () => window.scrollY < film.end() - H() * 1.15;
    // A chapter marked data-free-scroll (the contact brief, with its own step buttons) is on screen: the
    // page is never settled or glided away from it, whatever step the form is on and however far down
    // the visitor has scrolled, and the buttons stay out of its way.
    const free = () =>
      Array.from(document.querySelectorAll<HTMLElement>("[data-free-scroll]")).some((el) => {
        const r = el.getBoundingClientRect();
        return r.top < H() * 0.6 && r.bottom > 0;
      });

    let raf = 0;
    const read = () => {
      raf = 0;
      const y = window.scrollY;
      const cs = chapters(film.stops());
      const at = cs.filter((x) => x.y <= y + 8).length;
      const next = { show: live() && !free(), first: y <= (cs[0]?.y ?? 0) + 8, last: at >= cs.length, n: cs.length, at };
      setState((p) => (p.show === next.show && p.first === next.first && p.last === next.last && p.at === next.at && p.n === next.n ? p : next));
    };

    const stop = () => {
      cancelAnimationFrame(a.raf);
      a.raf = 0;
      a.gliding = false;
      a.onEnd = null;
    };
    const glide = (to: number, ms?: number, onEnd?: () => void) => {
      stop();
      const from = window.scrollY;
      to = Math.max(0, Math.min(document.documentElement.scrollHeight - H(), to));
      const dist = Math.abs(to - from);
      if (dist < 2) return onEnd?.();
      // longer moves take a little longer, so a camera move plays at a calm pace
      const dur = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : (ms ?? Math.min(1900, 650 + (dist / H()) * 320));
      const t0 = performance.now();
      a.gliding = true;
      a.expect = from;
      a.onEnd = onEnd ?? null;
      const step = (now: number) => {
        const t = dur ? Math.min(1, (now - t0) / dur) : 1;
        const top = from + (to - from) * ease(t);
        window.scrollTo({ top, behavior: "instant" });
        a.expect = window.scrollY;
        if (t < 1) a.raf = requestAnimationFrame(step);
        else {
          const done = a.onEnd;
          a.raf = 0;
          a.gliding = false;
          a.at = Math.round(window.scrollY);
          a.onEnd = null;
          done?.();
        }
      };
      a.raf = requestAnimationFrame(step);
    };

    // Steps that play by themselves while the visitor rests on a chapter.
    let autoT = 0;
    let heldChapter = -1; // the visitor took over this chapter's interface: leave it to them
    // writing: a field has focus, the chapter holds a form, or a free-scroll chapter is on screen
    const writing = () => typingRef.current || !!document.querySelector("[data-current] form") || free();
    const arm = () => {
      clearTimeout(autoT);
      const stops = film.stops();
      const y = window.scrollY;
      const i = stops.findIndex((x) => Math.abs(x.y - y) < 6);
      const here = stops[i];
      if (!here || here.chapter === heldChapter || here.step >= here.steps - 1) return;
      autoT = window.setTimeout(() => {
        if (a.gliding || writing() || Math.abs(window.scrollY - here.y) > 6) return;
        glide(stops[i + 1].y, 1100, arm);
      }, STEP_PAUSE);
    };

    // One gesture, one chapter: settle once the visitor stops scrolling between chapters.
    let idle = 0;
    let touching = false;
    let lastY = window.scrollY;
    let dir = 0;
    const settle = () => {
      if (touching || a.gliding || writing() || !live()) return;
      const y = window.scrollY;
      // a visitor's gesture rests only on chapters (the steps between are the chapter's own demo)
      const cs = chapters(film.stops()).map((x) => x.y);
      if (cs.some((v) => Math.abs(v - y) < 6)) return arm();
      if (dir > 0) glide(cs.find((v) => v > y) ?? onward(), undefined, arm);
      else if (dir < 0) glide(cs.filter((v) => v < y).pop() ?? 0, undefined, arm);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read);
      const y = window.scrollY;
      // our own glide (or its last frame) is not the visitor scrolling; anything else moving the page
      // during a glide (a link to a section, a field brought into view) takes over from it
      if ((a.gliding && Math.abs(y - a.expect) < 3) || (!a.gliding && Math.abs(y - a.at) < 2)) {
        lastY = y;
        return;
      }
      if (a.gliding) stop();
      a.at = -1;
      if (y !== lastY) dir = y > lastY ? 1 : -1;
      lastY = y;
      clearTimeout(autoT);
      clearTimeout(idle);
      idle = window.setTimeout(settle, 170);
    };
    // The visitor's own input always wins over a running glide or a playing step.
    const take = (e: Event) => {
      const inNav = (e.target as HTMLElement | null)?.closest?.("[data-chapter-nav]");
      if (inNav) return;
      if (e.type === "pointerdown") heldChapter = film.stops().find((x) => Math.abs(x.y - window.scrollY) < 6)?.chapter ?? heldChapter;
      stop();
      clearTimeout(autoT);
    };
    const onTouchStart = () => {
      touching = true;
      clearTimeout(idle);
    };
    const onTouchEnd = () => {
      touching = false;
      clearTimeout(idle);
      idle = window.setTimeout(settle, 170);
    };

    read();
    arm();
    const opts = { passive: true, capture: true } as const;
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    for (const t of ["wheel", "touchstart", "keydown", "pointerdown"]) window.addEventListener(t, take, opts);
    window.addEventListener("touchstart", onTouchStart, opts);
    window.addEventListener("touchend", onTouchEnd, opts);
    window.addEventListener("touchcancel", onTouchEnd, opts);
    // the buttons
    navRef.current = {
      next: () => {
        const y = window.scrollY;
        glide(chapters(film.stops()).find((x) => x.y > y + 8)?.y ?? onward(), undefined, arm);
      },
      prev: () => {
        const y = window.scrollY;
        glide(chapters(film.stops()).filter((x) => x.y < y - 8).pop()?.y ?? 0, undefined, arm);
      },
    };
    return () => {
      cancelAnimationFrame(raf);
      stop();
      clearTimeout(autoT);
      clearTimeout(idle);
      navRef.current = null;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      for (const t of ["wheel", "touchstart", "keydown", "pointerdown"]) window.removeEventListener(t, take, opts);
      window.removeEventListener("touchstart", onTouchStart, opts);
      window.removeEventListener("touchend", onTouchEnd, opts);
      window.removeEventListener("touchcancel", onTouchEnd, opts);
    };
  }, [film]);

  if (!film) return null;
  return (
    <nav className={s.nav} data-chapter-nav data-show={state.show && !typing ? "true" : undefined} aria-label="Chapters">
      <button type="button" className={s.prev} onClick={() => navRef.current?.prev()} disabled={state.first} aria-label="Previous chapter">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 14.5 12 8.5l6 6" />
        </svg>
      </button>
      <span className={s.count} aria-hidden="true">
        {String(Math.max(1, state.at)).padStart(2, "0")}
        <i>/</i>
        {String(state.n).padStart(2, "0")}
      </span>
      <button type="button" className={s.next} onClick={() => navRef.current?.next()} aria-label={state.last ? "Next, past the film" : "Next chapter"}>
        <span>Next</span>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 9.5l6 6 6-6" />
        </svg>
      </button>
    </nav>
  );
}
