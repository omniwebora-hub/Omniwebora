// Video scrubbing micro-benchmark: how quickly can Chromium (hardware GPU) seek a short-GOP clip
// while a target time sweeps like a scrubbed scroll? Measures seek latency, presented frames/s and
// how far the presented frame trails the target.  Usage: node qa/perf/seek-bench.mjs <dir> file1.mp4 ...
import { chromium } from "@playwright/test";
import fs from "node:fs";
import p from "node:path";

const [dir, ...files] = process.argv.slice(2);
const browser = await chromium.launch({ args: ["--use-angle=d3d11", "--enable-gpu", "--ignore-gpu-blocklist"] });
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
await page.route("http://bench.local/**", (r) => {
  const f = p.join(dir, decodeURIComponent(new URL(r.request().url()).pathname.slice(1)));
  if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) return r.fulfill({ status: 200, contentType: "text/html", body: "<html><body style='margin:0;background:#000'></body></html>" });
  r.fulfill({ status: 200, contentType: "video/mp4", body: fs.readFileSync(f) });
});
await page.goto("http://bench.local/");
for (const f of files) {
  const res = await page.evaluate(async (f) => {
    const blob = await (await fetch(`http://bench.local/${f}`)).blob();
    const v = document.createElement("video");
    v.muted = true;
    v.playsInline = true;
    v.preload = "auto";
    v.style.cssText = "width:1600px;height:900px;display:block";
    document.body.replaceChildren(v);
    v.src = URL.createObjectURL(blob);
    await new Promise((r) => v.addEventListener("loadeddata", r, { once: true }));
    const fps = 24;
    const n = Math.round(v.duration * fps);
    let seeking = false,
      t0 = 0,
      want = 0,
      lat = [],
      presented = 0,
      lastMediaTime = -1,
      trail = [];
    v.addEventListener("seeked", () => {
      lat.push(performance.now() - t0);
      seeking = false;
    });
    const onFrame = (_, meta) => {
      if (meta.mediaTime !== lastMediaTime) {
        presented++;
        lastMediaTime = meta.mediaTime;
        trail.push(Math.abs(want - meta.mediaTime) * fps);
      }
      v.requestVideoFrameCallback(onFrame);
    };
    v.requestVideoFrameCallback(onFrame);
    // Sweep: forward slowly, fast back, forward fast, with reversals; ~6 s total.
    const start = performance.now();
    const T = 6000;
    const path = (u) => {
      if (u < 0.35) return (u / 0.35) * 0.6; // slow forward to 60%
      if (u < 0.5) return 0.6 - ((u - 0.35) / 0.15) * 0.5; // fast back to 10%
      if (u < 0.7) return 0.1 + ((u - 0.5) / 0.2) * 0.9; // fast forward to end
      return 1 - 0.15 * Math.abs(Math.sin((u - 0.7) * 40)); // jitter reversals near end
    };
    await new Promise((done) => {
      const tick = (now) => {
        const u = (now - start) / T;
        if (u >= 1) return done();
        want = (Math.round(path(u) * (n - 1)) + 0.5) / fps;
        if (!seeking && Math.abs(v.currentTime - want) > 0.5 / fps) {
          seeking = true;
          t0 = performance.now();
          v.currentTime = want;
        }
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    await new Promise((r) => setTimeout(r, 300));
    lat.sort((a, b) => a - b);
    trail.sort((a, b) => a - b);
    const q = (a, x) => (a.length ? Math.round(a[Math.floor((a.length - 1) * x)] * 10) / 10 : null);
    URL.revokeObjectURL(v.src);
    return { file: f, mb: +(blob.size / 1048576).toFixed(2), frames: n, seeks: lat.length, seekMs: { p50: q(lat, 0.5), p95: q(lat, 0.95), max: q(lat, 1) }, presentedPerSec: +(presented / (T / 1000)).toFixed(1), trailFrames: { p50: q(trail, 0.5), p95: q(trail, 0.95) } };
  }, f);
  console.log(JSON.stringify(res));
}
await browser.close();
