"use client";

import Link from "next/link";
import { useState } from "react";
import { OFFERS, PRICING_NOTE, type Offer } from "@/content/pricing";
import { solutionBySlug } from "@/content/solutions";
import { onTabKeys } from "@/lib/tabKeys";
import s from "./PlanBoard.module.css";

/**
 * Plans by service, with no amounts (owner instruction). Website plans are named; their inclusions are
 * pending from the owner and shown as such. Every other service is a scoped proposal. All six panels
 * stay in the HTML (hidden, not removed) so the content is indexable.
 */
export function PlanBoard() {
  const [sel, setSel] = useState(OFFERS[0].service);
  return (
    <div className={s.board}>
      <div className={s.tabs} role="tablist" aria-label="Services" onKeyDown={onTabKeys}>
        {OFFERS.map((o) => (
          <button
            key={o.service}
            type="button"
            role="tab"
            id={`plan-tab-${o.service}`}
            aria-selected={sel === o.service}
            aria-controls={`plan-panel-${o.service}`}
            tabIndex={sel === o.service ? 0 : -1}
            className={s.tab}
            onClick={() => setSel(o.service)}
          >
            {o.label}
          </button>
        ))}
      </div>
      {OFFERS.map((o) => (
        <div key={o.service} id={`plan-panel-${o.service}`} role="tabpanel" aria-labelledby={`plan-tab-${o.service}`} hidden={sel !== o.service} className={s.panel}>
          <OfferPanel offer={o} />
        </div>
      ))}
      <p className={s.note}>{PRICING_NOTE}</p>
    </div>
  );
}

function OfferPanel({ offer }: { offer: Offer }) {
  const sol = solutionBySlug(offer.service)!;
  if (offer.plans)
    return (
      <>
        <p className={s.intro}>{sol.pitch}</p>
        <PlanCards offer={offer} />
      </>
    );
  return (
    <>
      <div className={s.proposalHead}>
        <span className={s.badge}>Quoted on your requirements</span>
        <p className={s.intro}>
          {sol.pitch} There are no fixed packages here: every engagement is shaped to what you need, and you receive a written proposal.
        </p>
      </div>
      <ol className={s.plans}>
        {sol.scopeQuestions.slice(0, 3).map((q, i) => (
          <li key={q} className={s.plan} data-level={i === 2 ? 3 : undefined}>
            <span className={s.steps} aria-hidden="true">
              {[0, 1, 2].map((k) => (
                <i key={k} data-on={k <= i ? "true" : undefined} />
              ))}
            </span>
            <p className={s.qLabel}>What shapes the quote · 0{i + 1}</p>
            <p className={s.position}>{q}</p>
          </li>
        ))}
      </ol>
      <div className={s.proposalFoot}>
        <p className={s.pending}>Tell us a little about your situation and we will reply with questions and a written proposal.</p>
        <Link href={`/contact?service=${sol.inquiry}`} className="btn btn-primary btn-small">
          {sol.cta}
        </Link>
      </div>
    </>
  );
}

/** Named plan cards (inclusions pending from the owner). Also used on the Website detail page. */
export function PlanCards({ offer }: { offer: Offer }) {
  const sol = solutionBySlug(offer.service)!;
  return (
    <ol className={s.plans}>
      {offer.plans!.map((p, i) => (
        <li key={p.id} className={s.plan} data-level={i + 1}>
          <span className={s.steps} aria-hidden="true">
            {[0, 1, 2].map((k) => (
              <i key={k} data-on={k <= i ? "true" : undefined} />
            ))}
          </span>
          <h3 className={s.planName}>{p.name}</h3>
          <p className={s.position}>{p.position}</p>
          <p className={s.pending}>Plan details coming soon</p>
          <Link href={`/contact?service=${sol.inquiry}&plan=${p.id}`} className={s.ask}>
            Ask about {p.name}
            <span className="visually-hidden"> {offer.label} plan</span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
