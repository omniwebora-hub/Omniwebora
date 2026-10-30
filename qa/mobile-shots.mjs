// Phone review: full-page screenshots of every route at 390x844 (iPhone-size), split into viewport-tall
// tiles for review. Usage: node qa/mobile-shots.mjs [baseUrl]
import { chromium, devices } from "@playwright/test";
import fs from "node:fs";
const base = process.argv[2] ?? "http://localhost:3200";
const routes = ["/", "/solutions", "/solutions/web-development", "/industries", "/approach", "/pricing", "/about", "/contact"];
fs.mkdirSync("qa/screenshots/mobile", { recursive: true });
const browser = await chromium.launch();
const ctx = await browser.newContext({ ...devices["iPhone 13"] });
for (const r of routes) {
  const page = await ctx.newPage();
  await page.goto(base + r, { waitUntil: "networkidle" });
  // walk down so lazy images load
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 700) { await page.evaluate((y) => scrollTo(0, y), y); await page.waitForTimeout(120); }
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForTimeout(500);
  const name = r === "/" ? "home" : r.slice(1).replace(/\//g, "_");
  await page.screenshot({ path: `qa/screenshots/mobile/${name}.png`, fullPage: true });
  console.log(name, h);
  await page.close();
}
await browser.close();
