// Scroll performance benchmark for the film pages (Gate 1).
// Runs real wheel input through Chromium on the hardware GPU and records:
//  - rAF frame intervals (p50/p95/p99, share of frames over 1.5x and 2x the vsync budget)
//  - compositor frames presented vs dropped (Chrome trace PipelineReporter)
//  - long animation frames (LoAF) and their total blocking time
//  - main-thread / raster / decode time by trace category
//  - engine-reported stats when the page exposes window.__filmStats
// Usage: node qa/perf/scroll-bench.mjs [baseUrl] [--path=/solutions] [--size=1440x900] [--engine=]
//        [--headed] [--cpu=1] [--scenario=slow,fast,reverse,cold] [--tag=name] [--css=extra css]
import { chromium } from "@playwright/test";
import fs from "node:fs";

const args = process.argv.slice(2);
const base = args.find((a) => a.startsWith("http")) ?? "http://localhost:3200";
const opt = (k, d) => args.find((a) => a.startsWith(`--${k}=`))?.slice(k.length + 3) ?? d;
const path = opt("path", "/solutions");
const [W, H] = opt("size", "1440x900").split("x").map(Number);
const engine = opt("engine", "");
const headed = args.includes("--headed");
const cpu = Number(opt("cpu", "1"));
const scenarios = opt("scenario", "slow,fast,reverse").split(",");
const tag = opt("tag", engine || "current");
const extraCss = opt("css", "");
fs.mkdirSync("qa/perf/results", { recursive: true });

const browser = await chromium.launch({
  headless: !headed,
  args: ["--use-angle=d3d11", "--enable-gpu", "--ignore-gpu-blocklist", "--enable-gpu-rasterization"],
});
const pct = (a, p) => (a.length ? a[Math.min(a.length - 1, Math.floor((a.length - 1) * p))] : 0);
const round = (v, d = 1) => Math.round(v * 10 ** d) / 10 ** d;

