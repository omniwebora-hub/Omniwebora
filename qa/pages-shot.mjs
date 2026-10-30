// Quick page screenshots for review: node qa/pages-shot.mjs [baseUrl]
import { chromium } from "@playwright/test";
import fs from "node:fs";

const base = process.argv[2] ?? "http://localhost:3200";
fs.mkdirSync("qa/screenshots/pages", { recursive: true });
const browser = await chromium.launch();
const shots = [
  { name: "pricing-1440", url: "/pricing", w: 1440, h: 900, full: true },
  { name: "approach-1440", url: "/approach", w: 1440, h: 900, full: true, act: async (p) => {
      await p.getByRole("radio", { name: "We provide services" }).check();
      await p.getByRole("checkbox", { name: "Take bookings or orders online" }).check();
      await p.getByRole("checkbox", { name: "Reach more of the right customers" }).check();
    } },
  { name: "solutions-390", url: "/solutions", w: 390, h: 844, full: true, mobile: true },
  { name: "dm-detail-1440", url: "/solutions/digital-marketing", w: 1440, h: 900, full: true },
];
for (const s of shots) {
  const ctx = await browser.newContext({ viewport: { width: s.w, height: s.h }, isMobile: !!s.mobile, hasTouch: !!s.mobile });
  const page = await ctx.newPage();
  await page.goto(base + s.url, { waitUntil: "networkidle" });
  if (s.act) await s.act(page);
  await page.waitForTimeout(600);
  await page.screenshot({ path: `qa/screenshots/pages/${s.name}.png`, fullPage: !!s.full });
  await ctx.close();
}
await browser.close();
console.log("ok");
