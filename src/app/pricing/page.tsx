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
    "Website plans from £399: Basic, Standard, Premium and Professional. Written proposals for mobile apps, ERP & CRM software, business automation, digital marketing and enterprise platforms.",
  path: "/pricing",
});

const FAQ = [
  { q: "What decides the price of other services?", a: "Your features, users, platforms, integrations and support needs." },
  { q: "Are hosting, domains and other fees included?", a: "Anything included is listed in your proposal." },
  { q: "Do you offer maintenance?", a: "Yes, as one-off help or ongoing support." },
];

export default function PricingPage() {
  return (
    <>
      <PricingFilm>
        {WEBSITE_PLANS.map((plan, i) => {
          const block = plan.id;
          return [
            // the model grows between the first three plans; Professional is a closer look at the campus
            i > 0 && i < 3 && <div key={`g${i}`} className={`${c.block} ${c.move}`} data-film-block={`grow${i}`} aria-hidden="true"><p className={c.moveLine}>{i === 1 ? "The scope grows · more rooms, more connections" : "Everything, coordinated"}</p></div>,
            <section key={plan.id} className={`${c.block} ${c.hold}`} data-film-block={block} style={{ "--hold": i === 0 ? "150svh" : "130svh" } as React.CSSProperties} aria-labelledby={`plan-${plan.id}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className={c.flatPlate} src={`/assets/cinematic/${["p01-basic", "price-grow1-end", "price-grow2-end", "price-grow2-end"][i]}-1280.webp`} alt="" loading={i ? "lazy" : undefined} />
              <div className={c.panelWrap}>
                <div className={c.panel} data-panel>
                  {i === 0 && (
                    <>
                      <Breadcrumbs items={[{ name: "Pricing", path: "/pricing" }]} />
                      <h1 className={c.title}>Simple plans for websites.</h1>
                      <p className={`${c.lede} ${s.introLede}`}>Four plans, from £399. Other services are quoted for you.</p>
                    </>
                  )}
                  <p className={c.num}>
                    Website plan {i + 1} of {WEBSITE_PLANS.length}
                  </p>
                  <h2 id={`plan-${plan.id}`} className={c.title}>
                    {plan.name}
                  </h2>
                  <p className={s.price}>{plan.price}</p>
                  <p className={c.lede}>{plan.position}</p>
                  <div className={c.actions}>
                    <Link href={`/contact?service=website&plan=${plan.id}`} className="btn btn-primary btn-small">
                      Ask about {plan.name}
                      <span className="visually-hidden"> website plan</span>
                    </Link>
                    {i === WEBSITE_PLANS.length - 1 && (
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
              <p className={`${c.lede} ${s.introLede}`}>Priced on what you need, in a written proposal.</p>
              <div className={c.cols}>
                {solutions
                  .filter((sol) => sol.slug !== "web-development")
                  .map((sol) => (
                    <div key={sol.slug}>
                      <h3>
                        <Link href={`/contact?service=${sol.inquiry}`}>{sol.name}</Link>
                      </h3>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </section>

        <section className={`${c.block} ${c.hold}`} data-film-block="faq" style={{ "--hold": "150svh" } as React.CSSProperties} aria-labelledby="faq-film-title">
          <div className={`${c.panelWrap} ${c.wideWrap}`}>
            <div className={c.panel} data-panel style={{ width: "min(42vw, 38rem)" }}>
              <p className={c.num}>Questions</p>
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
