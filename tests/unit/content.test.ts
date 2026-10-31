import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { site, publishedMetrics } from "@/content/site";
import { solutions, serviceList } from "@/content/solutions";
import { stages } from "@/content/approach";
import { OFFERS, WEBSITE_PLANS } from "@/content/pricing";
import { ROOMS } from "@/content/gallery";
import { searchEntries } from "@/content/searchIndex";
import { CUBE_REST, STILLS, heroPanels } from "@/content/heroWorld";
import { H01_FRAMES, H01_TRACK } from "@/content/cinematic.generated";

const SRC = path.resolve(import.meta.dirname, "../../src");
const read = (p: string) => fs.readFileSync(path.join(SRC, p), "utf8");
const walk = (dir: string): string[] =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => (d.isDirectory() ? walk(path.join(dir, d.name)) : [path.join(dir, d.name)]));

describe("content honesty", () => {
  it("publishes no unverified metrics", () => {
    expect(site.metrics.every((m) => !m.verified)).toBe(true);
    expect(publishedMetrics).toHaveLength(0);
  });

  it("never hard-codes the unverified screenshot figures in page source", () => {
    const files = walk(SRC).filter((f) => /\.(tsx)$/.test(f));
    for (const f of files) {
      const text = fs.readFileSync(f, "utf8");
      expect(text, f).not.toMatch(/20\+\s*Projects|10\+\s*Industries|100%\s*Client/i);
    }
  });

  it("keeps unknown business facts unverified and out of structured data", () => {
    expect(site.legalName.verified).toBe(false);
    // The contact email is owner-confirmed (FACT_REGISTER O06).
    expect(site.contactEmail).toMatchObject({ value: "info@omniwebora.com", verified: true });
    expect(site.address.verified).toBe(false);
    const seo = read("lib/seo.ts");
    expect(seo).not.toMatch(/aggregateRating|review/i);
  });

  it("labels every live demonstration as illustrative and not client work", () => {
    expect(site.caseStudiesPublished).toBe(false);
    for (const f of ["components/solutions/ModuleConsole.tsx", "components/solutions/AutomationRunner.tsx", "components/solutions/MarketingStudio.tsx", "components/solutions/ResponsiveBrowser.tsx"]) {
      expect(read(f), f).toMatch(/Illustrative/);
    }
  });

  it("never publishes the withheld brochure claims", () => {
    const pages = walk(SRC).filter((f) => /\.(tsx?)$/.test(f)).map((f) => fs.readFileSync(f, "utf8")).join("\n");
    expect(pages).not.toMatch(/Most popular|Domain included|On-Time Delivery|Expert Team|free consultation/i);
  });

  it("has no testimonial or award language in content", () => {
    const content = walk(path.join(SRC, "content")).map((f) => fs.readFileSync(f, "utf8")).join("\n");
    expect(content).not.toMatch(/award-winning|testimonial|trusted by|clients include/i);
  });
});

describe("services (owner list, 2026-10-29) and process content", () => {
  it("offers exactly the owner's six services with complete copy", () => {
    expect(solutions.map((x) => x.slug)).toEqual(["web-development", "mobile-apps", "custom-software", "business-automation", "digital-marketing", "enterprise-platforms"]);
    expect(serviceList.map((x) => x.name)).toEqual(["Website Building", "Mobile Applications", "Custom Software: ERP & CRM", "Business Automation", "Digital Marketing", "Enterprise Platforms"]);
    for (const x of solutions) {
      expect(x.metaTitle.length, x.slug).toBeLessThanOrEqual(60);
      expect(x.metaDescription.length, x.slug).toBeGreaterThan(80);
      expect(x.metaDescription.length, x.slug).toBeLessThanOrEqual(200);
      expect(x.needs.length).toBeGreaterThanOrEqual(3);
      expect(x.capabilities.length).toBeGreaterThanOrEqual(5);
      expect(x.faqs.length).toBeGreaterThanOrEqual(2);
    }
    expect(new Set(solutions.map((x) => x.metaTitle)).size).toBe(solutions.length);
  });

  it("gives every service its own gallery room, in film order", () => {
    expect(ROOMS.map((r) => r.slug)).toEqual(solutions.map((x) => x.slug));
    expect(new Set(ROOMS.map((r) => r.hold)).size).toBeGreaterThan(1); // rooms differ in pace
  });

  it("uses the brochure's seven stages in order", () => {
    expect(stages.map((p) => p.name)).toEqual(["Discover", "Design", "Develop", "Integrate", "Deploy", "Maintain", "Scale"]);
  });
});