async function run(scenario) {
  const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.addInitScript(() => {
    window.__rec = { on: false, ts: [], loaf: [] };
    const loop = (t) => {
      if (window.__rec.on) window.__rec.ts.push(t);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
    try {
      new PerformanceObserver((l) => {
        if (!window.__rec.on) return;
        for (const e of l.getEntries())
          window.__rec.loaf.push({ d: e.duration, b: e.blockingDuration, s: (e.scripts || []).map((x) => `${x.invoker || x.name}:${Math.round(x.duration)}`).slice(0, 3) });
      }).observe({ type: "long-animation-frame", buffered: false });
    } catch {}
  });
  const cdp = await ctx.newCDPSession(page);
  if (cpu > 1) await cdp.send("Emulation.setCPUThrottlingRate", { rate: cpu });
  if (scenario === "cold") await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
  const q = engine ? `?engine=${engine}` : "";
  await page.goto(base + path + q, { waitUntil: scenario === "cold" ? "domcontentloaded" : "networkidle" });
  if (extraCss) await page.addStyleTag({ content: extraCss });
  const gpu = await page.evaluate(() => {
    const gl = document.createElement("canvas").getContext("webgl");
    const e = gl?.getExtension("WEBGL_debug_renderer_info");
    return e ? gl.getParameter(e.UNMASKED_RENDERER_WEBGL) : "none";
  });
  if (scenario !== "cold") {
    // Warm: let the first segment's media load, as a visitor reading the intro would.
    await page.waitForTimeout(2500);
  }
  const film = await page.evaluate(() => {
    const el = document.querySelector("[data-film]");
    const blocks = [...document.querySelectorAll("[data-film-block]")].map((b) => ({ id: b.dataset.filmBlock, top: b.getBoundingClientRect().top + scrollY, h: b.offsetHeight }));
    return { mode: el?.dataset.film, blocks };
  });
  const start = film.blocks.find((b) => b.id === "intro")?.top ?? 0;
  const endBlock = film.blocks[film.blocks.length - 1];
  const end = endBlock ? endBlock.top + endBlock.h - H : 8000;
  await page.evaluate((y) => scrollTo(0, y), start);
  await page.mouse.move(W * 0.75, H * 0.5);
  await page.waitForTimeout(300);

  await browser.startTracing(page, {
    categories: ["devtools.timeline", "disabled-by-default-devtools.timeline", "disabled-by-default-devtools.timeline.frame", "cc", "benchmark", "gpu", "toplevel"],
  });
  await page.evaluate(() => {
    window.__rec.on = true;
    window.__filmStats?.reset?.();
  });
  const t0 = Date.now();
  const wheel = async (dy, n, gap) => {
    for (let i = 0; i < n; i++) {
      await page.mouse.wheel(0, dy);
      await page.waitForTimeout(gap);
    }
  };
  if (scenario === "slow") await wheel(40, Math.ceil((end - start) / 40), 32);
  else if (scenario === "fast" || scenario === "cold") {
    await wheel(120, Math.ceil((end - start) / 120), 16);
    await page.waitForTimeout(600);
    await wheel(-120, Math.ceil((end - start) / 120), 16);
  } else if (scenario === "reverse") {
    // Repeated direction changes inside the camera moves and holds.
    for (const id of film.blocks.filter((x) => x.id !== "intro" && x.id !== "outro").slice(0, 6).map((x) => x.id)) {
      const b = film.blocks.find((x) => x.id === id);
      if (!b) continue;
      await page.evaluate((y) => scrollTo(0, y), b.top + 20);
      await page.waitForTimeout(250);
      for (let k = 0; k < 4; k++) {
        await wheel(60, 8, 16);
        await wheel(-60, 6, 16);
      }
    }
  }
  await page.waitForTimeout(500);
  const elapsed = Date.now() - t0;
  const reachedY = await page.evaluate(() => Math.round(scrollY));
  const rec = await page.evaluate(() => {
    window.__rec.on = false;
    return { ts: window.__rec.ts, loaf: window.__rec.loaf, stats: window.__filmStats?.snapshot?.() ?? null };
  });
  const raw = await browser.stopTracing();
  if (args.includes("--save-trace")) fs.writeFileSync(`qa/perf/results/trace-${tag}-${scenario}.json`, raw);
  const trace = JSON.parse(raw.toString());
  const metrics = await cdp.send("Performance.enable").then(() => cdp.send("Performance.getMetrics"));
  await ctx.close();

  // rAF intervals
  const d = rec.ts.slice(1).map((t, i) => t - rec.ts[i]).sort((a, b) => a - b);
  const budget = pct(d, 0.5) || 16.7;
  // trace aggregates
  const ev = trace.traceEvents ?? trace;
  const by = {};
  let presented = 0,
    dropped = 0,
    partial = 0;
  for (const e of ev) {
    if (e.name === "PipelineReporter" && e.ph === "b") {
      const st = e.args?.chrome_frame_reporter?.state;
      if (st === "STATE_DROPPED") dropped++;
      else if (st === "STATE_PRESENTED_ALL") presented++;
      else if (st === "STATE_PRESENTED_PARTIAL") partial++;
    }
    if (e.ph !== "X" || !e.dur) continue;
    const k = e.name;
    if (!["Decode Image", "ImageDecodeTask", "Decode LazyPixelRef", "RasterTask", "Paint", "UpdateLayoutTree", "Layout", "PrePaint", "Layerize", "FireAnimationFrame", "FunctionCall", "EventDispatch", "GPUTask", "ScheduledTasks", "ProxyMain::BeginMainFrame", "ThreadControllerImpl::RunTask"].includes(k)) continue;
    by[k] = (by[k] ?? 0) + e.dur / 1000;
  }
  const loafTotal = rec.loaf.reduce((a, x) => a + x.d, 0);
  const loafBlock = rec.loaf.reduce((a, x) => a + (x.b || 0), 0);
  const heap = metrics.metrics.find((m) => m.name === "JSHeapUsedSize")?.value ?? 0;
  return {
    scenario,
    gpu: gpu.replace(/ANGLE \((.*?),.*/, "$1"),
    mode: film.mode,
    seconds: round(elapsed / 1000, 2),
    scroll: { start: Math.round(start), end: Math.round(end), reached: reachedY },
    frames: d.length,
    rafMs: { p50: round(pct(d, 0.5)), p95: round(pct(d, 0.95)), p99: round(pct(d, 0.99)), max: round(d[d.length - 1] ?? 0) },
    slowFramesPct: round((100 * d.filter((x) => x > budget * 1.5).length) / Math.max(1, d.length)),
    veryslowFramesPct: round((100 * d.filter((x) => x > budget * 2.5).length) / Math.max(1, d.length)),
    compositor: { presented, partial, dropped, droppedPct: round((100 * dropped) / Math.max(1, presented + partial + dropped)) },
    loaf: { count: rec.loaf.length, totalMs: Math.round(loafTotal), blockingMs: Math.round(loafBlock), worst: rec.loaf.sort((a, b) => b.d - a.d).slice(0, 3) },
    traceMs: Object.fromEntries(Object.entries(by).map(([k, v]) => [k, Math.round(v)])),
    jsHeapMB: round(heap / 1048576),
    engine: rec.stats,
  };
}

const out = { tag, size: `${W}x${H}`, cpu, headed, results: [] };
for (const s of scenarios) {
  const r = await run(s);
  out.results.push(r);
  console.log(JSON.stringify(r));
}
await browser.close();
fs.writeFileSync(`qa/perf/results/${tag}-${W}x${H}${cpu > 1 ? `-cpu${cpu}` : ""}${headed ? "-headed" : ""}.json`, JSON.stringify(out, null, 2));
