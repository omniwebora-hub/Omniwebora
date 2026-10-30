// Below-the-film continuity: viewport shots stepping through each page after its film, plus the
// footer. Usage: node qa/scenic-shots.mjs [base] /industries /about ...
import { chromium } from "@playwright/test";
import fs from "node:fs";

const args = process.argv.slice(2);
const base = args.find((a) => a.startsWith("http")) ?? "http://localhost:3200";
const paths = args.filter((a) => a.startsWith("/"));
fs.mkdirSync("qa/screenshots/scenic", { recursive: true });
const browser = await chromium.launch({ args: ["--use-angle=d3d11", "--enable-gpu", "--ignore-gpu-blocklist"] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
for (const p of paths) {
  await page.goto(base + p, { waitUntil: "networkidle" });
  const { start, end } = await page.evaluate(() => {
    const films = [...document.querySelectorAll("[data-film]")];
    const last = films[films.length - 1];
    const r = last.getBoundingClientRect();
    return { start: r.bottom + scrollY, end: document.documentElement.scrollHeight - innerHeight };
  });
  const name = p.slice(1).replace(/\//g, "_") || "home";
  let k = 0;
  for (let y = start - 450; y <= end + 1; y += 820) {
    await page.evaluate((y) => scrollTo({ top: y, behavior: "instant" }), Math.min(y, end));
    await page.waitForTimeout(900);
    await page.screenshot({ path: `qa/screenshots/scenic/${name}-${k++}.png` });
    if (y >= end) break;
  }
  await page.evaluate((y) => scrollTo({ top: y, behavior: "instant" }), end);
  await page.waitForTimeout(700);
  await page.screenshot({ path: `qa/screenshots/scenic/${name}-end.png` });
  console.log(p, k + 1, "shots");
}
await browser.close();
