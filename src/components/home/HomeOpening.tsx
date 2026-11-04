"use client";

import { smoothstep } from "@/components/film/engine";
import type { FrameHook } from "@/components/film/CinemaFilm";
import { heroPanels } from "@/content/heroWorld";
import { HOME_PUSH_TRACK } from "@/content/homePushTrack";
import { solutionBySlug } from "@/content/solutions";
import s from "./HomeOpening.module.css";

/**
 * Home opening (owner reference, 2026-10-30): the glass crystal on its marble and gold pedestal on the
 * golden-hour terrace, the six services as light glass cards around it. On scroll the cards clear and
 * the camera pushes in on the crystal (the v1 push-in, H01), holds, then flies into the core and comes
 * out on the drawing of the building: 01 Innovate and the rest of the story follow unchanged.
 *
 * The crystal's core is left as filmed (owner, 2026-11-04): no mark or name is laid over it, since a
 * flat overlay never sits seamlessly inside the moving glass. Per frame only transforms and opacities
 * are written, element by element.
 */

/** The six arched bays (plate fractions), shared with HomeFilm's Innovate / Transform overlays. */
export const BAY_X = [0.211, 0.336, 0.459, 0.583, 0.707, 0.832] as const;
export const BAY = { y: 0.192, w: 0.081, h: 0.484 } as const;

const TRACK = HOME_PUSH_TRACK;
const REST = TRACK[0];
/** The crystal's glass at rest, left and right edges as plate fractions (measured on h00-hero). */
const GLASS = { l: 0.625, r: 0.86 } as const;
/** The crystal on the hold after the push-in: the left tip of its gold ring, as a plate fraction. */
const CORE_GLASS_L = 0.335;

