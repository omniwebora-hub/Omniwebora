import type { Metadata } from "next";
import { Fragment } from "react";
import Link from "next/link";
import { HomeFilm } from "@/components/home/HomeFilm";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { Icon } from "@/components/ui/Icon";
import { ROOMS } from "@/content/gallery";
import { solutionBySlug } from "@/content/solutions";
import { stages } from "@/content/approach";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/content/site";
import c from "@/components/film/chapters.module.css";
import h from "@/components/home/HomeFilm.module.css";

const title = `${site.name} | Websites, Apps, ERP & CRM, Automation & Marketing`;

export const metadata: Metadata = {
  ...pageMetadata({ title, description: site.description, path: "/" }),
  title: { absolute: title },
};

const IDEA = [
  ["The idea", "“Let customers book without calling.” One sentence from a business owner is enough to start."],
  ["An app", "Customers book from their phone in under a minute, and get a reminder the day before."],
  ["A website", "The same booking works from any browser, on any screen."],
  ["One system", "Every booking lands in one schedule your team already uses. Nothing is typed twice."],
];

/** Each stage of the drawing-to-building story, in the brochure's words (Innovate · Build · Transform). */
const STAGE_COPY = [
  { id: "innovate", n: "01 · Innovate", title: "Every product starts as a drawing.", lede: "Six services, one plan. We understand the idea and the people it is for before anything is built.", hold: "150svh", plate: "k1-draw" },
  { id: "design", n: "02 · Design", title: "Then it takes shape.", lede: "Flows, screens and structure you can react to before a line of code is written.", hold: "140svh", plate: "home-design-end" },
  { id: "build", n: "03 · Build", title: "Built to last.", lede: "Websites, apps, ERP and CRM, automation and campaigns, engineered piece by piece and tested as they grow.", hold: "140svh", plate: "home-build-end" },
] as const;

/**
 * Home (design/HOME_SCRIPT.md): one film from the first frame. A drawing of the building on the
 * terrace becomes a model, is built and lights up: the six bays are the six services. Then in through
 * the centre bay to the product wall, out again as the evening falls, and the invitation at night.
 * Every chapter's words stay where they are and dissolve; nothing scrolls across the scene.
 */
