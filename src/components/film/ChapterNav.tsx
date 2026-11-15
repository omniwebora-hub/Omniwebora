"use client";

import { useEffect, useRef, useState } from "react";
import { runningFilms, type FilmEngine, type FilmStop } from "./engine";
import s from "./ChapterNav.module.css";

/**
 * How a film page moves (owner, 2026-11-04: "button type to go next and next"; 2026-11-16: "just one
 * mouse scroll and chak chak chak it moves … nice and slow, not frustrating"):
 * - The page never moves by itself. Every move answers the visitor: one gesture (a wheel turn, a fast
 *   spin, a trackpad flick with its momentum, a touch swipe) is one calm step to the next resting place:
 *   the next screen of a chapter's interface (the product wall, a room's steps) or the next chapter.
 * - A gesture made while the page is still moving queues one more step, played after the current one,
 *   never faster; turning back reverses at once.
 * - Scrolling stays native for touch: when the visitor lets go between resting places, the page finishes
 *   the move in the direction they were going.
 * - Previous / Next buttons step the same way; after the last place, Next goes on to the page's next step.
 *   The page glides, eased, so the camera plays the move instead of cutting.
 * Nothing settles while the visitor writes (a form field has focus, or the chapter is a form:
 * `data-free-scroll`) or once the film has ended.
 */
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

export function ChapterNav() {
  const [film, setFilm] = useState<FilmEngine | null>(null);
  const [state, setState] = useState({ show: false, first: true, last: false, n: 0, at: 0, place: 0, places: 0 });
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
      const all = film.stops();
      const place = all.filter((x) => x.y <= y + 8).length;
      const next = { show: live() && !free(), first: y <= (cs[0]?.y ?? 0) + 8, last: at >= cs.length, n: cs.length, at, place, places: all.length };
      setState((p) => (p.show === next.show && p.first === next.first && p.last === next.last && p.at === next.at && p.n === next.n && p.place === next.place && p.places === next.places ? p : next));
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
      // calm and even: a short move between a chapter's screens takes ~1.2 s, a camera move between
      // chapters ~1.8 s, the longest 2.4 s (owner, 2026-11-16: "nice and slow, not frustrating")
      const dur = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : (ms ?? Math.min(2400, 1050 + (dist / H()) * 480));
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

    // Resting places: every chapter and every screen of a chapter's interface.
    const places = () => film.stops().map((x) => x.y);
    const target = (y: number, d: number) => (d > 0 ? (places().find((v) => v > y + 8) ?? onward()) : (places().filter((v) => v < y - 8).pop() ?? 0));
    // writing: a field has focus, the chapter holds a form, or a free-scroll chapter is on screen
    const writing = () => typingRef.current || !!document.querySelector("[data-current] form") || free();

    // One step at a time; a gesture during a move queues one more (never more), played after it.
    let moving = 0;
    let queued = false;
    const go = (d: number) => {
      moving = d;
      queued = false;
      glide(target(window.scrollY, d), undefined, () => {
        if (queued) go(d);
      });
    };
    const ask = (d: number) => {
      if (!a.gliding) go(d);
      else if (d === moving) queued = true;
      else go(d); // turning back: at once
    };

    // Touch and other native scrolling: when the visitor lets go between resting places, finish the move.
    let idle = 0;
    let touching = false;
    let lastY = window.scrollY;
    let dir = 0;
    const settle = () => {
      if (touching || a.gliding || writing() || !live()) return;
      const y = window.scrollY;
      if (places().some((v) => Math.abs(v - y) < 6)) return;
      if (dir) go(dir);
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
      queued = false;
      a.at = -1;
      if (y !== lastY) dir = y > lastY ? 1 : -1;
      lastY = y;
      clearTimeout(idle);
      idle = window.setTimeout(settle, 170);
    };
    // Mouse wheel and trackpad: one gesture, one step. A burst of wheel events (a fast spin, or a
    // trackpad's momentum tail) is one gesture; the native scroll it would cause is replaced by the calm
    // glide. A steady spin that keeps going advances again only after a long beat.
    let wheelDir = 0;
    let lastWheel = 0;
    let lastGo = 0;
    let lastAbs = 0;
    const onWheel = (e: WheelEvent) => {
      const loose = e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY) || !live() || writing();
      if (loose || !e.deltaY) return take(e);
      e.preventDefault();
      clearTimeout(idle);
      const now = performance.now();
      const d = Math.sign(e.deltaY);
      const abs = Math.abs(e.deltaY);
      // a strong push after the momentum has almost died out is a new flick, even inside a trackpad's
      // stream (a busy page merges events, so a mid-stream jump in strength alone proves nothing)
      const fresh = lastAbs < 12 && abs > Math.max(30, lastAbs * 3);
      // wheel events can arrive late while the camera is busy, so only a clear pause (450 ms) starts a new
      // gesture; people pause about that long between one scroll and the next anyway
      const burst = now - lastWheel < 450 && d === wheelDir && !fresh;
      // a fading stream (momentum) never advances again; a steady one (a long wheel spin) may, after a beat
      // (deltas are rounded, so a small one that merely repeats is still fading; a large one that repeats
      // is a wheel held spinning)
      const fading = abs < 10 || abs < lastAbs * 0.97 || (abs < 40 && abs <= lastAbs);
      lastWheel = now;
      lastAbs = abs;
      if (burst && (a.gliding || fading || now - lastGo < 3100)) return;
      wheelDir = d;
      lastGo = now;
      ask(d);
    };

    // The visitor's own input always wins over a running glide.
    const take = (e: Event) => {
      const inNav = (e.target as HTMLElement | null)?.closest?.("[data-chapter-nav]");
      if (inNav) return;
      queued = false;
      stop();
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
    const opts = { passive: true, capture: true } as const;
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    for (const t of ["touchstart", "keydown", "pointerdown"]) window.addEventListener(t, take, opts);
    window.addEventListener("wheel", onWheel, { passive: false, capture: true });
    window.addEventListener("touchstart", onTouchStart, opts);
    window.addEventListener("touchend", onTouchEnd, opts);
    window.addEventListener("touchcancel", onTouchEnd, opts);
    // the buttons
    navRef.current = { next: () => ask(1), prev: () => ask(-1) };
    return () => {
      cancelAnimationFrame(raf);
      stop();
      clearTimeout(idle);
      navRef.current = null;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      for (const t of ["touchstart", "keydown", "pointerdown"]) window.removeEventListener(t, take, opts);
      window.removeEventListener("wheel", onWheel, { capture: true });
      window.removeEventListener("touchstart", onTouchStart, opts);
      window.removeEventListener("touchend", onTouchEnd, opts);
      window.removeEventListener("touchcancel", onTouchEnd, opts);
    };
  }, [film]);

  if (!film) return null;
  return (
    <nav className={s.nav} data-chapter-nav data-place={state.place} data-places={state.places} data-show={state.show && !typing ? "true" : undefined} aria-label="Chapters">
      <button type="button" className={s.prev} onClick={() => navRef.current?.prev()} disabled={state.first} aria-label="Previous">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 14.5 12 8.5l6 6" />
        </svg>
      </button>
      <span className={s.count} aria-hidden="true">
        {String(Math.max(1, state.at)).padStart(2, "0")}
        <i>/</i>
        {String(state.n).padStart(2, "0")}
      </span>
      <button type="button" className={s.next} onClick={() => navRef.current?.next()} aria-label={state.last ? "Next, past the film" : "Next"}>
        <span>Next</span>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 9.5l6 6 6-6" />
        </svg>
      </button>
    </nav>
  );
}
