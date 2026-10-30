// Join continuity check: steps the scroll through every chapter boundary in small increments with the
// copy hidden, screenshots the camera stage at each settled step, and writes the frames so
// qa/perf/join_diff.py can measure frame-to-frame change. A spike = a visible jump.
// Usage: node qa/perf/join-check.mjs [baseUrl] [--path=/solutions] [--step=30] [--span=360] [--engine=]
import { chromium } from "@playwright/test";
import fs from "node:fs";

const args = process.argv.slice(2);
const base = args.find((a) => a.startsWith("http")) ?? "http://localhost:3200";
const opt = (k, d) => args.find((a) => a.startsWith(`--${k}=`))?.slice(k.length + 3) ?? d;
const path = opt("path", "/solutions");
const step = Number(opt("step", "30"));
const span = Number(opt("span", "360"));
const engine = opt("engine", "");
const out = `qa/perf/joins${path.replace(/\//g, "_")}`;
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

const browser = await chromium.launch({ args: ["--use-angle=d3d11", "--enable-gpu", "--ignore-gpu-blocklist"] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(base + path + (engine ? `?engine=${engine}` : ""), { waitUntil: "networkidle" });
await page.addStyleTag({ content: "[data-film] > div:nth-child(2), [data-film] > ol, header { visibility: hidden !important; }" });
await page.waitForTimeout(3000);
const blocks = await page.evaluate(() => [...document.querySelectorAll("[data-film-block]")].map((b) => ({ id: b.dataset.filmBlock, top: Math.round(b.getBoundingClientRect().top + scrollY) })));
const manifest = [];
if (args.includes("--motion")) {
  // Live compositor output (CDP screencast) while wheel-scrolling through each boundary.
  const cdp = await page.context().newCDPSession(page);
  await page.mouse.move(1100, 450);
  for (let i = 1; i < blocks.length; i++) {
    const b = blocks[i];
    const name = `${blocks[i - 1].id}-${b.id}`;
    await page.evaluate((y) => scrollTo(0, y), b.top - 700);
    await page.waitForTimeout(1500);
    const frames = [];
    const onFrame = async (e) => {
      frames.push({ t: e.metadata.timestamp, data: e.data, y: await page.evaluate(() => scrollY).catch(() => 0) });
      cdp.send("Page.screencastFrameAck", { sessionId: e.sessionId }).catch(() => {});
    };
    cdp.on("Page.screencastFrame", onFrame);
    await cdp.send("Page.startScreencast", { format: "jpeg", quality: 70, maxWidth: 480, maxHeight: 300, everyNthFrame: 1 });
    for (let k = 0; k < 1400 / 24; k++) {
      await page.mouse.wheel(0, 24);
      await page.waitForTimeout(16);
    }
    await page.waitForTimeout(900);
    await cdp.send("Page.stopScreencast");
    cdp.off("Page.screencastFrame", onFrame);
    const shots = frames.map((fr, k) => {
      const f = `${out}/${name}-m${String(k).padStart(3, "0")}.jpg`;
      fs.writeFileSync(f, Buffer.from(fr.data, "base64"));
      return { f, y: fr.y - b.top, block: "", t: fr.t };
    });
    manifest.push({ name, shots });
  }
  fs.writeFileSync(`${out}/manifest.json`, JSON.stringify(manifest, null, 1));
  await browser.close();
  console.log(out);
  process.exit(0);
}
for (let i = 1; i < blocks.length; i++) {
  const b = blocks[i];
  const name = `${blocks[i - 1].id}-${b.id}`;
  const shots = [];
  // Approach from just above the boundary, as a visitor scrolling down would.
  await page.evaluate((y) => scrollTo(0, y), b.top - span - 400);
  await page.waitForTimeout(1200);
  for (let y = b.top - span, k = 0; y <= b.top + span; y += step, k++) {
    await page.evaluate((y) => scrollTo(0, y), y);
    await page.waitForTimeout(850);
    const f = `${out}/${name}-${String(k).padStart(3, "0")}.png`;
    await page.screenshot({ path: f, scale: "css" });
    const st = await page.evaluate(() => ({ block: document.querySelector("[data-film]").dataset.block, p: document.querySelector("[data-film]").dataset.progress }));
    shots.push({ f, y: y - b.top, ...st });
  }
  manifest.push({ name, shots });
}
fs.writeFileSync(`${out}/manifest.json`, JSON.stringify(manifest, null, 1));
await browser.close();
console.log(out);
