import type { Metadata } from "next";
import { site } from "@/content/site";

type PageMeta = {
  title: string;
  description: string;
  path: string;
  /** Force noindex regardless of environment (e.g. unapproved legal drafts). */
  noindex?: boolean;
};

export function pageMetadata({ title, description, path, noindex }: PageMeta): Metadata {
  const index = site.allowIndexing && !noindex;
  return {
    title,
    description,
    alternates: { canonical: path },
    robots: index ? { index: true, follow: true } : { index: false, follow: !noindex },
    openGraph: {
      type: "website",
      siteName: site.name,
      title: `${title} | ${site.name}`,
      description,
      url: path,
      locale: "en",
    },
    twitter: { card: "summary_large_image", title: `${title} | ${site.name}`, description },
  };
}

/** JSON-LD using verified facts only. */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${site.url}/#organization`,
        name: site.name,
        url: site.url,
        description: site.description,
        ...(site.logo.verified ? { logo: `${site.url}${site.logo.value}` } : {}),
        ...(site.contactEmail.verified ? { email: site.contactEmail.value } : {}),
        ...(site.social.some((s) => s.verified) ? { sameAs: site.social.filter((s) => s.verified).map((s) => s.href) } : {}),
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        url: site.url,
        name: site.name,
        publisher: { "@id": `${site.url}/#organization` },
        inLanguage: "en",
      },
    ],
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${site.url}${item.path}`,
    })),
  };
}

export function serviceJsonLd(service: { name: string; metaDescription: string; slug: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.metaDescription,
    url: `${site.url}/solutions/${service.slug}`,
    provider: { "@id": `${site.url}/#organization` },
  };
}
