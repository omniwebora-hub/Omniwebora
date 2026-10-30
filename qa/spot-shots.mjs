// Targeted screenshots of specific chapters at specific progress: node qa/spot-shots.mjs [base] path:block:fraction ...
import { chromium } from "@playwright/test";
import fs from "node:fs";

const args = process.argv.slice(2);
const base = args.find((a) => a.startsWith("http")) ?? "http://localhost:3200";
const specs = args.filter((a) => !a.startsWith("http"));
fs.mkdirSync("qa/screenshots/spots", { recursive: true });
const browser = await chromium.launch({ args: ["--use-angle=d3d11", "--enable-gpu", "--ignore-gpu-blocklist"] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
let current = "";
for (const s of specs) {
  const [path, block, frac] = s.split(":");
  if (path !== current) {
    await page.goto(base + path, { waitUntil: "networkidle" });
    await page.waitForTimeout(1500);
    current = path;
  }
  await page.evaluate(
    ([id, f]) => {
      const b = document.querySelector(`[data-film-block="${id}"]`);
      scrollTo(0, Math.round(b.getBoundingClientRect().top + scrollY + Math.max(0, b.offsetHeight - innerHeight * 0.15) * Number(f)));
    },
    [block, frac],
  );
  await page.waitForTimeout(1300);
  const file = `qa/screenshots/spots/${(path === "/" ? "home" : path.slice(1)).replace(/\//g, "_")}-${block}-${frac}.png`;
  await page.screenshot({ path: file });
  console.log(file);
}
await browser.close();
