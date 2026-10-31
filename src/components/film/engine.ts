/**
 * FilmEngine: the shared scroll-film runtime for every immersive page (design/IMMERSIVE_PLAN.md §8, §11).
 *
 * - Native scrolling stays untouched; a passive listener only records the target position.
 * - One rAF loop eases the camera toward that target (frame-rate independent, like the hero's GSAP
 *   scrub) and stops itself once settled, so an idle page costs nothing.
 * - Layout is measured on resize only; per-frame work is arithmetic plus cached style writes.
 * - Camera moves are short-GOP videos scrubbed by seeking (primary), or ImageBitmap sequences
 *   (`?engine=frames` fallback). Only nearby segments are loaded; distant ones are released.
 * - Holds show sharp 2560 stills; a hold's still is the previous clip's exact last frame.
 * React is never told about scroll ticks: pages get `onFrame` for direct DOM writes and decide
 * themselves when a (rare) state change is worth a render.
 */
import { FrameSet } from "./frames";

export type FilmSegment = {
  id: string;
  /** Base folder, e.g. /assets/cinematic/sol-enter (holds v1600.mp4, v1280.mp4, lg/, md/). */
  base: string;
  frames: number;
  videoFrames: number;
  fps: number;
  /** How much of the segment the clip takes to fade in over the previous still (default 4 %). */
  fade?: number;
};
export type FilmBlock = { id: string; kind: "hold" | "seg"; seg?: string; still?: string };
export type FilmGeometry = { W: number; H: number; pw: number; ph: number; px: number; py: number };
export type FilmFrame = { index: number; block: FilmBlock; next?: FilmBlock; p: number; moving: boolean; geo: FilmGeometry };
export type EngineKind = "video" | "frames";

type Options = {
  root: HTMLElement;
  stage: HTMLElement;
  /** Element the media layers are inserted into (under the page's overlays). */
  layer: HTMLElement;
  blocks: FilmBlock[];
  segments: Record<string, FilmSegment>;
  kind: EngineKind;
  /** Easing time constant in seconds (hero scrub ≈ 0.6 s catch-up ≈ τ 0.16 s). */
  tau?: number;
  onFrame: (f: FilmFrame) => void;
};

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const smoothstep = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/* ------------------------------------------------------------------ stats (QA only) */
type Stats = {
  renders: number;
  renderMs: number[];
  seeks: number;
  seekMs: number[];
  presented: number;
  steps: number[];
  fallbackFrames: number;
  blankFrames: number;
  decodedMB: () => number;
  loaded: () => string[];
};
function makeStats(): Stats {
  return { renders: 0, renderMs: [], seeks: 0, seekMs: [], presented: 0, steps: [], fallbackFrames: 0, blankFrames: 0, decodedMB: () => 0, loaded: () => [] };
}
const q = (a: number[], x: number) => {
  if (!a.length) return 0;
  const s = [...a].sort((m, n) => m - n);
  return Math.round(s[Math.floor((s.length - 1) * x)] * 100) / 100;
};

/* ------------------------------------------------------------------ media backends */
interface Media {
  el: HTMLElement;
  state: "idle" | "loading" | "ready";
  readonly ready: boolean;
  prepare(): void;
  release(): void;
  /** Show progress p; returns false if no frame of this segment can be shown yet. */
  show(p: number): boolean;
  decodedBytes(): number;
}

class VideoMedia implements Media {
  el: HTMLVideoElement;
  state: Media["state"] = "idle";
  get ready() {
    return this.state === "ready";
  }
  private url = "";
  private abort: AbortController | null = null;
  private seeking = false;
  private want = -1;
  private requested = -1;
  private shownMedia = -1;
  private t0 = 0;

