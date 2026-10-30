"use client";

import { useState } from "react";
import { FILM } from "@/content/film.generated";
import { ROOMS } from "@/content/gallery";
import type { SolutionSlug } from "@/content/solutions";
import { CinemaFilm, plateRect, type CinemaBlock, type Rect } from "@/components/film/CinemaFilm";
import { ARRIVE, DESIGN } from "@/components/film/SolutionsFilm";
import { WebDisplay } from "@/components/displays/WebDisplay";
import { PhoneApp } from "@/components/displays/PhoneApp";
import { OpsDisplay } from "@/components/displays/OpsDisplay";
import { FlowDisplay } from "@/components/displays/FlowDisplay";
import { CampaignDisplay } from "@/components/displays/CampaignDisplay";
import { PlatformDisplay } from "@/components/displays/PlatformDisplay";
import f from "@/components/film/SolutionsFilm.module.css";

/**
 * A solution's own page, told in its room of the gallery (owner, 2026-10-30: every page a scene).
 * The camera rests in the room: the live interface runs on the room's display (pushed in and playing
 * through its steps on the "demo" chapter), and the camera eases to a different view for each of the
 * other chapters while their words appear and dissolve in place.
 */
/**
 * A gentle push for each reading chapter, centred a little left of the room's display so the display
 * settles to the right of the words (never under them). Height varies slightly from chapter to chapter.
 */
const viewFor = (screen: Rect, i: number): Rect => {
  const [x, y, w, h] = screen;
  const cx = Math.min(0.72, Math.max(0.28, x + w / 2 - 0.16));
  const cy = Math.min(0.66, Math.max(0.34, y + h / 2 + [0, -0.04, 0.04, -0.02, 0.02][i % 5]));
  // close enough (about 1.5×) that even a wide wall display clears the words without framing past the plate
  return [cx - 0.18, cy - 0.18, 0.36, 0.36];
};

export function RoomFilm({ slug, chapters, children }: { slug: SolutionSlug; chapters: string[]; children: React.ReactNode }) {
  const room = ROOMS.find((r) => r.slug === slug)!;
  const screen = FILM[ARRIVE[slug]].screenEnd as unknown as Rect;
  const design = DESIGN[slug];
  const blocks: CinemaBlock[] = chapters.map((id, i): CinemaBlock => {
    if (id === "intro" || id === "next") return { id, kind: "hold", still: "room" };
    if (id === "demo") return { id, kind: "hold", still: "room", dolly: screen, steps: room.steps.length, frame: { x: 0.64, y: 0.52, w: 0.56, h: 0.66 } };
    return { id, kind: "hold", still: "room", dolly: viewFor(screen, i), frame: { x: 0.7, y: 0.52, w: 0.6, h: 0.7 } };
  });
  const [pick, setPick] = useState<{ key: string; value: number } | null>(null);

  const [, , w, h] = screen;
  const radius = design.r ? `${design.r * 100}% / ${((design.r * w * 16) / (h * 9)) * 100}%` : undefined;

  return (
    <CinemaFilm
      blocks={blocks}
      segments={{}}
      stills={{ room: `/assets/cinematic/${ARRIVE[slug]}-end` }}
      label={`The ${room.slug.replace(/-/g, " ")} room`}
      overlays={(a) => {
        // Scroll plays the interface through its steps on the demo chapter; elsewhere it rests on the
        // start (intro) or the finished state. A visitor's click holds until the scroll moves on.
        const key = `${a.block}:${a.step}`;
        const scrolled = a.block === "demo" ? a.step : a.block === "intro" ? 0 : room.steps.length - 1;
        const step = pick?.key === key ? pick.value : scrolled;
        const go = (value: number) => setPick({ key, value });
        const ui: Record<SolutionSlug, React.ReactNode> = {
          "web-development": <WebDisplay step={step} go={go} />,
          "mobile-apps": <PhoneApp step={step} go={go} />,
          "custom-software": <OpsDisplay step={step} go={go} />,
          "business-automation": <FlowDisplay step={step} go={go} />,
          "digital-marketing": <CampaignDisplay step={step} go={go} />,
          "enterprise-platforms": <PlatformDisplay step={step} />,
        };
        return (
          <div className={f.overlay} data-show={chapters.join(" ")} style={{ ...plateRect(screen), borderRadius: radius, overflow: "hidden" }}>
            <div className={f.overlayInner} data-design={design.w} style={{ width: design.w, height: design.w / ((w * 16) / (h * 9)) }}>
              {ui[slug]}
            </div>
          </div>
        );
      }}
    >
      {children}
    </CinemaFilm>
  );
}