/** The film overlay (plate coordinates; rendered inside CinemaFilm's camera). */
export function HomeOpening() {
  return (
    <div className={s.root} data-opening>
      <ul className={s.cards} data-part="cards" aria-label="Our six services">
        {heroPanels.map((p, i) => {
          const sol = solutionBySlug(p.slug)!;
          return (
            <li key={p.slug} className={s.card} data-card data-side={p.side} style={{ animationDelay: `${0.5 + i * 0.08}s` }}>
              <a href={`/solutions#${p.slug}`} tabIndex={-1}>
                {/* the short name keeps every card to one line of title, so all six read the same */}
                <b>{sol.short}</b>
                <span>{p.tagline}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

const fx = (v: number, d = 3) => v.toFixed(d);

/**
 * Per-frame driver: `arrive` is the first screen (cards around the crystal), `push` the camera move in
 * (H01), `core` the hold on the crystal, `dive` the flight into the core onto the drawing.
 */
export function openingDriver(ids: { arrive: string; push: string; core: string; dive: string }): FrameHook {
  let root: HTMLElement | null = null;
  let cards: HTMLElement[] = [];
  let cardBox: HTMLElement | null = null;
  const written = new Map<HTMLElement, Record<string, string>>();
  const set = (el: HTMLElement, prop: string, v: string) => {
    let w = written.get(el);
    if (!w) written.set(el, (w = {}));
    if (w[prop] === v) return;
    w[prop] = v;
    (el.style as unknown as Record<string, string>)[prop] = v;
  };
  let layout = "";
  let wordsRight = 0;
  let pan = 0;

  return ({ block, p, geo }) => {
    if (!root?.isConnected) {
      root = document.querySelector<HTMLElement>("[data-opening]");
      cardBox = root?.querySelector<HTMLElement>('[data-part="cards"]') ?? null;
      cards = root ? Array.from(root.querySelectorAll<HTMLElement>("[data-card]")) : [];
      written.clear();
      layout = "";
    }
    if (!root || !cardBox) return;
    const { pw, ph, W, H } = geo;
    const portrait = W / H < 1.25;

    // Landscape framing for the whole film: the plate is shifted sideways once per screen size so the
    // space left of the crystal (after the words) and right of it are equal. It never changes while
    // scrolling, so nothing slides; every overlay is in plate coordinates and moves with it.
    const key = `${Math.round(pw)}x${Math.round(ph)}x${Math.round(W)}x${Math.round(H)}`;
    if (!portrait && key !== layout) {
      layout = key;
      const words = document.querySelectorAll<HTMLElement>('[data-film-block="arrive"] [data-panel] > *');
      wordsRight = Math.max(0, ...Array.from(words, (w) => w.getBoundingClientRect().right));
      const px0 = (W - pw) / 2;
      const left = (W + 4 + wordsRight - (GLASS.l + GLASS.r) * pw) / 2;
      const room = (pw - W) / 2;
      pan = Math.max(-room, Math.min(room, left - px0));
      placeCards();
      // The crystal hold's words end before the glass: their width, for CSS (--core-room).
      const film = root.closest<HTMLElement>("[data-film]");
      const pad = Math.min(56, Math.max(24, W * 0.032));
      film?.style.setProperty("--core-room", `${Math.max(240, Math.round(CORE_GLASS_L * pw + px0 + pan - pad - 32))}px`);
    }

    const order = [ids.arrive, ids.push, ids.core, ids.dive];
    const at = order.indexOf(block.id);
    const on = at >= 0;
    if (root.dataset.on !== String(on)) root.dataset.on = String(on);
    if (root.dataset.portrait !== String(portrait)) root.dataset.portrait = String(portrait);
    if (!on) return portrait ? undefined : pan;

    if (portrait) return undefined;

    // The cards clear as the scroll begins, before the camera moves.
    const clear = at === 0 ? smoothstep(0.35, 0.85, p) : 1;
    set(cardBox, "opacity", fx(1 - clear));
    if (cardBox.dataset.live !== String(clear < 0.5)) cardBox.dataset.live = String(clear < 0.5);
    cards.forEach((n, i) => {
      const out = (heroPanels[i].side === "left" ? -1 : 1) * clear * 40;
      set(n, "translate", `${out.toFixed(1)}px 0`);
    });
    return pan;

    /** The six cards are one size (owner, 2026-11-04: "all these in different sizes, make it minimal"):
     *  the width the narrower side allows, the height of the tallest card. Each side's three are stacked
     *  around the crystal's centre, between the words (or the window edge) and the crystal; never over
     *  the crystal, the words or each other. */
    function placeCards() {
      const wl = (pw - W) / 2 - pan; // the window's left edge in plate pixels
      const gap = 22;
      const sides = {
        left: [wl + wordsRight + gap, GLASS.l * pw - gap],
        right: [GLASS.r * pw + gap, wl + W - gap],
      } as const;
      const top = (ph - H) / 2 + 84; // below the header
      const bottom = (ph - H) / 2 + H - 24;
      const w = Math.min(230, sides.left[1] - sides.left[0], sides.right[1] - sides.right[0]);
      let fits = w >= 136;
      const links = cards.map((n) => n.firstElementChild as HTMLElement);
      links.forEach((a) => {
        set(a, "width", `${Math.round(w)}px`);
        set(a, "minHeight", "");
      });
      const h = Math.max(...cards.map((n) => n.offsetHeight));
      links.forEach((a) => set(a, "minHeight", `${h}px`));
      const step = h + 14;
      const total = step * 3 - 14;
      const y0 = Math.max(top, Math.min(bottom - total, REST[1] * ph - total / 2));
      if (y0 + total > bottom) fits = false;
      for (const side of ["left", "right"] as const) {
        const [x0, x1] = sides[side];
        const x = side === "left" ? x1 - w : x0;
        cards
          .filter((_, i) => heroPanels[i].side === side)
          .forEach((n, k) => set(n, "transform", `translate(${x.toFixed(1)}px, ${(y0 + k * step).toFixed(1)}px)`));
      }
      // Too little room on this screen: no cards rather than cards over the crystal or the words.
      cardBox!.dataset.fits = String(fits);
    }
  };
}