describe("plans (owner instruction: no amounts)", () => {
  it("names the website plans Basic, Standard and Premium and scopes the rest", () => {
    expect(WEBSITE_PLANS.map((p) => p.name)).toEqual(["Basic", "Standard", "Premium"]);
    expect(OFFERS.map((o) => o.service)).toEqual(solutions.map((x) => x.slug));
    expect(OFFERS.filter((o) => o.plans).map((o) => o.service)).toEqual(["web-development"]);
  });

  it("publishes no currency amounts anywhere in the site source", () => {
    const files = walk(SRC).filter((f) => /\.(tsx?|css)$/.test(f) && !/demos[\\/]|ResponsiveBrowser/.test(f));
    for (const f of files) expect(fs.readFileSync(f, "utf8"), f).not.toMatch(/₹|\blakh\b|\bINR\b|Rs\.\s?\d/i);
  });

  it("has no Work / case-study route and no Concept Lab (owner removed both)", () => {
    expect(fs.existsSync(path.join(SRC, "app/work"))).toBe(false);
    expect(fs.existsSync(path.join(SRC, "app/concept-lab"))).toBe(false);
  });
});

describe("site search", () => {
  it("finds services by keyword and ranks title matches first", () => {
    expect(searchEntries("automation")[0].href).toBe("/solutions/business-automation");
    expect(searchEntries("pricing")[0].href).toBe("/pricing");
    expect(searchEntries("zzzz")).toHaveLength(0);
  });
});

describe("hero world (Higgsfield-rendered media)", () => {
  const PUBLIC = path.resolve(import.meta.dirname, "../../public");

  it("ships every still and the opening's clips locally (no remote generation URLs at runtime)", () => {
    const files = [...STILLS.hero, ...STILLS.heroPortrait, ...STILLS.colonnade]
      .map((s) => s.src)
      .concat("/assets/cinematic/a01-studio-table-2400.webp", "/assets/cinematic/a01-studio-table-1280.webp")
      .concat(["home-push", "home-dive"].flatMap((id) => [`/assets/cinematic/${id}/v1600.mp4`, `/assets/cinematic/${id}/v1280.mp4`, `/assets/cinematic/${id}-end-1920.webp`]));
    for (const src of files) expect(fs.existsSync(path.join(PUBLIC, src)), src).toBe(true);
    const runtime = walk(SRC).filter((f) => /\.(tsx?|css)$/.test(f)).map((f) => fs.readFileSync(f, "utf8")).join("\n");
    expect(runtime).not.toMatch(/cloudfront\.net|higgsfield\.ai|muapi/i);
  });

  it("has one smooth crystal track sample per frame of the push-in", () => {
    expect(H01_TRACK).toHaveLength(H01_FRAMES);
    for (let i = 1; i < H01_TRACK.length; i++) {
      const [x0, y0, h0] = H01_TRACK[i - 1];
      const [x1, y1, h1] = H01_TRACK[i];
      expect(Math.abs(x1 - x0), `x jump at ${i}`).toBeLessThan(0.02);
      expect(Math.abs(y1 - y0), `y jump at ${i}`).toBeLessThan(0.02);
      expect(h1, `push-in never pulls back at ${i}`).toBeGreaterThanOrEqual(h0 - 0.002);
    }
    expect(CUBE_REST.x).toBeGreaterThan(0.6); // the crystal sits right of centre, the words on the left
  });

  it("puts the six services around the crystal, three each side", () => {
    expect(heroPanels).toHaveLength(6);
    expect(heroPanels.filter((p) => p.side === "left")).toHaveLength(3);
    expect(heroPanels.filter((p) => p.side === "right")).toHaveLength(3);
  });
});
