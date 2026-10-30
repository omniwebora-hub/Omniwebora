// Contact brief on the scene: screenshots each step at 1440x900 and 1366x768 (film mode), and checks
// that the brief stays fully on the stage (no footer rising under it) while it is the current chapter.
// Usage: node qa/brief-shots.mjs [baseUrl]
import { chromium } from "@playwright/test";
import fs from "node:fs";

const base = process.argv[2] ?? "http://localhost:3200";
fs.mkdirSync("qa/screenshots/brief", { recursive: true });
const browser = await chromium.launch({ args: ["--use-angle=d3d11", "--enable-gpu", "--ignore-gpu-blocklist"] });
const out = {};
for (const [w, h] of [[1440, 900], [1366, 768]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  const issues = [];
  page.on("pageerror", (e) => issues.push(e.message));
  await page.goto(`${base}/contact?service=website`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  const shot = async (n) => {
    await page.waitForTimeout(900);
    await page.screenshot({ path: `qa/screenshots/brief/${w}-${n}.png` });
  };
  const state = async () =>
    page.evaluate(() => {
      const b = document.querySelector('[data-film-block="brief"]');
      const card = b.querySelector("[data-panel]").getBoundingClientRect();
      const footer = document.querySelector("footer")?.getBoundingClientRect();
      return { current: b.hasAttribute("data-current"), cardBottom: Math.round(card.bottom), cardTop: Math.round(card.top), footerTop: Math.round(footer?.top ?? -1), vh: innerHeight };
    });
  out[`${w}`] = { landed: await state() };
  await shot("1-need");
  await page.getByRole("button", { name: "Continue" }).click();
  await shot("2-context");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Review brief" }).click();
  await shot("3-details-errors");
  await page.getByLabel("Your name *").fill("Test Person");
  await page.getByLabel("Business email *").fill("test@example.com");
  await page.getByLabel(/What are you trying to build or fix/).fill("A new website for our studio, with online bookings.");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Review brief" }).click();
  await shot("4-review");
  out[`${w}`].review = await state();
  // a little further down the chapter: still on stage
  await page.mouse.wheel(0, Math.round(h * 0.4));
  await page.waitForTimeout(800);
  out[`${w}`].scrolled = await state();
  out[`${w}`].issues = issues;
  await page.close();
}
await browser.close();
console.log(JSON.stringify(out, null, 1));
