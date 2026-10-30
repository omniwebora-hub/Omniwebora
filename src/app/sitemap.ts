import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { solutions } from "@/content/solutions";

/** Indexable routes only (privacy draft and thank-you are excluded). */
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "/",
    "/solutions",
    ...solutions.map((s) => `/solutions/${s.slug}`),
    "/industries",
    "/approach",
    "/pricing",
    "/about",
    "/contact",
  ];
  if (site.privacyPolicyApproved) routes.push("/privacy");
  return routes.map((path) => ({
    url: `${site.url}${path === "/" ? "" : path}`,
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : path.startsWith("/solutions") || path === "/pricing" ? 0.8 : 0.6,
  }));
}
