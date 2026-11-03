// Portrait cut QA: on phones every film with portrait footage must run the 9:16 cut (data-cut="portrait",
// 9:16 plate, portrait clips loaded), and wide screens must keep the landscape cut. Captures the product
// wall's three steps and Pricing's growth at phone size, and checks the plate has no sideways crop.
// Usage: node qa/portrait-cut.mjs [base]
import { chromium, devices } from "@playwright/test";
import fs from "node:fs";

const base = process.argv[2] ?? "http://localhost:3200";
const out = "qa/screenshots/portrait-cut";
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ args: ["--use-angle=d3d11", "--enable-gpu", "--ignore-gpu-blocklist"] });
const check = (name, ok) => console.log(`${ok ? "PASS" : "FAIL"} ${name}`);

async function at(page, id, f) {
  await page.evaluate(
    ([id, f]) => {
      const b = document.querySelector(`[data-film-block="${id}"]`);
      const r = b.getBoundingClientRect();
      scrollTo({ top: Math.round(r.top + scrollY + Math.max(0, r.height - innerHeight) * f), behavior: "instant" });
    },
    [id, f],
  );
  await page.waitForTimeout(1600);
}

const phone = await browser.newContext({ ...devices["iPhone 13"], hasTouch: true });
// pages whose film has camera moves (clips) and pages that rest in one scene (no clips)
const CLIPS = ["/", "/pricing", "/solutions", "/about", "/approach", "/contact"];
for (const path of [...CLIPS, "/solutions/web-development", "/solutions/mobile-apps"]) {
  const page = await phone.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  const clips = [];
  page.on("request", (r) => r.url().endsWith(".mp4") && clips.push(r.url()));
  await page.goto(base + path, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  const info = await page.evaluate(() => {
    const film = document.querySelector("[data-film]");
    const plate = film?.querySelector("[data-stage] > *");
    const r = plate?.getBoundingClientRect();
    const media = [...document.querySelectorAll(".film-media")].map((m) => m.currentSrc || m.src || "").filter(Boolean);
    return { cut: film?.dataset.cut, plate: r && { w: Math.round(r.width), h: Math.round(r.height) }, W: innerWidth, media: media.slice(0, 3) };
  });
  check(`${path} phone runs the portrait cut`, info.cut === "portrait");
  check(`${path} plate is 9:16 and barely wider than the screen (${info.plate?.w}×${info.plate?.h} on ${info.W})`, info.plate && Math.abs(info.plate.w / info.plate.h - 9 / 16) < 0.01 && info.plate.w <= info.W * 1.25);
  const name = path === "/" ? "home" : path.slice(1);
  if (path === "/") for (const f of [0.2, 0.45, 0.7]) {
    await at(page, "idea", f);
    await page.screenshot({ path: `${out}/${name}-idea-${f}.png` });
  }
  else if (path === "/pricing") for (const id of ["basic", "standard", "premium", "others"]) {
    await at(page, id, 0.3);
    await page.screenshot({ path: `${out}/${name}-${id}.png` });
  }
  else await page.screenshot({ path: `${out}/${name.replaceAll("/", "-")}.png` });
  // clips are fetched into memory (blob URLs), so check what was requested
  if (CLIPS.includes(path)) check(`${path} only portrait clips requested (${clips.length})`, clips.length > 0 && clips.every((s) => s.includes("/portrait/")));
  else check(`${path} no landscape clips requested`, clips.every((s) => s.includes("/portrait/")));
  check(`${path} no errors`, errors.length === 0);
  await page.close();
}
await phone.close();

const desk = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await desk.goto(base + "/", { waitUntil: "networkidle" });
await desk.waitForTimeout(1200);
check("wide screen keeps the landscape cut", (await desk.evaluate(() => document.querySelector("[data-film]")?.dataset.cut)) === "landscape");
await desk.goto(base + "/solutions", { waitUntil: "networkidle" });
await desk.waitForTimeout(1200);
check("wide screen keeps the landscape cut on Solutions", (await desk.evaluate(() => document.querySelector("[data-film]")?.dataset.cut)) === "landscape");
await browser.close();
