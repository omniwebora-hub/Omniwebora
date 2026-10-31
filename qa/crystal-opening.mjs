// Home opening QA: the crystal (arrive), the push-in (push), the hold (core), the flight into the core
// (dive) and the landing on 01 Innovate; at 1440x900, other desktop sizes, and a 390x844 phone (touch).
// Usage: node qa/crystal-opening.mjs [baseUrl] [--tag=name]
import { chromium } from "@playwright/test";
import fs from "node:fs";

const args = process.argv.slice(2);
const base = args.find((a) => a.startsWith("http")) ?? "http://localhost:3300";
const tag = (args.find((a) => a.startsWith("--tag=")) ?? "--tag=").slice(6);
const dir = `qa/screenshots/crystal-opening${tag ? `/${tag}` : ""}`;
fs.mkdirSync(dir, { recursive: true });
const browser = await chromium.launch({ args: ["--use-angle=d3d11", "--enable-gpu", "--ignore-gpu-blocklist"] });
const issues = [];
const watch = (p) => {
  p.on("console", (m) => m.type() === "error" && issues.push(m.text().slice(0, 160)));
  p.on("pageerror", (e) => issues.push(e.message.slice(0, 160)));
  p.on("response", (r) => r.status() >= 400 && issues.push(`HTTP ${r.status()} ${r.url()}`));
};
const PLAN = [
  ["arrive", [0.3, 0.6, 0.9]],
  ["push", [0.35, 0.75]],
  ["core", [0.3]],
  ["dive", [0.2, 0.4, 0.6, 0.8, 0.98]],
  ["innovate", [0.15]],
  ["design", [0.3]],
  ["launch", [0.3]],
  ["idea", [0.2, 0.6]],
  ["launched", [0.4]],
  ["invite", [0.4]],
];
// the words of the current chapter vs the glass cards, numerically
const clash = (p) =>
  p.evaluate(() => {
    const words = [...document.querySelectorAll("[data-current] [data-panel] > *")].map((n) => n.getBoundingClientRect()).filter((r) => r.width > 0);
    const box = document.querySelector('[data-part="cards"]');
    if (!box || getComputedStyle(box).display === "none" || Number(getComputedStyle(box).opacity) < 0.05) return "no cards";
    const out = [...document.querySelectorAll("[data-card] a")].flatMap((a) => {
      const r = a.getBoundingClientRect();
      const off = r.left < 0 || r.right > innerWidth || r.top < 60 || r.bottom > innerHeight;
      const hit = words.some((q) => r.left < q.right && r.right > q.left && r.top < q.bottom && r.bottom > q.top);
      return off || hit ? [`${a.querySelector("b").textContent}${off ? " off-screen" : ""}${hit ? " over words" : ""}`] : [];
    });
    return out.length ? out.join("; ") : "cards clear";
  });

async function walk(page, prefix, H) {
  const blocks = await page.evaluate(() =>
    Object.fromEntries([...document.querySelectorAll("[data-film-block]")].map((b) => [b.dataset.filmBlock, { top: b.getBoundingClientRect().top + scrollY, h: b.offsetHeight, hold: b.style.getPropertyValue("--hold") }])),
  );
  let n = 1;
  for (const [id, fs_] of PLAN) {
    const b = blocks[id];
    if (!b) continue;
    // a hold runs one viewport under the next chapter: its own length is without that overlap
    const len = b.hold ? b.h - H : b.h;
    for (const f of fs_) {
      await page.evaluate((v) => scrollTo(0, v), Math.round(b.top + Math.max(0, len - H * 0.15) * f));
      await page.waitForTimeout(1300);
      const st = await page.evaluate(() => ({ block: document.querySelector("[data-film]")?.dataset.block, cur: document.querySelector("[data-current]")?.dataset.filmBlock }));
      await page.screenshot({ path: `${dir}/${prefix}-${String(n++).padStart(2, "0")}-${id}-${f}.png` });
      console.log(prefix, id, f, JSON.stringify(st));
    }
  }
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForTimeout(1400);
  await page.screenshot({ path: `${dir}/${prefix}-${String(n++).padStart(2, "0")}-back-to-top.png` });
}

const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
watch(page);
await page.goto(base + "/", { waitUntil: "networkidle" });
await page.waitForTimeout(2600);
await page.screenshot({ path: `${dir}/desk-00-first-screen.png` });
console.log("1440x900", await clash(page));
await walk(page, "desk", 900);
await page.close();

for (const [w, h] of [[1920, 1080], [1366, 768], [1280, 800], [1280, 1000]]) {
  const p = await browser.newPage({ viewport: { width: w, height: h } });
  watch(p);
  await p.goto(base + "/", { waitUntil: "networkidle" });
  await p.waitForTimeout(2600);
  await p.screenshot({ path: `${dir}/size-${w}x${h}.png` });
  console.log(`${w}x${h}`, await clash(p));
  await p.close();
}

// Phone: the film runs here too (portrait framing). Scrolled by real touch gestures.
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
const phone = await ctx.newPage();
watch(phone);
await phone.goto(base + "/", { waitUntil: "networkidle" });
await phone.waitForTimeout(2600);
console.log("phone film:", await phone.evaluate(() => document.querySelector("[data-film]")?.dataset.film), "sideways overflow:", await phone.evaluate(() => document.documentElement.scrollWidth - innerWidth));
await phone.screenshot({ path: `${dir}/phone-00-opening.png` });
const cdp = await ctx.newCDPSession(phone);
// a thumb drag: finger down low on the screen, moved up in small steps, released
const swipe = async (from, to) => {
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: 200, y: from }] });
  for (let k = 1; k <= 12; k++) {
    await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: 200, y: from + ((to - from) * k) / 12 }] });
    await phone.waitForTimeout(16);
  }
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
};
for (let i = 1; i <= 3; i++) {
  for (let k = 0; k < 2; k++) await swipe(700, 280);
  await phone.waitForTimeout(1300);
  const st = await phone.evaluate(() => ({ y: scrollY, block: document.querySelector("[data-film]")?.dataset.block }));
  console.log("touch", i, JSON.stringify(st));
  await phone.screenshot({ path: `${dir}/phone-0${i}-touch.png` });
}
await walk(phone, "phone", 844);
await ctx.close();

const reduced = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
await reduced.goto(base + "/", { waitUntil: "networkidle" });
await reduced.waitForTimeout(1200);
await reduced.screenshot({ path: `${dir}/reduced-phone-00-opening.png` });
await reduced.close();

await browser.close();
console.log(JSON.stringify({ dir, issues }));
