"use client";

import { useEffect, useRef } from "react";

/**
 * The footer's living scene: the building at night across the pool, in gentle motion (a seamless
 * Higgsfield loop). Loaded only on wide screens with motion allowed, and played only while the footer
 * is actually revealed; otherwise the still is shown.
 */
export function FooterScene({ src, poster }: { src: string; poster: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const ok = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    if (!ok.matches) return;
    let loaded = false;
    const check = () => {
      const left = document.documentElement.scrollHeight - window.scrollY - window.innerHeight;
      const near = left < window.innerHeight * 1.2;
      if (near && !loaded) {
        loaded = true;
        v.src = src;
      }
      if (near && loaded && v.paused) v.play().catch(() => undefined);
      if (!near && !v.paused) v.pause();
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, [src]);

  return <video ref={ref} poster={poster} muted loop playsInline preload="none" aria-hidden="true" tabIndex={-1} />;
}
