import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { StudioFilm } from "@/components/about/StudioFilm";
import c from "@/components/film/chapters.module.css";
import { CtaBand } from "@/components/sections/CtaBand";
import { solutions } from "@/content/solutions";
import { stages } from "@/content/approach";
import { pageMetadata } from "@/lib/seo";
import s from "./about.module.css";

export const metadata: Metadata = pageMetadata({
  title: "About Omniwebora",
  description:
    "Omniwebora is a technology partner for web, mobile, software, automation and enterprise solutions, matching each digital solution to a real business need. Innovate. Build. Transform.",
  path: "/about",
});

const AUDIENCES = [
  { who: "Growing businesses", need: "need a credible website, an online store or a better way to take enquiries." },
  { who: "Operations managers", need: "want custom workflows, CRM or ERP modules and dashboards instead of spreadsheets." },
  { who: "Founders", need: "are planning a digital product and need it designed and built carefully." },
  { who: "Larger organisations", need: "need integration, infrastructure and long-term systems support." },
];

export default function AboutPage() {
  return (
    <>
      <StudioFilm>
        <section className={`${c.block} ${c.hold}`} data-film-block="studio" style={{ "--hold": "110svh" } as React.CSSProperties} aria-labelledby="page-title">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={c.flatPlate} src="/assets/cinematic/about-in-start-1280.webp" alt="" />
          <div className={c.panelWrap}>
            <div className={c.panel} data-panel>
              <Breadcrumbs items={[{ name: "About", path: "/about" }]} />
              <p className={c.num}>About Omniwebora · Innovate. Build. Transform.</p>
              <h1 id="page-title" className={c.title}>
                Technology should fit the people who use it.
              </h1>
              <p className={c.lede}>We match a digital solution to a real business need, then build it so it lasts.</p>
            </div>
          </div>
        </section>

        <div className={`${c.block} ${c.move}`} data-film-block="in" aria-hidden="true">
          <p className={c.moveLine}>Into the studio · where projects take shape</p>
        </div>

        <section className={`${c.block} ${c.hold}`} data-film-block="craft" style={{ "--hold": "330svh" } as React.CSSProperties} aria-labelledby="craft-title">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={c.flatPlate} src="/assets/cinematic/about-in-end-1280.webp" alt="" loading="lazy" />
          <div className={c.panelWrap}>
            <div className={`${c.panel} ${c.storyAll}`} data-panel>
              <p className={c.num}>How projects take shape</p>
              <h2 id="craft-title" className={c.title}>
                From the first questions to a working screen.
              </h2>
              <dl className={c.story}>
                <div>
                  <dt>Discover</dt>
                  <dd>Who uses it, what happens next, what must never be retyped.</dd>
                </div>
                <div>
                  <dt>Design</dt>
                  <dd>Flows and screens you can react to before anything is built.</dd>
                </div>
                <div>
                  <dt>Develop</dt>
                  <dd>The same screen, now real and working, reviewed as it grows.</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        <div className={`${c.block} ${c.move}`} data-film-block="out" aria-hidden="true">
          <p className={c.moveLine}>And then, a conversation</p>
        </div>

        <section className={`${c.block} ${c.hold}`} data-film-block="solve" style={{ "--hold": "140svh" } as React.CSSProperties} aria-labelledby="solve-film">
          <div className={c.panelWrap}>
            <div className={c.panel} data-panel style={{ width: "min(40vw, 36rem)" }}>
              <p className={c.num}>What we solve</p>
              <h2 id="solve-film" className={c.title}>
                Most problems worth solving are not about technology at first.
              </h2>
              <p className={c.lede}>Enquiries get lost between channels. Teams keep their own copies of the same records. Reports are rebuilt by hand. We work across the whole range, from a focused website to an enterprise platform, so the answer follows the problem.</p>
            </div>
          </div>
        </section>

        <section className={`${c.block} ${c.hold}`} data-film-block="breadth" style={{ "--hold": "160svh" } as React.CSSProperties} aria-labelledby="breadth-film">
          <div className={`${c.panelWrap} ${c.wideWrap}`}>
            <div className={`${c.panel} ${c.wide}`} data-panel>
              <p className={c.num}>Breadth of capability</p>
              <h2 id="breadth-film" className={c.title}>
                Six services, and what each one covers.
              </h2>
              <div className={c.cols}>
                {solutions.map((sol) => (
                  <div key={sol.slug}>
                    <h3>
                      <Link href={`/solutions#${sol.slug}`}>{sol.name}</Link>
                    </h3>
                    <ul>
                      {sol.capabilities.slice(0, 3).map((cap) => (
                        <li key={cap}>{cap}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className={`${c.block} ${c.hold}`} data-film-block="way" style={{ "--hold": "150svh" } as React.CSSProperties} aria-labelledby="way-film">
          <div className={c.panelWrap}>
            <div className={c.panel} data-panel style={{ width: "min(40vw, 36rem)" }}>
              <p className={c.num}>Way of working</p>
              <h2 id="way-film" className={c.title}>
                Seven stages, adapted to each project.
              </h2>
              <ol className={c.lines}>
                {stages.map((st, i) => (
                  <li key={st.id}>
                    <span>0{i + 1}</span>
                    <b>{st.name}</b>
                  </li>
                ))}
              </ol>
              <Link href="/approach" className={c.more}>
                See how each stage works
              </Link>
            </div>
          </div>
        </section>

        <section className={`${c.block} ${c.hold}`} data-film-block="who" style={{ "--hold": "140svh" } as React.CSSProperties} aria-labelledby="who-film">
          <div className={c.panelWrap}>
            <div className={c.panel} data-panel style={{ width: "min(40vw, 36rem)" }}>
              <p className={c.num}>Who we work with</p>
              <h2 id="who-film" className={c.title}>
                Described by need, not as a list of clients.
              </h2>
              <ul className={c.lines}>
                {AUDIENCES.map((a) => (
                  <li key={a.who} style={{ display: "block" }}>
                    <b>{a.who}</b> {a.need}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className={`${c.block} ${c.hold}`} data-film-block="meet" style={{ "--hold": "120svh" } as React.CSSProperties} aria-labelledby="meet-title">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={c.flatPlate} src="/assets/cinematic/about-out-end-1280.webp" alt="" loading="lazy" />
          <div className={c.panelWrap}>
            <div className={c.panel} data-panel>
              <p className={c.num}>Work with us</p>
              <h2 id="meet-title" className={c.title}>
                Bring the idea. We will bring the questions.
              </h2>
              <p className={c.lede}>A rough idea is enough to begin. We reply by email to talk through scope and a sensible first step.</p>
              <div className={c.actions}>
                <Link href="/contact" className="btn btn-primary btn-small">
                  Contact us
                </Link>
              </div>
            </div>
          </div>
        </section>
      </StudioFilm>
      <div className="flat-only">

      <section className="section" aria-labelledby="solve-title">
        <div className={`container ${s.split}`}>
          <div>
            <p className="kicker">What we solve</p>
            <h2 id="solve-title" className={s.title}>
              Custom solutions, scalable platforms, lasting support.
            </h2>
          </div>
          <div className={s.prose}>
            <p>
              Most of the problems worth solving are not about technology at first. Enquiries get lost between channels. Teams keep their own copies
              of the same records. Reports are rebuilt by hand. A website explains too little, or an app does too much.
            </p>
            <p>
              We work across the whole range, from a focused website to an enterprise platform, so the recommendation can follow the problem
              rather than the other way round. Design and engineering are planned together, because how something works and how it feels to use are
              the same decision.
            </p>
          </div>
        </div>
      </section>

      <section className={`section ${s.ink}`} data-scenic="dark" aria-labelledby="breadth-title">
        <div className="container">
          <div className={s.head}>
            <p className="kicker">Breadth of capability</p>
            <h2 id="breadth-title" className={s.titleLight}>
              Six services, and what each one covers
            </h2>
          </div>
          <div className={s.index}>
            {solutions.map((sol) => (
              <div key={sol.slug} className={s.indexCol}>
                <h3>
                  <Link href={`/solutions#${sol.slug}`}>{sol.name}</Link>
                </h3>
                <ul>
                  {sol.capabilities.slice(0, 5).map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="way-title">
        <div className={`container ${s.split}`}>
          <div>
            <p className="kicker">Way of working</p>
            <h2 id="way-title" className={s.title}>
              Seven stages, adapted to each project
            </h2>
            <Link href="/approach" className="text-link">
              See how each stage works
            </Link>
          </div>
          <ol className={s.stages}>
            {stages.map((st, i) => (
              <li key={st.id}>
                <span>0{i + 1}</span>
                {st.name}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={`section ${s.stone}`} aria-labelledby="who-title">
        <div className="container">
          <div className={s.head}>
            <p className="kicker">Who we work with</p>
            <h2 id="who-title" className={s.title}>
              The people we built this studio to help
            </h2>
            <p className={s.note}>Described by need, not as a list of clients.</p>
          </div>
          <ul className={s.audiences}>
            {AUDIENCES.map((a) => (
              <li key={a.who}>
                <b>{a.who}</b> {a.need}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand title="Start a conversation." body="Tell us what you are working on. A rough idea is enough to begin." label="Start a conversation" location="about" />
      </div>
    </>
  );
}
