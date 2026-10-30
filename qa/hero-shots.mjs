// Hero and its hand-off to the Home film: rest (at several sizes), a node hovered, end of the
// push-in, the first frame after the hand-off, and the arrive copy. Usage: node qa/hero-shots.mjs [base]
import { chromium } from "@playwright/test";
import fs from "node:fs";

const base = process.argv[2] ?? "http://localhost:3200";
fs.mkdirSync("qa/screenshots/hero", { recursive: true });
const browser = await chromium.launch({ args: ["--use-angle=d3d11", "--enable-gpu", "--ignore-gpu-blocklist"] });
for (const [w, h] of [[1440, 900], [1920, 1080], [1280, 800], [1366, 768]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.goto(base + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(3200);
  await page.screenshot({ path: `qa/screenshots/hero/rest-${w}.png` });
  if (w === 1440) {
    await page.locator('[data-panel="custom-software"] a').hover();
    await page.waitForTimeout(700);
    await page.screenshot({ path: "qa/screenshots/hero/hover-1440.png" });
    await page.mouse.move(5, 5);
    const at = async (y, name) => {
      await page.evaluate((y) => scrollTo({ top: y, behavior: "instant" }), y);
      await page.waitForTimeout(1900);
      await page.screenshot({ path: `qa/screenshots/hero/${name}.png` });
    };
    const heroEnd = await page.evaluate(() => document.querySelector("[data-hero]").offsetHeight - innerHeight);
    await at(heroEnd - 120, "end-before");
    await at(heroEnd + 8, "handoff");
    const arrive = await page.evaluate(() => {
      const b = document.querySelector('[data-film-block="arrive"]');
      return b.getBoundingClientRect().top + scrollY;
    });
    await at(arrive + 0.3 * h, "arrive");
  }
  await page.close();
}
await browser.close();
console.log("ok");
