import { test, expect, type Page } from "@playwright/test";

const ROUTES = [
  "/",
  "/solutions",
  "/solutions/web-development",
  "/solutions/mobile-apps",
  "/solutions/custom-software",
  "/solutions/business-automation",
  "/solutions/digital-marketing",
  "/solutions/enterprise-platforms",
  "/industries",
  "/approach",
  "/pricing",
  "/about",
  "/contact",
  "/privacy",
];

/**
 * Film pages show one chapter's words at a time, in place. Bring a chapter on stage before using
 * what it shows, as a visitor scrolling there would. No-op where the film is off (phones, reduced motion).
 */
async function toChapter(page: Page, id: string) {
  const film = await page.evaluate(() => matchMedia("(min-width: 1024px) and (min-aspect-ratio: 5/4) and (prefers-reduced-motion: no-preference)").matches);
  if (!film) return;
  await expect(page.locator('[data-film="on"][data-engine]').first()).toBeAttached();
  await page.evaluate((id) => {
    const el = document.querySelector<HTMLElement>(`[data-film-block="${id}"]`)!;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + 4, behavior: "instant" });
  }, id);
  await expect(page.locator(`[data-film-block="${id}"][data-current]`)).toHaveCount(1);
}

function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(`console: ${m.text()}`);
  });
  page.on("response", (r) => {
    if (r.status() >= 400 && !r.url().includes("/api/inquiry")) errors.push(`HTTP ${r.status()} ${r.url()}`);
  });
  return errors;
}

