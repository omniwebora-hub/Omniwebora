import type { Metadata } from "next";
import Link from "next/link";
import { solutions, solutionBySlug, type SolutionSlug } from "@/content/solutions";
import { ROOMS } from "@/content/gallery";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { CtaBand } from "@/components/sections/CtaBand";
import { Icon } from "@/components/ui/Icon";
import { SolutionsFilm } from "@/components/film/SolutionsFilm";
import { FlatOnly } from "@/components/film/FlatOnly";
import { ResponsiveBrowser } from "@/components/solutions/ResponsiveBrowser";
import { PhoneJourney } from "@/components/solutions/PhoneJourney";
import { ModuleConsole } from "@/components/solutions/ModuleConsole";
import { AutomationRunner } from "@/components/solutions/AutomationRunner";
import { MarketingStudio } from "@/components/solutions/MarketingStudio";
import { LayerExplorer } from "@/components/solutions/LayerExplorer";
import { pageMetadata } from "@/lib/seo";
import c from "@/components/film/chapters.module.css";

export const metadata: Metadata = pageMetadata({
  title: "Solutions: Websites, Apps, ERP & CRM, Automation, Marketing",
  description:
    "Walk through six working rooms: website building, mobile applications, custom ERP & CRM software, business automation, digital marketing (Meta Ads and SEO) and enterprise platforms.",
  path: "/solutions",
});

const CAPTION: Record<SolutionSlug, string> = {
  "web-development": "First room · the front door of your business",
  "mobile-apps": "Next · the same business, in your customer's pocket",
  "custom-software": "Next · the system behind the screens",
  "business-automation": "Next · work that moves by itself",
  "digital-marketing": "Next · bringing the right people in",
  "enterprise-platforms": "Last room · everything, coordinated",
};

/** Full-size demos for the stacked (phone, tablet, reduced-motion) layout. */
const FLAT_DEMO: Record<SolutionSlug, React.ReactNode> = {
  "web-development": <ResponsiveBrowser />,
  "mobile-apps": <PhoneJourney />,
  "custom-software": <ModuleConsole />,
  "business-automation": <AutomationRunner />,
  "digital-marketing": <MarketingStudio />,
  "enterprise-platforms": <LayerExplorer />,
};

export default function SolutionsPage() {
  return (
    <>
      <SolutionsFilm>
        <section className={`${c.block} ${c.intro}`} data-film-block="intro" aria-labelledby="page-title">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={c.flatPlate} src="/assets/cinematic/s00-gallery-1280.webp" alt="" />
          <div className={`container ${c.introInner}`}>
            <Breadcrumbs items={[{ name: "Solutions", path: "/solutions" }]} />
            <p className="kicker">Solutions</p>
            <h1 id="page-title" className={c.h1}>
              Digital solutions, built around the real work.
            </h1>
            <p className={c.lede}>
              Six rooms, six services, each with the real thing running on the wall. Start at the front door of a business and walk through to the
              systems behind it.
            </p>
            <nav aria-label="Jump to a room" className={c.jump}>
              {ROOMS.map((r) => (
                <a key={r.slug} href={`#${r.slug}`}>
                  {solutionBySlug(r.slug)!.short}
                </a>
              ))}
            </nav>
            <p className={c.scrollHint} aria-hidden="true">
              <span /> Scroll to enter
            </p>
          </div>
        </section>

        {ROOMS.map((r, i) => {
          const sol = solutionBySlug(r.slug)!;
          return [
            <div key={`to-${r.slug}`} className={`${c.block} ${c.move}`} data-film-block={`to-${r.slug}`} aria-hidden="true">
              <p className={c.moveLine}>{CAPTION[r.slug]}</p>
            </div>,
            <section
              key={r.slug}
              className={`${c.block} ${c.hold}`}
              data-film-block={r.slug}
              aria-labelledby={`${r.slug}-title`}
              style={{ "--hold": r.hold } as React.CSSProperties}
            >
              <span id={r.slug} className={c.anchor} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className={c.flatPlate} src={`/assets/cinematic/${r.flat}-1280.webp`} alt="" loading="lazy" />
              <div className={c.panelWrap}>
                <div className={`${c.panel} ${c.beside}`} data-panel>
                  <p className={c.num}>
                    0{i + 1} · {sol.name}
                  </p>
                  <h2 id={`${r.slug}-title`} className={c.title}>
                    {r.title}
                  </h2>
                  <dl className={c.story}>
                    <div>
                      <dt>The need</dt>
                      <dd>{sol.needs[0]}</dd>
                    </div>
                    <div>
                      <dt>On the wall</dt>
                      <dd>{r.onWall}</dd>
                    </div>
                    <div>
                      <dt>Why it matters</dt>
                      <dd>{r.why}</dd>
                    </div>
                  </dl>
                  <div className={c.actions}>
                    <Link href={`/contact?service=${sol.inquiry}`} className="btn btn-primary btn-small">
                      {sol.cta}
                    </Link>
                    <Link href={`/solutions/${sol.slug}`} className={c.more}>
                      {sol.short} in detail <Icon name="arrow-right" size={16} />
                    </Link>
                  </div>
                </div>
              </div>
              <FlatOnly>
                <div className={`container ${c.flatDemo}`}>{FLAT_DEMO[r.slug]}</div>
              </FlatOnly>
            </section>,
          ];
        })}

        <div className={`${c.block} ${c.move}`} data-film-block="to-finale" aria-hidden="true">
          <p className={c.moveLine}>Outside · the whole building, together</p>
        </div>

        <section className={`${c.block} ${c.outro}`} data-film-block="outro" aria-labelledby="more-title">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={c.flatPlate} src="/assets/cinematic/sol-finale-end-1280.webp" alt="" loading="lazy" />
          <div className={`container ${c.outroInner}`} data-panel>
            <div className={c.outroCard}>
            <p className="kicker">Six rooms, one building</p>
            <h2 id="more-title" className={c.title}>
              Every service works better connected.
            </h2>
            <p className={c.outroLede}>
              Choose a window to walk back into its room, or tell us what you need and we will suggest where to start.
            </p>
            <div className={c.actions}>
              <Link href="/contact" className="btn btn-primary">
                Contact us
              </Link>
              <Link href="/approach" className={c.more}>
                How we would work with you <Icon name="arrow-right" size={16} />
              </Link>
            </div>
            </div>
            <ul className={c.rooms}>
              {solutions.map((x) => (
                <li key={x.slug}>
                  <Link href={`/solutions/${x.slug}`}>
                    <span className={c.roomName}>{x.name}</span>
                    <span className={c.roomPitch}>{x.pitch}</span>
                    <Icon name="arrow-right" size={18} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </SolutionsFilm>
      <div className="flat-only">

      <CtaBand title="Tell us what you need." body="Describe the problem. We will suggest where to start, and what can wait." label="Contact us" location="solutions" />
      </div>
    </>
  );
}