  constructor(
    private seg: FilmSegment,
    private src: string,
    private stats: Stats,
    private wake: () => void,
  ) {
    const v = document.createElement("video");
    v.muted = true;
    v.playsInline = true;
    v.preload = "none";
    v.disablePictureInPicture = true;
    v.setAttribute("aria-hidden", "true");
    v.setAttribute("tabindex", "-1");
    v.dataset.filmMedia = seg.id;
    v.addEventListener("seeked", () => {
      this.seeking = false;
      this.stats.seeks++;
      this.stats.seekMs.push(performance.now() - this.t0);
      if (this.want !== this.requested) this.seek();
    });
    v.addEventListener("loadeddata", () => {
      this.state = "ready";
      this.wake();
    });
    const onFrame: VideoFrameRequestCallback = (_, meta) => {
      const idx = Math.round(meta.mediaTime * this.seg.fps - 0.5);
      if (idx !== this.shownMedia) {
        if (this.shownMedia >= 0) this.stats.steps.push(Math.abs(idx - this.shownMedia) / (this.seg.videoFrames - 1));
        this.shownMedia = idx;
        this.stats.presented++;
      }
      if (this.state !== "idle") v.requestVideoFrameCallback(onFrame);
    };
    this.rvfc = onFrame;
    this.el = v;
  }
  private rvfc: VideoFrameRequestCallback;

  prepare() {
    if (this.state !== "idle") return;
    this.state = "loading";
    this.abort = new AbortController();
    // Fetch the whole (3–4 MB) clip so every seek is local; the HTTP cache makes revisits free.
    fetch(this.src, { signal: this.abort.signal })
      .then((r) => (r.ok ? r.blob() : Promise.reject(new Error(String(r.status)))))
      .then((b) => {
        if (this.state !== "loading") return;
        this.url = URL.createObjectURL(b);
        this.el.preload = "auto";
        this.el.src = this.url;
        this.el.load();
        if ("requestVideoFrameCallback" in this.el) this.el.requestVideoFrameCallback(this.rvfc);
      })
      .catch(() => {
        if (this.state === "loading") this.state = "idle";
      });
  }

  release() {
    this.abort?.abort();
    this.state = "idle";
    this.seeking = false;
    this.requested = this.want = -1;
    if (this.url) {
      this.el.removeAttribute("src");
      this.el.load(); // frees the decoder
      URL.revokeObjectURL(this.url);
      this.url = "";
    }
  }

  private seek() {
    if (this.seeking || this.want < 0) return;
    this.requested = this.want;
    this.seeking = true;
    this.t0 = performance.now();
    this.el.currentTime = (this.want + 0.5) / this.seg.fps;
  }

  show(p: number) {
    if (this.state !== "ready") return false;
    this.want = Math.round(clamp01(p) * (this.seg.videoFrames - 1));
    if (this.want !== this.requested) this.seek();
    return true;
  }

  decodedBytes() {
    return this.state === "ready" ? this.el.videoWidth * this.el.videoHeight * 1.5 * 4 : 0;
  }
}

class FrameMedia implements Media {
  el: HTMLCanvasElement;
  state: Media["state"] = "idle";
  get ready() {
    return this.state === "ready";
  }
  private set: FrameSet | null = null;
  private ctx: CanvasRenderingContext2D;
  private lastKey = "";
  private lastIdx = -1;

  constructor(
    private seg: FilmSegment,
    private size: "lg" | "md",
    private stats: Stats,
    private wake: () => void,
  ) {
    const c = document.createElement("canvas");
    c.width = size === "lg" ? 1440 : 960;
    c.height = size === "lg" ? 810 : 540;
    c.setAttribute("aria-hidden", "true");
    c.dataset.filmMedia = seg.id;
    this.el = c;
    this.ctx = c.getContext("2d", { alpha: false })!;
  }

  prepare() {
    if (this.state !== "idle") return;
    this.state = "ready";
    this.set = new FrameSet(this.seg.base, this.seg.frames, this.size, () => {
      this.lastKey = "";
      this.wake();
    });
    this.set.want(0);
  }

  release() {
    this.set?.release();
    this.set = null;
    this.state = "idle";
    this.lastKey = "";
  }

  show(p: number) {
    if (!this.set) return false;
    const f = clamp01(p) * (this.seg.frames - 1);
    this.set.want(f);
    const key = `${Math.round(f * 40)}`;
    if (key === this.lastKey) return this.lastIdx >= 0;
    const drawn = this.set.draw(this.ctx, this.el.width, this.el.height, p);
    if (drawn < 0) return false;
    if (Math.abs(drawn - f) > 1) this.stats.fallbackFrames++;
    if (this.lastIdx >= 0 && drawn !== this.lastIdx) {
      this.stats.steps.push(Math.abs(drawn - this.lastIdx) / (this.seg.frames - 1));
      this.stats.presented++;
    }
    this.lastIdx = drawn;
    this.lastKey = key;
    return true;
  }

