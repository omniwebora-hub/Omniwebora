// Spot shots at 1440x900: Home "one idea" strip, Pricing plan scale, the end of Home and of a solution page (next step + footer).
import { chromium } from "@playwright/test";
const browser = await chromium.launch({ args: ["--use-angle=d3d11", "--enable-gpu", "--ignore-gpu-blocklist"] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const at = async (url, sel, f, file) => {
  await page.goto("http://localhost:3200" + url, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  await page.evaluate(([sel, f]) => {
    const y = sel ? document.querySelector(sel).getBoundingClientRect().top + scrollY + innerHeight * f : document.documentElement.scrollHeight;
    scrollTo({ top: y, behavior: "instant" });
  }, [sel, f]);
  await page.waitForTimeout(1600);
  await page.screenshot({ path: `qa/screenshots/${file}.png` });
};
await at("/", '[data-film-block="idea"]', 0.3, "fix-idea");
await at("/pricing", '[data-film-block="premium"]', 0.3, "fix-scale");
await at("/", null, 0, "fix-home-end");
await at("/solutions/web-development", null, 0, "fix-solution-end");
await browser.close();
