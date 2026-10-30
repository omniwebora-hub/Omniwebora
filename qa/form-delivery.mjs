// End-to-end delivery test for the project brief, against a local webhook receiver.
// Usage (after `npm run build`): node qa/form-delivery.mjs
// 1. starts a receiver on :3999 that records POST bodies (and fails on demand),
// 2. starts `next start -p 3300` with INQUIRY_WEBHOOK_URL pointing at it,
// 3. submits a real brief through the UI and checks the receiver payload and the /thank-you hand-off,
// 4. makes the receiver fail and checks the visitor sees an honest delivery error (no fake success).
import { chromium } from "@playwright/test";
import { spawn } from "node:child_process";
import http from "node:http";

const received = [];
let failNext = false;
const receiver = http.createServer((req, res) => {
  let body = "";
  req.on("data", (c) => (body += c));
  req.on("end", () => {
    if (failNext) {
      res.writeHead(500).end("simulated failure");
      return;
    }
    received.push(JSON.parse(body || "{}"));
    res.writeHead(200, { "Content-Type": "application/json" }).end('{"ok":true}');
  });
});
await new Promise((r) => receiver.listen(3999, "127.0.0.1", r));

const server = spawn(process.platform === "win32" ? "npx.cmd" : "npx", ["next", "start", "-p", "3300"], {
  env: { ...process.env, INQUIRY_WEBHOOK_URL: "http://127.0.0.1:3999/hook", INQUIRY_DEV_LOG: "0" },
  shell: process.platform === "win32",
  stdio: "ignore",
});
const base = "http://localhost:3300";
for (let i = 0; i < 60; i++) {
  try {
    if ((await fetch(base)).ok) break;
  } catch {}
  await new Promise((r) => setTimeout(r, 1000));
}

const results = [];
const browser = await chromium.launch();
try {
  async function fillBrief(page, note) {
    await page.goto(`${base}/contact?service=custom-software`);
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByRole("radio", { name: "Automate tasks" }).check();
    await page.getByRole("radio", { name: "₹1–5 lakh" }).check();
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByLabel("Your name *").fill("Delivery Test");
    await page.getByLabel("Business email *").fill("delivery-test@example.com");
    await page.getByLabel(/What are you trying to build or fix/).fill(`Orders and stock are tracked in spreadsheets. ${note}`);
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: "Review brief" }).click();
    await page.waitForTimeout(3200); // anti-bot minimum fill time
    await page.getByRole("button", { name: "Send brief" }).click();
  }

  // Success path
  const page = await browser.newPage();
  await fillBrief(page, "Success path.");
  await page.waitForURL(/\/thank-you$/, { timeout: 15000 });
  const payload = received.at(-1)?.inquiry ?? {};
  results.push({
    test: "success → webhook received, visitor sent to /thank-you",
    pass:
      page.url().endsWith("/thank-you") &&
      payload.service === "custom-software" &&
      payload.situation === "automate" &&
      payload.budget === "1-5l" &&
      /Need: Custom software/.test(payload.brief ?? "") &&
      payload.website === undefined,
    details: { url: page.url(), service: payload.service, situation: payload.situation, budget: payload.budget, brief: payload.brief },
  });

  // Failure path
  failNext = true;
  const page2 = await browser.newPage();
  await fillBrief(page2, "Failure path.");
  const alert = page2.getByRole("alert").filter({ hasText: /couldn't be delivered/ });
  await alert.waitFor({ timeout: 15000 });
  results.push({ test: "webhook failure → honest error, stays on /contact", pass: page2.url().includes("/contact"), details: { url: page2.url(), message: await alert.textContent() } });
} catch (e) {
  results.push({ test: "run", pass: false, details: String(e).slice(0, 400) });
} finally {
  await browser.close();
  receiver.close();
  if (process.platform === "win32") spawn("taskkill", ["/pid", String(server.pid), "/T", "/F"]);
  else server.kill();
}
console.log(JSON.stringify(results, null, 2));
process.exit(results.every((r) => r.pass) ? 0 : 1);
