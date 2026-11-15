// Wheel pacing QA (owner, 2026-11-14: "a few scrolls and the home page moves very fast"). Desktop only.
// 1. one notch = one chapter; 2. a fast spin (12 notches, 40 ms apart) = one chapter; 3. a trackpad
// flick with a momentum tail (70 small deltas at 16 ms) = one chapter; 4. separate notches = one
// chapter each (owner, 2026-11-15: "have to scroll so much"); 5. one notch up = back one.
// Also reports how long each glide takes. Usage: node qa/wheel-burst.mjs [base] [/path]
import { chromium } from "@playwright/test";

const args = process.argv.slice(2);
const base = args.find((a) => a.startsWith("http")) ?? "http://localhost:3200";
const path = args.find((a) => a.startsWith("/")) ?? "/";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(base + path, { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
await page.mouse.move(720, 450);

const at = () => page.evaluate(() => +(document.querySelector("[data-chapter-nav]")?.textContent?.match(/(\d+)\s*\//)?.[1] ?? 0));
async function settle() {
  const t0 = Date.now();
  let y = -1, still = 0, moved = 0;
  for (;;) {
    await page.waitForTimeout(100);
    const now = await page.evaluate(() => Math.round(scrollY));
    if (now !== y) { moved = Date.now(); still = 0; } else if (++still >= 6) break;
    y = now;
  }
  return { ms: moved - t0, y };
}
let fails = 0;
async function check(name, fn, expect) {
  const a = await at();
  await fn();
  const s = await settle();
  const b = await at();
  const ok = expect === -99 ? b - a >= 2 && b - a <= 4 : expect === -12 ? b - a >= 1 && b - a <= 2 : b - a === expect;
  if (!ok) fails++;
  console.log(`${ok ? "PASS" : "FAIL"} ${name}: chapter ${a} → ${b} (expected ${expect >= 0 ? "+" : ""}${expect}), glide ~${s.ms} ms`);
}
// wait out the first chapter's autoplay steps, if any
await check("one notch down", () => page.mouse.wheel(0, 100), 1);
await check("one notch down again", () => page.mouse.wheel(0, 100), 1);
await check("fast spin (12 notches)", async () => { for (let i = 0; i < 12; i++) { await page.mouse.wheel(0, 100); await page.waitForTimeout(40); } }, 1);
await check("trackpad flick with momentum", async () => { for (let i = 0; i < 70; i++) { await page.mouse.wheel(0, Math.max(2, 60 * Math.exp(-i / 18))); await page.waitForTimeout(16); } }, 1);
await check("long trackpad flick (3.5 s tail)", async () => { for (let i = 0; i < 110; i++) { await page.mouse.wheel(0, Math.max(1, 80 * Math.exp(-i / 25))); await page.waitForTimeout(16); } }, 1);
await check("one notch up", () => page.mouse.wheel(0, -100), -1);
// back to the top for the multi-notch checks
await page.evaluate(() => scrollTo(0, 0));
await page.waitForTimeout(800);
await check("two deliberate notches (250 ms apart)", async () => { for (let i = 0; i < 2; i++) { await page.mouse.wheel(0, 100); await page.waitForTimeout(250); } }, 2);
await check("five quick notches (150 ms apart, capped two ahead)", async () => { for (let i = 0; i < 5; i++) { await page.mouse.wheel(0, 100); await page.waitForTimeout(150); } }, -99);
await browser.close();
console.log(fails ? `${fails} FAILED` : "ALL PASS");
process.exit(fails ? 1 : 0);
