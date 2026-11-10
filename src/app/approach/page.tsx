import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { StageExplorer } from "@/components/approach/StageExplorer";
import { JourneyPlanner } from "@/components/approach/JourneyPlanner";
import { PlanFilm } from "@/components/approach/PlanFilm";
import { PlannerProvider } from "@/components/approach/plannerState";
import c from "@/components/film/chapters.module.css";
import { CtaBand } from "@/components/sections/CtaBand";
import { pageMetadata } from "@/lib/seo";
import s from "./approach.module.css";

export const metadata: Metadata = pageMetadata({
  title: "How We Work: Seven Stages, Brief to Launch",
  description:
    "Seven stages from a clear brief to a product you can rely on: discovery, design, development, integration, deployment, maintenance and scaling, adapted to each project's scope.",
  path: "/approach",
});


export default function ApproachPage() {
  return (
    <PlannerProvider>
      <PlanFilm>
        <section className={`${c.block} ${c.hold}`} data-film-block="studio" style={{ "--hold": "115svh" } as React.CSSProperties} aria-labelledby="page-title">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={c.flatPlate} src="/assets/cinematic/l02-table-eye-1280.webp" alt="" />
          <div className={c.panelWrap}>
            <div className={c.panel} data-panel>
              <Breadcrumbs items={[{ name: "How we work", path: "/approach" }]} />
              <p className={c.num}>How we work</p>
              <h1 id="page-title" className={c.title}>
                Planned around your business.
              </h1>
              <p className={c.lede}>Seven simple stages, from the first talk to launch and beyond.</p>
            </div>
          </div>
        </section>

        <div className={`${c.block} ${c.move} ${s.filmOnly}`} data-film-block="rise" aria-hidden="true">
          <p className={c.moveLine}>To the planning table</p>
        </div>

        <section className={`${c.block} ${c.hold} ${s.filmOnly}`} data-film-block="table" style={{ "--hold": "110svh" } as React.CSSProperties} aria-labelledby="table-title">
          <div className={`${c.panelWrap} ${c.water}`}>
            <div className={c.panel} data-panel>
              <p className={c.num}>The planning table</p>
              <h2 id="table-title" className={c.title}>
                Three screens, one plan: yours.
              </h2>
              <p className={c.lede}>Tell us what you do and what you want. We write your plan.</p>
            </div>
          </div>
        </section>

        <section className={`${c.block} ${c.hold} ${s.filmOnly}`} data-film-block="trade" style={{ "--hold": "170svh" } as React.CSSProperties} aria-labelledby="plan-trade">
          <div className={`${c.panelWrap} ${c.water}`}>
            <div className={c.panel} data-panel>
              <p className={c.num}>01 · What you do</p>
              <h2 id="plan-trade" className={c.title}>
                Start with your business.
              </h2>
              <p className={c.lede}>Pick the closest one on the tablet.</p>
            </div>
          </div>
        </section>

        <section className={`${c.block} ${c.hold} ${s.filmOnly}`} data-film-block="wants" style={{ "--hold": "170svh" } as React.CSSProperties} aria-labelledby="plan-wants">
          <div className={`${c.panelWrap} ${c.water}`}>
            <div className={c.panel} data-panel>
              <p className={c.num}>02 · What you want</p>
              <h2 id="plan-wants" className={c.title}>
                Then, what you need.
              </h2>
              <p className={c.lede}>Choose up to three on the laptop.</p>
            </div>
          </div>
        </section>

        <section className={`${c.block} ${c.hold} ${s.filmOnly}`} data-film-block="stages" style={{ "--hold": "380svh" } as React.CSSProperties} aria-labelledby="plan-stages">
          <div className={`${c.panelWrap} ${c.water}`}>
            <div className={c.panel} data-panel>
              <p className={c.num}>03 · Your plan</p>
              <h2 id="plan-stages" className={c.title}>
                Seven stages, written for you.
              </h2>
              <p className={c.lede}>Discover, Design, Develop, Integrate, Deploy, Maintain and Scale. Each one plays on the tablet.</p>
            </div>
          </div>
        </section>

        <section className={`${c.block} ${c.hold} ${s.filmOnly}`} data-film-block="together" style={{ "--hold": "150svh" } as React.CSSProperties} aria-labelledby="together-film">
          <div className={c.panelWrap}>
            <div className={`${c.panel} ${c.storyAll}`} data-panel style={{ width: "min(40vw, 36rem)" }}>
              <p className={c.num}>Working together</p>
              <h2 id="together-film" className={c.title}>
                How we work together.
              </h2>
              <dl className={c.story}>
                <div>
                  <dt>We show you</dt>
                  <dd>Short, regular reviews of real screens.</dd>
                </div>
                <div>
                  <dt>You bring</dt>
                  <dd>Your know-how, quick feedback and content.</dd>
                </div>
                <div>
                  <dt>We agree</dt>
                  <dd>The scope, written down before we start.</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

      </PlanFilm>
      <div className="flat-only">

      <section className="section" id="planner" aria-labelledby="planner-title">
        <div className="container">
          <div className={s.head}>
            <p className="kicker">Your project, step by step</p>
            <h2 id="planner-title" className={s.title}>
              The whole plan on one page
            </h2>
          </div>
          <JourneyPlanner />
        </div>
      </section>

      <section className={`section ${s.explorer}`} aria-labelledby="stages-title">
        <div className="container">
          <h2 id="stages-title" className="visually-hidden">
            What each stage produces
          </h2>
          <StageExplorer />
        </div>
      </section>

      <section className={`section ${s.stone}`} aria-labelledby="principles-title">
        <div className={`container ${s.split}`}>
          <div>
            <p className="kicker">Working together</p>
            <h2 id="principles-title" className={s.title}>
              What we propose, and what helps from your side
            </h2>
          </div>
          <div className={s.columns}>
            <div>
              <h3>Communication</h3>
              <p>Short, regular reviews of something you can see: a flow, a screen, a working build. Decisions are written down where everyone can find them.</p>
            </div>
            <div>
              <h3>What you bring</h3>
              <p>Context about the business, access to the people who do the work, timely feedback, and the content or data the product needs.</p>
            </div>
            <div>
              <h3>Scope</h3>
              <p>
                Modules, users, platforms, integrations, infrastructure, security and support shape every proposal. Those are the things we pin
                down first. <Link href="/pricing">See plans</Link>.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CtaBand title="Start with discovery." body="A short conversation about the problem is the first step of every project." label="Start with discovery" location="approach" />
      </div>
    </PlannerProvider>
  );
}
