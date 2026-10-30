import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PlanBoard } from "@/components/pricing/PlanBoard";
import { PricingFilm } from "@/components/pricing/PricingFilm";
import { WEBSITE_PLANS } from "@/content/pricing";
import c from "@/components/film/chapters.module.css";
import { solutions } from "@/content/solutions";
import { CtaBand } from "@/components/sections/CtaBand";
import { JsonLd } from "@/components/ui/JsonLd";
import { PRICE_DRIVERS } from "@/content/pricing";
import { pageMetadata } from "@/lib/seo";
import s from "./pricing.module.css";

export const metadata: Metadata = pageMetadata({
  title: "Plans & Proposals",
  description:
    "Website plans in Basic, Standard and Premium, and written proposals for mobile apps, ERP & CRM software, business automation, digital marketing and enterprise platforms.",
  path: "/pricing",
});

const FAQ = [
  {
    q: "Why are there no prices on the site?",
    a: "Because scope decides cost. The same label can mean five pages or fifty, one user role or ten. We share plan details on request and send a written proposal once we understand your requirements.",
  },
  {
    q: "What shapes a proposal?",
    a: "Requirements, the number of modules, users and roles, platforms, integrations, infrastructure, security requirements and support after launch.",
  },
  {
    q: "Are hosting, domains and third-party fees included?",
    a: "Not assumed. Anything included, and any third-party costs such as advertising spend, are listed in the proposal for your project.",
  },
  {
    q: "Do you offer maintenance?",
    a: "Yes, as ad-hoc help or an ongoing arrangement. What is included is confirmed in each proposal.",
  },
];

