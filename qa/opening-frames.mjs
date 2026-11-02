// Opening motion check: scrolls through arrive → push → core → dive → innovate in small steps at a
// given size, waits for the eased camera to settle, and saves each frame plus the camera transform.
// Usage: node qa/opening-frames.mjs [baseUrl] [WxH] [--tag=name]
import { chromium } from "@playwright/test";
import fs from "node:fs";
const args = process.argv.slice(2);
const base = args.find((a) => a.startsWith("http")) ?? "http://localhost:3200";
const [W, H] = (args.find((a) => /^\d+x\d+$/.test(a)) ?? "1440x900").split("x").map(Number);
const tag = (args.find((a) => a.startsWith("--tag=")) ?? "--tag=run").slice(6);
const dir = `qa/screenshots/opening-frames/${tag}-${W}`;
fs.mkdirSync(dir, { recursive: true });
const b = await chromium.launch({ args: ["--use-angle=d3d11", "--enable-gpu", "--ignore-gpu-blocklist"] });
const p = await b.newPage({ viewport: { width: W, height: H } });
await p.goto(base + "/", { waitUntil: "networkidle" });
await p.waitForTimeout(2500);
const range = await p.evaluate(() => {
  const top = (id) => { const e = document.querySelector(`[data-film-block="${id}"]`); return e.getBoundingClientRect().top + scrollY; };
  return { start: 0, end: top("innovate") + innerHeight * 0.3 };
});
const steps = 24;
const log = [];
for (let i = 0; i <= steps; i++) {
  const y = Math.round(range.start + ((range.end - range.start) * i) / steps);
  await p.evaluate((y) => scrollTo({ top: y, behavior: "instant" }), y);
  await p.waitForTimeout(900);
  const st = await p.evaluate(() => {
    const f = document.querySelector("[data-film]");
    const cam = document.querySelector("[data-camera]");
    const core = document.querySelector('[data-part="core"]');
    return { block: f.dataset.block, cam: cam.style.transform, core: core?.style.transform, coreO: core?.style.opacity };
  });
  log.push({ i, y, ...st });
  await p.screenshot({ path: `${dir}/f${String(i).padStart(2, "0")}.png` });
}
fs.writeFileSync(`${dir}/log.json`, JSON.stringify(log, null, 1));
for (const l of log) console.log(l.i, l.block, "cam:", l.cam, "| core:", l.core, l.coreO);
await b.close();