test.describe("routes and SEO", () => {
  test("every route renders one H1, unique title, canonical and staging noindex, without errors", async ({ page }) => {
    const titles = new Set<string>();
    for (const route of ROUTES) {
      const errors = collectErrors(page);
      const res = await page.goto(route);
      expect(res?.status(), route).toBe(200);
      await expect(page.locator("h1"), route).toHaveCount(1);
      const title = await page.title();
      expect(titles.has(title), `duplicate title ${title}`).toBe(false);
      titles.add(title);
      expect(await page.locator('meta[name="description"]').getAttribute("content"), route).toBeTruthy();
      expect(await page.locator('link[rel="canonical"]').getAttribute("href"), route).toContain(route === "/" ? "" : route);
      expect(await page.locator('meta[name="robots"]').getAttribute("content"), route).toContain("noindex");
      expect(errors, route).toEqual([]);
      page.removeAllListeners();
    }
  });

  test("unknown routes return a real 404 page", async ({ page }) => {
    const res = await page.goto("/this-page-does-not-exist");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("doesn");
  });

  test("robots.txt blocks crawling on staging; sitemap lists indexable pages only", async ({ request }) => {
    const robots = await (await request.get("/robots.txt")).text();
    expect(robots).toMatch(/Disallow: \//);
    const sitemap = await (await request.get("/sitemap.xml")).text();
    expect(sitemap).toContain("/solutions/digital-marketing");
    expect(sitemap).not.toContain("/work");
    expect(sitemap).toContain("/pricing");
    expect(sitemap).not.toContain("/privacy");
    expect(sitemap).not.toContain("/thank-you");
  });

  test("structured data uses verified facts only", async ({ page }) => {
    await page.goto("/");
    const json = await page.locator('script[type="application/ld+json"]').first().textContent();
    const data = JSON.parse(json ?? "{}");
    const org = data["@graph"].find((n: { "@type": string }) => n["@type"] === "Organization");
    expect(org.name).toBe("Omniwebora");
    expect(org).not.toHaveProperty("address");
    expect(org).not.toHaveProperty("aggregateRating");
  });

  test("SSR HTML contains the hero copy and service links without JavaScript", async ({ request }) => {
    const html = await (await request.get("/")).text();
    expect(html).toContain("Ideas we bring");
    for (const name of ["Website Building", "Mobile Applications", "Custom Software", "Business Automation", "Digital Marketing", "Enterprise Platforms"]) expect(html).toContain(name);
    expect(html).toContain('href="/solutions#custom-software"');
    expect(html).not.toMatch(/₹|lakh/);
    expect(html).toContain('href="/contact"');
    expect(html).not.toMatch(/20\+|Projects Delivered/);
  });
});

test.describe("navigation", () => {
  test("primary navigation reaches every section; Solutions opens the gallery start and lists its rooms on hover", async ({ page, isMobile }) => {
    test.skip(!!isMobile, "desktop navigation");
    await page.goto("/about");
    const nav = page.getByRole("navigation", { name: "Primary" });
    for (const [label, path] of [["Industries", "/industries"], ["How We Work", "/approach"], ["Pricing", "/pricing"], ["About", "/about"]] as const) {
      await nav.getByRole("link", { name: label, exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`${path}$`));
      await expect(nav.getByRole("link", { name: label, exact: true })).toHaveAttribute("aria-current", "page");
    }
    // The room list is hidden until hover, and it is names only.
    const rooms = nav.getByRole("list", { name: "Solutions rooms" });
    await expect(rooms).toBeHidden();
    const solutions = nav.getByRole("link", { name: "Solutions", exact: true });
    await solutions.hover();
    await expect(rooms).toBeVisible();
    await expect(rooms.getByRole("link")).toHaveCount(6);
    await expect(rooms.locator("img")).toHaveCount(0);
    // Clicking Solutions itself goes to the start of the gallery, and the list does not stay open.
    await solutions.click();
    await expect(page).toHaveURL(/\/solutions$/);
    await page.mouse.move(700, 600);
    await expect(rooms).toBeHidden();
    // A room in the list goes to that room.
    await solutions.hover();
    await rooms.getByRole("link", { name: /Digital Marketing/ }).click();
    await expect(page).toHaveURL(/\/solutions#digital-marketing$/);
  });

  test("mobile menu opens as a dialog with the solution hierarchy, navigates and closes", async ({ page, isMobile }) => {
    test.skip(!isMobile, "mobile menu");
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    const dialog = page.getByRole("dialog", { name: "Menu" });
    await expect(dialog).toBeVisible();
    await dialog.getByRole("link", { name: "Mobile Applications" }).click();
    await expect(page).toHaveURL(/\/solutions#mobile-apps$/);
    await expect(dialog).toBeHidden();
  });

  test("old URLs redirect permanently to their replacements", async ({ request }) => {
    for (const [from, to] of [["/services", "/solutions"], ["/services/business-software", "/solutions/custom-software"], ["/process", "/approach"], ["/solutions/ai-automation", "/solutions/business-automation"]]) {
      const res = await request.get(from, { maxRedirects: 0 });
      expect(res.status(), from).toBe(308);
      expect(res.headers()["location"], from).toContain(to);
    }
  });

  test("site search finds a service from the keyboard", async ({ page, isMobile }) => {
    test.skip(!!isMobile, "keyboard shortcut");
    await page.goto("/about");
    const input = page.getByRole("combobox", { name: "Search pages and services" });
    // The shortcut listener attaches on hydration; a press before that is a no-op, so retry until it lands.
    await expect(async () => {
      await page.keyboard.press("Control+k");
      await expect(input).toBeFocused({ timeout: 500 });
    }).toPass({ timeout: 10_000 });
    await input.fill("automation");
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/solutions\/business-automation$/);
  });

  test("skip link moves focus to main content", async ({ page, isMobile }) => {
    test.skip(!!isMobile, "keyboard");
    await page.goto("/pricing");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to content" });
    await expect(skip).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator("main")).toBeFocused();
  });

  test("solution pages link to the brief with the service preselected", async ({ page }) => {
    await page.goto("/solutions/mobile-apps");
    await page.getByRole("link", { name: "Plan a mobile app" }).first().click();
    await expect(page).toHaveURL(/\/contact\?service=mobile/);
    await expect(page.getByRole("radio", { name: "Mobile app" })).toBeChecked();
  });
});

test.describe("home", () => {
  test("the six services open their own room in the Solutions gallery", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const services = page.getByRole("list", { name: "What we build" }).getByRole("link");
    await expect(services).toHaveCount(6);
    await services.filter({ hasText: "Custom Software" }).click();
    await expect(page).toHaveURL(/\/solutions#custom-software$/);
  });

  test("desktop: the drawing becomes the building and the film reaches every chapter", async ({ page, request, isMobile }) => {
    const html = await (await request.get("/")).text();
    for (const slug of ["web-development", "mobile-apps", "custom-software", "business-automation", "digital-marketing", "enterprise-platforms"])
      expect(html).toContain(`href="/solutions#${slug}"`);
    test.skip(!!isMobile, "film runs on desktop only");
    await page.goto("/");
    const film = page.locator("[data-film][aria-label='Ideas we bring to life']");
    await expect(film).toHaveAttribute("data-film", "on");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Ideas we bring");
    for (const id of ["innovate", "design", "build", "launch", "idea", "launched", "invite"]) {
      await page.locator(`[data-film-block="${id}"]`).evaluate((el) => window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + 40, behavior: "instant" }));
      await expect(film).toHaveAttribute("data-block", id);
    }
    // the lit bays are links into their rooms
    await page.locator('[data-film-block="launch"]').evaluate((el) => window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + el.getBoundingClientRect().height * 0.3, behavior: "instant" }));
    await expect(page.locator('a[href="/solutions#mobile-apps"][data-on="true"]')).toHaveCount(1);
  });

  test("reduced motion: no film, nothing pinned, every link still works", async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.goto("/");
    await expect(page.locator("[data-film]").first()).toHaveAttribute("data-film", "off");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await page.getByRole("list", { name: "What we build" }).getByRole("link", { name: /Website Building/ }).click();
    await expect(page).toHaveURL(/\/solutions#web-development$/);
    await ctx.close();
  });

  test("mobile: stacked chapters with tappable services and no sideways scroll", async ({ page, isMobile }) => {
    test.skip(!isMobile, "mobile layout");
    await page.goto("/");
    await expect(page.locator("[data-film]").first()).toHaveAttribute("data-film", "off");
    await expect(page.getByRole("list", { name: "What we build" }).getByRole("link")).toHaveCount(6);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(0);
    await page.getByRole("list", { name: "What we build" }).getByRole("link", { name: /Business Automation/ }).tap();
    await expect(page).toHaveURL(/\/solutions#business-automation$/);
  });
});