  decodedBytes() {
    return this.set?.decodedBytes ?? 0;
  }
}

/* ------------------------------------------------------------------ engine */
export class FilmEngine {
  private o: Required<Omit<Options, "tau">> & { tau: number };
  private media: Record<string, Media> = {};
  private stills: Record<string, HTMLElement> = {};
  private blockEls: HTMLElement[] = [];
  private tops: number[] = [];
  private heights: number[] = [];
  private rootTop = 0;
  private geo: FilmGeometry = { W: 0, H: 0, pw: 0, ph: 0, px: 0, py: 0 };
  private target = 0;
  private cur = 0;
  private last = 0;
  private raf = 0;
  private ro: ResizeObserver;
  private dead = false;
  private written = new Map<HTMLElement, Partial<Record<"opacity" | "transform", string>>>();
  private lastIndex = -1;
  private currentIndex = -1;
  /** Which segments around the playhead are kept loaded (chapters behind, ahead). */
  private reach: [number, number] = [-2, 4];
  readonly stats = makeStats();

  constructor(opts: Options) {
    this.o = { tau: 0.16, ...opts };
    const { root, layer, segments, kind } = this.o;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const plateW = Math.max(window.innerWidth, (window.innerHeight * 16) / 9) * dpr;
    // Phones and tablets (portrait or narrow): the 1280 encode is plenty for the visible crop.
    const small = window.innerWidth < 1024 || window.innerWidth < window.innerHeight;
    this.reach = small ? [-1, 2] : [-2, 4];
    for (const s of Object.values(segments)) {
      const m =
        kind === "video"
          ? new VideoMedia(s, `${s.base}/${plateW > 1450 && !small ? "v1600" : "v1280"}.mp4`, this.stats, this.wake)
          : new FrameMedia(s, plateW > 1300 ? "lg" : "md", this.stats, this.wake);
      m.el.className = "film-media";
      m.el.style.opacity = "0";
      layer.appendChild(m.el);
      this.media[s.id] = m;
    }
    root.querySelectorAll<HTMLElement>("[data-still]").forEach((n) => (this.stills[n.dataset.still!] = n));
    this.blockEls = this.o.blocks.map((b) => root.querySelector<HTMLElement>(`[data-film-block="${b.id}"]`)!);
    this.stats.decodedMB = () => Math.round(Object.values(this.media).reduce((a, m) => a + m.decodedBytes(), 0) / 1048576);
    this.stats.loaded = () => Object.entries(this.media).filter(([, m]) => m.state !== "idle").map(([k]) => k);

    this.ro = new ResizeObserver(() => this.measure());
    this.ro.observe(this.o.stage);
    this.ro.observe(root);
    window.addEventListener("scroll", this.onScroll, { passive: true });
    document.addEventListener("visibilitychange", this.onVisibility);
    window.addEventListener("pageshow", this.onPageShow);
    this.measure();
    this.cur = this.target = this.local(window.scrollY);
    this.wake();
  }

  private local(y: number) {
    return y - this.rootTop;
  }

  private measure = () => {
    const r = this.o.stage.getBoundingClientRect();
    const g = this.geo;
    g.W = r.width;
    g.H = r.height;
    g.pw = Math.max(r.width, (r.height * 16) / 9);
    g.ph = (g.pw * 9) / 16;
    g.px = (r.width - g.pw) / 2;
    g.py = (r.height - g.ph) / 2;
    this.rootTop = this.o.root.getBoundingClientRect().top + window.scrollY;
    this.tops = this.blockEls.map((b) => b.offsetTop);
    // A chapter may run on under the next one (negative bottom margin) so its words stay pinned while
    // they hand over; its length for the film is without that overlap.
    this.heights = this.blockEls.map((b) => b.offsetHeight + Math.min(0, parseFloat(getComputedStyle(b).marginBottom) || 0));
    // The stage leaves with the film's last chapter, so that chapter ends when its bottom reaches the
    // bottom of the viewport (its words go before the stage starts to scroll away, never with it).
    const n = this.heights.length - 1;
    if (n >= 0) this.heights[n] = Math.max(g.H * 0.5, this.heights[n] - g.H * 0.85);
    this.target = this.local(window.scrollY);
    this.cur = this.target;
    this.lastIndex = -1;
    this.wake();
  };

