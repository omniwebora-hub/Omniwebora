"use client";

import { smoothstep } from "@/components/film/engine";
import type { FrameHook } from "@/components/film/CinemaFilm";
import { heroPanels } from "@/content/heroWorld";
import { H01_TRACK } from "@/content/cinematic.generated";
import { solutionBySlug } from "@/content/solutions";
import s from "./HomeOpening.module.css";

/**
 * Home opening (owner reference, 2026-10-30): the glass crystal on its marble and gold pedestal on the
 * golden-hour terrace, the Omniwebora mark and name glowing in its deep-blue core, the six services as
 * light glass cards around it. On scroll the cards clear and the camera pushes in on the crystal (the
 * v1 push-in, H01), holds, then flies into the core and comes out on the drawing of the building:
 * 01 Innovate and the rest of the story follow unchanged.
 *
 * The mark rides the crystal frame by frame (H01_TRACK, the cube measured in every frame of the clip).
 * Per frame only transforms and opacities are written, element by element.
 */

/** The six arched bays (plate fractions), shared with HomeFilm's Innovate / Transform overlays. */
export const BAY_X = [0.211, 0.336, 0.459, 0.583, 0.707, 0.832] as const;
export const BAY = { y: 0.192, w: 0.081, h: 0.484 } as const;

const REST = H01_TRACK[0];
/** The crystal's glass at rest, left and right edges as plate fractions (measured on h00-hero). */
const GLASS = { l: 0.625, r: 0.86 } as const;
const END = H01_TRACK[H01_TRACK.length - 1];

/** The existing mark (Logo.tsx), drawn in light for the crystal's core. */
function CoreMark() {
  return (
    <svg className={s.markSvg} viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor" strokeWidth="3.6" strokeLinecap="round">
        <path d="M14.2 19.6a7.6 7.6 0 1 1 11.6 0" />
        <path d="M20 29.6a7.6 7.6 0 1 1-8.4-12.4" />
        <path d="M28.4 17.2A7.6 7.6 0 1 1 20 29.6" />
        <path d="M16.4 25.4 20 22l3.6 3.4" />
      </g>
    </svg>
  );
}

/**
 * A small drawn preview of each service on its card (owner reference: a site, apps, a dashboard, a
 * flow). Illustrative shapes only, no data. viewBox 200 x 64.
 */
