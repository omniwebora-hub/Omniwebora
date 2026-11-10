// Words per chapter on each film page (what a visitor reads, desktop film mode).
// Usage: node qa/word-count.mjs [baseUrl] [/route …]
import { chromium } from "@playwright/test";
const args = process.argv.slice(2);
const base = args.find((a) => a.startsWith("http")) ?? "http://localhost:3200";
const routes = args.filter((a) => a.startsWith("/"));
const ROUTES = routes.length ? routes : ["/", "/solutions", "/solutions/web-development", "/solutions/custom-software", "/approach", "/pricing", "/about", "/contact"];
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
let total = 0;
for (const r of ROUTES) {
  await p.goto(base + r, { waitUntil: "networkidle" });
  const rows = await p.evaluate(() =>
    [...document.querySelectorAll("[data-film-block]")].map((e) => {
      const t = [...e.querySelectorAll("[data-panel] :is(p, h1, h2, h3, li, dt, dd, summary, a)")].filter((n) => !n.closest("nav[aria-label=Breadcrumb], ol[aria-label=Breadcrumb]") && !n.querySelector("p, h1, h2, h3, li, dt, dd, summary")).map((n) => n.textContent).join(" ").replace(/\s+/g, " ").trim();
      return { id: e.dataset.filmBlock, words: t ? t.split(" ").length : 0, text: t.slice(0, 260) };
    }).filter((x) => x.words),
  );
  const sum = rows.reduce((s, x) => s + x.words, 0);
  total += sum;
  console.log(`\n== ${r}  (${sum} words)`);
  for (const x of rows) console.log(`  ${String(x.words).padStart(3)}  ${x.id}: ${x.text}`);
}
console.log("\nTOTAL", total);
await b.close();