  private onScroll = () => {
    const t = this.local(window.scrollY);
    // Big jumps (hash links, Home/End, history) cut instead of fast-forwarding the whole film.
    if (Math.abs(t - this.cur) > this.geo.H * 1.25) this.cur = t;
    this.target = t;
    this.wake();
  };

  private onVisibility = () => {
    if (document.visibilityState === "visible") {
      this.cur = this.target = this.local(window.scrollY);
      this.wake();
    } else {
      cancelAnimationFrame(this.raf);
      this.raf = 0;
    }
  };

  private onPageShow = (e: PageTransitionEvent) => {
    if (e.persisted) this.measure();
  };

  wake = () => {
    if (!this.raf && !this.dead && document.visibilityState !== "hidden") {
      this.last = performance.now();
      this.raf = requestAnimationFrame(this.tick);
    }
  };

  private tick = (now: number) => {
    this.raf = 0;
    const dt = Math.min(0.1, (now - this.last) / 1000);
    this.last = now;
    const k = 1 - Math.exp(-dt / this.o.tau);
    this.cur += (this.target - this.cur) * k;
    const moving = Math.abs(this.target - this.cur) > 0.4;
    if (!moving) this.cur = this.target;
    const t0 = performance.now();
    this.render(moving);
    this.stats.renders++;
    this.stats.renderMs.push(performance.now() - t0);
    if (this.stats.renderMs.length > 4000) this.stats.renderMs.splice(0, 2000);
    if (moving) this.raf = requestAnimationFrame(this.tick);
  };

  /** Write a style only when it changes (avoids style invalidation on every frame). */
  set(el: HTMLElement, prop: "opacity" | "transform", v: string) {
    let w = this.written.get(el);
    if (!w) this.written.set(el, (w = {}));
    if (w[prop] === v) return;
    w[prop] = v;
    el.style[prop] = v;
  }

  private render(moving: boolean) {
    const { blocks } = this.o;
    const y = this.cur;
    let idx = 0;
    for (let i = 0; i < blocks.length; i++) if (y >= this.tops[i] - 1) idx = i;
    const b = blocks[idx];
    const p = clamp01((y - this.tops[idx]) / Math.max(1, this.heights[idx] - this.geo.H * 0.15));

    // Exactly one chapter is "current" (its words are shown in place; CSS crossfades on change).
    // Before the first chapter or past the end of the last, none is.
    const last = blocks.length - 1;
    const current = y < this.tops[0] - this.geo.H * 0.5 || (idx === last && p >= 1) ? -1 : idx;
    if (current !== this.currentIndex) {
      this.blockEls[this.currentIndex]?.removeAttribute("data-current");
      if (current >= 0) this.blockEls[current].setAttribute("data-current", "");
      this.currentIndex = current;
    }

    // Media lifecycle: queue the segments within reach of the playhead (more ahead than behind),
    // release distant ones. Preparation runs in idle time, one segment at a time, because
    // starting a hardware decoder briefly occupies the GPU thread that also composites the page.
    if (idx !== this.lastIndex) {
      const dir = idx >= this.lastIndex ? 1 : -1;
      this.lastIndex = idx;
      const wanted: string[] = [];
      blocks.forEach((bk, i) => {
        if (!bk.seg) return;
        const d = (i - idx) * dir;
        if (d >= this.reach[0] && d <= this.reach[1]) wanted.push(bk.seg);
        else if (Math.abs(i - idx) > this.reach[1] + 1) this.media[bk.seg].release();
      });
      wanted.sort((a, b) => Math.abs(this.segIndex(a) - idx) - Math.abs(this.segIndex(b) - idx));
      this.prepQueue = wanted;
      this.pumpPrep();
    }

    // Joins are entirely scroll-driven (no timed fades), so nothing can flash between shots:
    // - a clip fades in over its first 4 % on top of the previous still, which equals its frame 0;
    // - once the clip covers the stage, the still underneath switches to the next hold's still,
    //   which equals the clip's last frame, so when the clip hands over nothing changes but sharpness.
    let still = b.still;
    let covered = false;
    for (const [id, m] of Object.entries(this.media)) {
      if (b.seg === id) {
        const ok = m.show(p);
        if (!ok) this.stats.fallbackFrames++;
        const a = ok ? smoothstep(0, this.o.segments[id].fade ?? 0.04, p) : 0;
        covered = a >= 1;
        this.set(m.el, "opacity", a.toFixed(3));
      } else this.set(m.el, "opacity", "0");
    }
    if (b.kind === "seg") {
      let prev: string | undefined, next: string | undefined;
      for (let i = idx - 1; i >= 0 && !prev; i--) prev = blocks[i].still;
      for (let i = idx + 1; i < blocks.length && !next; i++) next = blocks[i].still;
      // Without a clip (still loading), cut at the midpoint rather than freeze on the old shot.
      still = (covered || !this.media[b.seg!]?.ready) && p >= 0.5 && next ? next : prev;
    }
    if (!still && b.kind === "hold") this.stats.blankFrames++;
    for (const [k, n] of Object.entries(this.stills)) this.set(n, "opacity", k === still ? "1" : "0");

    this.o.onFrame({ index: idx, block: b, next: blocks[idx + 1], p, moving, geo: this.geo });
  }

