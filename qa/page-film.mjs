// Generic film QA for any page: discovers [data-film-block] chapters, screenshots each (holds at 25 % and
// 70 %, camera moves at 50 %) at 1440x900, records console errors / 4xx, and writes a contact sheet list.
// Usage: node qa/page-film.mjs [baseUrl] /path1 /path2 ...
import { chromium } from "@playwright/test";
import fs from "node:fs";

const args = process.argv.slice(2);
const base = args.find((a) => a.startsWith("http")) ?? "http://localhost:3200";
const paths = args.filter((a) => a.startsWith("/"));
fs.mkdirSync("qa/screenshots/pages", { recursive: true });
const browser = await chromium.launch({ args: ["--use-angle=d3d11", "--enable-gpu", "--ignore-gpu-blocklist"] });
const report = {};
for (const p of paths) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const issues = [];
  page.on("console", (m) => m.type() === "error" && issues.push(m.text().slice(0, 160)));
  page.on("pageerror", (e) => issues.push(e.message.slice(0, 160)));
  page.on("response", (r) => r.status() >= 400 && issues.push(`HTTP ${r.status()} ${r.url()}`));
  await page.goto(base + p, { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  const blocks = await page.evaluate(() =>
    [...document.querySelectorAll("[data-film-block]")].map((b) => ({ id: b.dataset.filmBlock, top: b.getBoundingClientRect().top + scrollY, h: b.offsetHeight, seg: b.className.includes("move") })),
  );
  const shots = [];
  const name = p === "/" ? "home" : p.slice(1).replace(/\//g, "_");
  for (const b of blocks)
    for (const f of b.seg ? [0.5] : [0.25, 0.7]) {
      await page.evaluate((y) => scrollTo(0, y), Math.round(b.top + Math.max(0, b.h - 900 * 0.15) * f));
      await page.waitForTimeout(1100);
      const file = `qa/screenshots/pages/${name}-${b.id}-${String(f).replace(".", "")}.png`;
      await page.screenshot({ path: file });
      shots.push(file);
    }
  report[p] = { film: await page.evaluate(() => document.querySelector("[data-film]")?.dataset.film), blocks: blocks.map((b) => b.id), issues, shots };
  await page.close();
}
await browser.close();
fs.writeFileSync("qa/screenshots/pages/report.json", JSON.stringify(report, null, 1));
console.log(JSON.stringify(Object.fromEntries(Object.entries(report).map(([k, v]) => [k, { film: v.film, blocks: v.blocks.length, issues: v.issues }]))));
