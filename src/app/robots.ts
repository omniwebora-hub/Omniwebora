import type { MetadataRoute } from "next";
import { site } from "@/content/site";

/** Staging-safe: everything is disallowed unless NEXT_PUBLIC_ALLOW_INDEXING=true on production. */
export default function robots(): MetadataRoute.Robots {
  if (!site.allowIndexing) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