export default function PricingPage() {
  return (
    <>
      <PricingFilm>
        {WEBSITE_PLANS.map((plan, i) => {
          const block = ["basic", "standard", "premium"][i];
          const metaphor = [
            "One well-made building: the essentials, done properly.",
            "The same foundations, with more rooms and more connections.",
            "A complete, connected campus: everything working together.",
          ][i];
          return [
            i > 0 && <div key={`g${i}`} className={`${c.block} ${c.move}`} data-film-block={`grow${i}`} aria-hidden="true"><p className={c.moveLine}>{i === 1 ? "The scope grows · more rooms, more connections" : "Everything, coordinated"}</p></div>,
            <section key={plan.id} className={`${c.block} ${c.hold}`} data-film-block={block} style={{ "--hold": i === 0 ? "150svh" : "130svh" } as React.CSSProperties} aria-labelledby={`plan-${plan.id}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className={c.flatPlate} src={`/assets/cinematic/${["p01-basic", "price-grow1-end", "price-grow2-end"][i]}-1280.webp`} alt="" loading={i ? "lazy" : undefined} />
              <div className={c.panelWrap}>
                <div className={c.panel} data-panel>
                  {i === 0 && (
                    <>
                      <Breadcrumbs items={[{ name: "Pricing", path: "/pricing" }]} />
                      <h1 className={c.title}>The right plan starts with the right scope.</h1>
                      <p className={c.lede}>Websites come in three plans. Everything else is shaped to your requirements and sent as a written proposal.</p>
                    </>
                  )}
                  <p className={c.num}>
                    Website plan {i + 1} of 3
                  </p>
                  <h2 id={`plan-${plan.id}`} className={c.title}>
                    {plan.name}
                  </h2>
                  <dl className={c.story}>
                    <div>
                      <dt>Where it sits</dt>
                      <dd>{plan.position}</dd>
                    </div>
                    <div>
                      <dt>On the table</dt>
                      <dd>{metaphor}</dd>
                    </div>
                    <div>
                      <dt>Details</dt>
                      <dd>Plan details are being finalised. Ask us and we will share the current plan sheet.</dd>
                    </div>
                  </dl>
                  <div className={c.actions}>
                    <Link href={`/contact?service=website&plan=${plan.id}`} className="btn btn-primary btn-small">
                      Ask about {plan.name}
                      <span className="visually-hidden"> website plan</span>
                    </Link>
                    {i === 2 && (
                      <a href="#others" className={c.more}>
                        Every other service
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </section>,
          ];
        })}
        <section className={`${c.block} ${c.hold}`} data-film-block="others" style={{ "--hold": "150svh" } as React.CSSProperties} aria-labelledby="others-title">
          <span id="others" className={c.anchor} />
          <div className={`${c.panelWrap} ${c.wideWrap}`}>
            <div className={`${c.panel} ${c.wide}`} data-panel>
              <p className={c.num}>Every other service</p>
              <h2 id="others-title" className={c.title}>
                Quoted on your requirements.
              </h2>
              <p className={c.lede}>Apps, ERP and CRM, automation, marketing and enterprise platforms are shaped to what you need and sent as a written proposal. This is what we would ask first.</p>
              <div className={c.cols}>
                {solutions
                  .filter((sol) => sol.slug !== "web-development")
                  .map((sol) => (
                    <div key={sol.slug}>
                      <h3>
                        <Link href={`/contact?service=${sol.inquiry}`}>{sol.name}</Link>
                      </h3>
                      <p>{sol.scopeQuestions[0]}</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </section>

        <section className={`${c.block} ${c.hold}`} data-film-block="drivers" style={{ "--hold": "150svh" } as React.CSSProperties} aria-labelledby="drivers-film-title">
          <div className={`${c.panelWrap} ${c.wideWrap}`}>
            <div className={`${c.panel} ${c.wide}`} data-panel>
              <p className={c.num}>What shapes a proposal</p>
              <h2 id="drivers-film-title" className={c.title}>
                Eight things we look at first.
              </h2>
              <div className={c.cols} style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}>
                {PRICE_DRIVERS.map((d) => (
                  <div key={d.id}>
                    <h3>{d.label}</h3>
                    <p>{d.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className={`${c.block} ${c.hold}`} data-film-block="faq" style={{ "--hold": "150svh" } as React.CSSProperties} aria-labelledby="faq-film-title">
          <div className={`${c.panelWrap} ${c.wideWrap}`}>
            <div className={c.panel} data-panel style={{ width: "min(42vw, 38rem)" }}>
              <p className={c.num}>Plan questions</p>
              <h2 id="faq-film-title" className={c.title}>
                Before you ask.
              </h2>
              <div className={c.faq}>
                {FAQ.map((f) => (
                  <details key={f.q}>
                    <summary>{f.q}</summary>
                    <p>{f.a}</p>
                  </details>
                ))}
              </div>
              <div className={c.actions}>
                <Link href="/contact" className="btn btn-primary btn-small">
                  Request a proposal
                </Link>
              </div>
            </div>
          </div>
        </section>
      </PricingFilm>
      <div className="flat-only">

      <section className="section" id="all-services" aria-label="Plans by service">
        <div className="container">
          <PlanBoard />
        </div>
      </section>

      <section className={`section ${s.stone}`} aria-labelledby="drivers-title">
        <div className={`container ${s.split}`}>
          <div>
            <p className="kicker">What shapes a proposal</p>
            <h2 id="drivers-title" className={s.title}>
              Eight things we look at before we propose
            </h2>
            <p className={s.lede}>Open any of them to see why it matters.</p>
          </div>
          <div className={s.drivers}>
            {PRICE_DRIVERS.map((d) => (
              <details key={d.id}>
                <summary>{d.label}</summary>
                <p>{d.body}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className={`section ${s.stone}`} aria-labelledby="pricing-faq">
        <div className={`container ${s.split}`}>
          <h2 id="pricing-faq" className={s.title}>
            Plan questions
          </h2>
          <div className={s.drivers}>
            {FAQ.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <CtaBand title="Request a proposal." body="Tell us what you need. We will reply with questions, then a proposal shaped to your scope." label="Request a proposal" location="pricing" />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }}
      />
      </div>
    </>
  );
}
