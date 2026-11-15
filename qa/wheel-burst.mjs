// Wheel pacing QA (owner, 2026-11-16: "just one mouse scroll and chak chak chak it moves … nice and slow,
// not frustrating"). Desktop only. Counts resting places (each chapter and each screen of a chapter's
// interface: `data-place` on the chapter nav).
// 1. one notch = one place; 2. a fast spin (12 notches, 40 ms apart) = one place; 3. a trackpad flick with
// a momentum tail = one place; 4. resting 8 s = the page never moves by itself; 5. two gestures 600 ms apart
// = two places, one after the other; 6. one notch up = back one. Reports how long each move takes.
// Usage: node qa/wheel-burst.mjs [base] [/path]
import { chromium } from "@playwright/test";

const args = process.argv.slice(2);
const base = args.find((a) => a.startsWith("http")) ?? "http://localhost:3200";
const path = args.find((a) => a.startsWith("/")) ?? "/";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(base + path, { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
await page.mouse.move(720, 450);

const at = () => page.evaluate(() => +(document.querySelector("[data-chapter-nav]")?.getAttribute("data-place") ?? 0));
async function settle() {
  const t0 = Date.now();
  let y = -1, still = 0, moved = 0;
  for (;;) {
    await page.waitForTimeout(100);
    const now = await page.evaluate(() => Math.round(scrollY));
    if (now !== y) { moved = Date.now(); still = 0; } else if (++still >= 8) break;
    y = now;
  }
  return { ms: moved - t0, y };
}
let fails = 0;
const total = () => page.evaluate(() => +(document.querySelector("[data-chapter-nav]")?.getAttribute("data-places") ?? 0));
async function check(name, fn, expect) {
  // not enough places left on a short film: start again from the top
  if (expect > 0 && (await at()) + expect >= (await total())) {
    await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
    await settle();
  }
  const a = await at();
  await fn();
  const s = await settle();
  const b = await at();
  const ok = b - a === expect;
  if (!ok) fails++;
  console.log(`${ok ? "PASS" : "FAIL"} ${name}: place ${a} → ${b} (expected ${expect >= 0 ? "+" : ""}${expect}), moving ~${s.ms} ms`);
}
await check("one notch down", () => page.mouse.wheel(0, 100), 1);
await check("one notch down again", () => page.mouse.wheel(0, 100), 1);
await check("fast spin (12 notches)", async () => { for (let i = 0; i < 12; i++) { await page.mouse.wheel(0, 100); await page.waitForTimeout(40); } }, 1);
await check("trackpad flick with momentum", async () => { for (let i = 0; i < 70; i++) { await page.mouse.wheel(0, Math.max(2, 60 * Math.exp(-i / 18))); await page.waitForTimeout(16); } }, 1);
await check("resting 8 s (nothing moves by itself)", () => page.waitForTimeout(8000), 0);
await check("two notches 600 ms apart", async () => { await page.mouse.wheel(0, 100); await page.waitForTimeout(600); await page.mouse.wheel(0, 100); }, 2);
await check("one notch up", () => page.mouse.wheel(0, -100), -1);
await browser.close();
console.log(fails ? `${fails} FAILED` : "ALL PASS");
process.exit(fails ? 1 : 0);
