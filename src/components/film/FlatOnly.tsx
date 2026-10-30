"use client";

import { useSyncExternalStore } from "react";

/** Film mode: desktop-sized, landscape, motion allowed. Must match the CSS media queries. */
export const FILM_QUERY = "(min-width: 1024px) and (min-aspect-ratio: 5/4) and (prefers-reduced-motion: no-preference)";

const subscribe = (cb: () => void) => {
  const mq = window.matchMedia(FILM_QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

export function useFilmMode() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(FILM_QUERY).matches,
    () => false,
  );
}

/**
 * Renders its children only outside film mode (phones, tablets, reduced motion), where the interfaces
 * sit inline under each chapter instead of on the display walls. Server-rendered, then unmounted on
 * film-mode desktops (CSS already hides it there, so nothing shifts).
 */
export function FlatOnly({ children }: { children: React.ReactNode }) {
  return useFilmMode() ? null : <>{children}</>;
}

/** The opposite: rendered only on film-mode desktops (nothing on the server), so an interactive tool
 *  that also has a flat copy exists once in the document. */
export function FilmOnly({ children }: { children: React.ReactNode }) {
  return useFilmMode() ? <>{children}</> : null;
}
