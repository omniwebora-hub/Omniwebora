// Chapter buttons QA (owner, 2026-11-04: "button type to go next and next"). On each film page, clicks
// Next until the film ends and checks at every stop: the page moved forward, at most one chapter is
// current and its words are fully shown, and the buttons cover no visible text of any kind. Saves a screenshot per
// stop to qa/screenshots/chapters/<device>/<page>-NN.png.
// Usage: node qa/chapter-nav.mjs [base] [phone|desktop] /a /b …
import { chromium, devices } from "@playwright/test";
import fs from "node:fs";

const args = process.argv.slice(2);
const base = args.find((a) => a.startsWith("http")) ?? "http://localhost:3200";
const phone = args.includes("phone");
const paths = args.filter((a) => a.startsWith("/"));
const device = phone ? "phone" : "desktop";
const out = `qa/screenshots/chapters/${device}`;
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ args: ["--use-angle=d3d11", "--enable-gpu", "--ignore-gpu-blocklist"] });
const ctx = await browser.newContext(phone ? { ...devices["iPhone 13"], hasTouch: true } : { viewport: { width: 1440, height: 900 } });
let fails = 0;
const bad = (m) => {
  fails++;
  console.log("   FAIL " + m);
};

for (const path of paths) {
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(base + path, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  const name = path === "/" ? "home" : path.slice(1).replaceAll("/", "-");
  let stops = 0;
  for (let k = 0; k < 40; k++) {
    const nav = page.locator("[data-chapter-nav]");
    if ((await nav.getAttribute("data-show")) !== "true") break;
    const label = await nav.locator("button").last().getAttribute("aria-label");
    const before = await page.evaluate(() => scrollY);
    await nav.locator("button").last().click();
    // wait for the glide to finish, then for the words to dissolve in
    let y = -1;
    for (let t = 0; t < 40; t++) {
      await page.waitForTimeout(150);
      const now = await page.evaluate(() => scrollY);
      if (now === y) break;
      y = now;
    }
    await page.waitForTimeout(1300);
    stops++;
    const info = await page.evaluate(() => {
      const op = (el) => {
        let o = 1;
        for (let n = el; n && n !== document.documentElement; n = n.parentElement) {
          const s = getComputedStyle(n);
          if (s.visibility === "hidden" || s.display === "none") return 0;
          o *= parseFloat(s.opacity);
        }
        return o;
      };
      const cur = [...document.querySelectorAll("[data-current]")];
      const navEl = document.querySelector("[data-chapter-nav]");
      const nr = navEl.getBoundingClientRect();
      const navOn = navEl.dataset.show === "true";
      // the part of an element actually painted: clipped by any ancestor that hides its overflow
      const visibleRect = (el) => {
        const r = el.getBoundingClientRect();
        let [l, t, rr, b] = [r.left, r.top, r.right, r.bottom];
        for (let n = el.parentElement; n && n !== document.body; n = n.parentElement) {
          const s = getComputedStyle(n);
          if (s.overflow === "visible" && s.overflowY === "visible") continue;
          const c = n.getBoundingClientRect();
          [l, t, rr, b] = [Math.max(l, c.left), Math.max(t, c.top), Math.min(rr, c.right), Math.min(b, c.bottom)];
        }
        return { left: l, top: t, right: rr, bottom: b };
      };
      const words = [...document.querySelectorAll("[data-panel] :is(h1, h2, h3, p, li, a), [data-film] [class*=card] :is(h3, p, a)")].filter((el) => {
        const r = visibleRect(el);
        return r.bottom - r.top > 4 && r.bottom > 0 && r.top < innerHeight && op(el) > 0.5;
      });
      // anything with visible text under the buttons (chapter words, chips, a display's interface…),
      // clipped by its scrolling/overflow ancestors; the footer is skipped (on wide screens it waits,
      // covered, under the page until the film has ended, and the buttons leave before it shows)
      const under = new Set();
      if (navOn)
        for (const el of document.querySelectorAll("body *")) {
          if (el.closest("[data-chapter-nav], footer, script, style")) continue;
          if (![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
          const r = visibleRect(el);
          if (r.right - r.left < 2 || r.bottom - r.top < 2) continue;
          if (!(r.left < nr.right && r.right > nr.left && r.top < nr.bottom && r.bottom > nr.top)) continue;
          if (op(el) > 0.5) under.add(el);
        }
      const overlap = [...under, ...(navOn ? words : []).filter((el) => {
        const r = visibleRect(el);
        return r.left < nr.right && r.right > nr.left && r.top < nr.bottom && r.bottom > nr.top;
      })].map((el) => el.textContent.trim().slice(0, 40)).filter((t, i, all) => all.indexOf(t) === i);
      // words of the current chapter (or, past the film's last chapter, any words on screen)
      // (Industries' district cards live on the stage, not inside the chapter)
      const scope = cur[0] ?? document.querySelector("[data-film]");
      const blocks = [...(scope?.querySelectorAll("[data-panel]") ?? []), ...document.querySelectorAll("[data-film] [data-stage] [class*=card]")].filter((el) => {
        const r = el.getBoundingClientRect();
        return r.height > 8 && r.bottom > 0 && r.top < innerHeight;
      });
      return {
        y: scrollY,
        current: cur.map((c) => c.dataset.filmBlock),
        shown: blocks.length ? +Math.max(...blocks.map(op)).toFixed(2) : null,
        overlap,
      };
    });
    await page.screenshot({ path: `${out}/${name}-${String(stops).padStart(2, "0")}.png` });
    const tag = `${path} stop ${stops} (${info.current.join(",") || "none"})`;
    if (info.y <= before + 4) bad(`${tag}: did not move forward (${before} → ${info.y})`);
    if (label === "Next chapter") {
      if (info.current.length > 1) bad(`${tag}: ${info.current.length} chapters current`);
      if (info.shown !== null && info.shown < 0.95) bad(`${tag}: words at opacity ${info.shown}`);
    }
    if (info.overlap.length) bad(`${tag}: buttons cover words: ${info.overlap.join(" | ")}`);
  }
  if (errors.length) bad(`${path}: page errors: ${errors.join("; ")}`);
  console.log(`${path} [${device}] ${stops} stops`);
  await page.close();
}
console.log(fails ? `FAIL ${fails}` : "PASS chapter buttons");
await browser.close();
