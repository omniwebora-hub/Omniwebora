// Words vs displays: for each chapter of a film page, the panel box and the lit display boxes at 1440x900,
// so overlaps can be checked numerically. Usage (Git Bash: MSYS_NO_PATHCONV=1): node qa/overlap-check.mjs /solutions/web-development
import { chromium } from "@playwright/test";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3200" + (process.argv[2] ?? "/solutions"), { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
const ids = await page.evaluate(() => [...document.querySelectorAll("[data-film-block]")].filter((b) => !b.className.includes("move")).map((b) => b.dataset.filmBlock));
for (const id of ids) {
  const r = await page.evaluate(async (id) => {
    const b = document.querySelector(`[data-film-block="${id}"]`);
    const top = b.getBoundingClientRect().top + scrollY;
    scrollTo({ top: top + innerHeight * 0.45, behavior: "instant" });
    await new Promise((r) => setTimeout(r, 1400));
    const panel = b.querySelector("[data-panel]");
    const box = (el) => { const q = el.getBoundingClientRect(); return [Math.round(q.left), Math.round(q.top), Math.round(q.right), Math.round(q.bottom)]; };
    // text extents: the union of the text nodes' boxes inside the panel
    let right = 0;
    if (panel) for (const el of panel.querySelectorAll("h1,h2,h3,p,li,dd,dt,a,summary")) { const q = el.getBoundingClientRect(); if (q.width && getComputedStyle(el).visibility !== "hidden") right = Math.max(right, q.right); }
    const screens = [...document.querySelectorAll("[data-stage] [data-show]")].filter((n) => parseFloat(getComputedStyle(n).opacity) > 0.5).map(box).filter((q) => q[2] - q[0] > 40);
    return { id, current: b.hasAttribute("data-current"), panel: panel ? box(panel) : null, textRight: Math.round(right), screens };
  }, id);
  console.log(JSON.stringify(r));
}
await browser.close();
