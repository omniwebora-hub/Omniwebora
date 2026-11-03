// The Omniwebora mark vs the crystal's dark core: screenshots the first screen, a mid push-in and the
// hold, and prints both centres (window px). Usage: node qa/mark-centre.mjs [baseUrl] [WxH]
import { chromium } from "@playwright/test";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
const args = process.argv.slice(2);
const base = args.find((a) => a.startsWith("http")) ?? "http://localhost:3200";
const [W, H] = (args.find((a) => /^\d+x\d+$/.test(a)) ?? "1440x900").split("x").map(Number);
fs.mkdirSync("qa/screenshots/mark", { recursive: true });
const b = await chromium.launch({ args: ["--use-angle=d3d11", "--enable-gpu", "--ignore-gpu-blocklist"] });
const p = await b.newPage({ viewport: { width: W, height: H } });
await p.goto(base + "/", { waitUntil: "networkidle" });
await p.waitForTimeout(2500);
for (const [name, block, f] of [["rest", null, 0], ["push", "push", 0.5], ["hold", "core", 0.4]]) {
  if (block) await p.evaluate(([id, f]) => { const e = document.querySelector(`[data-film-block="${id}"]`); scrollTo({ top: e.getBoundingClientRect().top + scrollY + e.offsetHeight * f, behavior: "instant" }); }, [block, f]);
  await p.waitForTimeout(1500);
  // hide the mark for the measurement shot, then measure the mark's own box
  await p.evaluate(() => (document.querySelector('[data-part="core"]').style.visibility = "hidden"));
  const file = `qa/screenshots/mark/${name}-${W}.png`;
  await p.screenshot({ path: file });
  await p.evaluate(() => (document.querySelector('[data-part="core"]').style.visibility = ""));
  const m = await p.evaluate(() => {
    const els = [...document.querySelectorAll('[data-part="core"] svg, [data-part="core"] span')];
    const r = els.map((e) => e.getBoundingClientRect());
    const svg = r[0];
    return { svg: [svg.left + svg.width / 2, svg.top + svg.height / 2], block: [(Math.min(...r.map((q) => q.left)) + Math.max(...r.map((q) => q.right))) / 2, (Math.min(...r.map((q) => q.top)) + Math.max(...r.map((q) => q.bottom))) / 2] };
  });
  const core = JSON.parse(execFileSync("python", ["qa/core-centre.py", file]).toString());
  console.log(name, "core", core.map(Math.round), "mark block", m.block.map(Math.round), "icon", m.svg.map(Math.round));
}
await b.close();
