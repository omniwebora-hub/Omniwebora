// How We Work planning table: choose on the devices in film mode, check the plan follows, the full
// planner below shares the selection, and the tablet hands the plan to the brief.
// Usage: node qa/plan-table.mjs [baseUrl]
import { chromium } from "@playwright/test";
import fs from "node:fs";

const base = process.argv[2] ?? "http://localhost:3200";
fs.mkdirSync("qa/screenshots/spots", { recursive: true });
const browser = await chromium.launch({ args: ["--use-angle=d3d11", "--enable-gpu", "--ignore-gpu-blocklist"] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const issues = [];
page.on("console", (m) => m.type() === "error" && issues.push(m.text().slice(0, 160)));
page.on("pageerror", (e) => issues.push(e.message.slice(0, 160)));
const go = async (id, f) => {
  await page.evaluate(
    ([id, f]) => {
      const b = document.querySelector(`[data-film-block="${id}"]`);
      scrollTo({ top: Math.round(b.getBoundingClientRect().top + scrollY + (b.offsetHeight - innerHeight * 0.15) * f), behavior: "instant" });
    },
    [id, f],
  );
  await page.waitForTimeout(1400);
};
const stage = page.locator("[data-stage]");
const check = (name, ok) => console.log(`${ok ? "PASS" : "FAIL"} ${name}`);

await page.goto(base + "/approach", { waitUntil: "networkidle" });
await go("trade", 0.5);
await page.screenshot({ path: "qa/screenshots/spots/plan-trade.png" });
await stage.getByRole("button", { name: "We take bookings or appointments" }).click();
check("tablet choice is pressed", (await stage.getByRole("button", { name: "We take bookings or appointments" }).getAttribute("aria-pressed")) === "true");

await go("wants", 0.5);
await stage.getByRole("button", { name: "Take bookings or orders online" }).click();
await stage.getByRole("button", { name: "Stop doing repetitive work by hand" }).click();
await page.screenshot({ path: "qa/screenshots/spots/plan-wants.png" });
check("laptop counts the choices", (await stage.getByText("2 of 3 chosen").count()) === 1);

await go("stages", 0.15);
await page.screenshot({ path: "qa/screenshots/spots/plan-stage1.png" });
check("discover is written for the business", (await stage.innerText()).includes("bookings and schedules"));
await go("stages", 0.42);
await page.screenshot({ path: "qa/screenshots/spots/plan-stage3.png" });
check("develop names the chosen builds", (await stage.innerText()).includes("automated workflows"));


await go("send", 0.3);
await page.screenshot({ path: "qa/screenshots/spots/plan-send.png" });
await page.getByRole("button", { name: "Send this plan with my brief" }).click();
await page.waitForURL(/\/contact\?from=approach$/);
check("brief carries the plan", (await page.getByRole("complementary", { name: "Your brief so far" }).innerText()).includes("We take bookings or appointments"));
console.log(JSON.stringify({ issues }));
await browser.close();
