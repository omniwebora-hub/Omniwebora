// Page-by-page review: loads each page and steps with its own "Next" button, one screenshot per stop.
// Usage: node qa/review-shots.mjs [baseUrl] [--phone] [/route …]   → qa/screenshots/review[-phone]/
import { chromium, devices } from "@playwright/test";
import fs from "node:fs";
const args = process.argv.slice(2);
const base = args.find((a) => a.startsWith("http")) ?? "http://localhost:3200";
const phone = args.includes("--phone");
const routes = args.filter((a) => a.startsWith("/"));
const ROUTES = routes.length ? routes : ["/", "/solutions", "/approach", "/pricing", "/about", "/contact"];
const dir = `qa/screenshots/review${phone ? "-phone" : ""}`;
fs.mkdirSync(dir, { recursive: true });
const b = await chromium.launch({ args: ["--use-angle=d3d11", "--enable-gpu", "--ignore-gpu-blocklist"] });
const ctx = await b.newContext(phone ? { ...devices["iPhone 13"] } : { viewport: { width: 1440, height: 900 } });
for (const route of ROUTES) {
  const name = route === "/" ? "home" : route.slice(1).replace(/\//g, "_");
  for (const f of fs.readdirSync(dir).filter((f) => f.startsWith(name + "-"))) fs.rmSync(`${dir}/${f}`);
  const p = await ctx.newPage();
  const errors = [];
  p.on("pageerror", (e) => errors.push(e.message));
  await p.goto(base + route, { waitUntil: "networkidle" });
  await p.waitForTimeout(2500);
  const next = p.locator("[data-chapter-nav] button").last();
  let i = 0;
  for (; i < 14; i++) {
    const block = await p.evaluate(() => document.querySelector("[data-film]")?.dataset.block ?? "");
    await p.screenshot({ path: `${dir}/${name}-${String(i).padStart(2, "0")}-${block}.png` });
    const label = await next.getAttribute("aria-label").catch(() => null);
    if (!label || label.includes("past the film") || !(await next.isVisible().catch(() => false))) break;
    await next.click();
    await p.waitForTimeout(3600);
  }
  console.log(route, "stops:", i + 1, errors.length ? errors : "");
  await p.close();
}
await b.close();