function Preview({ slug }: { slug: string }) {
  const ink = "#16305e";
  const blue = "#3d7be0";
  const soft = "#c9d6ea";
  switch (slug) {
    case "web-development":
      return (
        <svg className={s.pv} viewBox="0 0 200 64" aria-hidden="true">
          <rect x="1" y="1" width="198" height="62" rx="6" fill="#fff" stroke={soft} />
          <circle cx="9" cy="8" r="2" fill={soft} />
          <circle cx="16" cy="8" r="2" fill={soft} />
          <circle cx="23" cy="8" r="2" fill={soft} />
          <rect x="10" y="20" width="64" height="6" rx="2" fill={ink} />
          <rect x="10" y="30" width="80" height="3" rx="1.5" fill={soft} />
          <rect x="10" y="36" width="70" height="3" rx="1.5" fill={soft} />
          <rect x="10" y="46" width="30" height="9" rx="4.5" fill={ink} />
          <image href="/assets/cinematic/d01-colonnade-1280.webp" x="104" y="16" width="88" height="40" preserveAspectRatio="xMidYMid slice" />
        </svg>
      );
    case "mobile-apps":
      return (
        <svg className={s.pv} viewBox="0 0 200 64" aria-hidden="true">
          <rect x="52" y="2" width="40" height="60" rx="7" fill="#fff" stroke={soft} />
          {[0, 1, 2].map((r) => [0, 1].map((c) => <rect key={`${r}${c}`} x={58 + c * 15} y={12 + r * 13} width="12" height="9" rx="2" fill={r === 1 && c === 0 ? blue : soft} />))}
          <rect x="58" y="51" width="28" height="6" rx="3" fill={ink} />
          <rect x="106" y="2" width="40" height="60" rx="7" fill={ink} />
          <circle cx="126" cy="28" r="11" fill="none" stroke="#2c4a80" strokeWidth="4" />
          <circle cx="126" cy="28" r="11" fill="none" stroke="#8fc3ff" strokeWidth="4" strokeDasharray="50 70" transform="rotate(-90 126 28)" />
          <rect x="112" y="47" width="28" height="4" rx="2" fill="#2c4a80" />
        </svg>
      );
    case "custom-software":
      return (
        <svg className={s.pv} viewBox="0 0 200 64" aria-hidden="true">
          <rect x="1" y="1" width="198" height="62" rx="6" fill="#fff" stroke={soft} />
          <rect x="1" y="1" width="30" height="62" rx="6" fill={ink} />
          {[10, 20, 30].map((y) => <rect key={y} x="7" y={y} width="18" height="4" rx="2" fill="#2c4a80" />)}
          {[22, 30, 26, 38, 34, 44, 48].map((h, i) => <rect key={i} x={44 + i * 20} y={56 - h} width="12" height={h} rx="2" fill={i === 6 ? blue : "#9fbbe8"} />)}
        </svg>
      );
    case "business-automation":
      return (
        <svg className={s.pv} viewBox="0 0 200 64" aria-hidden="true">
          <rect x="1" y="1" width="198" height="62" rx="6" fill="#fff" stroke={soft} />
          <path d="M30 32 H170" stroke="#d9a65c" strokeWidth="2" strokeDasharray="4 4" />
          {[30, 77, 123, 170].map((x, i) => (
            <g key={x}>
              <rect x={x - 16} y="22" width="32" height="20" rx="5" fill={i === 1 ? ink : "#fff"} stroke={i === 1 ? ink : soft} />
              <rect x={x - 9} y="30" width="18" height="4" rx="2" fill={i === 1 ? "#8fc3ff" : soft} />
            </g>
          ))}
        </svg>
      );
    case "digital-marketing":
      return (
        <svg className={s.pv} viewBox="0 0 200 64" aria-hidden="true">
          <rect x="1" y="1" width="198" height="62" rx="6" fill="#fff" stroke={soft} />
          <polyline points="12,50 40,44 64,46 90,34 116,36 142,24 168,20 188,12" fill="none" stroke={blue} strokeWidth="2.5" strokeLinejoin="round" />
          <polyline points="12,54 40,52 64,50 90,47 116,45 142,42 168,40 188,36" fill="none" stroke={soft} strokeWidth="2" />
          <circle cx="188" cy="12" r="3" fill={blue} />
        </svg>
      );
    default:
      return (
        <svg className={s.pv} viewBox="0 0 200 64" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(${30 + i * 14} ${38 - i * 14})`}>
              <path d="M0 10 L60 0 L120 10 L60 20 Z" fill={i === 2 ? ink : i === 1 ? "#5d86cf" : "#b9cdee"} stroke="#fff" strokeWidth="1" />
            </g>
          ))}
        </svg>
      );
  }
}

/** The film overlay (plate coordinates; rendered inside CinemaFilm's camera). */
export function HomeOpening() {
  return (
    <div className={s.root} data-opening>
      <div className={s.core} data-part="core" aria-hidden="true">
        <div className={s.coreIn}>
          <CoreMark />
          <span className={s.word}>Omniwebora</span>
        </div>
      </div>
      <ul className={s.cards} data-part="cards" aria-label="Our six services">
        {heroPanels.map((p, i) => {
          const sol = solutionBySlug(p.slug)!;
          return (
            <li key={p.slug} className={s.card} data-card data-side={p.side} style={{ animationDelay: `${0.5 + i * 0.08}s` }}>
              <a href={`/solutions#${p.slug}`} tabIndex={-1}>
                <b>{sol.name}</b>
                <span>{p.tagline}</span>
                <Preview slug={p.slug} />
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
  let core: HTMLElement | null = null;
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
      core = root?.querySelector<HTMLElement>('[data-part="core"]') ?? null;
      cardBox = root?.querySelector<HTMLElement>('[data-part="cards"]') ?? null;
      cards = root ? Array.from(root.querySelectorAll<HTMLElement>("[data-card]")) : [];
      written.clear();
      layout = "";
    }
    if (!root || !core || !cardBox) return;
    const order = [ids.arrive, ids.push, ids.core, ids.dive];
    const at = order.indexOf(block.id);
    const on = at >= 0;
    if (root.dataset.on !== String(on)) root.dataset.on = String(on);
    if (!on) return;
    const { pw, ph, W, H } = geo;
    const portrait = W / H < 1.25;
    if (root.dataset.portrait !== String(portrait)) root.dataset.portrait = String(portrait);

    // The mark rides the crystal: its tracked centre and height in the push-in, held after it.
    let t: readonly [number, number, number] = REST;
    if (at === 1) {
      const f = p * (H01_TRACK.length - 1);
      const i = Math.min(H01_TRACK.length - 2, Math.floor(f));
      const k = f - i;
      const a = H01_TRACK[i];
      const b = H01_TRACK[i + 1];
      t = [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
    } else if (at >= 2) t = END;
    // into the core: the mark swells a little and is gone before the camera reaches the glass
    const dive = at === 3 ? smoothstep(0, 0.1, p) : 0;
    const sc = (t[2] / REST[2]) * (1 + 0.5 * dive);
    set(core, "transform", `translate(${(t[0] * pw).toFixed(1)}px, ${(t[1] * ph).toFixed(1)}px) scale(${fx(sc)})`);
    set(core, "opacity", fx(1 - dive));
    if (portrait) return;

    // Landscape framing: shift the plate sideways so the space left of the crystal (after the words)
    // and right of it are equal; eased back to centre while the camera flies into the core.
    if (layout !== `${Math.round(pw)}x${Math.round(ph)}x${Math.round(W)}x${Math.round(H)}`) {
      layout = `${Math.round(pw)}x${Math.round(ph)}x${Math.round(W)}x${Math.round(H)}`;
      const words = document.querySelectorAll<HTMLElement>('[data-film-block="arrive"] [data-panel] > *');
      wordsRight = Math.max(0, ...Array.from(words, (w) => w.getBoundingClientRect().right));
      const px0 = (W - pw) / 2;
      const left = (W + 4 + wordsRight - (GLASS.l + GLASS.r) * pw) / 2;
      const room = (pw - W) / 2;
      pan = Math.max(-room, Math.min(room, left - px0));
      placeCards();
    }

    // The cards clear as the scroll begins, before the camera moves.
    const clear = at === 0 ? smoothstep(0.35, 0.85, p) : 1;
    set(cardBox, "opacity", fx(1 - clear));
    if (cardBox.dataset.live !== String(clear < 0.5)) cardBox.dataset.live = String(clear < 0.5);
    cards.forEach((n, i) => {
      const out = (heroPanels[i].side === "left" ? -1 : 1) * clear * 40;
      set(n, "translate", `${out.toFixed(1)}px 0`);
    });
    return at === 3 ? pan * (1 - smoothstep(0, 0.6, p)) : pan;

    /** Each side's three cards fill the space between the words (or the window edge) and the crystal,
     *  stacked around the crystal's centre; never over the crystal, the words or each other. */
    function placeCards() {
      const wl = (pw - W) / 2 - pan; // the window's left edge in plate pixels
      const gap = 22;
      const sides = {
        left: [wl + wordsRight + gap, GLASS.l * pw - gap],
        right: [GLASS.r * pw + gap, wl + W - gap],
      } as const;
      const top = (ph - H) / 2 + 84; // below the header
      const bottom = (ph - H) / 2 + H - 24;
      let fits = true;
      for (const side of ["left", "right"] as const) {
        const [x0, x1] = sides[side];
        const w = Math.min(250, x1 - x0);
        if (w < 140) fits = false;
        const mine = cards.filter((_, i) => heroPanels[i].side === side);
        mine.forEach((n) => {
          set(n.firstElementChild as HTMLElement, "width", `${Math.round(w)}px`);
          const compact = String(w < 175);
          if (n.dataset.compact !== compact) n.dataset.compact = compact;
        });
        const hs = mine.map((n) => n.offsetHeight);
        const total = hs.reduce((s, h) => s + h, 0) + 16 * (mine.length - 1);
        let y = Math.max(top, Math.min(bottom - total, REST[1] * ph - total / 2));
        if (y + total > bottom) fits = false;
        const x = side === "left" ? x1 - w : x0;
        mine.forEach((n, k) => {
          set(n, "transform", `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`);
          y += hs[k] + 16;
        });
      }
      // Too little room on this screen: no cards rather than cards over the crystal or the words.
      cardBox!.dataset.fits = String(fits);
    }
  };
}
