// Text motion audit (owner: "the text should dissolve the way it came, never scroll up"). Scrolls each
// page in small steps and records every visible block of words (a [data-panel], the brief, the footer's
// next step); flags any that moves on screen by more than 2 px between steps while it is visible
// (effective opacity > 0.15 and on screen). Usage: node qa/text-motion.mjs [base] [phone|desktop] /a /b …
import { chromium, devices } from "@playwright/test";

const args = process.argv.slice(2);
const base = args.find((a) => a.startsWith("http")) ?? "http://localhost:3200";
const phone = args.includes("phone");
const paths = args.filter((a) => a.startsWith("/"));
const browser = await chromium.launch({ args: ["--use-angle=d3d11", "--enable-gpu", "--ignore-gpu-blocklist"] });
const ctx = await browser.newContext(phone ? { ...devices["iPhone 13"], hasTouch: true } : { viewport: { width: 1440, height: 900 } });
let total = 0;
for (const path of paths) {
  const page = await ctx.newPage();
  await page.goto(base + path, { waitUntil: "networkidle" });
  await page.waitForTimeout(800);
  const H = await page.evaluate(() => innerHeight);
  const end = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  const step = Math.round(H * 0.06);
  let prev = new Map();
  const hits = [];
  for (let y = 0; y <= end; y += step) {
    await page.evaluate((y) => scrollTo({ top: y, behavior: "instant" }), y);
    await page.waitForTimeout(140);
    const now = await page.evaluate(() => {
      const op = (el) => {
        let o = 1;
        for (let n = el; n && n !== document.documentElement; n = n.parentElement) {
          const s = getComputedStyle(n);
          if (s.visibility === "hidden" || s.display === "none") return 0;
          o *= parseFloat(s.opacity);
        }
        return o;
      };
      const out = [];
      document.querySelectorAll("[data-panel], [data-text-block]").forEach((el, i) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < 60 || r.top > innerHeight - 10 || r.height < 8) return;
        const o = op(el);
        if (o < 0.15) return;
        const block = el.closest("[data-film-block]")?.getAttribute("data-film-block") ?? el.getAttribute("data-text-block") ?? "page";
        out.push({ key: `${block}#${i}`, top: Math.round(r.top), o: +o.toFixed(2) });
      });
      return out;
    });
    for (const n of now) {
      const p = prev.get(n.key);
      if (p && Math.abs(p.top - n.top) > 2) hits.push(`${n.key} moved ${p.top}→${n.top} at y=${y} (opacity ${n.o})`);
    }
    prev = new Map(now.map((n) => [n.key, n]));
  }
  total += hits.length;
  console.log(`${path} [${phone ? "phone" : "desktop"}] ${hits.length ? hits.length + " moves" : "steady"}`);
  for (const h of hits.slice(0, 8)) console.log("   " + h);
  await page.close();
}
console.log(total ? `FAIL ${total} text moves` : "PASS no text moves while visible");
await browser.close();
