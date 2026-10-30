// Hero + scroll-film visual QA.
// Usage: node qa/film.mjs [baseUrl] [--sizes=1440x800,1440x900] [--steps=0,0.25,0.5,0.75,1] [--tag=film] [--reduced]
// Captures the hero at each size, then scrubs the film to each step (fraction of the hero's
// scroll length), then scrolls back to 0 to verify reverse playback reconstructs the opening.
import { chromium } from "@playwright/test";
import fs from "node:fs";

const args = process.argv.slice(2);
const base = args.find((a) => a.startsWith("http")) ?? "http://localhost:3000";
const opt = (k, d) => args.find((a) => a.startsWith(`--${k}=`))?.split("=")[1] ?? d;
const sizes = opt("sizes", "1440x800").split(",").map((s) => s.split("x").map(Number));
const steps = opt("steps", "").split(",").filter(Boolean).map(Number);
const tag = opt("tag", "film");
const reduced = args.includes("--reduced");
fs.mkdirSync("qa/screenshots", { recursive: true });

const browser = await chromium.launch({ args: ["--ignore-gpu-blocklist"] });
const report = [];
for (const [w, h] of sizes) {
  const isMobile = w < 768;
  const ctx = await browser.newContext({
    viewport: { width: w, height: h },
    deviceScaleFactor: 1,
    isMobile,
    hasTouch: isMobile,
    reducedMotion: reduced ? "reduce" : "no-preference",
  });
  const page = await ctx.newPage();
  const issues = [];
  page.on("console", (m) => m.type() === "error" && issues.push(`console.error: ${m.text().slice(0, 200)}`));
  page.on("pageerror", (e) => issues.push(`pageerror: ${e.message.slice(0, 200)}`));
  page.on("response", (r) => r.status() >= 400 && issues.push(`HTTP ${r.status()} ${r.url()}`));
  await page.goto(base, { waitUntil: "networkidle" });
  await page.waitForTimeout(2600); // intro reveal
  const info = await page.evaluate(() => {
    const hero = document.querySelector("[data-hero]");
    return { film: hero?.dataset.film, frames: hero?.dataset.frames, heroH: hero?.offsetHeight, overflowX: document.documentElement.scrollWidth - innerWidth };
  });
  const sz = `${w}x${h}${reduced ? "-reduced" : ""}`;
  await page.screenshot({ path: `qa/screenshots/${tag}-${sz}-hero.png` });
  const shots = [];
  for (const s of steps) {
    await page.evaluate((s) => {
      const hero = document.querySelector("[data-hero]");
      const len = hero.offsetHeight - innerHeight;
      window.scrollTo(0, Math.round(len * s));
    }, s);
    await page.waitForTimeout(1400);
    const p = await page.evaluate(() => document.querySelector("[data-hero]")?.dataset.progress);
    const file = `qa/screenshots/${tag}-${sz}-p${String(s).replace(".", "")}.png`;
    await page.screenshot({ path: file });
    shots.push({ step: s, progress: p });
  }
  if (steps.length) {
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1600);
    const back = await page.evaluate(() => document.querySelector("[data-hero]")?.dataset.progress);
    await page.screenshot({ path: `qa/screenshots/${tag}-${sz}-reverse0.png` });
    shots.push({ step: "reverse→0", progress: back });
  }
  if (args.includes("--scan")) {
    const total = await page.evaluate(() => document.documentElement.scrollHeight);
    let k = 0;
    for (let y = 0; y < total - h / 2; y += Math.round(h * 0.85)) {
      await page.evaluate((y) => window.scrollTo(0, y), y);
      await page.waitForTimeout(900);
      await page.screenshot({ path: `qa/screenshots/${tag}-${sz}-scan${String(k++).padStart(2, "0")}.png` });
    }
    shots.push({ scanned: k, pageHeight: total });
  }
  report.push({ size: sz, ...info, shots, issues });
  await ctx.close();
}
await browser.close();
console.log(JSON.stringify(report, null, 2));
