"use client";

import { useSyncExternalStore } from "react";

/** Film mode: desktop-sized, landscape, motion allowed. Must match the CSS media queries. */
export const FILM_QUERY = "(min-width: 1024px) and (min-aspect-ratio: 5/4) and (prefers-reduced-motion: no-preference)";

/** Phones, tablets and narrow windows with motion allowed: Home runs its film here too (portrait
 *  framing). Must match the CSS media queries marked "phone film". */
export const PHONE_FILM_QUERY = "(prefers-reduced-motion: no-preference) and (max-width: 1023.98px), (prefers-reduced-motion: no-preference) and (max-aspect-ratio: 1249/1000)";

const subscribeTo = (q: string) => (cb: () => void) => {
  const mq = window.matchMedia(q);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
/** Tall screens (phones, portrait tablets): films that have a portrait cut show it here. */
export const PORTRAIT_QUERY = "(max-aspect-ratio: 1/1)";

const subscribe = subscribeTo(FILM_QUERY);
const subscribePortrait = subscribeTo(PORTRAIT_QUERY);
const subscribePhone = subscribeTo(PHONE_FILM_QUERY);

export function useFilmMode() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(FILM_QUERY).matches,
    () => false,
  );
}

/** True on a screen taller than wide: the portrait cut of a film (9:16 footage) is shown there. */
export function usePortraitCut() {
  return useSyncExternalStore(
    subscribePortrait,
    () => window.matchMedia(PORTRAIT_QUERY).matches,
    () => false,
  );
}

/** True where a page that opts in (Home) runs its film on a phone or tablet. */
export function usePhoneFilm() {
  return useSyncExternalStore(
    subscribePhone,
    () => window.matchMedia(PHONE_FILM_QUERY).matches,
    () => false,
  );
}

/**
 * Renders its children only without the film (reduced motion), where the interfaces sit inline under
 * each chapter instead of on the display walls. Server-rendered, then unmounted wherever a film runs
 * (wide screens and phones; CSS already hides it there, so nothing shifts).
 */
export function FlatOnly({ children }: { children: React.ReactNode }) {
  const desktop = useFilmMode();
  const phone = usePhoneFilm();
  return desktop || phone ? null : <>{children}</>;
}

/** The opposite: rendered only on film-mode desktops (nothing on the server), so an interactive tool
 *  that also has a flat copy exists once in the document. */
export function FilmOnly({ children }: { children: React.ReactNode }) {
  return useFilmMode() ? <>{children}</> : null;
}
