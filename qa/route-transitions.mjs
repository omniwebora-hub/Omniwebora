// Page transitions: navigates the primary nav between the film pages (desktop, real GPU path), checks a
// view transition actually ran, how long navigation took, that nothing errored, and that back/forward
// and a deep link still land correctly. Captures a frame mid-dissolve.
// Usage: node qa/route-transitions.mjs [baseUrl]
import { chromium } from "@playwright/test";
import fs from "node:fs";

const base = process.argv[2] ?? "http://localhost:3200";
fs.mkdirSync("qa/screenshots/spots", { recursive: true });
const browser = await chromium.launch({ args: ["--use-angle=d3d11", "--enable-gpu", "--ignore-gpu-blocklist"] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const issues = [];
page.on("console", (m) => m.type() === "error" && issues.push(m.text().slice(0, 160)));
page.on("pageerror", (e) => issues.push(e.message.slice(0, 160)));
await page.addInitScript(() => {
  window.__vt = 0;
  const start = document.startViewTransition?.bind(document);
  if (start)
    document.startViewTransition = (...a) => {
      window.__vt++;
      return start(...a);
    };
});

await page.goto(base + "/", { waitUntil: "networkidle" });
const nav = page.getByRole("navigation", { name: "Primary" });
const results = [];
for (const [label, path] of [["Industries", "/industries"], ["How We Work", "/approach"], ["Pricing", "/pricing"], ["About", "/about"]]) {
  const t0 = Date.now();
  await nav.getByRole("link", { name: label, exact: true }).click();
  if (label === "Pricing") {
    await page.waitForTimeout(140);
    await page.screenshot({ path: "qa/screenshots/spots/transition-mid.png" });
  }
  await page.waitForURL(base + path);
  await page.waitForFunction(() => !document.documentElement.matches(":active-view-transition"), null, { timeout: 3000 }).catch(() => {});
  const h1 = await page.locator("h1").first().innerText();
  results.push({ to: path, ms: Date.now() - t0, transitions: await page.evaluate(() => window.__vt), scrollY: await page.evaluate(() => scrollY), h1 });
}
await page.goBack();
await page.waitForURL(base + "/pricing");
const back = await page.locator("h1").first().innerText();
await nav.getByRole("button", { name: "Solutions" }).click();
await page.getByRole("link", { name: /Business Automation/ }).first().click();
await page.waitForURL(/\/solutions#business-automation$/);
await page.waitForTimeout(1500);
const deep = await page.evaluate(() => document.querySelector("[data-film]")?.dataset.block);
console.log(JSON.stringify({ results, back, deep, issues }, null, 1));
const ok = results.every((r) => r.scrollY < 5) && results.at(-1).transitions >= results.length && deep === "business-automation" && !issues.length;
console.log(ok ? "PASS every page opens at the top, dissolves in, and deep links land" : "FAIL see above");
await browser.close();
