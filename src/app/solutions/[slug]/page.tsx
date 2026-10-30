import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { solutions, solutionBySlug, type SolutionSlug } from "@/content/solutions";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { RoomFilm } from "@/components/solutions/RoomFilm";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { ROOMS } from "@/content/gallery";
import c from "@/components/film/chapters.module.css";
import { ResponsiveBrowser } from "@/components/solutions/ResponsiveBrowser";
import { PhoneJourney } from "@/components/solutions/PhoneJourney";
import { ModuleConsole } from "@/components/solutions/ModuleConsole";
import { AutomationRunner } from "@/components/solutions/AutomationRunner";
import { MarketingStudio } from "@/components/solutions/MarketingStudio";
import { LayerExplorer } from "@/components/solutions/LayerExplorer";
import { WEBSITE_PLANS } from "@/content/pricing";
import { pageMetadata } from "@/lib/seo";
import s from "../solutions.module.css";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return solutions.map((x) => ({ slug: x.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const sol = solutionBySlug(slug);
  if (!sol) return {};
  return pageMetadata({ title: sol.metaTitle, description: sol.metaDescription, path: `/solutions/${sol.slug}` });
}

const SIGNATURE: Record<SolutionSlug, { tone: "light" | "dark"; title: string; lede: string; node: React.ReactNode }> = {
  "web-development": {
    tone: "light",
    title: "One site, every screen, four working states",
    lede: "Switch the width and the page. The layout reflows like a real responsive build; the form validates, the catalogue filters and the booking holds a slot.",
    node: <ResponsiveBrowser />,
  },
  "mobile-apps": {
    tone: "light",
    title: "A complete journey, start to confirmation",
    lede: "Step through one core journey. Alongside, see which parts of the system each screen relies on.",
    node: <PhoneJourney />,
  },
  "custom-software": {
    tone: "light",
    title: "One record, every module",
    lede: "Pick a module, then select a record. The same customer, order or person shows up wherever it is used, because there is only one copy.",
    node: <ModuleConsole />,
  },
  "business-automation": {
    tone: "dark",
    title: "Run a sample automation",
    lede: "Choose an incoming message and run it. The automation classifies and routes it; a person approves before anything is sent.",
    node: <AutomationRunner />,
  },
  "digital-marketing": {
    tone: "light",
    title: "Plan a campaign, then check it can be measured",
    lede: "Pick what the ad should lead to and who should see it, check the tracking a campaign needs, and write a search result for the page it lands on.",
    node: <MarketingStudio />,
  },
  "enterprise-platforms": {
    tone: "light",
    title: "Explore the layers of one platform",
    lede: "Select a layer to see what it holds, who uses it and what it depends on. Highlight a department to see which layers it touches.",
    node: <LayerExplorer />,
  },
};

/** Chapters that only some rooms have, told on the scene like the rest. */
const EXTRA: Partial<Record<SolutionSlug, "plans" | "rules" | "promise">> = {
  "web-development": "plans",
  "business-automation": "rules",
  "digital-marketing": "promise",
};

const hold = (h: string) => ({ "--hold": h }) as React.CSSProperties;

export default async function SolutionPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const sol = solutionBySlug(slug);
  if (!sol) notFound();
  const sig = SIGNATURE[sol.slug];
  const room = ROOMS.find((r) => r.slug === sol.slug)!;
  const extra = EXTRA[sol.slug];
  const chapters = ["intro", "demo", "needs", "covers", ...(extra ? [extra] : []), "questions", "faq", "next"];
  const others = solutions.filter((x) => x.slug !== sol.slug);

  return (
    <RoomFilm slug={sol.slug} chapters={chapters}>
      <section className={`${c.block} ${c.hold}`} data-film-block="intro" style={hold("120svh")} aria-labelledby="page-title">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={c.flatPlate} src={`/assets/cinematic/${room.flat}-1280.webp`} alt="" fetchPriority="high" />
        <div className={`${c.panelWrap} ${c.low}`}>
          <div className={c.panel} data-panel>
            <Breadcrumbs
              items={[
                { name: "Solutions", path: "/solutions" },
                { name: sol.name, path: `/solutions/${sol.slug}` },
              ]}
            />
            <p className={c.num}>{sol.name}</p>
            <h1 id="page-title" className={c.title}>
              {sol.h1}
            </h1>
            <p className={c.lede}>{sol.lede}</p>
            <div className={c.actions}>
              <TrackedLink href={`/contact?service=${sol.inquiry}`} event="project_cta_click" props={{ location: "solution_hero", service: sol.slug }} className="btn btn-primary btn-small">
                {sol.cta}
              </TrackedLink>
              <Link href="/pricing" className={c.more}>
                Plans &amp; proposals
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className={`${c.block} ${c.hold}`} data-film-block="demo" style={hold(room.hold)} aria-labelledby="demo-title">
        <div className={`${c.panelWrap} ${c.low}`}>
          <div className={c.panel} data-panel>
            <p className={c.num}>On the wall</p>
            <h2 id="demo-title" className={c.title}>
              {sig.title}
            </h2>
            <p className={c.lede}>{room.onWall}</p>
          </div>
        </div>
      </section>
      {/* Phones, tablets and reduced motion: the full interactive demonstration inline. */}
      <div className="flat-only">
        <section className="section" aria-label={sig.title}>
          <div className="container">
            <p className={s.note}>{sig.lede}</p>
            {sig.node}
          </div>
        </section>
      </div>

      <section className={`${c.block} ${c.hold}`} data-film-block="needs" style={hold("140svh")} aria-labelledby="needs-title">
        <div className={c.panelWrap}>
          <div className={c.panel} data-panel style={{ width: "min(40vw, 36rem)" }}>
            <p className={c.num}>When it helps</p>
            <h2 id="needs-title" className={c.title}>
              Situations we hear about.
            </h2>
            <ul className={c.lines}>
              {sol.needs.map((n) => (
                <li key={n} style={{ display: "block" }}>
                  {n}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className={`${c.block} ${c.hold}`} data-film-block="covers" style={hold("150svh")} aria-labelledby="caps-title">
        <div className={c.panelWrap}>
          <div className={c.panel} data-panel style={{ width: "min(40vw, 36rem)" }}>
            <p className={c.num}>What it can include</p>
            <h2 id="caps-title" className={c.title}>
              Capabilities.
            </h2>
            <ul className={c.capList}>
              {sol.capabilities.map((cap) => (
                <li key={cap}>{cap}</li>
              ))}
            </ul>
            <p className={c.lede}>From the Omniwebora brochure. What is in scope for you is agreed in the proposal.</p>
          </div>
        </div>
      </section>

      {extra === "plans" && (
        <section className={`${c.block} ${c.hold}`} data-film-block="plans" style={hold("140svh")} aria-labelledby="web-plans">
          <div className={c.panelWrap}>
            <div className={c.panel} data-panel style={{ width: "min(40vw, 36rem)" }}>
              <p className={c.num}>Website plans</p>
              <h2 id="web-plans" className={c.title}>
                Three plans, one standard of care.
              </h2>
              <ol className={c.lines}>
                {WEBSITE_PLANS.map((p, i) => (
                  <li key={p.id}>
                    <span>0{i + 1}</span>
                    <span style={{ color: "#fff", fontSize: "1rem", letterSpacing: 0, fontWeight: 400 }}>
                      <b>{p.name}</b> · {p.position}
                    </span>
                  </li>
                ))}
              </ol>
              <p className={c.lede}>Plan details are being finalised; ask us and we will share the current plan sheet.</p>
              <div className={c.actions}>
                <Link href="/pricing" className={c.more}>
                  See the plans grow
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {extra === "rules" && (
        <section className={`${c.block} ${c.hold}`} data-film-block="rules" style={hold("150svh")} aria-labelledby="rules-ai">
          <div className={`${c.panelWrap} ${c.wideWrap}`}>
            <div className={`${c.panel} ${c.wide}`} data-panel style={{ width: "min(52vw, 50rem)" }}>
              <p className={c.num}>How it decides</p>
              <h2 id="rules-ai" className={c.title}>
                Rules, AI, and the person in the loop.
              </h2>
              <div className={c.cols}>
                <div>
                  <h3>Rules-based automation</h3>
                  <p>Best when inputs are structured and the decision is clear: routing by amount, status changes, reminders, scheduled reports. Predictable and easy to audit.</p>
                </div>
                <div>
                  <h3>AI-assisted steps</h3>
                  <p>Useful when inputs are messy: free-text enquiries, documents, summaries. We evaluate it on your own examples before relying on it, and keep a fallback.</p>
                </div>
                <div>
                  <h3>Human oversight</h3>
                  <p>Wherever a mistake would matter (money, customers, records), a person approves. Every automated step is logged so it can be checked later.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {extra === "promise" && (
        <section className={`${c.block} ${c.hold}`} data-film-block="promise" style={hold("130svh")} aria-labelledby="no-guarantee">
          <div className={c.panelWrap}>
            <div className={c.panel} data-panel style={{ width: "min(40vw, 36rem)" }}>
              <p className={c.num}>Plainly</p>
              <h2 id="no-guarantee" className={c.title}>
                What we will and will not promise.
              </h2>
              <p className={c.lede}>
                We plan campaigns and search work around the actions that matter to your business, set up tracking so results are visible, and report plainly. We do not promise rankings, reach or a number of leads: search engines and ad platforms decide those, and honest agencies say so.
              </p>
            </div>
          </div>
        </section>
      )}

      <section className={`${c.block} ${c.hold}`} data-film-block="questions" style={hold("140svh")} aria-labelledby="scope-title">
        <div className={c.panelWrap}>
          <div className={c.panel} data-panel style={{ width: "min(40vw, 36rem)" }}>
            <p className={c.num}>Before we estimate</p>
            <h2 id="scope-title" className={c.title}>
              Questions that shape the scope.
            </h2>
            <ol className={c.lines}>
              {sol.scopeQuestions.map((q, i) => (
                <li key={q}>
                  <span>0{i + 1}</span>
                  <span style={{ color: "rgb(255 255 255 / 0.92)", fontSize: "0.98rem", letterSpacing: 0, fontWeight: 400 }}>{q}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className={`${c.block} ${c.hold}`} data-film-block="faq" style={hold("140svh")} aria-labelledby="faq-title">
        <div className={c.panelWrap}>
          <div className={c.panel} data-panel style={{ width: "min(40vw, 36rem)" }}>
            <p className={c.num}>Common questions</p>
            <h2 id="faq-title" className={c.title}>
              Before you ask.
            </h2>
            <div className={c.faq}>
              {sol.faqs.map((q) => (
                <details key={q.q}>
                  <summary>{q.q}</summary>
                  <p>{q.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={`${c.block} ${c.hold}`} data-film-block="next" style={hold("130svh")} aria-labelledby="next-title">
        <div className={`${c.panelWrap} ${c.low}`}>
          <div className={c.panel} data-panel>
            <p className={c.num}>Next step</p>
            <h2 id="next-title" className={c.title}>
              {sol.cta}.
            </h2>
            <p className={c.lede}>Share the problem and the people involved. We will reply with questions and a sensible first step.</p>
            <div className={c.actions}>
              <TrackedLink href={`/contact?service=${sol.inquiry}`} event="project_cta_click" props={{ location: `solution-${sol.slug}` }} className="btn btn-primary btn-small">
                {sol.cta}
              </TrackedLink>
              <Link href={`/solutions#${sol.slug}`} className={c.more}>
                Back to the gallery
              </Link>
            </div>
            <nav aria-label="Other solutions">
              <ul className={c.lines}>
                {others.map((o) => (
                  <li key={o.slug} style={{ display: "block" }}>
                    <Link href={`/solutions/${o.slug}`}>{o.name}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </section>
    </RoomFilm>
  );
}
