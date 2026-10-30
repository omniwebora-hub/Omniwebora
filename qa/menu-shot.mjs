import { chromium } from "@playwright/test";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto("http://localhost:3200/about", { waitUntil: "networkidle" });
await p.getByRole("navigation", { name: "Primary" }).getByRole("button", { name: "Solutions" }).click();
await p.waitForTimeout(700);
await p.screenshot({ path: "qa/screenshots/spots/zz-menu.png", clip: { x: 0, y: 0, width: 1440, height: 520 } });
await b.close();
