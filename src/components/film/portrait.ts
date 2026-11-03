import { PORTRAIT } from "@/content/portrait.generated";
import type { FilmSegment } from "./engine";
import type { Rect } from "./CinemaFilm";

/**
 * The portrait (9:16) cut's footage (scripts/cinematic/build_portrait.py), for films to pick from:
 * clips, their measured display rects, and the stills' base paths. A film only switches to its portrait
 * cut when every clip it needs exists.
 */
export const PB = "/assets/cinematic/portrait";
type Meta = { frames: number; videoFrames: number; fps: number; screenEnd?: number[]; screensEnd?: number[][] };
const SEGS = PORTRAIT.segments as unknown as Record<string, Meta | undefined>;

/** A portrait clip as a film segment, or undefined until it is built. */
export const pseg = (id: string, extra?: Partial<FilmSegment>): FilmSegment | undefined => {
  const m = SEGS[id];
  return m ? { id, base: `${PB}/${id}`, frames: m.frames, videoFrames: m.videoFrames, fps: m.fps, ...extra } : undefined;
};

/** Every listed clip as segments, or undefined if any is missing. */
export const psegs = (ids: string[], extra: Record<string, Partial<FilmSegment>> = {}): Record<string, FilmSegment> | undefined => {
  const out: Record<string, FilmSegment> = {};
  for (const id of ids) {
    const s = pseg(id, extra[id]);
    if (!s) return undefined;
    out[id] = s;
  }
  return out;
};

/** The blank display in a clip's last frame (fractions of the 9:16 frame). */
export const pscreen = (id: string): Rect | undefined => SEGS[id]?.screenEnd as Rect | undefined;
/** Several displays in a clip's last frame (top to bottom for a column, else left to right). */
export const pscreens = (id: string): Rect[] | undefined => SEGS[id]?.screensEnd as Rect[] | undefined;
