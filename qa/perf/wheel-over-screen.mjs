// Wheel with the pointer over each room's display must scroll the page (never the interface).
import { chromium } from "@playwright/test";
const b = await chromium.launch({ args: ["--use-angle=d3d11", "--enable-gpu"] });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto((process.argv[2] ?? "http://localhost:3200") + "/solutions", { waitUntil: "networkidle" });
const out = [];
for (const id of await p.evaluate(() => [...document.querySelectorAll("[data-film-block]")].map((x) => x.dataset.filmBlock).filter((x) => !x.startsWith("to-") && x !== "intro" && x !== "outro"))) {
  await p.evaluate((id) => { const el = document.querySelector(`[data-film-block="${id}"]`); scrollTo(0, el.getBoundingClientRect().top + scrollY + el.offsetHeight * 0.4); }, id);
  await p.waitForTimeout(1200);
  const r = await p.evaluate((id) => { const s = document.querySelector(`[data-screen="${id}"]`).getBoundingClientRect(); return { x: s.left + s.width / 2, y: s.top + s.height / 2 }; }, id);
  const y0 = await p.evaluate(() => scrollY);
  await p.mouse.move(r.x, r.y);
  for (let i = 0; i < 5; i++) { await p.mouse.wheel(0, 100); await p.waitForTimeout(40); }
  await p.waitForTimeout(400);
  const y1 = await p.evaluate(() => scrollY);
  const inner = await p.evaluate((id) => [...document.querySelectorAll(`[data-screen="${id}"] *`)].reduce((a, el) => a + el.scrollTop, 0), id);
  out.push({ room: id, pageScrolled: Math.round(y1 - y0), innerScrollTop: inner });
}
console.log(JSON.stringify(out));
await b.close();
