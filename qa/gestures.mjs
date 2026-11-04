// Scroll effort QA (owner, 2026-11-04: "it should be easy to scroll; should not keep swiping"). On each
// film page, sends one small gesture at a time (desktop: one wheel notch; phone: one short finger
// swipe) and waits for the page to settle. Checks that every gesture lands on the next chapter (the
// counter moves on by one), and reports how many gestures the whole film takes. Also checks that a
// multi-step chapter plays its steps by itself while the visitor rests (Home's product wall).
// Usage: node qa/gestures.mjs [base] desktop|phone /a /b …
import { chromium, devices } from "@playwright/test";

const args = process.argv.slice(2);
const base = args.find((a) => a.startsWith("http")) ?? "http://localhost:3200";
const phone = args.includes("phone");
const paths = args.filter((a) => a.startsWith("/"));
const browser = await chromium.launch({ args: ["--use-angle=d3d11", "--enable-gpu", "--ignore-gpu-blocklist"] });
const ctx = await browser.newContext(phone ? { ...devices["iPhone 13"], hasTouch: true } : { viewport: { width: 1440, height: 900 } });
let fails = 0;
const bad = (m) => {
  fails++;
  console.log("   FAIL " + m);
};

const counter = (page) => page.evaluate(() => {
  const n = document.querySelector("[data-chapter-nav]");
  const m = n?.textContent?.match(/(\d+)\s*\/\s*(\d+)/);
  return { show: n?.dataset.show === "true", at: m ? +m[1] : 0, of: m ? +m[2] : 0, y: Math.round(scrollY) };
});
/** One short finger swipe up (raw touch events, so the page scrolls as it would under a finger). */
async function swipe(cdp, dy) {
  const x = 195;
  const y0 = 560;
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y: y0 }] });
  for (let i = 1; i <= 8; i++) {
    await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x, y: y0 - (dy * i) / 8 }] });
    await new Promise((r) => setTimeout(r, 16));
  }
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
}
async function settled(page) {
  let y = -1;
  for (let t = 0; t < 60; t++) {
    await page.waitForTimeout(160);
    const now = await page.evaluate(() => Math.round(scrollY));
    if (now === y) return now;
    y = now;
  }
  return y;
}

for (const path of paths) {
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(base + path, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  const cdp = phone ? await ctx.newCDPSession(page) : null;
  let gestures = 0;
  let c = await counter(page);
  const of = c.of;
  while (c.show && gestures < 60) {
    const before = c;
    if (phone) await swipe(cdp, 200);
    else {
      await page.mouse.move(720, 450);
      await page.mouse.wheel(0, 120);
    }
    gestures++;
    await page.waitForTimeout(350);
    await settled(page);
    c = await counter(page);
    if (c.show && c.at !== before.at + 1) bad(`${path} gesture ${gestures}: chapter ${before.at} → ${c.at} (expected ${before.at + 1})`);
    if (c.y <= before.y) bad(`${path} gesture ${gestures}: did not move forward (${before.y} → ${c.y})`);
  }
  console.log(`${path} [${phone ? "phone" : "desktop"}] ${of} chapters, ${gestures} gestures to the end`);

  if (path === "/") {
    // rest on the product wall: its steps should play by themselves
    await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
    await page.waitForTimeout(800);
    for (let k = 0; k < 30; k++) {
      if (await page.evaluate(() => !!document.querySelector('[data-film-block="idea"][data-current]'))) break;
      await page.locator("[data-chapter-nav] button").last().click();
      await settled(page);
    }
    const y0 = await settled(page);
    await page.waitForTimeout(4200);
    const y1 = await page.evaluate(() => Math.round(scrollY));
    if (y1 <= y0) bad(`/ product wall: steps did not play by themselves (${y0} → ${y1})`);
    else console.log(`/ product wall plays its steps by itself (${y0} → ${y1})`);
  }
  if (errors.length) bad(`${path}: page errors: ${errors.join("; ")}`);
  await page.close();
}
console.log(fails ? `FAIL ${fails}` : "PASS one gesture, one chapter");
await browser.close();
