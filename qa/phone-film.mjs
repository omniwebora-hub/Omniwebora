// Phone film QA: every chapter of each page at iPhone size (390x844, touch), holds at 40 %, camera
// moves at 50 %; flags words that run off the top of the screen and console errors.
// Usage: node qa/phone-film.mjs [baseUrl] /route1 /route2 …  (Git Bash: MSYS_NO_PATHCONV=1)
import { chromium, devices } from "@playwright/test";
import fs from "node:fs";
const args = process.argv.slice(2);
const base = args.find((a) => a.startsWith("http")) ?? "http://localhost:3200";
const routes = args.filter((a) => a.startsWith("/"));
const b = await chromium.launch({ args: ["--use-angle=d3d11", "--enable-gpu", "--ignore-gpu-blocklist"] });
const ctx = await b.newContext({ ...devices["iPhone 13"] });
for (const r of routes) {
  const name = r === "/" ? "home" : r.slice(1).replace(/\//g, "_");
  const dir = `qa/screenshots/phone/${name}`;
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  const p = await ctx.newPage();
  const errors = [];
  p.on("pageerror", (e) => errors.push(e.message));
  await p.goto(base + r, { waitUntil: "networkidle" });
  await p.waitForTimeout(1500);
  const film = await p.evaluate(() => document.querySelector("[data-film]")?.dataset.film);
  const blocks = await p.evaluate(() => [...document.querySelectorAll("[data-film-block]")].map((e) => ({ id: e.dataset.filmBlock, top: e.getBoundingClientRect().top + scrollY, h: e.offsetHeight, move: e.className.includes("move") })));
  const notes = [];
  let i = 0;
  for (const bl of blocks) {
    const f = bl.move ? 0.5 : 0.4;
    const y = bl.top + Math.max(0, (bl.move ? bl.h : Math.max(bl.h - 844, 0)) * f);
    await p.evaluate((y) => scrollTo({ top: y, behavior: "instant" }), Math.round(y));
    await p.waitForTimeout(1100);
    const over = await p.evaluate((id) => {
      const blk = document.querySelector(`[data-film-block="${id}"]`);
      const panel = blk?.querySelector("[data-panel]");
      if (!panel || getComputedStyle(panel.parentElement).visibility === "hidden") return null;
      const r = panel.getBoundingClientRect();
      return r.top < 64 ? Math.round(64 - r.top) : null;
    }, bl.id);
    if (over) notes.push(`${bl.id}: words run ${over}px under the header`);
    await p.screenshot({ path: `${dir}/${String(i++).padStart(2, "0")}-${bl.id}.png` });
  }
  console.log(r, "film:", film, "chapters:", blocks.length, notes.length ? notes.join("; ") : "", errors.length ? errors : "");
  await p.close();
}
await b.close();
