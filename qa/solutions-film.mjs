// Solutions pilot film QA: scrolls each chapter forward at fixed fractions, then back in reverse,
// screenshotting and recording which chapter and progress the film reports at each stop.
// Usage: node qa/solutions-film.mjs [baseUrl] [--sizes=1440x900,390x844] [--reduced]
import { chromium } from "@playwright/test";
import fs from "node:fs";

const args = process.argv.slice(2);
const base = (args.find((a) => a.startsWith("http")) ?? "http://localhost:3200") + "/solutions";
const opt = (k, d) => args.find((a) => a.startsWith(`--${k}=`))?.split("=")[1] ?? d;
const sizes = opt("sizes", "1440x900,390x844").split(",").map((s) => s.split("x").map(Number));
const reduced = args.includes("--reduced");
fs.mkdirSync("qa/screenshots/solutions", { recursive: true });

// Stops are discovered from the page: every camera move at 50 %, every room at 10 / 45 / 80 %.
let STOPS = [];
const browser = await chromium.launch({ args: ["--ignore-gpu-blocklist"] });
const report = [];
for (const [w, h] of sizes) {
  const isMobile = w < 768;
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, isMobile, hasTouch: isMobile, reducedMotion: reduced ? "reduce" : "no-preference" });
  const page = await ctx.newPage();
  const issues = [];
  page.on("console", (m) => m.type() === "error" && issues.push(`console.error: ${m.text().slice(0, 200)}`));
  page.on("pageerror", (e) => issues.push(`pageerror: ${e.message.slice(0, 200)}`));
  page.on("response", (r) => r.status() >= 400 && issues.push(`HTTP ${r.status()} ${r.url()}`));
  await page.goto(base, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  const sz = `${w}x${h}${reduced ? "-reduced" : ""}`;
  const film = await page.evaluate(() => document.querySelector("[data-film]")?.dataset.film);
  const shots = [];
  const go = async (id, f, label) => {
    await page.evaluate(
      ([id, f]) => {
        const b = document.querySelector(`[data-film-block="${id}"]`);
        const top = b.getBoundingClientRect().top + scrollY;
        scrollTo(0, Math.round(top + Math.max(0, b.offsetHeight - innerHeight * 0.15) * f));
      },
      [id, f],
    );
    await page.waitForTimeout(film === "on" ? 900 : 300);
    const st = await page.evaluate(() => {
      const el = document.querySelector("[data-film]");
      const sc = [...document.querySelectorAll("[data-screen][data-on=true]")].map((n) => n.dataset.screen);
      return { block: el?.dataset.block, progress: el?.dataset.progress, screen: sc[0] ?? null, steps: document.querySelector("ol[data-block] li[data-on]")?.textContent ?? null };
    });
    const file = `qa/screenshots/solutions/${sz}-${label}.png`;
    await page.screenshot({ path: file });
    shots.push({ label, ...st });
  };
  STOPS = (await page.evaluate(() => [...document.querySelectorAll("[data-film-block]")].map((b) => b.dataset.filmBlock))).flatMap((id) =>
    id === "intro" || id === "outro" ? [[id, 0.2]] : id.startsWith("to-") ? [[id, 0.5]] : [[id, 0.1], [id, 0.45], [id, 0.8]],
  );
  if (film === "on") {
    for (const [id, f] of STOPS) await go(id, f, `${id}-${String(f).replace(".", "")}`);
    for (const [id, f] of [...STOPS].reverse().slice(1)) await go(id, f, `rev-${id}-${String(f).replace(".", "")}`);
  } else {
    for (const [id] of STOPS.filter(([, f]) => f !== 0.45 && f !== 0.8)) await go(id, 0, `flat-${id}`);
    await page.screenshot({ path: `qa/screenshots/solutions/${sz}-flat-full.png`, fullPage: true });
  }
  const overflowX = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  report.push({ size: sz, film, overflowX, issues, shots });
  await ctx.close();
}
await browser.close();
fs.writeFileSync("qa/screenshots/solutions/report.json", JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 1));
