"use client";

import { FILM } from "@/content/film.generated";
import { WEBSITE_PLANS } from "@/content/pricing";
import { CinemaFilm, type CinemaBlock } from "@/components/film/CinemaFilm";
import type { FilmSegment } from "@/components/film/engine";
import f from "@/components/film/SolutionsFilm.module.css";
import s from "./PricingFilm.module.css";

/**
 * Pricing "scope atelier" (design/IMMERSIVE_PLAN.md §10): a locked-off camera on an architect's model
 * table. As you scroll, the model grows from one pavilion (Basic) to connected wings (Standard) to a
 * coordinated campus (Premium): a metaphor for scope, not a price formula.
 */
type SegId = "price-grow1" | "price-grow2";
const seg = (id: SegId): FilmSegment => ({ id, base: `/assets/cinematic/${id}`, frames: FILM[id].frames, videoFrames: FILM[id].videoFrames, fps: FILM[id].fps });
const SEGMENTS = { "price-grow1": seg("price-grow1"), "price-grow2": seg("price-grow2") };
const STILLS = { basic: "/assets/cinematic/p01-basic", standard: "/assets/cinematic/price-grow1-end", premium: "/assets/cinematic/price-grow2-end" };

export const PRICING_BLOCKS: CinemaBlock[] = [
  { id: "basic", kind: "hold", still: "basic" },
  { id: "grow1", kind: "seg", seg: "price-grow1" },
  { id: "standard", kind: "hold", still: "standard" },
  { id: "grow2", kind: "seg", seg: "price-grow2" },
  { id: "premium", kind: "hold", still: "premium" },
  // After the plans the camera stays with the finished campus, easing toward a different part of it
  // for each chapter: every other service, what shapes a proposal, questions.
  { id: "others", kind: "hold", still: "premium", dolly: [0.36, 0.36, 0.42, 0.4] },
  { id: "drivers", kind: "hold", still: "premium", dolly: [0.46, 0.38, 0.4, 0.38] },
  { id: "faq", kind: "hold", still: "premium", dolly: [0.3, 0.32, 0.46, 0.42] },
];
const LEVEL: Record<string, number> = { basic: 0, grow1: 0, standard: 1, grow2: 1, premium: 2 };

export function PricingFilm({ children }: { children: React.ReactNode }) {
  return (
    <CinemaFilm
      blocks={PRICING_BLOCKS}
      segments={SEGMENTS}
      stills={STILLS}
      label="Website plans"
      overlays={(a) => {
        const lvl = LEVEL[a.block] + (a.block.startsWith("grow") && a.p > 0.5 ? 1 : 0);
        return (
          <ol className={`${f.overlay} ${s.scale}`} data-show="basic grow1 standard grow2 premium" aria-hidden="true">
            {WEBSITE_PLANS.map((p, i) => (
              <li key={p.id} data-state={i < lvl ? "done" : i === lvl ? "now" : undefined}>
                <span className={s.bars}>
                  {[0, 1, 2].map((k) => (
                    <i key={k} data-on={k <= i ? "true" : undefined} />
                  ))}
                </span>
                {p.name}
              </li>
            ))}
          </ol>
        );
      }}
    >
      {children}
    </CinemaFilm>
  );
}