test.describe("project brief and API", () => {
  test("the brief validates its details step and focuses the first invalid field", async ({ page }) => {
    await page.goto("/contact");
    await toChapter(page, "brief");
    await page.getByRole("button", { name: "Skip to the short form" }).click();
    await page.getByRole("button", { name: "Review brief" }).click();
    await expect(page.getByLabel("Your name *")).toBeFocused();
    await expect(page.getByText("Enter your name.")).toBeVisible();
    await expect(page.getByText("Agree to the privacy notice so we can reply.")).toBeVisible();
  });

  test("without a configured transport the brief says so plainly and does not fake success", async ({ page }) => {
    await page.goto("/contact?service=website");
    await toChapter(page, "brief");
    await expect(page.getByRole("radio", { name: "Website" })).toBeChecked();
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByRole("radio", { name: "Connect tools" }).check();
    await page.getByRole("button", { name: "Continue" }).click();
    await page.getByLabel("Your name *").fill("Test Person");
    await page.getByLabel("Business email *").fill("test@example.com");
    await page.getByLabel(/What are you trying to build or fix/).fill("We would like a new marketing website for our studio.");
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: "Review brief" }).click();
    await expect(page.getByRole("heading", { name: "Review and send" })).toBeVisible();
    await page.waitForTimeout(3100); // minimum fill time (anti-bot)
    await page.getByRole("button", { name: "Send brief" }).click();
    await expect(page.getByRole("alert").filter({ hasText: /isn.t connected to a mailbox yet/ })).toBeVisible();
    await expect(page).toHaveURL(/\/contact/);
  });

  test("how we work personalises the seven stages and carries them into the brief", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/approach");
    await page.getByRole("radio", { name: "We take bookings or appointments" }).check();
    await page.getByRole("checkbox", { name: "Take bookings or orders online" }).check();
    await page.getByRole("checkbox", { name: "Stop doing repetitive work by hand" }).check();
    await expect(page.locator("#discover")).toContainText("bookings and schedules");
    await expect(page.locator("#develop")).toContainText("automated workflows");
    await page.getByRole("button", { name: "Start my brief with this" }).click();
    await expect(page).toHaveURL(/\/contact\?from=approach$/);
    await expect(page.getByRole("complementary", { name: "Your brief so far" })).toContainText("We take bookings or appointments");
  });

  test("API validates, rejects bots, rate-limits and refuses non-POST", async ({ request, baseURL }) => {
    const good = {
      name: "API Test",
      email: "api@example.com",
      message: "Testing the inquiry endpoint with a valid message.",
      consent: true,
      startedAt: Date.now() - 10_000,
    };
    const headers = { origin: baseURL! };
    expect((await request.get("/api/inquiry")).status()).toBe(405);
    expect((await request.post("/api/inquiry", { data: { ...good, email: "bad" }, headers })).status()).toBe(400);
    const bot = await request.post("/api/inquiry", { data: { ...good, website: "spam" }, headers });
    expect(bot.status()).toBe(200);
    expect((await request.post("/api/inquiry", { data: good, headers: { origin: "https://evil.example" } })).status()).toBe(403);
    const unconfigured = await request.post("/api/inquiry", { data: good, headers });
    expect([503, 429]).toContain(unconfigured.status());
  });
});

test.describe("route interactions", () => {
  test("pricing shows named website plans, no amounts, and every service panel in the HTML", async ({ page, request }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    const html = await (await request.get("/pricing")).text();
    for (const name of ["Basic", "Standard", "Premium", "Quoted on your requirements", "Digital Marketing"]) expect(html).toContain(name);
    expect(html).not.toMatch(/₹|lakh/);
    await page.goto("/pricing");
    await page.getByRole("tab", { name: "Enterprise Platforms" }).click();
    await expect(page.getByRole("tabpanel", { name: "Enterprise Platforms" })).toContainText("Quoted on your requirements");
    await page.getByRole("tab", { name: "Website Building" }).click();
    await page.getByRole("link", { name: /Ask about Standard Website Building plan/ }).click();
    await expect(page).toHaveURL(/\/contact\?service=website&plan=standard$/);
    await expect(page.getByRole("complementary", { name: "Your brief so far" })).toContainText("Standard");
  });

  test("approach stages respond to arrow keys", async ({ page, isMobile }) => {
    test.skip(!!isMobile, "keyboard");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/approach");
    await page.getByRole("tab", { name: /Discover/ }).click();
    await page.keyboard.press("ArrowRight");
    await expect(page.getByRole("tab", { name: /Design/ })).toHaveAttribute("aria-selected", "true");
    await expect(page.getByRole("tabpanel")).toContainText("Experience direction or prototype");
  });
});
