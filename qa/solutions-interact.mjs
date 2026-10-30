// Clicks the live interfaces on the display walls in film mode (desktop) and checks they respond,
// then checks a deep link and a refresh mid-film.  Usage: node qa/solutions-interact.mjs [baseUrl]
import { chromium } from "@playwright/test";

const base = (process.argv[2] ?? "http://localhost:3200") + "/solutions";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.goto(base, { waitUntil: "networkidle" });
const to = async (id, f) => {
  await page.evaluate(
    ([id, f]) => {
      const b = document.querySelector(`[data-film-block="${id}"]`);
      scrollTo(0, Math.round(b.getBoundingClientRect().top + scrollY + (b.offsetHeight - innerHeight * 0.15) * f));
    },
    [id, f],
  );
  await page.waitForTimeout(900);
};
const out = {};
await to("web", 0.3);
const web = page.locator('[data-screen="web"]');
await web.getByRole("button", { name: "Booking" }).first().click({ timeout: 5000 });
await page.waitForTimeout(400);
out.webBookingSlots = await web.locator("button[aria-pressed]").count();
await page.screenshot({ path: "qa/screenshots/solutions/interact-web-booking.png" });
await to("ops", 0.3);
const ops = page.locator('[data-screen="ops"]');
await ops.getByRole("tab", { name: /Teams/ }).click({ timeout: 5000 });
await page.waitForTimeout(300);
out.opsSelected = await ops.getByRole("tab", { selected: true }).textContent();
await page.screenshot({ path: "qa/screenshots/solutions/interact-ops-teams.png" });
await to("ops", 0.6);
out.opsAfterScrollStep = await ops.getByRole("tab", { selected: true }).textContent();
await page.goto(base + "#business-software", { waitUntil: "networkidle" });
await page.waitForTimeout(1200);
out.deepLink = await page.evaluate(() => ({
  block: document.querySelector("[data-film]").dataset.block,
  screen: document.querySelector("[data-screen][data-on=true]")?.dataset.screen,
}));
await page.reload({ waitUntil: "networkidle" });
await page.waitForTimeout(1200);
out.afterReload = await page.evaluate(() => ({ y: Math.round(scrollY), block: document.querySelector("[data-film]").dataset.block }));
out.errors = errors;
console.log(JSON.stringify(out, null, 1));
await browser.close();
