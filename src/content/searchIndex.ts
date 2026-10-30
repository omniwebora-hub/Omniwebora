import { solutions } from "./solutions";
import { stages } from "./approach";
import { industries } from "./industries";

export type SearchEntry = { title: string; href: string; description: string; group: "Pages" | "Solutions" | "How we work" | "Industries" };

export const searchIndex: SearchEntry[] = [
  { title: "Home", href: "/", description: "Websites, apps, software, AI and enterprise solutions", group: "Pages" },
  { title: "Solutions", href: "/solutions", description: "All six solution families and how they fit together", group: "Pages" },
  { title: "Pricing", href: "/pricing", description: "Website plans (Basic, Standard, Premium) and proposals for every service", group: "Pages" },
  { title: "How we work", href: "/approach", description: "Discover, design, develop, integrate, deploy, maintain, scale", group: "Pages" },
  { title: "Industries", href: "/industries", description: "Retail, hospitality, education, healthcare, logistics and more", group: "Pages" },
  { title: "About", href: "/about", description: "Technology should fit the people who use it", group: "Pages" },
  { title: "Contact", href: "/contact", description: "Contact us with a short guided brief", group: "Pages" },
  { title: "Privacy notice", href: "/privacy", description: "How enquiry data is handled (draft)", group: "Pages" },
  ...solutions.map((s) => ({ title: s.name, href: `/solutions/${s.slug}`, description: s.pitch, group: "Solutions" as const })),
  ...stages.map((st) => ({ title: st.name, href: `/approach#${st.id}`, description: st.summary, group: "How we work" as const })),
  ...industries.map((i) => ({ title: i.name, href: "/industries", description: i.context, group: "Industries" as const })),
];

export function searchEntries(query: string): SearchEntry[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return searchIndex.filter((e) => e.group === "Pages" || e.group === "Solutions");
  return searchIndex
    .map((e) => {
      const hay = `${e.title} ${e.description}`.toLowerCase();
      const title = e.title.toLowerCase();
      let score = 0;
      for (const t of terms) {
        if (!hay.includes(t)) return null;
        score += title.startsWith(t) ? 3 : title.includes(t) ? 2 : 1;
      }
      return { e, score };
    })
    .filter((x): x is { e: SearchEntry; score: number } => x !== null)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.e)
    .slice(0, 8);
}