  private prepQueue: string[] = [];
  private prepBusy = false;
  private segIndex(id: string) {
    return this.o.blocks.findIndex((b) => b.seg === id);
  }
  private pumpPrep() {
    if (this.prepBusy || this.dead) return;
    const next = this.prepQueue.find((id) => this.media[id].state === "idle");
    if (!next) return;
    this.prepBusy = true;
    const run = () => {
      const m = this.media[next];
      m.prepare();
      const done = () => {
        this.prepBusy = false;
        this.pumpPrep();
      };
      // Wait until the segment is ready (or give up after 4 s) before starting the next one.
      const t0 = performance.now();
      const wait = () => (m.state === "ready" || m.state === "idle" || performance.now() - t0 > 4000 ? done() : setTimeout(wait, 120));
      wait();
    };
    // The segment the visitor is in (or about to enter) cannot wait for idle time.
    const urgent = Math.abs(this.segIndex(next) - this.lastIndex) <= 1;
    if (urgent || !("requestIdleCallback" in window)) run();
    else requestIdleCallback(run, { timeout: 1200 });
  }

  snapshot() {
    const s = this.stats;
    return {
      renders: s.renders,
      renderMs: { p50: q(s.renderMs, 0.5), p95: q(s.renderMs, 0.95), max: q(s.renderMs, 1) },
      seeks: s.seeks,
      seekMs: { p50: q(s.seekMs, 0.5), p95: q(s.seekMs, 0.95), max: q(s.seekMs, 1) },
      presented: s.presented,
      stepPct: { p50: q(s.steps.map((x) => x * 100), 0.5), p95: q(s.steps.map((x) => x * 100), 0.95), max: q(s.steps.map((x) => x * 100), 1) },
      fallbackFrames: s.fallbackFrames,
      blankFrames: s.blankFrames,
      decodedMB: s.decodedMB(),
      loaded: s.loaded(),
    };
  }

  reset() {
    Object.assign(this.stats, { renders: 0, renderMs: [], seeks: 0, seekMs: [], presented: 0, steps: [], fallbackFrames: 0, blankFrames: 0 });
  }

  destroy() {
    this.dead = true;
    this.blockEls[this.currentIndex]?.removeAttribute("data-current");
    cancelAnimationFrame(this.raf);
    this.ro.disconnect();
    window.removeEventListener("scroll", this.onScroll);
    document.removeEventListener("visibilitychange", this.onVisibility);
    window.removeEventListener("pageshow", this.onPageShow);
    for (const m of Object.values(this.media)) {
      m.release();
      m.el.remove();
    }
  }
}
