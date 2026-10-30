/**
 * Image-sequence backend for scroll-scrubbed clips (fallback engine, `?engine=frames`).
 * Frames are decoded once with createImageBitmap (off the main thread, and never silently discarded
 * the way <img> pixels are), kept only inside a window around the playhead plus a coarse every-8th
 * set, and closed when the playhead moves away, so decoded memory stays bounded.
 */
export class FrameSet {
  readonly bitmaps: (ImageBitmap | null)[];
  private pending = new Set<number>();
  private queue: number[] = [];
  private inflight = 0;
  private cancelled = false;
  private abort = new AbortController();
  private center = 0;

  constructor(
    private base: string,
    readonly n: number,
    private size: "lg" | "md",
    private onFrame: () => void,
    private radius = 14,
  ) {
    this.bitmaps = Array(n).fill(null);
  }

  src(i: number) {
    return `${this.base}/${this.size}/f${String(i).padStart(3, "0")}.webp`;
  }

  private keep(i: number) {
    return i % 8 === 0 || i === this.n - 1 || Math.abs(i - this.center) <= this.radius * 2;
  }

  /** Ask for the frames around index `c`, nearest first (after the coarse set). */
  want(c: number) {
    if (this.cancelled) return;
    this.center = Math.round(c);
    const order: number[] = [];
    for (let i = 0; i < this.n; i += 8) order.push(i);
    order.push(this.n - 1);
    for (let d = 0; d <= this.radius; d++) {
      if (this.center + d < this.n) order.push(this.center + d);
      if (d && this.center - d >= 0) order.push(this.center - d);
    }
    this.queue = order.filter((i) => !this.bitmaps[i] && !this.pending.has(i));
    for (let i = 0; i < this.n; i++) {
      const b = this.bitmaps[i];
      if (b && !this.keep(i)) {
        b.close();
        this.bitmaps[i] = null;
      }
    }
    this.pump();
  }

  private pump() {
    while (!this.cancelled && this.inflight < 4 && this.queue.length) {
      const i = this.queue.shift()!;
      if (this.bitmaps[i] || this.pending.has(i)) continue;
      this.pending.add(i);
      this.inflight++;
      fetch(this.src(i), { signal: this.abort.signal })
        .then((r) => r.blob())
        .then((b) => createImageBitmap(b))
        .then((bmp) => {
          if (this.cancelled || !this.keep(i)) return bmp.close();
          this.bitmaps[i] = bmp;
          this.onFrame();
        })
        .catch(() => undefined)
        .finally(() => {
          this.pending.delete(i);
          this.inflight--;
          this.pump();
        });
    }
  }

  nearest(i: number) {
    for (let d = 0; d < this.n; d++) {
      if (i - d >= 0 && this.bitmaps[i - d]) return i - d;
      if (i + d < this.n && this.bitmaps[i + d]) return i + d;
    }
    return -1;
  }

  get decodedBytes() {
    return this.bitmaps.reduce((a, b) => a + (b ? b.width * b.height * 4 : 0), 0);
  }

  /** Draw progress p. Returns the (fractional, when blended) frame index drawn, or -1. */
  draw(ctx: CanvasRenderingContext2D, w: number, h: number, p: number) {
    const f = Math.min(1, Math.max(0, p)) * (this.n - 1);
    const i0 = Math.floor(f);
    const i1 = Math.min(this.n - 1, i0 + 1);
    const t = f - i0;
    const a = this.bitmaps[i0] ? i0 : this.nearest(i0);
    if (a < 0) return -1;
    ctx.globalAlpha = 1;
    ctx.drawImage(this.bitmaps[a]!, 0, 0, w, h);
    if (a === i0 && i1 !== i0 && this.bitmaps[i1] && t > 0.02) {
      ctx.globalAlpha = t;
      ctx.drawImage(this.bitmaps[i1]!, 0, 0, w, h);
      ctx.globalAlpha = 1;
      return f;
    }
    return a;
  }

  release() {
    this.cancelled = true;
    this.abort.abort();
    this.bitmaps.forEach((b, i) => {
      b?.close();
      this.bitmaps[i] = null;
    });
  }
}
