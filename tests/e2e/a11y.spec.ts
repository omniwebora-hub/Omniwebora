import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/** Wait for the load-in fades (finite, time-based animations) so contrast is measured on settled text.
 *  Scroll-linked and looping animations never finish and are left alone. */
const settle = (page: import("@playwright/test").Page) =>
  page.evaluate(() =>
    Promise.all(
      document
        .getAnimations()
        .filter((a) => a.timeline === document.timeline && a.effect?.getComputedTiming().iterations !== Infinity)
        .map((a) => a.finished.catch(() => undefined)),
    ),
  );

const ROUTES = ["/", "/solutions", "/solutions/web-development", "/solutions/mobile-apps", "/solutions/custom-software", "/solutions/business-automation", "/solutions/digital-marketing", "/solutions/enterprise-platforms", "/industries", "/approach", "/pricing", "/about", "/contact", "/privacy"];

test.describe("accessibility (axe, WCAG 2.2 A/AA)", () => {
  for (const route of ROUTES) {
    test(`no violations on ${route}`, async ({ page }) => {
      await page.goto(route);
      await page.waitForLoadState("networkidle");
      await settle(page);
      const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
      const summary = results.violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.length} × ${v.nodes[0]?.target.join(" ")}`);
      expect(summary, summary.join("\n")).toEqual([]);
    });
  }

  test("home opening with the main action focused has no violations", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Contact Us" }).last().focus();
    const results = await new AxeBuilder({ page }).include("main").withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
    expect(results.violations.map((v) => v.id)).toEqual([]);
  });
});
