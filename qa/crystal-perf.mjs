// Smoothness of the Home opening: wheel-scrolls from the top through "spark" into 01 Innovate and
// reports the browser's frame intervals and the film engine's own render cost.
// Usage: node qa/crystal-perf.mjs [baseUrl]
import { chromium } from "@playwright/test";

const base = process.argv.find((a) => a.startsWith("http")) ?? "http://localhost:3300";
const browser = await chromium.launch({ args: ["--use-angle=d3d11", "--enable-gpu", "--ignore-gpu-blocklist"] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(base + "/", { waitUntil: "networkidle" });
await page.waitForTimeout(2500);
const hide = process.argv.includes("--without") ? "[data-opening]" : (process.argv.find((a) => a.startsWith("--hide=")) ?? "").slice(7);
if (hide) await page.addStyleTag({ content: `${hide}{display:none!important}` }); // control runs
await page.evaluate(() => {
  window.__fr = [];
  let last = performance.now();
  const loop = (t) => {
    window.__fr.push(t - last);
    last = t;
    if (window.__fr.length < 4000) requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
  window.__filmStats?.reset();
});
const cdp = await page.context().newCDPSession(page);
await cdp.send("Performance.enable");
const m0 = Object.fromEntries((await cdp.send("Performance.getMetrics")).metrics.map((m) => [m.name, m.value]));
await page.mouse.move(900, 450);
const end = await page.evaluate(() => document.querySelector('[data-film-block="innovate"]').getBoundingClientRect().top + scrollY + 200);
for (let y = 0; y < end; y += 60) {
  await page.mouse.wheel(0, 60);
  await page.waitForTimeout(16);
}
await page.waitForTimeout(800);
const r = await page.evaluate(() => {
  const f = window.__fr.slice(5).sort((a, b) => a - b);
  const q = (x) => Math.round(f[Math.floor((f.length - 1) * x)] * 10) / 10;
  return { frames: f.length, p50: q(0.5), p95: q(0.95), p99: q(0.99), over33: f.filter((x) => x > 33).length, engine: window.__filmStats?.snapshot().renderMs, block: document.querySelector("[data-film]")?.dataset.block };
});
const m1 = Object.fromEntries((await cdp.send("Performance.getMetrics")).metrics.map((m) => [m.name, m.value]));
r.main = Object.fromEntries(["TaskDuration", "ScriptDuration", "RecalcStyleDuration", "LayoutDuration", "RecalcStyleCount", "LayoutCount"].map((k) => [k, Math.round((m1[k] - m0[k]) * (k.endsWith("Count") ? 1 : 1000))]));
console.log(JSON.stringify(r));
await browser.close();
