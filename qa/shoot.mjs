// Visual QA capture.
// Usage: node qa/shoot.mjs [baseUrl] [--full] [--routes=/,/about] [--sizes=1440x900,390x844] [--tag=pass1]
// Captures every route at each size and reports H1 count, horizontal overflow and console/HTTP errors.
import { chromium } from "@playwright/test";
import fs from "node:fs";

const args = process.argv.slice(2);
const base = args.find((a) => a.startsWith("http")) ?? "http://localhost:3000";
const full = args.includes("--full");
const opt = (k, d) => (args.find((a) => a.startsWith(`--${k}=`))?.split("=")[1] ?? d);
const routes = opt("routes", "/,/about,/services,/services/websites,/services/mobile-apps,/services/business-software,/services/ai-automation,/work,/process,/contact,/privacy,/does-not-exist").split(",");
const sizes = opt("sizes", "1440x900").split(",").map((s) => s.split("x").map(Number));
const tag = opt("tag", "shot");
const extra = opt("query", "");
fs.mkdirSync("qa/screenshots", { recursive: true });

const browser = await chromium.launch({ args: ["--ignore-gpu-blocklist"] });
const report = [];
for (const [w, h] of sizes) {
  const isMobile = w < 768;
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, isMobile, hasTouch: isMobile });
  const page = await ctx.newPage();
  for (const route of routes) {
    const issues = [];
    page.removeAllListeners("console");
    page.removeAllListeners("response");
    page.removeAllListeners("pageerror");
    page.on("console", (m) => {
      const t = m.text();
      if (m.type() === "error" && !/favicon/.test(t)) issues.push(`console.error: ${t.slice(0, 200)}`);
      if (m.type() === "warning" && /hydrat|Warning:/i.test(t)) issues.push(`warning: ${t.slice(0, 200)}`);
    });
    page.on("pageerror", (e) => issues.push(`pageerror: ${e.message.slice(0, 200)}`));
    page.on("response", (r) => {
      if (r.status() >= 400 && !r.url().includes("does-not-exist")) issues.push(`HTTP ${r.status()} ${r.url()}`);
    });
    const sep = route.includes("?") ? "&" : "?";
    await page.goto(`${base}${route}${extra ? sep + extra : ""}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(route === "/" ? 2600 : 1200);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    const h1s = await page.evaluate(() => document.querySelectorAll("h1").length);
    const name = `${tag}-${w}x${h}-${route === "/" ? "home" : route.replace(/[/?=&]+/g, "_").replace(/^_/, "")}.png`;
    await page.screenshot({ path: `qa/screenshots/${name}`, fullPage: full });
    report.push({ size: `${w}x${h}`, route, h1s, overflowX: overflow, issues });
  }
  await ctx.close();
}
await browser.close();
for (const r of report) {
  const flag = r.issues.length || r.overflowX > 0 || r.h1s !== 1 ? "!!" : "ok";
  console.log(`${flag} ${r.size} ${r.route.padEnd(30)} h1=${r.h1s} overflowX=${r.overflowX}${r.issues.length ? "\n   " + r.issues.join("\n   ") : ""}`);
}