export default function HomePage() {
  return (
    <HomeFilm>
      <section className={`${c.block} ${c.hold}`} data-film-block="arrive" style={{ "--hold": "100svh" } as React.CSSProperties} aria-labelledby="hero-title">
        <picture>
          <source media="(max-width: 1023px)" srcSet="/assets/cinematic/h00-hero-portrait-720.webp 720w, /assets/cinematic/h00-hero-portrait-1100.webp 1100w" sizes="100vw" />
          <img className={`${c.flatPlate} ${h.heroPlate}`} src="/assets/cinematic/h00-hero-1280.webp" srcSet="/assets/cinematic/h00-hero-1280.webp 1280w, /assets/cinematic/h00-hero-1920.webp 1920w" sizes="100vw" alt="" fetchPriority="high" />
        </picture>
        <div className={`${c.panelWrap} ${h.heroWrap}`}>
          <div className={`${c.panel} ${h.heroPanel}`} data-panel>
            <p className={c.num}>Digital solutions studio</p>
            <h1 id="hero-title" className={h.heroTitle}>
              Ideas we bring <span>to life.</span>
            </h1>
            <p className={c.lede}>Websites, mobile apps, business software, automation and digital marketing, designed around how your business really works.</p>
            <div className={c.actions}>
              <TrackedLink href="/contact" event="start_project" props={{ location: "hero" }} className="btn btn-primary">
                Contact Us
                <Icon name="arrow-right" size={18} className="btn-arrow" />
              </TrackedLink>
              <Link href="/solutions" className={c.more}>
                Explore our solutions <Icon name="arrow-right" size={16} />
              </Link>
            </div>
            <p className={h.cue} aria-hidden="true">
              <span /> Scroll to watch it take shape
            </p>
          </div>
        </div>
      </section>

      {/* The camera pushes in on the crystal (the cards have cleared), then holds on it. */}
      <div className={`${c.block} ${c.move}`} data-film-block="push" style={{ height: "150svh" }} aria-hidden="true" />

      <section className={`${c.block} ${c.hold}`} data-film-block="core" style={{ "--hold": "110svh" } as React.CSSProperties} aria-labelledby="core-title">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={c.flatPlate} src="/assets/cinematic/home-push-end-1280.webp" alt="" loading="lazy" />
        <div className={`${c.panelWrap} ${h.heroWrap} ${h.coreWrap}`}>
          <div className={`${c.panel} ${h.heroPanel}`} data-panel>
            <p className={c.num}>What we build</p>
            <h2 id="core-title" className={c.title}>
              Six services, planned as one system.
            </h2>
            <p className={c.lede}>Your website, apps, business software and automations are planned together, so they share their data and grow as one.</p>
          </div>
        </div>
      </section>

      {/* Into the crystal's core, and out onto the drawing of the building (01 Innovate). */}
      <div className={`${c.block} ${c.move}`} data-film-block="dive" style={{ height: "170svh" }} aria-hidden="true" />

      {STAGE_COPY.map((st, i) => (
        <Fragment key={st.id}>
          {i > 0 && (
            <div className={`${c.block} ${c.move}`} data-film-block={`to-${st.id}`} aria-hidden="true">
              <p className={c.moveLine}>{i === 1 ? "The drawing becomes a model" : "The model becomes a building"}</p>
            </div>
          )}
          <section className={`${c.block} ${c.hold}`} data-film-block={st.id} style={{ "--hold": st.hold } as React.CSSProperties} aria-labelledby={`stage-${st.id}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className={c.flatPlate} src={`/assets/cinematic/${st.plate}-1280.webp`} alt="" loading="lazy" />
            <div className={`${c.panelWrap} ${c.water}`}>
              <div className={c.panel} data-panel>
                <p className={c.num}>{st.n}</p>
                <h2 id={`stage-${st.id}`} className={c.title}>
                  {st.title}
                </h2>
                <p className={c.lede}>{st.lede}</p>
              </div>
            </div>
          </section>
        </Fragment>
      ))}

      <div className={`${c.block} ${c.move}`} data-film-block="to-launch" aria-hidden="true">
        <p className={c.moveLine}>Evening · the lights come on</p>
      </div>

      <section className={`${c.block} ${c.hold}`} data-film-block="launch" style={{ "--hold": "190svh" } as React.CSSProperties} aria-labelledby="what-we-build">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={c.flatPlate} src="/assets/cinematic/home-launch-end-1280.webp" alt="" loading="lazy" />
        <div className={`${c.panelWrap} ${c.water}`}>
          <div className={c.panel} data-panel>
            <p className={c.num}>04 · Transform</p>
            <h2 id="what-we-build" className={c.title}>
              Launched, lit and working.
            </h2>
            <p className={c.lede}>Six services, one building. Choose a window to walk into its room.</p>
            <ul className={h.services} aria-label="What we build">
              {ROOMS.map((r) => {
                const sol = solutionBySlug(r.slug)!;
                return (
                  <li key={r.slug}>
                    <Link href={`/solutions#${r.slug}`}>
                      {sol.name}
                      <span>{sol.pitch}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      <div className={`${c.block} ${c.move}`} data-film-block="enter" aria-hidden="true">
        <p className={c.moveLine}>Step inside · one idea, three products</p>
      </div>

      <section className={`${c.block} ${c.hold}`} data-film-block="idea" style={{ "--hold": "330svh" } as React.CSSProperties} aria-labelledby="one-idea">
        <div className={h.stripWrap}>
          <div className={`${c.panel} ${c.storyAll} ${h.strip}`} data-panel>
            <p className={c.num}>One idea, three working products</p>
            <h2 id="one-idea" className={c.title}>
              An app, a website and a system that share one booking.
            </h2>
            <dl className={c.story}>
              {IDEA.map(([t, d]) => (
                <div key={t}>
                  <dt>{t}</dt>
                  <dd>{d}</dd>
                </div>
              ))}
            </dl>
            <div className={c.actions}>
              <Link href="/contact" className="btn btn-primary btn-small">
                Tell us your idea
              </Link>
              <Link href="/approach" className={c.more}>
                How we work <Icon name="arrow-right" size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className={`${c.block} ${c.move}`} data-film-block="to-terrace" aria-hidden="true">
        <p className={c.moveLine}>Back outside · it keeps running</p>
      </div>
      <div className={`${c.block} ${c.hold}`} data-film-block="evening" style={{ "--hold": "60svh" } as React.CSSProperties} aria-hidden="true" />
      <div className={`${c.block} ${c.move}`} data-film-block="dusk" style={{ height: "290svh" }} aria-hidden="true">
        <p className={c.moveLine}>After launch · the work continues</p>
      </div>

      <section className={`${c.block} ${c.hold}`} data-film-block="launched" style={{ "--hold": "150svh" } as React.CSSProperties} aria-labelledby="beyond">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={c.flatPlate} src="/assets/cinematic/home-night-end-1280.webp" alt="" loading="lazy" />
        <div className={h.nightWrap}>
          <div className={h.nightPanel} data-panel>
            <p className="kicker">Beyond launch</p>
            <h2 id="beyond" className={c.title}>
              Built to keep improving.
            </h2>
            <p>Seven stages, adapted to every project, and support for as long as you need it.</p>
            <ol className={h.stageList}>
              {stages.map((st) => (
                <li key={st.id}>
                  <b>{st.name}</b>: {st.summary}
                </li>
              ))}
            </ol>
            <Link href="/approach" className={c.more}>
              See how it would work for you <Icon name="arrow-right" size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className={`${c.block} ${c.hold}`} data-film-block="invite" style={{ "--hold": "130svh" } as React.CSSProperties} aria-labelledby="final-title">
        <div className={c.panelWrap}>
          <div className={c.panel} data-panel>
            <p className={c.num}>Contact us</p>
            <h2 id="final-title" className={c.title}>
              Tell us what you&rsquo;re trying to build.
            </h2>
            <p className={c.lede}>A clear brief is a good start. A rough idea is enough to begin a conversation.</p>
            <div className={c.actions}>
              <TrackedLink href="/contact" event="project_cta_click" props={{ location: "home_final" }} className="btn btn-primary btn-small">
                Contact Us
              </TrackedLink>
              <Link href="/solutions" className={c.more}>
                Explore Solutions <Icon name="arrow-right" size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </HomeFilm>
  );
}
